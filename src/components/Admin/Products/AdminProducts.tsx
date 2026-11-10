import { useEffect, useState, useRef, useMemo } from "react"
import axios from "axios"
import { useAppDispatch, useAppSelector } from "../../../store/hooks"
import { fetchAllProducts, setSearchQuery } from "../../../features/products/productSlice"
import AdminPorductCard from "./AdminPorductCard"
import { getPageSlice } from "../../../utils/chunk"
import { fetchCategories } from "../../../features/categories/categorySlice"
import type { ProductImageLite, ProductType } from "../../../types/product"
import type { CategoryLite, Category } from "../../../types/category"
import type { ProductForm } from "../../../types/admin"
import toast from "react-hot-toast"
import ModalAdminProducts from "./ModalAdminProducts"
import SortDrawer from "../../SortDrawer"
import { Search } from "lucide-react"
import type { TrademarkType } from "../../../types/trademark"
import type { CountryType } from "../../../types/country"

const PER_PAGE = 12

const emptyForm = (firstCategoryId?: number): ProductForm => ({
    images: [null, null, null, null],
    previews: [null, null, null, null],
    name: '',
    description: '',
    categoryId: firstCategoryId ?? '',
    price: 0,
    offert: 0,
    inStock: true,
    servername: '',
    trademarkId: '',
    countryId: ''
})

const AdminProducts = () => {
    const dispatch = useAppDispatch()
    const fileInputsRef = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]
    const { items: products, loading, error } = useAppSelector((state) => state.product)
    const { items: categories } = useAppSelector((state) => state.category)
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [modalMode, setModalMode] = useState<'create'|'edit'>('create')
    const [saving, setSaving] = useState<boolean>(false)
    const [editingId, setEditingId] = useState<number|null>(null)
    const [form, setForm] = useState<ProductForm>(emptyForm())
    const [parentCategoryId, setParentCategoryId] = useState<number | ''>('')
    const [subcategories, setSubcategories] = useState<CategoryLite[]>([])
    const [trademarks, setTrademarks] = useState<TrademarkType[]>([])
    const [countries, setCountries] = useState<CountryType[]>([])
    useEffect(() => {
        dispatch(fetchAllProducts())
        dispatch(fetchCategories())
    }, [dispatch])
    useEffect(() => {
        const loadDicts = async () => {
            const [brRes, coRes] = await Promise.all([
                axios.get('http://localhost:5000/api/trademarks'),
                axios.get('http://localhost:5000/api/countries'),
            ])
            setTrademarks(brRes.data.data || [])
            setCountries(coRes.data.data || [])
        }
        loadDicts()
    }, [])
    const loadSubcategories = async (parent: Category | { slug?: string }): Promise<CategoryLite[]> => {
        const parentSlug = (parent as Category).slug
        if (!parentSlug) { setSubcategories([]); return []; }
        const res = await axios.get<{ success: boolean; category: CategoryLite; subcategories: CategoryLite[] }>(`http://localhost:5000/api/categories/${encodeURIComponent(parentSlug)}`)
        setSubcategories(res.data.subcategories || [])
        return res.data.subcategories || [];
    }
    const openCreate = async () => {
        setEditingId(null)
        setModalMode('create')
        const firstParent = categories[0]
        setParentCategoryId(firstParent ? firstParent.id : '')
        let firstSubId: number | '' = ''
        if (firstParent) {
            const subs = await loadSubcategories(firstParent)
            firstSubId = subs[0]?.id as number | undefined ?? ''
        }
        setForm(emptyForm(firstSubId as number | undefined))
        setModalOpen(true)
    }
    const detectParentForSub = async (subId: number | undefined) => {
        if (!subId) return { parentId: '', subs: [] as CategoryLite[] }
        for (const parent of categories) {
            const subs = await loadSubcategories(parent)
            if (subs.some(s => String(s.id) === String(subId))) {
                return { parentId: parent.id, subs }
            }
        }
        return { parentId: '', subs: [] as CategoryLite[] }
    }
    const openEdit = async (p: ProductType) => {
        setEditingId(p.id)
        setModalMode('edit')
        const previews: (string|null)[] = [null, null, null, null]
        if (Array.isArray(p.productImages)) {
            (p.productImages as ProductImageLite[]).slice(0,4).forEach((img, idx) => {
                previews[idx] = `http://localhost:5000/static/${img.link}`
            })
        }
        const { parentId, subs } = await detectParentForSub(p.categoryId as number | undefined)
        setParentCategoryId(parentId === '' ? '' : Number(parentId))
        setSubcategories(subs)
        setForm({
            images: p.productImages ?? [null, null, null, null],
            previews,
            name: p.name,
            description: p.description ?? '',
            categoryId: p.categoryId ?? '',
            price: p.price,
            offert: p.offert ?? 0,
            inStock: p.inStock,
            servername: p.servername ?? '',
            trademarkId: p.trademarkId ?? '',
            countryId: p.countryId ?? ''
        })
        setModalOpen(true)
    }
    const onDelete = async (p: ProductType) => {
        if (!confirm('Видалити товар?')) return;
        await axios.delete(`http://localhost:5000/api/products/${p.id}`)
        toast.success('Товар успішно видалений')
        dispatch(fetchAllProducts())
    }
    const onToggleStock = async (p: ProductType, checked: boolean) => {
        await axios.put(`http://localhost:5000/api/products/${p.id}`, { inStock: checked })
        toast.success('Товар успішно змінений')
        dispatch(fetchAllProducts())
    }
    const handlePickImage = (idx: number) => fileInputsRef[idx].current?.click()
    const handleFileChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null
        setForm((s) => {
            const nextImgs = [...s.images]
            const nextPrev = [...s.previews]
            nextImgs[idx] = file
            nextPrev[idx] = file ? URL.createObjectURL(file) : null
            return { ...s, images: nextImgs, previews: nextPrev }
        })
    }
    const handleDeleteImage = async (imageId: number, idx: number) => {
        if(!confirm('Видалити зображення?')) return;

        try {
            await axios.delete(`http://localhost:5000/api/products/images/${imageId}`)
            toast.success('Зображення успішно видалене')

            setForm((s) => {
                const nextImgs = [...s.images]
                const nextPrev = [...s.previews]
                nextImgs[idx] = null
                nextPrev[idx] = null
                return { ...s, images: nextImgs, previews: nextPrev }
            })
        } catch (error) {
            toast.error('Помилка видалення зображення')
        }
    }
    const handleParentChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const pid = Number(e.target.value)
        setParentCategoryId(pid)
        const parent = categories.find(c => c.id === pid)
        if (parent) {
            const subs = await loadSubcategories(parent)
            setForm(f => ({ ...f, categoryId: subs[0]?.id ?? '' }))
        } else {
            setSubcategories([])
            setForm(f => ({ ...f, categoryId: '' }))
        }
    }
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setSaving(true)
            const fd = new FormData()
            fd.append('name', form.name)
            fd.append('description', form.description)
            fd.append('price', String(form.price))
            fd.append('offert', String(form.offert))
            fd.append('categoryId', String(form.categoryId))
            fd.append('inStock', String(form.inStock))
            fd.append('servername', form.servername)
            fd.append('trademarkId', String(form.trademarkId))
            fd.append('countryId', String(form.countryId))
            form.images.filter((f): f is File => !!f).forEach((file) => fd.append('images', file))

            if (modalMode === 'create') {
                await axios.post('http://localhost:5000/api/products', fd)
            } else {
                await axios.put(`http://localhost:5000/api/products/${editingId}`, fd)
            }
            setModalOpen(false)
            dispatch(fetchAllProducts())
            toast.success('Товар успішно збережений')
        } catch (error: unknown) {
            let message = 'Помилка збереження'
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message ?? error.message
            } else if (error instanceof Error) {
                message = error.message
            }
            toast.error(message)
        } finally {
            setSaving(false)
        }
    }
    const [selectedBrands, setSelectedBrands] = useState<number[]>([])
    const [selectedCountries, setSelectedCountries] = useState<number[]>([])
    const [minPrice, setMinPrice] = useState<number | null>(null)
    const [maxPrice, setMaxPrice] = useState<number | null>(null)
    const [rangeMin, setRangeMin] = useState<number>(0);
    const [rangeMax, setRangeMax] = useState<number>(0);
    const [range, setRange] = useState<number[]>([0, 0]);
    const search = useAppSelector(state => state.product.searchQuery).toLowerCase();
    const [sortOrder, setSortOrder] = useState<'new' | 'old'>('new')
    const filteredItems = useMemo(() => {
        let list = products
        if (search) {
            list = list.filter(p => p.name.toLowerCase().includes(search))
        }
        if (selectedBrands.length > 0) {
            list = list.filter(p => !!p.trademarkId && selectedBrands.includes(Number(p.trademarkId)))
        }
        if (selectedCountries.length > 0) {
            list = list.filter(p => !!p.countryId && selectedCountries.includes(Number(p.countryId)))
        }
        if (minPrice != null) {
            list = list.filter(p => p.price >= minPrice)
        }
        if (maxPrice != null) {
            list = list.filter(p => p.price <= maxPrice)
        }
        list = [...list].sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return sortOrder === 'new' ? dateB - dateA : dateA - dateB;
        })
        return list
    }, [products, search, selectedBrands, selectedCountries, minPrice, maxPrice, sortOrder])
    useEffect(() => {
        if(products.length) {
            const prices = products.map((p) => p.price);
            const min = Math.min(...prices);
            const max = Math.max(...prices);
            setRangeMin(min);
            setRangeMax(max);
            setRange([min, max]);
            setMinPrice(min);
            setMaxPrice(max);
        }
    }, [products]);
    const handleSliderChange = (_: Event, newValue: number | number[]) => {
        const [newMin, newMax] = newValue as number[];
        setRange([newMin, newMax]);
        setMinPrice(newMin);
        setMaxPrice(newMax);
    }
    const handleInputChange = (index: number, value: string) => {
        const num = Number(value);
        if (isNaN(num)) return;
        setRange((prev) => {
            const next = [...prev] as number[];
            next[index] = num;
            if(next[0] < rangeMin) next[0] = rangeMin;
            if(next[1] > rangeMax) next[1] = rangeMax;
            if(next[0] >= next[1]) next[0] = next[1] - 1;
            setMinPrice(next[0]);
            setMaxPrice(next[1]);
            return next;
        })
    }
    const [page, setPage] = useState<number>(1)
    const { items: pageItems, page: current, totalPages } = getPageSlice<ProductType>(filteredItems, page, PER_PAGE)
    const isFiltered = selectedBrands.length > 0 || selectedCountries.length > 0 || (minPrice != null && maxPrice != null && (minPrice > rangeMin || maxPrice < rangeMax))
    const setSearch = (query: string) => {
        dispatch(setSearchQuery(query))
    }
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
    }
    if (loading) return <span className="loading loading-spinner loading-lg text-primary"></span>
    if (error) return <p>Не вдалося отримати продукти. Помилка: {error}</p>
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-0 justify-between">
                <h2 className="text-2xl font-semibold">Продукти</h2>
                <div className="flex items-center gap-2">
                    <button className="btn btn-primary text-white" onClick={openCreate}>Додати</button>
                    <p className="text-sm text-gray-500">Всього: {filteredItems.length}</p>
                </div>
            </div>
            <div className="flex flex-row items-center justify-between">
                <SortDrawer
                    trademarks={trademarks}
                    countries={countries}
                    selectedBrands={selectedBrands}
                    selectedCountries={selectedCountries}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    isFiltered={isFiltered}
                    sortOrder={sortOrder}
                    onChangeSortOrder={setSortOrder}
                    onChangeBrand={(id, checked) => setSelectedBrands(prev => checked ? [...prev, id] : prev.filter(x => x !== id))}
                    onChangeCountry={(id, checked) => setSelectedCountries(prev => checked ? [...prev, id] : prev.filter(x => x !== id))}
                    onApply={() => {}}
                    onReset={() => {
                        setSelectedBrands([]); 
                        setSelectedCountries([]); 
                        setMinPrice(rangeMin); 
                        setMaxPrice(rangeMax);
                        setRange([rangeMin, rangeMax])
                    }}
                    rangeMin={rangeMin}
                    rangeMax={rangeMax}
                    range={range}
                    handleSliderChange={handleSliderChange}
                    handleInputChange={handleInputChange}
                />
            </div>
            <div className="ml-auto">
                <form onSubmit={handleSearch} className="flex w-60 items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                    <input
                        className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
                        type="text"
                        placeholder="Пошук товарів"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <button type="submit" className="group cursor-pointer">
                        <Search className="w-5 h-5 group-hover:text-primary transition-colors duration-300" />
                    </button>
                </form>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {pageItems.map((product) => (
                    <AdminPorductCard key={product.id} product={product} onEdit={openEdit} onDelete={onDelete} onToggleStock={onToggleStock} />
                ))}
            </div>
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                    <button className="btn" disabled={current <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Попередня</button>
                    <span className="px-3 py-2 border rounded-md">{current} / {totalPages}</span>
                    <button className="btn" disabled={current >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Наступна</button>
                </div>
            )}
            {modalOpen && (
                <ModalAdminProducts
                    setModalOpen={setModalOpen}
                    modalMode={modalMode}
                    handleSave={handleSave}
                    handlePickImage={handlePickImage}
                    fileInputsRef={fileInputsRef}
                    handleFileChange={handleFileChange}
                    form={form}
                    setForm={setForm}
                    parentCategoryId={parentCategoryId}
                    handleParentChange={handleParentChange}
                    categories={categories}
                    subcategories={subcategories}
                    saving={saving}
                    trademarks={trademarks}
                    countries={countries}
                    handleDeleteImage={handleDeleteImage}
                />
            )}
        </div>
    )
}

export default AdminProducts
