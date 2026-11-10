import { XIcon } from "lucide-react"
import type { ModalAdminProductsProps } from "../../../types/admin"

interface ModalAdminProductsPropsNew extends ModalAdminProductsProps {
    trademarks: { id: number, name: string }[];
    countries: { id: number, name: string }[];
}

const ModalAdminProducts = ({setModalOpen, modalMode, handleSave, handlePickImage, fileInputsRef, handleFileChange, form, setForm, parentCategoryId, handleParentChange, categories, subcategories, saving, trademarks, countries, handleDeleteImage}: ModalAdminProductsPropsNew) => {
    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full p-8 relative">
                <button onClick={()=>setModalOpen(false)} className="absolute right-3 top-3 text-2xl font-bold cursor-pointer"><XIcon className="text-primary hover:text-second transition-colors" /></button>
                <h3 className="text-xl font-bold mb-2">{modalMode==='create'?'Додати товар':'Редагувати товар'}</h3>
                <form onSubmit={handleSave} className="flex flex-col gap-6">
                    <div>
                        <p className="font-semibold">Зображення продукту</p>
                        <div className="grid grid-cols-4 gap-3">
                            {[0,1,2,3].map(i => {
                                const image = form.images[i];
                                const preview = form.previews[i];
                                return (
                                    <div key={i} className="border-2 border-dashed rounded-xl h-24 flex items-center justify-center text-gray-500 cursor-pointer overflow-hidden" onClick={()=>{
                                        if(preview && image && 'id' in image) {
                                            handleDeleteImage(Number((image as any).id), i)
                                        } else if (preview) {
                                            setForm((s) => {
                                                const nextImgs = [...s.images];
                                                const nextPrevs = [...s.previews];
                                                nextImgs[i] = null;
                                                nextPrevs[i] = null;
                                                return {...s, images: nextImgs, previews: nextPrevs};
                                            })
                                        } else {
                                            handlePickImage(i);
                                        }
                                    }}>
                                        <input type="file" accept="image/*" ref={fileInputsRef[i]} style={{display:'none'}} onChange={(e)=>handleFileChange(i, e)} />
                                            {form.previews[i] ? (
                                                <img src={form.previews[i] as string} alt="preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <span>Завантажити</span>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div>
                        <p className="font-semibold">Назва</p>
                        <input className="input input-bordered w-full" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} required />
                    </div>
                    <div>
                        <p className="font-semibold">Назва для сервера (servername)</p>
                        <input className="input input-bordered w-full" value={form.servername} onChange={(e)=>setForm({...form, servername: e.target.value})} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="font-semibold">Торгова марка</p>
                            <select className="select select-bordered w-full" value={form.trademarkId} onChange={e => setForm(f => ({...f, trademarkId: Number(e.target.value)}))} required>
                                <option value="">Оберіть торгову марку</option>
                                {trademarks.map(tm => (
                                    <option key={tm.id} value={tm.id}>{tm.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <p className="font-semibold">Країна</p>
                            <select className="select select-bordered w-full" value={form.countryId} onChange={e => setForm(f => ({...f, countryId: Number(e.target.value)}))} required>
                                <option value="">Оберіть країну</option>
                                {countries.map(cn => (
                                    <option key={cn.id} value={cn.id}>{cn.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <p className="font-semibold">Опис</p>
                        <textarea className="textarea textarea-bordered w-full text-justify" value={form.description} onChange={(e)=>setForm({...form, description: e.target.value})} rows={5} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="font-semibold">Батьківська категорія</p>
                            <select className="select select-bordered w-full" value={parentCategoryId} onChange={handleParentChange}>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <p className="font-semibold">Підкатегорія</p>
                            <select className="select select-bordered w-full" value={form.categoryId} onChange={(e)=>setForm({...form, categoryId: Number(e.target.value)})}>
                                {subcategories.map(sc => (
                                    <option key={sc.id} value={sc.id as number}>{sc.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="font-semibold">Ціна</p>
                                <input type="number" className="input input-bordered w-full" value={form.price.toFixed(2)} onChange={(e)=>setForm({...form, price: Number(e.target.value)})} />
                            </div>
                            <div>
                                <p className="font-semibold">Знижка</p>
                                <input type="number" className="input input-bordered w-full" value={form.offert.toFixed(2)} onChange={(e)=>setForm({...form, offert: Number(e.target.value)})} />
                            </div>
                        </div>
                    <div className="flex items-center gap-3">
                        <input id="instock" type="checkbox" className="checkbox" checked={form.inStock} onChange={(e)=>setForm({...form, inStock: e.target.checked})} />
                        <label htmlFor="instock">В наявності</label>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button type="button" className="btn" onClick={()=>setModalOpen(false)} disabled={saving}>Скасувати</button>
                        <button type="submit" className="btn btn-primary text-white" disabled={saving}>{saving?'Збереження...':'Зберегти'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ModalAdminProducts
