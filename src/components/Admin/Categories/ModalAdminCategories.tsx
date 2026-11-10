import { XIcon } from "lucide-react";
import type { ModalAdminCategoriesProps } from "../../../types/admin"

const ModalAdminCategories = ({modalMode, modalState, modalLoading, modalErr, handleModalChange, handleModalSubmit, handleModalClose, fileInputRef, handleModalFile}: ModalAdminCategoriesProps) => {
    if(!modalState) return null;
    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-8 relative">
                        <button onClick={handleModalClose} className="absolute right-3 top-3 text-2xl font-bold text-primary">
                            <XIcon className="cursor-pointer" />
                        </button>
                        <h3 className="text-xl font-bold text-center mb-6">{modalMode === 'create' ? (modalState.parent_id===null ? 'Додати категорію' : 'Додати підкатегорію') : (modalState.parent_id===null ? 'Редагувати категорію' : 'Редагувати підкатегорію')}</h3>
                        <form onSubmit={handleModalSubmit} className="flex flex-col gap-6">
                            <div className="flex gap-4 items-center">
                                <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleModalFile}/>
                                <div className="w-28 h-24 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-300 cursor-pointer overflow-hidden" onClick={()=>fileInputRef.current?.click()}>
                                    {modalState.logoPreview ? (
                                        <img src={modalState.logoPreview} alt="Логотип" className="w-full h-full object-cover" />
                                    ) : <span className="text-xs text-gray-400">Завантажити<br />логотип</span>}
                                </div>
                                <div className="flex-1 flex flex-col gap-2">
                                    <label className="text-sm">Назва</label>
                                    <input name="name" className="input input-bordered" value={modalState.name} onChange={handleModalChange} required/>
                                    <label className="text-sm mt-2">Slug (Англійською, латиницей)</label>
                                    <input name="slug" className="input input-bordered" value={modalState.slug} onChange={handleModalChange} required />
                                    <label className="text-sm mt-2">Колір фону</label>
                                    <input name="bgColor" type="color" className="w-12 h-8 border-none" value={modalState.bgColor} onChange={handleModalChange} />
                                </div>
                            </div>
                            {modalErr && <div className="text-red-500 mt-2">{modalErr}</div>}
                            <div className="flex gap-3 justify-end pt-2">
                                <button type="button" className="btn" onClick={handleModalClose} disabled={modalLoading}>Скасувати</button>
                                <button type="submit" className="btn btn-primary text-white" disabled={modalLoading}>{modalLoading ? 'Збереження...' : 'Зберегти'}</button>
                            </div>
                        </form>
                    </div>
                </div>
    )
}

export default ModalAdminCategories
