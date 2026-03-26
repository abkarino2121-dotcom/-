import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './bootstrap';

import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/customers/Customers';
import Orders from './pages/orders/Orders';
import Quotations from './pages/orders/Quotations';
import ProductionBoard from './pages/production/ProductionBoard';
import POS from './pages/pos/POS';
import Reports from './pages/reports/Reports';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="customers" element={<Customers />} />
                    <Route path="quotations" element={<Quotations />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="production" element={<ProductionBoard />} />
                    <Route path="pos" element={<POS />} />

                    <Route path="reports" element={<Reports />} />

                    {/* Placeholder routes that we'll implement in subsequent phases */}
                    <Route path="inventory" element={<div className="p-8">Inventory Page (Coming Soon)</div>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

if (document.getElementById('app')) {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
}
