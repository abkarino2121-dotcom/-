import React, { useState, useEffect } from 'react';
import { getOrders, getMaterials, getCustomers } from '../services/api';
import DashboardCards from '../components/DashboardCards';
import JobTrackingKanban from '../components/JobTrackingKanban';
import OrderBuilder from '../components/OrderBuilder';
import FinancialReport from '../components/FinancialReport';

export default function Dashboard() {
    const [orders, setOrders] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [customers, setCustomers] = useState([]);

    // We'll keep tabs for now inside dashboard until full migration is complete
    const [activeTab, setActiveTab] = useState('dashboard');

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
        <div className="max-w-7xl mx-auto space-y-6 p-6">
            <DashboardCards orders={orders} materials={materials} />

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <JobTrackingKanban orders={orders} onStatusChange={fetchData} />
            </div>
        </div>
    );
}
