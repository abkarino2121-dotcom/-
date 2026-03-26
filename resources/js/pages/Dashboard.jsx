import React, { useState, useEffect } from 'react';
import { getOrders, getMaterials, getCustomers } from '../services/api';
import DashboardCards from '../components/DashboardCards';
import OrderBuilder from '../components/OrderBuilder';
import JobTrackingKanban from '../components/JobTrackingKanban';
import FinancialReport from '../components/FinancialReport';
import { LayoutDashboard, FilePlus, Kanban, Receipt, Menu, X, Bell, UserCircle } from 'lucide-react';

export default function Dashboard() {
    const [orders, setOrders] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [activeTab, setActiveTab] = useState('kanban');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

    const navigation = [
        { id: 'dashboard', name: 'الرئيسية', icon: LayoutDashboard },
        { id: 'kanban', name: 'تتبع المهام', icon: Kanban },
        { id: 'order', name: 'طلب جديد', icon: FilePlus },
        { id: 'report', name: 'التقارير المالية', icon: Receipt },
    ];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-['Tajawal']" dir="rtl">

            {/* Sidebar */}
            <aside className={`bg-slate-900 text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col hidden md:flex`}>
                <div className="flex items-center justify-center h-20 border-b border-slate-800">
                    <h1 className={`font-bold text-xl tracking-wider transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                        EGY<span className="text-blue-500">PRINT</span>
                    </h1>
                    {!isSidebarOpen && <span className="font-bold text-xl text-blue-500">EP</span>}
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navigation.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 group
                                ${activeTab === item.id
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                        >
                            <item.icon className={`w-5 h-5 ${isSidebarOpen ? 'ml-3' : 'mx-auto'}`} />
                            <span className={`${isSidebarOpen ? 'block' : 'hidden'} font-medium`}>{item.name}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">

                {/* Navbar */}
                <header className="bg-white shadow-sm z-10">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1 hidden md:block"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <h2 className="text-2xl font-bold text-slate-800 mr-4">
                                {navigation.find(n => n.id === activeTab)?.name || 'لوحة التحكم'}
                            </h2>
                        </div>
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                <Bell className="w-6 h-6" />
                                <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse border-r pr-4 border-gray-200">
                                <UserCircle className="w-8 h-8 text-slate-400" />
                                <div className="hidden md:block">
                                    <p className="text-sm font-semibold text-slate-700">مدير النظام</p>
                                    <p className="text-xs text-slate-500">Admin</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-auto p-6 bg-slate-50/50">
                    <div className="max-w-7xl mx-auto space-y-6">

                        {(activeTab === 'dashboard' || activeTab === 'kanban') && (
                            <DashboardCards orders={orders} materials={materials} />
                        )}

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            {activeTab === 'dashboard' && <JobTrackingKanban orders={orders} onStatusChange={fetchData} />}
                            {activeTab === 'kanban' && <JobTrackingKanban orders={orders} onStatusChange={fetchData} />}
                            {activeTab === 'order' && <OrderBuilder materials={materials} customers={customers} onOrderCreated={fetchData} />}
                            {activeTab === 'report' && <FinancialReport />}
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
