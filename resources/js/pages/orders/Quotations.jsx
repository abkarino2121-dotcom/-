import React, { useState, useEffect } from 'react';
import { getOrders, getMaterials, getCustomers, updateJobStatus } from '../../services/api';
import OrderBuilder from '../../components/OrderBuilder';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Search, Plus, PlayCircle } from 'lucide-react';

export default function Quotations() {
    const [quotations, setQuotations] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [ordersRes, materialsRes, customersRes] = await Promise.all([
                getOrders(),
                getMaterials(),
                getCustomers()
            ]);
            // Only show orders that ARE Quotations
            setQuotations(ordersRes.data.filter(o => o.status === 'Quotation'));
            setMaterials(materialsRes.data);
            setCustomers(customersRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const convertToOrder = async (id) => {
        if (confirm('هل أنت متأكد من تحويل عرض السعر إلى أمر شغل؟ (سيتم تغيير الحالة إلى "في انتظار التصميم")')) {
            try {
                await updateJobStatus(id, 'Pending Design');
                fetchData();
                alert('تم تحويل عرض السعر إلى طلب بنجاح.');
            } catch (error) {
                console.error("Error converting quotation:", error);
                alert('حدث خطأ أثناء تحويل عرض السعر.');
            }
        }
    };

    const filteredQuotations = quotations.filter(q =>
        q.id.toString().includes(search) ||
        (q.customer?.name && q.customer.name.toLowerCase().includes(search.toLowerCase()))
    );

    if (isCreating) {
        return (
            <div className="p-6">
                <Button variant="outline" className="mb-4" onClick={() => setIsCreating(false)}>العودة لعروض الأسعار</Button>
                <OrderBuilder
                    materials={materials}
                    customers={customers}
                    onOrderCreated={() => {
                        fetchData();
                        setIsCreating(false);
                    }}
                />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">عروض الأسعار</h2>
                    <p className="text-sm text-slate-500 mt-1">إنشاء عروض أسعار للعملاء قبل تحويلها إلى أوامر تشغيل فعلية</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
                        <Input
                            placeholder="بحث عن عرض سعر..."
                            className="pr-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => setIsCreating(true)} className="shrink-0 bg-indigo-600 hover:bg-indigo-700">
                        <Plus className="w-4 h-4 ml-2" />
                        إنشاء عرض سعر
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-20 text-center">رقم العرض</TableHead>
                            <TableHead>العميل</TableHead>
                            <TableHead>التاريخ</TableHead>
                            <TableHead>الإجمالي</TableHead>
                            <TableHead>الحالة</TableHead>
                            <TableHead className="text-left">الإجراءات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredQuotations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-slate-500">
                                    لا توجد عروض أسعار نشطة.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredQuotations.map((quotation) => (
                                <TableRow key={quotation.id}>
                                    <TableCell className="text-center font-mono font-bold text-slate-700 bg-slate-50/50">
                                        QT-{quotation.id.toString().padStart(4, '0')}
                                    </TableCell>
                                    <TableCell className="font-bold text-slate-800">
                                        {quotation.customer?.name || 'غير محدد'}
                                    </TableCell>
                                    <TableCell className="text-slate-600 text-sm">
                                        {new Date(quotation.created_at).toLocaleDateString('ar-SA')}
                                    </TableCell>
                                    <TableCell className="font-bold text-indigo-600">
                                        {parseFloat(quotation.total).toFixed(2)} ر.س
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-slate-500 border-slate-300">عرض سعر</Badge>
                                    </TableCell>
                                    <TableCell className="text-left">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="secondary" size="sm">تعديل</Button>
                                            <Button size="sm" onClick={() => convertToOrder(quotation.id)} className="bg-emerald-600 hover:bg-emerald-700 font-bold">
                                                <PlayCircle className="w-4 h-4 ml-2" />
                                                اعتماد وتحويل لطلب
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
