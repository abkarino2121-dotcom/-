import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    FileText,
    FilePlus,
    Kanban,
    Calculator,
    Receipt,
    Menu,
    Bell,
    UserCircle,
    Boxes
} from 'lucide-react';

export default function MainLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
    const location = useLocation();

    const navigation = [
        { path: '/', name: 'الرئيسية', icon: LayoutDashboard },
        { path: '/pos', name: 'نقطة البيع (POS)', icon: Calculator },
        { path: '/customers', name: 'العملاء', icon: Users },
        { path: '/quotations', name: 'عروض الأسعار', icon: FileText },
        { path: '/orders', name: 'الطلبات', icon: FilePlus },
        { path: '/production', name: 'تتبع الإنتاج', icon: Kanban },
        { path: '/inventory', name: 'المخزون', icon: Boxes },
        { path: '/reports', name: 'التقارير', icon: Receipt },
    ];

    const currentNav = navigation.find(n => n.path === location.pathname);

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-['Tajawal']" dir="rtl">
            {/* Sidebar */}
            <aside className={`bg-slate-900 text-slate-300 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col hidden md:flex border-l border-slate-800`}>
                <div className="flex items-center justify-center h-20 border-b border-slate-800 bg-slate-950/50">
                    <h1 className={`font-black text-2xl tracking-tight transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                        <span className="text-white">EGY</span><span className="text-blue-500">PRINT</span>
                    </h1>
                    {!isSidebarOpen && <span className="font-black text-xl text-blue-500">EP</span>}
                </div>

                <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                                flex items-center w-full px-3 py-3 rounded-lg transition-all duration-200 group
                                ${isActive
                                    ? 'bg-blue-600/10 text-blue-500 font-bold'
                                    : 'hover:bg-slate-800/50 hover:text-white'}
                            `}
                        >
                            <item.icon className={`w-5 h-5 flex-shrink-0 ${isSidebarOpen ? 'ml-3' : 'mx-auto'}`} />
                            <span className={`${isSidebarOpen ? 'block' : 'hidden'} text-sm`}>{item.name}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className={`flex items-center ${isSidebarOpen ? 'px-2' : 'justify-center'}`}>
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold flex-shrink-0">
                            M
                        </div>
                        <div className={`${isSidebarOpen ? 'block mr-3' : 'hidden'}`}>
                            <p className="text-sm font-bold text-white leading-none mb-1">محمود صالح</p>
                            <p className="text-xs text-slate-500 leading-none">مدير النظام</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Topbar */}
                <header className="bg-white border-b border-slate-200 h-20 flex-shrink-0 z-10">
                    <div className="flex items-center justify-between px-6 h-full">
                        <div className="flex items-center">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="text-slate-500 hover:text-slate-800 focus:outline-none rounded-lg p-2 bg-slate-50 border border-slate-200 hidden md:block transition-colors"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <h2 className="text-xl font-bold text-slate-800 mr-4">
                                {currentNav?.name || 'لوحة التحكم'}
                            </h2>
                        </div>

                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <button className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-auto bg-slate-50">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
