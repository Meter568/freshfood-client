import { useAppDispatch, useAppSelector } from "../store/hooks"
import Loading from "../components/Loading"
import { Link, useNavigate } from "react-router-dom"
import { MinusIcon, MoveLeftIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { removeFromBasket, updateQuantity } from "../features/basket/basketSlice"
import OrderSummary from "../components/Basket/OrderSummary"

const BasketPage = () => {
    const dispatch = useAppDispatch()
    const { items, loading } = useAppSelector((state) => state.basket)
    const navigate = useNavigate()
    const totalPrice = items.reduce(
        (total, item) => total + item.price * item.quantity, 0
    )
    const handleChangeQuantity = (productId: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            dispatch(removeFromBasket(productId));
        } else {
            dispatch(updateQuantity({ productId, quantity: newQuantity }));
        }
    }
    if(loading) return <div><Loading /></div>
    if(items.length === 0) return (
        <div className="mx-auto my-[219px] flex flex-col gap-2 items-center">
            <h2>Ваш кошик порожній</h2>
            <p>Додати товари в кошик, щоб побачити їх тут</p>
            <button className="btn btn-primary text-white" onClick={() => navigate("/products")}><MoveLeftIcon /> Показати всі товари</button>
        </div>
    )
    return (
        <div className="flex flex-col xl:flex-row py-16 gap-10 max-w-7xl mx-auto">
            <div className='flex-1 w-full  xl:max-w-4xl border border-gray-200 p-3 rounded-3xl shadow-xl'>
                <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-primary text-center">
                Кошик для покупок 
                </h1>
                <div className="hidden sm:grid grid-cols-4 text-black text-base font-medium pb-3 border-b border-gray-200">
                    <p className="text-left">Продукти</p>
                    <p className="text-center">Кількість</p>
                    <p className="text-center">Ціна</p>
                    <p className="text-center">Видалити</p>
                </div>
                {items.map((product, index) => (
                    <div key={index} className="grid grid-cols-4 items-center text-sm md:text-base font-medium py-4 border-b border-gray-100">
                        <div className="flex items-center md:gap-6 gap-3">
                            <div className="cursor-pointer w-15 h-15 sm:w-22 sm:h-22 p-2 flex items-center justify-center border border-gray-300 rounded overflow-hidden flex-shrink-0">
                                <Link to={`/product/${product.servername}`}>
                                    <img className="w-full h-full object-cover" src={product.image} alt={product.name} />
                                </Link>
                            </div>
                            <div>
                                <p className="block text-[0.9rem] font-semibold text-center">{product.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="flex items-center justify-center bg-transparent rounded-xl select-none">
                                <button onClick={() => handleChangeQuantity(product.productId, product.quantity - 1)} className="text-primary hover:text-primary-dull text-lg leading-6 px-2 h-full cursor-pointer" >
                                    <MinusIcon className="w-3 text-error" />
                                </button>
                                <span className="w-8 text-center text-md text-black font-medium">{product.quantity}</span>
                                <button onClick={() => handleChangeQuantity(product.productId, product.quantity + 1)} className="text-primary hover:text-primary-dull text-lg leading-6 px-2 h-full cursor-pointer" >
                                    <PlusIcon className="w-3 text-primary" />
                                </button>
                            </div>
                        </div>
                        <p className="text-center font-semibold">{(product.price * product.quantity).toFixed(2)}₴</p>
                        <div className="flex justify-center">
                            <button className="cursor-pointer" onClick={() => dispatch(removeFromBasket(product.productId))}>
                                <Trash2Icon className="text-red-400 hover:text-red-500" />
                            </button>
                        </div>
                    </div>)
                )}
            </div>
            <OrderSummary totalPrice={totalPrice} />
        </div>
    )
}

export default BasketPage
