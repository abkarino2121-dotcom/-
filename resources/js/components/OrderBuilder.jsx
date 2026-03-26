import React, { useState } from 'react';
import { createOrder } from '../services/api';

export default function OrderBuilder({ materials, customers, onOrderCreated }) {
    const [customerId, setCustomerId] = useState('');
    const [items, setItems] = useState([{ material_id: '', width: '', height: '', printing_type: '', processing_fee: 0, profit_margin: 0 }]);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { material_id: '', width: '', height: '', printing_type: '', processing_fee: 0, profit_margin: 0 }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createOrder({
                customer_id: customerId,
                items: items
            });
            alert('تم إنشاء الطلب بنجاح');
            onOrderCreated();
            // Reset
            setCustomerId('');
            setItems([{ material_id: '', width: '', height: '', printing_type: '', processing_fee: 0, profit_margin: 0 }]);
            setFile(null);
        } catch (error) {
            console.error("Error creating order:", error);
            alert('حدث خطأ أثناء إنشاء الطلب');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">إنشاء طلب جديد</h2>
            <form onSubmit={handleSubmit} className="space-y-6">

                <div>
                    <label className="block text-sm font-medium text-gray-700">العميل</label>
                    <select
                        required
                        value={customerId}
                        onChange={(e) => setCustomerId(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border">
                        <option value="">اختر العميل</option>
                        {customers.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                        {/* Mock customer if none exist */}
                        {customers.length === 0 && <option value="1">عميل تجريبي 1</option>}
                    </select>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">عناصر الطلب</h3>
                    {items.map((item, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end bg-gray-50 p-4 rounded">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">المادة</label>
                                <select
                                    required
                                    value={item.material_id}
                                    onChange={(e) => handleItemChange(index, 'material_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border">
                                    <option value="">اختر المادة</option>
                                    {materials.map(m => (
                                        <option key={m.id} value={m.id}>{m.name} ({m.type}) - {m.cost_per_unit} ر.س</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">العرض (متر)</label>
                                <input
                                    type="number" step="0.01" required
                                    value={item.width}
                                    onChange={(e) => handleItemChange(index, 'width', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">الطول (متر)</label>
                                <input
                                    type="number" step="0.01" required
                                    value={item.height}
                                    onChange={(e) => handleItemChange(index, 'height', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">نوع الطباعة</label>
                                <select
                                    value={item.printing_type}
                                    onChange={(e) => handleItemChange(index, 'printing_type', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border">
                                    <option value="">لا يوجد</option>
                                    <option value="DTF">DTF</option>
                                    <option value="Laser">Laser</option>
                                    <option value="CNC">CNC</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">هامش الربح</label>
                                <input
                                    type="number" step="0.01"
                                    value={item.profit_margin}
                                    onChange={(e) => handleItemChange(index, 'profit_margin', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={addItem} className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                        + إضافة عنصر آخر
                    </button>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">ملف التصميم (PDF, AI, CDR)</label>
                    <input type="file" onChange={(e) => setFile(e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100" />
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
                        {loading ? 'جاري الحفظ...' : 'حفظ وإنشاء الطلب'}
                    </button>
                </div>
            </form>
        </div>
    );
}
