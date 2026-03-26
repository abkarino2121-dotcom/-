import React, { useState, useEffect } from 'react';
import { getVatReport } from '../services/api';
import { Download, FileText } from 'lucide-react';

export default function FinancialReport() {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await getVatReport();
                setReportData(response.data);
            } catch (error) {
                console.error("Error fetching report:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, []);

    if (loading) return <div className="p-6 text-center">جاري تحميل التقرير...</div>;

    if (!reportData) return <div className="p-6 text-center text-red-500">حدث خطأ أثناء تحميل التقرير.</div>;

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold flex items-center">
                    <FileText className="mr-2 h-6 w-6 text-blue-600" />
                    تقرير ضريبة القيمة المضافة (ZATCA)
                </h2>
                <button className="flex items-center text-blue-600 hover:text-blue-800 font-semibold px-4 py-2 border border-blue-600 rounded">
                    <Download className="mr-2 h-4 w-4" />
                    تصدير التقرير
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded border border-gray-200">
                    <p className="text-gray-500 text-sm font-semibold mb-1">إجمالي المبيعات (غير شاملة الضريبة)</p>
                    <p className="text-3xl font-bold text-gray-800">{reportData.total_sales.toFixed(2)} ر.س</p>
                </div>
                <div className="bg-blue-50 p-4 rounded border border-blue-200">
                    <p className="text-blue-800 text-sm font-semibold mb-1">إجمالي ضريبة القيمة المضافة المحصلة (15%)</p>
                    <p className="text-3xl font-bold text-blue-600">{reportData.total_vat_collected.toFixed(2)} ر.س</p>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-bold mb-4">قائمة الفواتير المشمولة</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-right">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="px-4 py-3 font-semibold rounded-tr">رقم الفاتورة</th>
                                <th className="px-4 py-3 font-semibold">تاريخ الإصدار</th>
                                <th className="px-4 py-3 font-semibold">المبلغ (غير شامل الضريبة)</th>
                                <th className="px-4 py-3 font-semibold">الضريبة (15%)</th>
                                <th className="px-4 py-3 font-semibold">الإجمالي</th>
                                <th className="px-4 py-3 font-semibold rounded-tl">ZATCA UUID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.invoices.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">لا توجد فواتير في هذه الفترة.</td>
                                </tr>
                            ) : (
                                reportData.invoices.map((invoice, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3">INV-{invoice.id.toString().padStart(5, '0')}</td>
                                        <td className="px-4 py-3">{new Date(invoice.created_at).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 font-medium">{(invoice.total - invoice.vat_total).toFixed(2)} ر.س</td>
                                        <td className="px-4 py-3 text-red-500 font-medium">{invoice.vat_total} ر.س</td>
                                        <td className="px-4 py-3 font-bold">{invoice.total} ر.س</td>
                                        <td className="px-4 py-3 text-xs text-gray-400 font-mono truncate max-w-xs">{invoice.uuid}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
