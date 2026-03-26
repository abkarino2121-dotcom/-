import React, { useState, useEffect } from 'react';
import { getCustomers } from '../../services/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Search, Plus } from 'lucide-react';

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await getCustomers();
                setCustomers(response.data);
            } catch (error) {
                console.error("Error fetching customers", error);
            }
        };
        fetchCustomers();
    }, []);

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.phone && c.phone.includes(search))
    );

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">العملاء</h2>
                    <p className="text-sm text-slate-500 mt-1">إدارة بيانات العملاء وسجلاتهم التجارية</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
                        <Input
                            placeholder="بحث عن عميل..."
                            className="pr-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button className="shrink-0">
                        <Plus className="w-4 h-4 ml-2" />
                        إضافة عميل
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-16 text-center">#</TableHead>
                            <TableHead>اسم العميل</TableHead>
                            <TableHead>رقم الهاتف</TableHead>
                            <TableHead>الرقم الضريبي</TableHead>
                            <TableHead>العنوان</TableHead>
                            <TableHead className="text-left">الإجراءات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCustomers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-slate-500">
                                    لا يوجد عملاء.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredCustomers.map((customer, index) => (
                                <TableRow key={customer.id}>
                                    <TableCell className="text-center font-mono text-slate-500">{index + 1}</TableCell>
                                    <TableCell className="font-bold text-slate-800">{customer.name}</TableCell>
                                    <TableCell dir="ltr" className="text-right text-slate-600">{customer.phone || '-'}</TableCell>
                                    <TableCell className="font-mono text-slate-600">{customer.vat_number || '-'}</TableCell>
                                    <TableCell className="text-slate-600 truncate max-w-[200px]">{customer.address || '-'}</TableCell>
                                    <TableCell className="text-left">
                                        <Button variant="outline" size="sm" className="ml-2">تعديل</Button>
                                        <Button variant="secondary" size="sm">التفاصيل</Button>
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
