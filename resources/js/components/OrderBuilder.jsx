import React, { useState } from 'react';
import { createOrder } from '../services/api';
import { PlusCircle, Save, Trash2, Image as ImageIcon } from 'lucide-react';

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

    const removeItem = (index) => {
        if (items.length > 1) {
            const newItems = items.filter((_, i) => i !== index);
            setItems(newItems);
        }
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
        <div className="bg-white rounded-2xl p-8 max-w-5xl mx-auto font-['Tajawal']">
            <div className="mb-8 border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-bold text-gray-800">إنشاء طلب جديد</h2>
                <p className="text-gray-500 text-sm mt-1">قم بتعبئة تفاصيل العميل والمنتجات لإنشاء أمر تشغيل جديد</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* Customer Section */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                        <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-2 ml-2 text-sm">1</span>
                        بيانات العميل
                    </h3>
                    <div className="max-w-md">
                        <label className="block text-sm font-medium text-slate-700 mb-2">اختر العميل <span className="text-red-500">*</span></label>
                        <select
                            required
                            value={customerId}
                            onChange={(e) => setCustomerId(e.target.value)}
                            className="w-full rounded-lg border-slate-300 shadow-sm p-3 border focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors">
                            <option value="">-- يرجى اختيار العميل --</option>
                            {customers.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                            {customers.length === 0 && <option value="1">عميل تجريبي 1</option>}
                        </select>
                    </div>
                </div>

                {/* Items Section */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                            <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-2 ml-2 text-sm">2</span>
                            تفاصيل المنتجات
                        </h3>
                    </div>

                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start bg-white p-5 rounded-lg border border-slate-200 shadow-sm relative group transition-all hover:border-blue-200 hover:shadow-md">

                                {items.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        className="absolute -top-3 -right-3 bg-red-100 text-red-600 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                                        title="حذف المنتج">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}

                                <div className="md:col-span-3">
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">المادة <span className="text-red-500">*</span></label>
                                    <select
                                        required
                                        value={item.material_id}
                                        onChange={(e) => handleItemChange(index, 'material_id', e.target.value)}
                                        className="w-full rounded-md border-slate-300 shadow-sm p-2 text-sm border focus:ring-blue-500 focus:border-blue-500">
                                        <option value="">اختر المادة</option>
                                        {materials.map(m => (
                                            <option key={m.id} value={m.id}>{m.name} - {m.cost_per_unit} ر.س</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">العرض (م) <span className="text-red-500">*</span></label>
                                    <input
                                        type="number" step="0.01" required placeholder="0.00"
                                        value={item.width}
                                        onChange={(e) => handleItemChange(index, 'width', e.target.value)}
                                        className="w-full rounded-md border-slate-300 shadow-sm p-2 text-sm border focus:ring-blue-500 focus:border-blue-500" />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">الطول (م) <span className="text-red-500">*</span></label>
                                    <input
                                        type="number" step="0.01" required placeholder="0.00"
                                        value={item.height}
                                        onChange={(e) => handleItemChange(index, 'height', e.target.value)}
                                        className="w-full rounded-md border-slate-300 shadow-sm p-2 text-sm border focus:ring-blue-500 focus:border-blue-500" />
                                </div>

                                <div className="md:col-span-3">
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">نوع الطباعة</label>
                                    <select
                                        value={item.printing_type}
                                        onChange={(e) => handleItemChange(index, 'printing_type', e.target.value)}
                                        className="w-full rounded-md border-slate-300 shadow-sm p-2 text-sm border focus:ring-blue-500 focus:border-blue-500">
                                        <option value="">بدون طباعة</option>
                                        <option value="DTF">DTF</option>
                                        <option value="Laser">Laser</option>
                                        <option value="CNC">CNC</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">هامش الربح</label>
                                    <div className="relative">
                                        <input
                                            type="number" step="0.01" placeholder="0.00"
                                            value={item.profit_margin}
                                            onChange={(e) => handleItemChange(index, 'profit_margin', e.target.value)}
                                            className="w-full rounded-md border-slate-300 shadow-sm p-2 pr-8 text-sm border focus:ring-blue-500 focus:border-blue-500" />
                                        <span className="absolute left-3 top-2 text-slate-400 text-sm">ر.س</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={addItem}
                        className="mt-4 flex items-center text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm font-semibold transition-colors w-fit border border-blue-200">
                        <PlusCircle className="w-4 h-4 mr-2 ml-2" />
                        إضافة منتج آخر
                    </button>
                </div>

                {/* Attachments Section */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                        <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-2 ml-2 text-sm">3</span>
                        المرفقات
                    </h3>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center bg-white hover:bg-slate-50 transition-colors cursor-pointer">
                        <ImageIcon className="w-10 h-10 text-slate-400 mb-3" />
                        <p className="text-sm text-slate-600 font-medium mb-1">اسحب وأفلت ملف التصميم هنا أو انقر للاستعراض</p>
                        <p className="text-xs text-slate-400 mb-4">الصيغ المدعومة: PDF, AI, CDR (الحد الأقصى 50MB)</p>
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100 cursor-pointer" />
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md hover:shadow-lg font-bold text-lg">
                        {loading ? (
                            <span className="flex items-center">جاري الحفظ... <span className="animate-pulse ml-2">⏳</span></span>
                        ) : (
                            <>
                                <Save className="w-5 h-5 ml-2" />
                                حفظ وإنشاء الطلب
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
