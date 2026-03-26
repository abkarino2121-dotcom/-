import React, { useState, useEffect } from 'react';
import { getVatReport } from '../services/api';
import { Download, FileText, CheckCircle2 } from 'lucide-react';

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

    if (loading) return (
        <div className="flex justify-center items-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="mr-3 text-slate-500 font-medium">جاري التحميل...</span>
        </div>
    );

    if (!reportData) return <div className="p-10 text-center text-red-500 bg-red-50 rounded-xl font-bold border border-red-200">حدث خطأ أثناء تحميل التقرير. يرجى المحاولة لاحقاً.</div>;

    return (
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100 font-['Tajawal']">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-100 pb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold flex items-center text-slate-800">
                        <FileText className="ml-3 h-8 w-8 text-blue-600 p-1.5 bg-blue-50 rounded-lg" />
                        تقرير ضريبة القيمة المضافة (ZATCA)
                    </h2>
                    <p className="text-sm text-slate-500 mt-2 mr-11">الفترة من {new Date(reportData.start_date).toLocaleDateString('ar-SA')} إلى {new Date(reportData.end_date).toLocaleDateString('ar-SA')}</p>
                </div>
                <button className="flex items-center text-white bg-blue-600 hover:bg-blue-700 font-semibold px-5 py-2.5 rounded-lg shadow-md transition-all">
                    <Download className="ml-2 h-4 w-4" />
                    تصدير التقرير (PDF/Excel)
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-200/50 rounded-full -mr-10 -mt-10 transform group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="relative z-10">
                        <p className="text-slate-500 text-sm font-semibold mb-2 flex items-center">
                            إجمالي المبيعات (غير شاملة الضريبة)
                        </p>
                        <p className="text-4xl font-black text-slate-800 tracking-tight">
                            {reportData.total_sales.toFixed(2)} <span className="text-lg font-normal text-slate-500 ml-1">ر.س</span>
                        </p>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/30 rounded-full -mr-10 -mt-10 transform group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="relative z-10">
                        <p className="text-blue-800 text-sm font-semibold mb-2 flex items-center">
                            إجمالي ضريبة القيمة المضافة المحصلة (15%)
                            <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />
                        </p>
                        <p className="text-4xl font-black text-blue-600 tracking-tight">
                            {reportData.total_vat_collected.toFixed(2)} <span className="text-lg font-normal text-blue-400 ml-1">ر.س</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                    <h3 className="text-lg font-bold text-slate-700">قائمة الفواتير المشمولة</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-right">
                        <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold w-32">رقم الفاتورة</th>
                                <th className="px-6 py-4 font-semibold w-40">تاريخ الإصدار</th>
                                <th className="px-6 py-4 font-semibold">المبلغ (الأساسي)</th>
                                <th className="px-6 py-4 font-semibold">الضريبة (15%)</th>
                                <th className="px-6 py-4 font-semibold">الإجمالي</th>
                                <th className="px-6 py-4 font-semibold text-left">ZATCA UUID / Hash</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {reportData.invoices.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500 bg-slate-50/50">
                                        <div className="flex flex-col items-center">
                                            <FileText className="w-12 h-12 text-slate-300 mb-3" />
                                            <p>لا توجد فواتير مصدرة في هذه الفترة المحددة.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                reportData.invoices.map((invoice, index) => (
                                    <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                                                INV-{invoice.id.toString().padStart(5, '0')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {new Date(invoice.created_at).toLocaleDateString('ar-SA')}
                                            <span className="text-xs text-slate-400 block mt-1">{new Date(invoice.created_at).toLocaleTimeString('ar-SA')}</span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-700">{(invoice.total - invoice.vat_total).toFixed(2)} ر.س</td>
                                        <td className="px-6 py-4 text-red-500 font-medium">{invoice.vat_total} ر.س</td>
                                        <td className="px-6 py-4 font-black text-blue-600">{invoice.total} ر.س</td>
                                        <td className="px-6 py-4 text-left">
                                            <div className="flex flex-col items-start gap-1">
                                                <span className="text-[10px] text-slate-400 font-mono truncate max-w-[200px] block bg-slate-50 px-2 py-0.5 rounded border border-slate-100" title={invoice.uuid}>
                                                    {invoice.uuid}
                                                </span>
                                                <span className="text-[10px] text-emerald-600/70 font-mono truncate max-w-[200px] block bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100" title="Hash متوافق">
                                                    Hash: {invoice.hash?.substring(0, 16)}...
                                                </span>
                                            </div>
                                        </td>
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
