import { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";
import type { ProductType } from "../types/product";
import { useNavigate } from "react-router-dom";
import { addToBasket, removeFromBasket, updateQuantity } from "../features/basket/basketSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import toast from "react-hot-toast";

type ProductProps = {
    product: ProductType
}

const ProductCard = ({product}: ProductProps) => {
    const dispatch = useAppDispatch();
    const basketItems = useAppSelector((state) => state.basket.items);
    const existingItem = basketItems.find(item => item.productId === product.id);
    const [count, setCount] = useState(existingItem ? existingItem.quantity : 0);
    const filename = product.productImages?.[0]?.link
    const src = filename ? `http://localhost:5000/static/${filename}` : undefined
    const navigate = useNavigate()
    useEffect(() => {
        if(existingItem) {
            setCount(existingItem.quantity);
        }
    }, [existingItem])
    const handleAddToBasket = () => {
        setCount(1);
        dispatch(addToBasket({ productId: product.id, quantity: 1 }));
        toast.success("Товар доданий до кошика")
    }
    const handleChangeQuantity = (newCount: number) => {
        if (newCount <= 0) {
            setCount(0);
            dispatch(removeFromBasket(product.id));
            toast.success("Товар прибрано з кошика")
        } else {
            setCount(newCount);
            dispatch(updateQuantity({ productId: product.id, quantity: newCount }));
        }
    }
    return (
        <div className={`bg-white border-2 ${count > 0 ? "border-primary" : "border-gray-500/20"}  p-3 rounded-[1rem] relative transition-all duration-300`}>
            <figure className="flex items-center justify-center px-2">
                <img src={src} alt={product.name} className="w-[7rem] h-30 sm:w-[8.5rem] sm:h-32 transition-all duration-400 ease-in-out hover:scale-[1.04] cursor-pointer" onClick={() => navigate(`/product/${product.servername}`)} />
            </figure>
            <div className="mt-4 text-gray-500/60 text-sm leading-5">
                <p>{product.category}</p>
                <p className="text-black text-lg leading-7 font-medium w-full truncate">{product.name}</p>
                <div className="flex items-center justify-between mt-3 gap-4">
                    {product.inStock ? (
                        <>
                            <div>
                                {product.offert > 0 ? (
                                    <p className="flex flex-col text-primary text-xl leading-7 font-medium">{product.offert.toFixed(2)}₴ <span className="text-gray-500/60 text-sm leading-5 line-through">{product.price.toFixed(2)}₴</span></p>
                                ): (
                                    <p className="flex flex-col text-primary text-xl leading-7 font-medium">{product.price.toFixed(2)}₴</p>
                                )}
                            </div>
                            <div>
                                {count === 0 ? (
                                    <button className="p-2 flex items-center justify-center gap-1 bg-transparent hover:bg-primary border border-primary rounded-xl text-primary hover:text-white font-medium cursor-pointer transition-all " onClick={() => handleAddToBasket()} >
                                        <PlusIcon />
                                    </button>
                                ) : (
                                    <div className="flex items-center justify-center gap-2 p-2 bg-transparent rounded-xl select-none border border-primary">
                                        <button onClick={() => handleChangeQuantity(count - 1)} className="text-primary hover:text-primary-dull text-lg leading-6 px-2 h-full cursor-pointer" >
                                            -
                                        </button>
                                        <span className="w-5 text-center text-md text-primary">{count}</span>
                                        <button onClick={() => handleChangeQuantity(count + 1)} className="text-primary hover:text-primary-dull text-lg leading-6 px-2 h-full cursor-pointer" >
                                            +
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="mx-auto text-center w-full py-3 text-white bg-gray-400 rounded-xl">Розпродано</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard