import React from 'react';
import { ShoppingCart, Clock, AlertTriangle, TrendingUp } from 'lucide-react';

export default function DashboardCards({ orders, materials }) {
    const todaySales = orders
        .filter(o => new Date(o.created_at).toDateString() === new Date().toDateString())
        .reduce((sum, o) => sum + parseFloat(o.total), 0);

    const pendingJobs = orders.filter(o => o.status !== 'Completed').length;

    // Low stock alerts (arbitrary threshold < 10 for demo)
    const lowStockMaterials = materials.filter(m => parseFloat(m.current_stock) < 10);

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 font-['Tajawal']">

            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/30 transform transition-transform hover:scale-105">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-blue-100 text-sm font-medium mb-1">مبيعات اليوم</p>
                        <h3 className="text-3xl font-bold tracking-tight">{todaySales.toFixed(2)} ر.س</h3>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                        <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                    <span className="text-blue-100 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" /> +12% مقارنة بالأمس
                    </span>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 group transition-all hover:border-indigo-100 hover:shadow-md">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-slate-500 text-sm font-medium mb-1">الطلبات الكلية</p>
                        <h3 className="text-3xl font-bold text-slate-800">{orders.length}</h3>
                    </div>
                    <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <ShoppingCart className="w-6 h-6" />
                    </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                    <span className="text-slate-400">إجمالي الطلبات المسجلة بالنظام</span>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 group transition-all hover:border-amber-100 hover:shadow-md">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-slate-500 text-sm font-medium mb-1">مهام قيد التنفيذ</p>
                        <h3 className="text-3xl font-bold text-slate-800">{pendingJobs}</h3>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-xl text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                        <Clock className="w-6 h-6" />
                    </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                        <div className="bg-amber-400 h-1.5 rounded-full" style={{width: `${(pendingJobs/orders.length)*100}%`}}></div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 group transition-all hover:border-rose-100 hover:shadow-md">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-slate-500 text-sm font-medium mb-1">تنبيهات المخزون</p>
                        <h3 className="text-3xl font-bold text-rose-600">{lowStockMaterials.length}</h3>
                    </div>
                    <div className="bg-rose-50 p-3 rounded-xl text-rose-600 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                    {lowStockMaterials.length > 0 ? (
                        <span className="text-rose-500 font-medium">مواد قريبة من النفاد</span>
                    ) : (
                        <span className="text-emerald-500 font-medium flex items-center">المخزون بحالة جيدة</span>
                    )}
                </div>
            </div>

        </div>
    );
}
