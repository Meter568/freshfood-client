import { TrashIcon } from "lucide-react"
import type { AdminOrderListPorps } from "../../../types/admin"

const AdminOrdersList = ({orders, maskCard, updateOrder, deleteOrder}: AdminOrderListPorps) => {
    return (
        <div className="space-y-4">
            {orders.map((o) => (
                <div key={o.id} className="border border-gray-200 rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start justify-center gap-4 min-w-[150px] lg:min-w-[220px]">
                        <div className="hidden lg:flex w-14 h-14 rounded-lg bg-gray-100 overflow-hidden items-center justify-center">
                            <img src="/order-logo.png" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-sm text-center lg:text-start w-75">
                            {o.items.map((it) => (
                                <div key={it.id} className="text-gray-800">
                                    {it.name} <span className="text-primary">x {it.quantity}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 text-sm text-center lg:text-start text-gray-700">
                        <div className="font-semibold">Замовлення #{o.id}{o.userName ? ` • ${o.userName}` : ''}</div>
                        <div className="text-gray-500">Дата: {new Date(o.createdAt).toLocaleDateString()}</div>
                            {o.street && <div className="text-gray-600">Адреса: {o.street}{o.houseNumber ? `, буд. ${o.houseNumber}` : ''}{o.apartmentNumber ? `, кв. ${o.apartmentNumber}` : ''}</div>}
                            {o.paymentMethod === 'Online' && o.cardNumber && (
                                <div className="text-gray-600">Картка: {maskCard(o.cardNumber)}</div>
                            )}
                        </div>
                        <div className="text-xl font-bold text-gray-800 w-full lg:w-0 lg:min-w-[80px] text-center lg:text-start">{o.totalAmount.toFixed(2)}₴</div>
                        <div className="text-sm text-gray-700 w-full lg:w-0 lg:min-w-[220px] space-y-1 text-center lg:text-start">
                            <div>Метод оплати: {o.paymentMethod }</div>
                            <div>Статус: {o.status}</div>
                            <div className="flex flex-col lg:flex-row items-center gap-2">
                                <span>Доставка:</span>
                                <select
                                    className="select select-bordered select-sm"
                                    value={o.deliveryStatus ?? "Очікує на розгляд"}
                                    onChange={(e) => updateOrder(o.id, { deliveryStatus: e.target.value })}
                                >
                                    {(["Очікує на розгляд","У дорозі","Доставлено"] as const).map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="w-full lg:w-0 lg:min-w-[60px]">
                            <button className="btn btn-error text-white w-full" onClick={() => deleteOrder(o.id)}>
                                <TrashIcon />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
    )
}

export default AdminOrdersList
