import React, { useState, useEffect } from 'react';
import { getMaterials, getCustomers, createOrder } from '../../services/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { ShoppingCart, User, Plus, Trash2, Printer, CreditCard, Banknote } from 'lucide-react';

export default function POS() {
    const [materials, setMaterials] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [cart, setCart] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPosData = async () => {
            try {
                const [materialsRes, customersRes] = await Promise.all([
                    getMaterials(),
                    getCustomers()
                ]);
                setMaterials(materialsRes.data);
                setCustomers(customersRes.data);
            } catch (error) {
                console.error("Error fetching POS data", error);
            }
        };
        fetchPosData();
    }, []);

    const addToCart = (material) => {
        // Simple POS mode (e.g. for standard items, ignoring complex WxH formula for now, or defaulting to 1x1)
        const newItem = {
            material_id: material.id,
            name: material.name,
            width: 1, // Defaulting to 1 for POS rapid checkout
            height: 1,
            price: material.cost_per_unit,
            quantity: 1,
            type: material.type
        };

        const existingItemIndex = cart.findIndex(item => item.material_id === material.id);
        if (existingItemIndex >= 0) {
            const newCart = [...cart];
            newCart[existingItemIndex].quantity += 1;
            setCart(newCart);
        } else {
            setCart([...cart, newItem]);
        }
    };

    const updateQuantity = (index, delta) => {
        const newCart = [...cart];
        newCart[index].quantity += delta;
        if (newCart[index].quantity <= 0) {
            newCart.splice(index, 1);
        }
        setCart(newCart);
    };

    const removeFromCart = (index) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };

    const calculateSubtotal = () => {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const handleCheckout = async (paymentMethod) => {
        if (!selectedCustomer) {
            alert('يرجى اختيار العميل أولاً');
            return;
        }
        if (cart.length === 0) {
            alert('السلة فارغة');
            return;
        }

        setLoading(true);
        try {
            // Map cart to order items structure expected by API
            const items = cart.map(item => ({
                material_id: item.material_id,
                width: item.width,
                height: item.height * item.quantity, // Hack for POS quantity if type is unit/sheet
                printing_type: null,
                processing_fee: 0,
                profit_margin: 0
            }));

            await createOrder({
                customer_id: selectedCustomer,
                items: items,
                status: 'Completed' // POS usually means immediate delivery/completion
            });

            alert(`تمت عملية الدفع (${paymentMethod}) بنجاح`);
            setCart([]);
            setSelectedCustomer('');
        } catch (error) {
            console.error("Checkout error:", error);
            alert('حدث خطأ أثناء الدفع');
        } finally {
            setLoading(false);
        }
    };

    const subtotal = calculateSubtotal();
    const vat = subtotal * 0.15;
    const total = subtotal + vat;

    return (
        <div className="flex h-[calc(100vh-80px)] overflow-hidden font-['Tajawal']">

            {/* Products Grid (Left side) */}
            <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
                <div className="mb-6">
                    <Input placeholder="بحث عن منتج برمز الباركود أو الاسم..." className="h-12 text-lg shadow-sm" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {materials.map(material => (
                        <div
                            key={material.id}
                            onClick={() => addToCart(material)}
                            className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all text-center flex flex-col justify-between aspect-square"
                        >
                            <div className="flex-1 flex items-center justify-center">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3 text-slate-400">
                                    <ShoppingCart className="w-8 h-8" />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm mb-1">{material.name}</h3>
                                <p className="text-blue-600 font-bold">{material.cost_per_unit} ر.س</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cart & Checkout (Right side) */}
            <div className="w-96 bg-white border-r border-slate-200 flex flex-col shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-10">

                {/* Customer Selection */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-2 mb-2">
                        <User className="w-5 h-5 text-slate-500" />
                        <h3 className="font-bold text-slate-700">بيانات العميل</h3>
                    </div>
                    <select
                        className="w-full rounded-lg border-slate-300 shadow-sm p-2 text-sm border focus:ring-blue-500 focus:border-blue-500"
                        value={selectedCustomer}
                        onChange={(e) => setSelectedCustomer(e.target.value)}
                    >
                        <option value="">-- العميل النقدي (افتراضي) --</option>
                        {customers.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <ShoppingCart className="w-12 h-12 mb-3 opacity-20" />
                            <p>السلة فارغة</p>
                        </div>
                    ) : (
                        cart.map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm text-slate-800">{item.name}</h4>
                                    <p className="text-blue-600 font-bold text-sm mt-1">{(item.price * item.quantity).toFixed(2)} ر.س</p>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <div className="flex items-center bg-slate-100 rounded-lg">
                                        <button onClick={() => updateQuantity(index, 1)} className="p-1.5 hover:bg-slate-200 rounded-r-lg"><Plus className="w-3 h-3" /></button>
                                        <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(index, -1)} className="p-1.5 hover:bg-slate-200 rounded-l-lg font-bold text-lg leading-none">-</button>
                                    </div>
                                    <button onClick={() => removeFromCart(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Totals & Actions */}
                <div className="bg-slate-900 text-white p-6 rounded-t-3xl mt-auto">
                    <div className="space-y-2 mb-4 text-sm text-slate-300 border-b border-slate-700 pb-4">
                        <div className="flex justify-between">
                            <span>المجموع الفرعي</span>
                            <span>{subtotal.toFixed(2)} ر.س</span>
                        </div>
                        <div className="flex justify-between">
                            <span>ضريبة القيمة المضافة (15%)</span>
                            <span>{vat.toFixed(2)} ر.س</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-end mb-6">
                        <span className="text-slate-300 font-bold">الإجمالي المطلوب</span>
                        <span className="text-3xl font-black text-white">{total.toFixed(2)} ر.س</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            disabled={loading || cart.length === 0}
                            onClick={() => handleCheckout('Cash')}
                            className="h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg border-0">
                            <Banknote className="w-5 h-5 ml-2" />
                            دفع نقدي
                        </Button>
                        <Button
                            disabled={loading || cart.length === 0}
                            onClick={() => handleCheckout('POS')}
                            className="h-14 bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg border-0">
                            <CreditCard className="w-5 h-5 ml-2" />
                            شبكة (مدى)
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
