import {  PencilIcon, TrashIcon } from "lucide-react"
import type { ProductProps } from "../../../types/admin"

const AdminPorductCard = ({product, onEdit, onDelete, onToggleStock}: ProductProps) => {
    const filename = product.productImages?.[0]?.link
    const src = filename ? `http://localhost:5000/static/${filename}` : undefined
    return (
        <div className="bg-white border border-gray-500/20 p-3 rounded-[1rem] relative">
            <figure className="flex items-center justify-center px-2">
                <img src={src} alt={product.name} className="w-[7rem] h-30 sm:w-[8.5rem] sm:h-32" />
            </figure>
            <div className="mt-4 text-gray-500/60 text-sm leading-5">
                <p>{product.category}</p>
                <p className="text-black text-lg leading-7 font-medium w-full truncate">{product.name}</p>
                <div className="flex items-center justify-between mt-3 gap-4">
                    <div>
                        {product.offert > 0 ? (
                            <p className="flex flex-col text-primary text-xl leading-7 font-medium">{product.offert.toFixed(2)}₴ <span className="text-gray-500/60 text-sm leading-5 line-through">{product.price.toFixed(2)}₴</span></p>
                        ): (
                            <p className="flex flex-col text-primary text-xl leading-7 font-medium">{product.price.toFixed(2)}₴</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                        <div>
                            <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                                <input type="checkbox" className="toggle sr-only peer" defaultChecked={product.inStock} onChange={(e)=> onToggleStock(product, e.target.checked)} />
                                <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                                <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                            </label>
                        </div>
                        <div className="flex gap-2 items-center ">
                            <button onClick={()=> onEdit(product)} title="Редагувати" className="p-2 hover:bg-gray-100 hover:text-green-500 rounded-md cursor-pointer transition-colors duration-300">
                                <PencilIcon />
                            </button>
                            <button onClick={()=> onDelete(product)} title="Видалити" className="p-2 hover:bg-gray-100 hover:text-red-500 cursor-pointer rounded-md transition-colors duration-300">
                                <TrashIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminPorductCard

