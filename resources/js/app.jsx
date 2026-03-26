import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';

import Dashboard from './pages/Dashboard';

export default function App() {
    return (
        <div dir="rtl" className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">EGY PRINT ERP</h1>
                    <div className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">المدينة المنورة - KSA</div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <Dashboard />
            </main>
        </div>
    );
}

if (document.getElementById('app')) {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
}
