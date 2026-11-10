import { useEffect, useState } from "react"
import type { AdminOrder, ModalAdminUserOrdersProps } from "../../../types/admin"
import axios from "axios"
import toast from "react-hot-toast"
import AdminOrdersList from "../Orders/AdminOrdersList"
import { XIcon } from "lucide-react"

const ModalAdminUserOrders = ({userId, onClose}: ModalAdminUserOrdersProps) => {
    const [orders, setOrders] = useState<AdminOrder[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const fetchOrders = async () => {
        try {
            const admintoken = localStorage.getItem('adminToken')
            const res = await axios.get(`http://localhost:5000/api/orders/user/${userId}`, {
                headers: { Authorization: `Bearer ${admintoken}` },
            })
            if(res.data.success) {
                setOrders(res.data.shaped)
                console.log('Orders fetched successfully:', res.data.shaped)
            } else {
                toast.error(res.data.message || 'Не вдалося отримати замовлення')
            }
        } catch (error) {
            toast.error('Помилка при завантаженні замовлень користувача')
        } finally {
            setLoading(false)
        }
    };
    useEffect(() => {
        fetchOrders()
    }, [])
    const updateOrder = async (id: number, patch: Partial<Pick<AdminOrder, "status" | "deliveryStatus">>) => {
        const adminToken = localStorage.getItem('adminToken');
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
    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-7xl">
                <div className="mb-3 flex justify-between items-center">
                    <h3>Замовлення користувача #{userId}</h3>
                    <button onClick={() => onClose()} className="text-primary hover:text-primary-focus transition-colors duration-300 cursor-pointer">
                        <XIcon />
                    </button>
                </div>
                {loading ? (
                    <div>Завантаження замовлень...</div>
                ) : orders.length === 0 ? (
                    <div>Замовлення відсутні</div>
                ) : (
                    <AdminOrdersList 
                        orders={orders}
                        maskCard={maskCard}
                        updateOrder={updateOrder}
                        deleteOrder={deleteOrder}
                    />
                )}
                <div className="modal-action">
                    <button onClick={() => onClose()} className="btn btn-primary text-white">
                        Закрити
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ModalAdminUserOrders
