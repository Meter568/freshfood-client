import { PlusIcon, MinusIcon, Trash2Icon } from "lucide-react"
import { Link } from "react-router-dom"
import { useAppDispatch } from "../../store/hooks"
import { removeFromBasket } from "../../features/basket/basketSlice"
import type { BasketListProps } from "../../types/basket"

const BasketList = ({items, handleChangeQuantity}: BasketListProps) => {
    const dispatch = useAppDispatch()
    return (
        <div className='flex-1 w-full  xl:max-w-4xl border border-gray-200 p-3 rounded-3xl shadow-xl'>
                <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-primary text-center">
                Кошик для покупок 
                </h1>
                <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr] text-black text-base font-medium pb-3">
                    <p className="text-left">Продукти</p>
                    <p className="text-center">Ціна</p>
                    <p className="text-center">Видалити</p>
                </div>
                {items.map((product, index) => (
                    <div key={index} className="grid grid-cols-[2fr_1fr_1fr] items-center text-sm md:text-base font-medium pt-3">
                        <div className="flex items-center md:gap-6 gap-3">
                            <div className="cursor-pointer w-15 h-15 sm:w-30 sm:h-30 p-2 flex items-center justify-center border border-gray-300 rounded overflow-hidden flex-shrink-0">
                                <Link to={`/product/${product.servername}`}>
                                    <img className="w-full h-full object-cover" src={product.image} alt={product.name} />
                                </Link>
                            </div>
                        <div>
                            <p className="block font-semibold">{product.name}</p>
                            <div className="font-normal">
                                <div className="flex items-center mt-2">
                                    <p>Кількість:</p>
                                    <div className="flex items-center justify-center bg-transparent rounded-xl select-none">
                                        <button onClick={() => handleChangeQuantity(product.productId, product.quantity - 1)} className="text-primary hover:text-primary-dull text-lg leading-6 px-2 h-full cursor-pointer" >
                                            <MinusIcon className="w-3 text-error" />
                                        </button>
                                        <span className="w-5 text-center text-md text-black">{product.quantity}</span>
                                        <button onClick={() => handleChangeQuantity(product.productId, product.quantity + 1)} className="text-primary hover:text-primary-dull text-lg leading-6 px-2 h-full cursor-pointer" >
                                            <PlusIcon className="w-3 text-primary" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="text-center">{(product.price * product.quantity).toFixed(2)}₴</p>
                    <button className="cursor-pointer mx-auto" onClick={() => dispatch(removeFromBasket(product.productId))}>
                        <Trash2Icon className="text-red-400 hover:text-red-500" />
                    </button>
                </div>)
            )}
        </div>
    )
}

export default BasketList
