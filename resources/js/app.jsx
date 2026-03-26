import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import Dashboard from './pages/Dashboard';

export default function App() {
    return (
        <div dir="rtl" className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <Dashboard />
        </div>
    );
}

if (document.getElementById('app')) {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
}
