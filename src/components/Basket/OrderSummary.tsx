import { useState, useEffect } from "react";
import DeliveryAddress from "./DeliveryAddress"
import { useNavigate } from "react-router-dom";
import { createOrder } from "../../features/orders/orderSlice";
import toast from "react-hot-toast";
import { useAppDispatch } from "../../store/hooks";
import { useUserContext } from "../../context/useUserContext";

const OrderSummary = ({ totalPrice }: { totalPrice: number }) => {
    const { user } = useUserContext()
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [cardData, setCardData] = useState({ number: "", expiry: "", cvv: "" })
    const [deliveryAddress, setDeliveryAddress] = useState("")
    const [guestEmail, setGuestEmail] = useState("");
    const [guestPhone, setGuestPhone] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
    const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    useEffect(() => {
        fetch('http://localhost:5000/api/cities')
            .then(response => response.json())
            .then(data => setCities(data.data))
            .catch(error => console.error('Error fetching cities:', error));
    }, []);
    useEffect(() => {
        if (user?.cityId) {
            setSelectedCityId(user.cityId);
        }
    }, [user]);
    const validateCard = (): { valid: boolean; message?: string } => {
        const validCard = "6769351012349090";
        
        if (cardData.number !== validCard) {
            return { 
                valid: false, 
                message: "Щось пішло не так. Повторіть пізніше." 
            };
        }
        if (!/^\d{2}\/\d{2}$/.test(cardData.expiry)) {
            return { 
                valid: false, 
                message: "Невірний формат дати (MM/YY)" 
            };
        }
        if (!/^\d{3}$/.test(cardData.cvv)) {
            return { 
                valid: false, 
                message: "Невірний формат CVV (3 цифры)" 
            };
        }
        return { valid: true };
    };
    const handlePlaceOrder = async () => {        
        if(!user) {
            if (!guestEmail || !guestEmail.trim() || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(guestEmail)) {
                toast.error("Вкажіть коректний e-mail для замовлення");
                return;
            }
            const guestBasket = JSON.parse(localStorage.getItem('basket') || '[]');
            if (!guestBasket || guestBasket.length === 0) {
                toast.error("Кошик порожній");
                return;
            }
            const validItems = guestBasket.filter((item: { productId?: number; name?: string; price?: number; quantity?: number }) => 
                item.productId && item.name && item.price && item.quantity
            );
            if (validItems.length === 0) {
                toast.error("Не знайдено валідних товарів у кошику");
                return;
            }
            if (!guestPhone || !guestPhone.trim()) {
                toast.error("Вкажіть номер телефону для замовлення");
                return;
            }
        }
        if(!deliveryAddress) {
            toast.error("Будь ласка, вкажіть адресу доставки.");
            return;
        }
        if(!selectedCityId) {
            toast.error("Будь ласка, виберіть місто доставки.");
            return;
        }
        const addressParts = deliveryAddress.split(",");
        if (addressParts.length < 2 || !addressParts[1]?.trim()) {
            toast.error("Будь ласка, вкажіть номер будинку в адресі доставки.");
            return;
        }
        if(paymentMethod === "Online") {
            if(!cardData.number || !cardData.expiry || !cardData.cvv) {
                toast.error("Будь ласка, заповніть всі дані картки.");
                return;
            }
        }
        setSubmitting(true);
        try {
            toast.loading("Обробка замовлення...");
            const addressParts = deliveryAddress.split(",");
            const street = addressParts[0]?.trim() || "";
            const houseNumber = addressParts[1]?.replace("буд.", "").trim() || "";
            const apartmentNumber = addressParts[2]?.replace("кв.", "").trim() || null;
            const cityId = selectedCityId || user?.cityId || 1; 
            if (paymentMethod === "Online") {
                const validation = validateCard();
                if (!validation.valid) {
                    toast.dismiss();
                    navigate("/result", { 
                        state: { 
                            success: false,
                            message: validation.message || "Помилка оплати. Перевірте дані карти."
                        } 
                    });
                    return;
                }
            }
            const orderPayload = {
                cityId: Number(cityId),
                street,
                houseNumber,
                apartmentNumber,
                paymentMethod,
                cardNumber: paymentMethod === "Online" ? cardData.number : null,
                phoneNumber: user ? user.phoneNumber : guestPhone,
                guestEmail: user ? undefined : guestEmail
            };
            await dispatch(
                createOrder(orderPayload)
            ).unwrap();
            toast.dismiss();
            toast.success("Замовлення успішно оформлено!");
            if (!user) {
                localStorage.removeItem('basket');
                localStorage.setItem('guestData', JSON.stringify({
                    cityId: cityId,
                    street: street,
                    houseNumber: houseNumber,
                    apartmentNumber: apartmentNumber,
                    phoneNumber: guestPhone,
                    email: guestEmail
                }));
            } else {}
            navigate("/result", { 
                state: { success: true } 
            });
        } catch (error: unknown) {
            toast.dismiss();
            console.error('Order creation error:', error);
            let errorMessage = "Не вдалося оформити замовлення.";
            
            if (error && typeof error === 'object' && 'message' in error) {
                errorMessage = (error as { message: string }).message;
            } else if (error && typeof error === 'object' && 'response' in error) {
                const response = (error as { response: { data?: { message?: string } } }).response;
                if (response?.data?.message) {
                    errorMessage = response.data.message;
                }
            }
            navigate("/result", { 
                state: { 
                    success: false, 
                    message: errorMessage 
                } 
            });
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <div className="xl:max-w-[360px] w-full p-5 max-md:mt-16 border border-gray-200 rounded-3xl shadow-xl">
                <h2 className="text-xl md:text-xl font-bold text-center">Замовлення</h2>
                <hr className="border-gray-300 my-5" />
                <div className="mb-6">
                    <div className="mt-4">
                        <label className="block text-sm font-medium uppercase mb-1">
                            Місто доставки
                        </label>
                        <select
                            value={selectedCityId ?? ""}
                            onChange={(e) => setSelectedCityId(Number(e.target.value) || null)}
                            className="select select-primary w-full outline-none"
                            required
                        >
                            <option value="">Виберіть місто</option>
                            {cities.map((city) => (
                                <option key={city.id} value={city.id}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <DeliveryAddress onChange={setDeliveryAddress} />
                    
                    {!user && (
                        <div className="mt-6">
                            <div className="mt-3">
                                <label className="text-sm font-medium uppercase mb-1">
                                    Електронна пошта
                                </label>
                                <input
                                    type="email"
                                    value={guestEmail}
                                    onChange={e => setGuestEmail(e.target.value)}
                                    className="input input-primary w-full"
                                    placeholder="you@email.com"
                                    required
                                />
                            </div>
                            <div className="mt-3">
                                <label className="text-sm font-medium uppercase mb-1">
                                    Номер телефону
                                </label>
                                <input
                                    type="text"
                                    value={guestPhone}
                                    onChange={e => setGuestPhone(e.target.value)}
                                    className="input input-primary w-full"
                                    placeholder="+380123456789"
                                    required
                                />
                            </div>
                        </div>
                    )}
                    <p className="text-sm font-medium uppercase mt-6">Спосіб оплати</p>
                    <select 
                        className="select select-primary w-full mt-2 outline-none"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                        <option value="COD">Готівка при отриманні</option>
                        <option value="Online">Онлайн-оплата</option>
                    </select>
                </div>
                {paymentMethod === "Online" && (
                    <div className="mt-4 space-y-3">
                        <input 
                            type="text"
                            placeholder="Номер картки"
                            maxLength={16}
                            value={cardData.number}
                            onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                            className="input input-primary w-full"
                        />
                        <div className="flex gap-3">
                            <input 
                                type="text"
                                placeholder="MM/YY"
                                maxLength={5}
                                value={cardData.expiry}
                                onChange={(e) => {
                                    let value = e.target.value.replace(/\D/g, "");
                                    if(value.length >= 3) {
                                        value = value.slice(0, 2) + "/" + value.slice(2, 4);
                                    }
                                    setCardData({ ...cardData, expiry: value });
                                }}
                                className="input input-primary w-1/2"
                            />
                            <input 
                                type="text"
                                placeholder="CVV"
                                maxLength={3}
                                value={cardData.cvv}
                                onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                                className="input input-primary w-1/2"
                            />
                        </div>
                    </div>
                )}
                <hr className="border-gray-300" />
                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between">
                        <span>Ціна</span><span>{totalPrice.toFixed(2)}₴</span>
                    </p>
                    <div className="mt-4">
                        {totalPrice >= 300 ? (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center font-medium">
                                <p className="text-green-600">Вітаємо! Ви отримали безкоштовну доставку.</p>
                            </div>
                        ): (
                            <>
                                <p className="text-gray-700 mb-1 text-sm flex justify-between">
                                    <span>До безкоштовної доставки залишилось:</span>
                                    <span className="font-semibold">
                                        {(300 - totalPrice).toFixed(2)}₴
                                    </span>
                                </p>
                                <progress 
                                    className="progress progress-success w-full h-3" 
                                    value={totalPrice} 
                                    max={300}
                                ></progress>
                            </>
                        )}
                    </div>
                    <p className="flex justify-between">
                        <span>Вартість доставки: </span>
                        <span
                            className={totalPrice >= 300 ? "text-green-600 font-medium" : "text-gray-700 font-medium"}
                        >
                            {totalPrice >= 300 ? "0₴" : "20₴"}
                        </span>
                    </p>
                    <p className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-3">
                        <span>До оплати</span>
                        <span>
                            {(totalPrice + (totalPrice >= 300 ? 0 : 20)).toFixed(2)}₴
                        </span>
                    </p>
                </div>
                <button
                    className="btn btn-primary w-full py-3 mt-6 cursor-pointer text-white font-medium transition"
                    onClick={handlePlaceOrder}
                    disabled={submitting}
                >
                    {paymentMethod === "Online" ? "Оплатити карткою" : "Замовити"}
                </button>
            </div>
    )
}

export default OrderSummary
