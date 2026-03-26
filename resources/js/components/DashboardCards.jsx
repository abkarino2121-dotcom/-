import React from 'react';
import { ShoppingCart, Clock, AlertTriangle } from 'lucide-react';

export default function DashboardCards({ orders, materials }) {
    const todaySales = orders
        .filter(o => new Date(o.created_at).toDateString() === new Date().toDateString())
        .reduce((sum, o) => sum + parseFloat(o.total), 0);

    const pendingJobs = orders.filter(o => o.status !== 'Completed').length;

    // Low stock alerts (arbitrary threshold < 10 for demo)
    const lowStockMaterials = materials.filter(m => parseFloat(m.current_stock) < 10);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm">مبيعات اليوم</p>
                    <p className="text-2xl font-bold">{todaySales.toFixed(2)} ر.س</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                    <ShoppingCart className="w-6 h-6 text-green-600" />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm">مهام قيد التنفيذ</p>
                    <p className="text-2xl font-bold">{pendingJobs}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                    <Clock className="w-6 h-6 text-yellow-600" />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm">تنبيهات المخزون</p>
                    <p className="text-2xl font-bold text-red-600">{lowStockMaterials.length} مواد</p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
            </div>
        </div>
    );
}
