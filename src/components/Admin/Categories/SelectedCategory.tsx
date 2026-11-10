import { CirclePlusIcon, Pencil, Trash2 } from "lucide-react";
import type { CategoryLite } from "../../../types/category";
import type { SelectedCategoryProps } from "../../../types/admin";

const SelectedCategory = ({selectedCategoryData, setSelectedCategorySlug, selectedCategorySubcategories, openEditModal, handleDeleteSubcategory, openCreateModal }: SelectedCategoryProps) => {
    if(!selectedCategoryData) return <div></div>
    return (
        <>
            <div className="mt-6 mb-4">
                <div className="group cursor-pointer py-5 px-3 gap-2 rounded-xl flex flex-col justify-center items-center border-2 border-primary bg-primary/10 relative" style={{ backgroundColor: selectedCategoryData.bgColor || undefined }}>
                    {typeof selectedCategoryData.logo === 'string' && selectedCategoryData.logo && (
                        <img src={`http://localhost:5000${selectedCategoryData.logo}`} alt={selectedCategoryData.name} className="group-hover:scale-108 transition max-w-28" />
                    )}
                    <p className="text-sm text-center font-bold">{selectedCategoryData.name}</p>
                    <button className="absolute top-2 right-2 rounded-full bg-white border border-primary text-primary px-3 py-1 text-xs font-semibold shadow hover:bg-primary hover:text-white transition cursor-pointer" onClick={() => setSelectedCategorySlug(null)}>Показати всі</button>
                </div>
            </div>
            <h4 className="font-semibold mt-6 mb-2 text-md text-gray-800">Дочірні категорії:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {selectedCategorySubcategories.map((subcat: CategoryLite) => (
                    <div key={subcat.id} className="group cursor-pointer py-4 px-2 gap-2 rounded-xl flex flex-col items-center bg-gray-100 border border-gray-200 relative"
                    onClick={()=>openEditModal(
                        typeof selectedCategoryData.id === 'number' ? selectedCategoryData.id : parseInt(selectedCategoryData.id as string, 10),
                            subcat)}>
                        {'logo' in subcat && typeof subcat.logo === 'string' && subcat.logo && (<img src={`http://localhost:5000${subcat.logo}`} alt={subcat.name} className="group-hover:scale-108 transition max-w-24" />)}
                        <p className="text-sm font-medium text-center">{subcat.name}</p>
                        <Pencil 
                            className="absolute top-2 left-3 w-4 h-4 text-primary/70 hover:text-primary cursor-pointer"
                            onClick={e => { e.stopPropagation(); openEditModal(typeof selectedCategoryData.id === 'number' ? selectedCategoryData.id : parseInt(selectedCategoryData.id as string, 10), subcat); }}
                        />
                        <button
                            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-red-50 rounded-full border border-red-200 text-xs text-red-600 hover:bg-red-100 cursor-pointer"
                            title="Видалити підкатегорію"
                            type="button"
                            onClick={e => { e.stopPropagation(); handleDeleteSubcategory(subcat.id as number); }}
                        >
                            <Trash2 size={14}/>
                        </button>
                    </div>
                ))}
                <button className="flex flex-col items-center justify-center gap-1 py-4 px-2 rounded-xl cursor-pointer bg-gray-100 border border-dashed border-primary hover:bg-primary/5 transition" onClick={() => openCreateModal(typeof selectedCategoryData.id === 'number' ? selectedCategoryData.id : parseInt(selectedCategoryData.id as string, 10))}>
                    <CirclePlusIcon />
                    <p>Додати підкатегорію</p>
                </button>
            </div>
        </>
    )
}

export default SelectedCategory
