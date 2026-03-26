import React, { useState, useEffect } from 'react';
import { getOrders } from '../../services/api';
import JobTrackingKanban from '../../components/JobTrackingKanban';

export default function ProductionBoard() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const ordersRes = await getOrders();
            setOrders(ordersRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <div className="p-6 max-w-full">
            <JobTrackingKanban orders={orders} onStatusChange={fetchData} />
        </div>
    );
}
