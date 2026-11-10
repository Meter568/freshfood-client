import { useEffect, useState } from "react";
import axios from "axios";
import type { AdminOrder } from "../../../types/admin";
import AdminOrdersList from "./AdminOrdersList";
import { toast } from "react-hot-toast";

const AdminOrders = () => {
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const adminToken = localStorage.getItem('adminToken');
            console.log('Admin token from localStorage:', adminToken ? 'exists' : 'not found');
            if (!adminToken) {
                setError('Необхідна авторизація адміністратора');
                return;
            }
            console.log('Making request to admin orders with admin token');
            const res = await axios.get<AdminOrder[]>("http://localhost:5000/api/orders/admin/all", {
                headers: {
                    Authorization: `Bearer ${adminToken}`
                }
            });
            console.log('Orders fetched successfully:', res.data.length);
            setOrders(res.data);
        } catch (e: unknown) {
            console.error('Error fetching orders:', e);
            const message = axios.isAxiosError(e) ? (e.response?.data as { message?: string } | undefined)?.message ?? e.message : 'Failed to fetch orders';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        console.log('AdminOrders component mounted, fetching orders...');
        fetchOrders(); 
    }, []);

    const updateOrder = async (id: number, patch: Partial<Pick<AdminOrder, "status" | "deliveryStatus">>) => {
        const adminToken = localStorage.getItem('adminToken');
        if (!adminToken) {
            setError('Необхідна авторизація адміністратора');
            return;
        }
        await axios.patch(`http://localhost:5000/api/orders/admin/status/${id}`, patch, {
            headers: {
                Authorization: `Bearer ${adminToken}`
            }
        });
        await fetchOrders();
        toast.success('Замовлення успішно оновлено');
    };

    const deleteOrder = async (id: number) => {
        const adminToken = localStorage.getItem('adminToken');
        if (!adminToken) {
            setError('Необхідна авторизація адміністратора');
            return;
        }
        if (!window.confirm("Видалити це замовлення?")) return;
        await axios.delete(`http://localhost:5000/api/orders/admin/${id}`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        await fetchOrders();
        toast.success('Замовлення успішно видалено');
    };

    const maskCard = (num?: string | null) => {
        if (!num) return '';
        const s = String(num).replace(/\s+/g, '');
        if (s.length < 4) return '****';
        return '**** **** **** ' + s.slice(-4);
    }

    if (loading) return <span className="loading loading-spinner loading-lg text-primary"></span>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Замовлення</h2>
            {orders.length === 0 ? (
                <p>Поки що немає замовлень</p>
            ) : (
                <AdminOrdersList 
                    orders={orders}
                    maskCard={maskCard}
                    updateOrder={updateOrder}
                    deleteOrder={deleteOrder}
                />
            )}
        </div>
    );
};

export default AdminOrders;


