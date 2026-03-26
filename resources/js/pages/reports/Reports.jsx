import React from 'react';
import FinancialReport from '../../components/FinancialReport';

export default function Reports() {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <FinancialReport />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-lg mb-4 text-slate-800">تقرير الإنتاج الشهري</h3>
                    <div className="h-64 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-lg border-dashed">
                        <p className="text-slate-400">سيتم إضافة الرسم البياني لاحقاً</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-lg mb-4 text-slate-800">المواد الأكثر استخداماً</h3>
                    <div className="h-64 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-lg border-dashed">
                        <p className="text-slate-400">سيتم إضافة الرسم البياني لاحقاً</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
