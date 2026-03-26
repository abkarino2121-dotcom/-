import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

export const getOrders = () => api.get('/orders');
export const createOrder = (data) => api.post('/orders', data);
export const getMaterials = () => api.get('/materials');
export const getCustomers = () => api.get('/customers');
export const updateJobStatus = (id, status) => api.patch(`/jobs/${id}/status`, { status });
export const getVatReport = () => api.get('/reports/vat');

export default api;
