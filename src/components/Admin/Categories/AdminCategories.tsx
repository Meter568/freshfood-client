import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchCategories, fetchCategoryBySlug } from "../../../features/categories/categorySlice";
import { Pencil, Trash2 } from "lucide-react";
import type { Category, CategoryLite } from "../../../types/category";
import axios from "axios";
import type { ModalState } from "../../../types/admin";
import ModalAdminCategories from "./ModalAdminCategories";
import toast from "react-hot-toast";
import SelectedCategory from "./SelectedCategory";

const getInitialModalState = (parentId: number | null, cat?: Category | CategoryLite): ModalState => ({
    name: cat?.name || '',
    slug: cat?.slug || '',
    bgColor: cat?.bgColor || '#FFFFFF',
    logo: null,
    parent_id: parentId,
    logoPreview: cat && typeof cat.logo === 'string' && cat.logo ? `http://localhost:5000${cat.logo}` : '',
});

const AdminCategories = () => {
    const dispatch = useAppDispatch();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { items: categories, loading: loadingCategories, error: errorCategories, selected } = useAppSelector((state) => state.category);
    const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create'|'edit'>('create');
    const [modalLoading, setModalLoading] = useState(false);
    const [modalErr, setModalErr] = useState('');
    const [modalCatId, setModalCatId] = useState<number | null>(null);
    const [modalState, setModalState] = useState<ModalState | null>(null);
    useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);
    useEffect(() => { if (selectedCategorySlug) dispatch(fetchCategoryBySlug(selectedCategorySlug)); }, [dispatch, selectedCategorySlug]);
    const openCreateParentModal = () => {
        setModalCatId(null); setModalMode('create'); setModalOpen(true);
        setModalState(getInitialModalState(null));
        setModalErr('');
    };
    const openEditParentModal = (cat: Category) => {
        setModalCatId(cat.id); setModalMode('edit'); setModalOpen(true);
        setModalState(getInitialModalState(null, cat));
        setModalErr('');
    };
    const handleDeleteParent = async (id: number) => {
        if (!window.confirm('Видалити категорію разом з усіма підкатегоріями?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/categories/${id}`);
            dispatch(fetchCategories());
            if (selectedCategorySlug) setSelectedCategorySlug(null);
            toast.success('Категорія успішно видалена');
        } catch {
            alert('Помилка видалення категорії');
        }
    };
    const openCreateModal = (parentId: number) => {
        setModalCatId(null); setModalMode('create'); setModalOpen(true);
        setModalState(getInitialModalState(parentId));
        setModalErr('');
    };
    const openEditModal = (parentId: number, data: CategoryLite) => {
        setModalCatId(typeof data.id === 'number' ? data.id : parseInt(data.id as string, 10)); setModalMode('edit'); setModalOpen(true);
        setModalState(getInitialModalState(parentId, data));
        setModalErr('');
    };
    const handleModalFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setModalState((s) => s ? ({ ...s, logo: file, logoPreview: file ? URL.createObjectURL(file) : '' }) : s);
    };
    const handleModalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setModalState((s) => s ? ({ ...s, [name]: value }) as ModalState : s);
    };
    const handleModalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!modalState) return;
        setModalLoading(true);
        setModalErr('');
        try {
            const formData = new FormData();
            formData.append('name', modalState.name);
            formData.append('slug', modalState.slug);
            formData.append('bgColor', modalState.bgColor);
            formData.append('parent_id', modalState.parent_id === null ? '' : String(Number(modalState.parent_id)));
            if (modalState.logo instanceof File) formData.append('logo', modalState.logo);
            if (modalMode === 'create') {
                await axios.post('http://localhost:5000/api/categories', formData);
            } else {
                await axios.put(`http://localhost:5000/api/categories/${modalCatId}`, formData);
            }
            setModalOpen(false);
            if (selectedCategorySlug && modalState.parent_id !== null) dispatch(fetchCategoryBySlug(selectedCategorySlug));
            else dispatch(fetchCategories());
            toast.success('Категорія успішно збережена');
        } catch (e) { setModalErr(e instanceof Error ? e.message : 'Щось пішло не так'); }
        finally { setModalLoading(false); }
    };
    const handleModalClose = () => { setModalOpen(false); };
    const handleDeleteSubcategory = async (subcategoryId: number | string) => {
        if (!window.confirm('Ви впевнені, що хочете видалити підкатегорію?')) return;
        const idnum = Number(subcategoryId);
        try {
            await axios.delete(`http://localhost:5000/api/categories/subcategory/${idnum}`);
            toast.success('Підкатегорія успішно видалена');
            if (selectedCategorySlug) dispatch(fetchCategoryBySlug(selectedCategorySlug));
        } catch { toast.error('Помилка видалення підкатегорії'); }
    };
    const showAllCategories = !selectedCategorySlug;
    const selectedCategoryData = selected?.data?.category as (Category | undefined);
    const selectedCategorySubcategories = (selected?.data?.subcategories || []) as CategoryLite[];
    const selectedLoading = selected?.loading;
    const selectedError = selected?.error;
    return (
        <div className="flex flex-col">
            <h2 className="text-center md:text-start text-xl md:text-2xl font-semibold mb-4">Управління категоріями</h2>
            <div>
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <h3 className="text-xl font-semibold mb-3">Категорії</h3>
                    {showAllCategories && (
                        <button className="btn btn-primary text-white" onClick={openCreateParentModal}>Додати категорію</button>
                    )}
                </div>
                {loadingCategories && (<span className="loading loading-spinner loading-lg text-primary"></span>)}
                {errorCategories && (<p>Не вдалося одержати категорії. Помилка:{errorCategories}</p>)}
                {showAllCategories && categories && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 mt-6 gap-6">
                        {categories.map((category: Category) => (
                            <div
                                key={category.id}
                                className="group cursor-pointer py-5 px-3 gap-2 rounded-xl flex flex-col justify-center items-center border-2 border-transparent hover:border-primary relative"
                                style={{ backgroundColor: category.bgColor }}
                            >
                                <button className="absolute top-2 right-2 p-1 rounded-md bg-white/70 hover:bg-white border" title="Редагувати" onClick={e => { e.stopPropagation(); openEditParentModal(category); }}>
                                    <Pencil className="w-4 h-4 text-primary" />
                                </button>
                                <button className="absolute top-2 left-2 p-1 rounded-md bg-white/70 hover:bg-white border" title="Видалити" onClick={e => { e.stopPropagation(); handleDeleteParent(category.id); }}>
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                                <div onClick={() => setSelectedCategorySlug(category.slug)}>
                                    {typeof category.logo === 'string' && category.logo && (
                                        <img src={`http://localhost:5000${category.logo}`} alt={category.name} className="group-hover:scale-108 transition max-w-28" />
                                    )}
                                    <p className="text-sm text-center font-medium">{category.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {!showAllCategories && (
                    <div>
                        {selectedLoading && (<span className="loading loading-spinner loading-lg text-primary"></span>)}
                        {selectedError && (<p>Не вдалося отримати підкатегорії. Помилка: {selectedError}</p>)}
                        {selectedCategoryData && (
                            <SelectedCategory  
                                selectedCategoryData={selectedCategoryData}
                                setSelectedCategorySlug={setSelectedCategorySlug}
                                selectedCategorySubcategories={selectedCategorySubcategories}
                                openEditModal={openEditModal}
                                handleDeleteSubcategory={handleDeleteSubcategory}
                                openCreateModal={openCreateModal}
                            />
                        )}
                    </div>
                )}
            </div>
            {modalOpen && modalState && (
                <ModalAdminCategories 
                    modalMode={modalMode} 
                    modalState={modalState} 
                    modalLoading={modalLoading} 
                    modalErr={modalErr} 
                    handleModalChange={handleModalChange} 
                    handleModalSubmit={handleModalSubmit} 
                    handleModalClose={handleModalClose} 
                    fileInputRef={fileInputRef} 
                    handleModalFile={handleModalFile} 
                />
            )}
        </div>
    );
};

export default AdminCategories;
