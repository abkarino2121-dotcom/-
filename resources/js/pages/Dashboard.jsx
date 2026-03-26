import React, { useState, useEffect } from 'react';
import { getOrders, getMaterials, getCustomers, updateJobStatus } from '../services/api';
import DashboardCards from '../components/DashboardCards';
import OrderBuilder from '../components/OrderBuilder';
import JobTrackingKanban from '../components/JobTrackingKanban';
import FinancialReport from '../components/FinancialReport';

export default function Dashboard() {
    const [orders, setOrders] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [activeTab, setActiveTab] = useState('kanban');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [ordersRes, materialsRes, customersRes] = await Promise.all([
                getOrders(),
                getMaterials(),
                getCustomers()
            ]);
            setOrders(ordersRes.data);
            setMaterials(materialsRes.data);
            setCustomers(customersRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <DashboardCards orders={orders} materials={materials} />

            <div className="flex space-x-4 mb-4 border-b pb-2 rtl:space-x-reverse">
                <button
                    className={`px-4 py-2 rounded ${activeTab === 'kanban' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('kanban')}>
                    تتبع المهام (Kanban)
                </button>
                <button
                    className={`px-4 py-2 rounded ${activeTab === 'order' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('order')}>
                    إنشاء طلب جديد
                </button>
                <button
                    className={`px-4 py-2 rounded ${activeTab === 'report' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('report')}>
                    التقارير المالية (ZATCA)
                </button>
            </div>

            {activeTab === 'kanban' && <JobTrackingKanban orders={orders} onStatusChange={fetchData} />}
            {activeTab === 'order' && <OrderBuilder materials={materials} customers={customers} onOrderCreated={fetchData} />}
            {activeTab === 'report' && <FinancialReport />}
        </div>
    );
}
