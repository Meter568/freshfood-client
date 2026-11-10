import Loading from "../components/Loading"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { useEffect, useState } from "react"
import { fetchOrders } from "../features/orders/orderSlice"
import { useUserContext } from "../context/useUserContext"
import axios from "axios"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const OrdersPage = () => {
    const dispatch = useAppDispatch()
    const { user } = useUserContext()
    const { orders, loading, error } = useAppSelector(state => state.order)
    const [resendingCheck, setResendingCheck] = useState<number | null>(null);
    const navigate = useNavigate();
    useEffect(() => {
        if (user) {
            dispatch(fetchOrders())
        } else {
            navigate('/auth')
        }
    }, [dispatch, user])
    const handleResendCheck = async (orderId: number) => {
        setResendingCheck(orderId);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `http://localhost:5000/api/orders/${orderId}/resend-check`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(response.data.message || 'Чек успішно відправлено на email');
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Не вдалося відправити чек');
            } else {
                toast.error('Не вдалося відправити чек');
            }
        } finally {
            setResendingCheck(null);
        }
    };
    if(loading) return <div><Loading /></div>
    if(error) return <div><p>Error: {error}</p></div>
    if(!orders || orders.length === 0) return <div className="py-16"><p>Замовлень поки немає</p></div>
    return (
        <div className="w-full mx-auto py-10 mb-42">
            <h1 className="text-3xl text-center md:text-4xl font-bold mb-10">Ваші <span className="text-primary">замовлення</span></h1>
            <div className="space-y-6">
                {orders.map(order => (
                    <div key={order.id} className="border border-gray-200 rounded-2xl shadow-sm">
                        <div className="flex flex-wrap justify-between gap-4 px-5 py-3 text-gray-600 text-sm">
                            <span>Номер заказу: {order.id}</span>
                            <span>Спосіб оплати: {order.paymentMethod === "COD" ? "Готівка при отриманні" : "Онлайн-оплата"}</span>
                            <span>Статус доставки: {order.deliveryStatus}</span>
                            <span className="font-semibold text-gray-800">Загальна сума: {order.totalAmount.toFixed ? order.totalAmount.toFixed(2) : order.totalAmount}₴</span>
                        </div>
                        <div className="px-5 py-3 border-t border-gray-100">
                            <button 
                                onClick={() => handleResendCheck(order.id)}
                                disabled={resendingCheck === order.id}
                                className="btn btn-sm btn-primary text-white"
                            >
                                {resendingCheck === order.id ? "Відправляємо..." : "Відправити чек повторно"}
                            </button>
                        </div>
                        <div className="divide-y">
                            {order.items.map((it) => (
                                <div key={it.id} className="flex items-center justify-between px-5 py-4">
                                    <div className="flex items-center gap-4 w-[250px]">
                                        <div className="w-18 h-18 rounded overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                                            {it.image ? <img src={it.image} alt={it.name} className="w-full h-full object-cover"/> : null}
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold">{it.name}</p>
                                            <p className="text-sm text-gray-500">Категорія: {it.category}</p>
                                        </div>
                                    </div>
                                    <div className="text-emerald-600 text-sm text-center">
                                        <p>Кількість: {it.quantity}</p>
                                        <p>Статус: Замовлення розміщено</p>
                                        <p>Дата: {new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right text-emerald-600 font-semibold">
                                        Сума: {it.amount.toFixed ? it.amount.toFixed(2) : it.amount}₴
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default OrdersPage
