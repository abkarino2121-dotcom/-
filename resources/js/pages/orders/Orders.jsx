import React, { useState, useEffect } from 'react';
import { getOrders, getMaterials, getCustomers } from '../../services/api';
import OrderBuilder from '../../components/OrderBuilder';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Search, Plus } from 'lucide-react';

export default function Orders() {
    const [orders, setOrders] = useState([]);
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
            // Only show orders that are NOT Quotations
            setOrders(ordersRes.data.filter(o => o.status !== 'Quotation'));
            setMaterials(materialsRes.data);
            setCustomers(customersRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending Design': return <Badge variant="info">في انتظار التصميم</Badge>;
            case 'In Production': return <Badge variant="warning">قيد الإنتاج</Badge>;
            case 'Ready': return <Badge variant="success">جاهز للتسليم</Badge>;
            case 'Completed': return <Badge className="bg-emerald-600 hover:bg-emerald-700">مكتمل</Badge>;
            default: return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const filteredOrders = orders.filter(o =>
        o.id.toString().includes(search) ||
        (o.customer?.name && o.customer.name.toLowerCase().includes(search.toLowerCase()))
    );

    if (isCreating) {
        return (
            <div className="p-6">
                <Button variant="outline" className="mb-4" onClick={() => setIsCreating(false)}>العودة للطلبات</Button>
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
                    <h2 className="text-2xl font-bold text-slate-800">الطلبات النشطة</h2>
                    <p className="text-sm text-slate-500 mt-1">إدارة أوامر التشغيل وعمليات الإنتاج</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
                        <Input
                            placeholder="بحث برقم الطلب أو العميل..."
                            className="pr-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => setIsCreating(true)} className="shrink-0">
                        <Plus className="w-4 h-4 ml-2" />
                        طلب جديد
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-20 text-center">رقم الطلب</TableHead>
                            <TableHead>العميل</TableHead>
                            <TableHead>التاريخ</TableHead>
                            <TableHead>الإجمالي</TableHead>
                            <TableHead>الحالة</TableHead>
                            <TableHead className="text-left">الإجراءات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-slate-500">
                                    لا توجد طلبات نشطة.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="text-center font-mono font-bold text-slate-700 bg-slate-50/50">
                                        #{order.id.toString().padStart(4, '0')}
                                    </TableCell>
                                    <TableCell className="font-bold text-slate-800">
                                        {order.customer?.name || 'غير محدد'}
                                    </TableCell>
                                    <TableCell className="text-slate-600 text-sm">
                                        {new Date(order.created_at).toLocaleDateString('ar-SA')}
                                    </TableCell>
                                    <TableCell className="font-bold text-blue-600">
                                        {parseFloat(order.total).toFixed(2)} ر.س
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(order.status)}
                                    </TableCell>
                                    <TableCell className="text-left">
                                        <Button variant="secondary" size="sm">عرض التفاصيل</Button>
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
