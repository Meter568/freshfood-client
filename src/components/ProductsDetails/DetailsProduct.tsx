import { useNavigate } from "react-router-dom"
import type { DetailsProductProps } from "../../types/product"
import { useAppDispatch } from "../../store/hooks"
import { addToBasket } from "../../features/basket/basketSlice"
import { ArrowRightIcon } from "lucide-react"
import toast from "react-hot-toast"
import { useEffect, useState } from "react"
import axios from "axios"
import type { CountryType } from "../../types/country"
import type { TrademarkType } from "../../types/trademark"

const DetailsProduct = ({product, count, handleChangeQuantity, setCount}: DetailsProductProps) => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const [countries, setCountries] = useState<CountryType[]>([])
    const [trademarks, setTrademarks] = useState<TrademarkType[]>([])

    useEffect(() => {
        axios.get(`http://localhost:5000/api/countries`)
        .then((result) => setCountries(result.data.data))
        .catch((error) => console.error("Помилка отримання країн:", error));
    }, [])

    const countryName = countries.find((country) => country.id === product.countryId)?.name || "Не вказано"

    useEffect(() => {
        axios.get(`http://localhost:5000/api/trademarks`)
        .then((result) => setTrademarks(result.data.data))
        .catch((error) => console.error("Помилка отримання торгових марок:", error));
    }, [])

    const trademarkName = trademarks.find((trademark) => trademark.id === product.trademarkId)?.name || "Не вказано"

    return (
        <div className="flex flex-col gap-7 w-full xl:w-[35rem]">
            <div className={`text-sm w-full p-4 bg-white border-2 ${count > 0 ? "border-primary" : "border-gray-500/30"} rounded-[1rem] transition-colors duration-300`}>
                <h1 className="text-2xl text-center sm:text-start sm:text-3xl font-medium mb-8">{product.name}</h1>
                <div className="flex flex-row gap-3 items-center justify-between">
                    {product.inStock ? (
                        <>
                            <div className="flex flex-col gap-2">
                                {product.offert > 0 ? (
                                        <p className="flex flex-col text-primary text-xl leading-7 font-medium">{product.offert.toFixed(2)}₴ <span className="text-gray-500/60 text-sm leading-5 line-through">{product.price.toFixed(2)}₴</span></p>
                                    ): (
                                        <p className="flex flex-col text-primary text-xl leading-7 font-medium">{product.price.toFixed(2)}₴</p>
                                    )}
                            </div>
                            <div className="flex items-center gap-5 text-md">
                                {count === 0 ? (
                                    <>
                                        <button 
                                            className="py-3 px-5 cursor-pointer font-bold text-md bg-primary text-white hover:bg-primary-dull transition-colors duration-300 rounded-xl"
                                        onClick={() => { 
                                                setCount(1); 
                                                dispatch(addToBasket({ productId: product.id, quantity: 1 }));
                                                toast.success("Товар доданий до кошика")
                                            }}
                                        >
                                            <i className="bi bi-cart-plus text-md"></i> Додати товар
                                        </button>
                                        <button 
                                            className="hidden sm:block py-3 px-5 cursor-pointer font-bold bg-primary text-white hover:bg-primary-dull transition-colors duration-300 rounded-xl"
                                            onClick={() => {
                                                setCount(1);
                                                dispatch(addToBasket({ productId: product.id, quantity: 1 }));
                                                navigate('/basket');
                                            }}
                                        >
                                            Купити зараз
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center gap-2 p-2 bg-transparent rounded-xl select-none border border-primary">
                                            <button onClick={() => handleChangeQuantity(count - 1)} className="text-primary hover:text-primary-dull text-lg leading-6 px-2 h-full cursor-pointer" >
                                                -
                                            </button>
                                            <span className="w-5 text-center text-md text-primary">{count}</span>
                                            <button onClick={() => handleChangeQuantity(count + 1)} className="text-primary hover:text-primary-dull text-lg leading-6 px-2 h-full cursor-pointer" >
                                                +
                                            </button>
                                        </div>
                                        <button 
                                            className="flex items-center gap-4 py-2 px-4 cursor-pointer font-bold text-md bg-primary text-white hover:bg-primary-dull transition-colors duration-300 rounded-xl"
                                            onClick={() => navigate("/basket")}
                                        >
                                            У кошик <ArrowRightIcon />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="mx-auto text-center w-full py-3 text-white text-md bg-gray-400">Розпродано</div>
                    )}
                </div>
            </div>
            <div className={`text-sm w-full p-4 bg-white border-2 ${count > 0 ? "border-primary" : "border-gray-500/30"} rounded-[1rem] transition-colors duration-300`}>
                <h2 className="text-xl text-center sm:text-start font-medium mb-4">Загальна інформація</h2>
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-row justify-between items-center">
                            <h3 className="text-md">Країна</h3>
                            <p className="text-md">{countryName}</p>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <h3 className="text-md">Торгова марка</h3>
                            <p className="text-md">{trademarkName}</p>
                        </div>
                    </div>
                </div>
                <div className={`text-sm w-full p-4 bg-white border-2 ${count > 0 ? "border-primary" : "border-gray-500/30"} rounded-[1rem] transition-colors duration-300`}>
                    <h2 className="text-xl text-center sm:text-start font-medium mb-4">Опис</h2>
                    <p className="text-md text-justify">{product.description}</p>
                </div>
        </div>
    )
}

export default DetailsProduct
