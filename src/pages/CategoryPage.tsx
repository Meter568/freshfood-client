import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchCategoryBySlug } from '../features/categories/categorySlice'
import { fetchProductsByCategory, fetchProductsByParent } from '../features/products/productSlice'
import ProductCard from '../components/ProductCard'
import Subcategories from '../components/Subcategories'
import Loading from '../components/Loading'
import SortDrawer from '../components/SortDrawer'
import { getPageSlice } from '../utils/chunk'
import type { ProductType } from '../types/product'
import axios from 'axios'
import type { TrademarkType } from '../types/trademark'
import type { CountryType } from '../types/country'

const PER_PAGE = 10

function CategoryPage() {
  const { slug } = useParams()
  const dispatch = useAppDispatch()
  const { data, loading, error } = useAppSelector((s) => s.category.selected)
  const productsState = useAppSelector((s) => s.product)
  const [selectedSubSlug, setSelectedSubSlug] = useState<string | null>(null)
  const [selectedBrands, setSelectedBrands] = useState<number[]>([])
  const [selectedCountries, setSelectedCountries] = useState<number[]>([])
  const [minPrice, setMinPrice] = useState<number | null>(null)
  const [maxPrice, setMaxPrice] = useState<number | null>(null)
  const [sortOrder, setSortOrder] = useState<'new' | 'old'>('new')
  const [rangeMin, setRangeMin] = useState<number>(0);
  const [rangeMax, setRangeMax] = useState<number>(0);
  const [range, setRange] = useState<number[]>([0, 0]);
  const [trademarks, setTrademarks] = useState<TrademarkType[]>([])
  const [countries, setCountries] = useState<CountryType[]>([])
  const [filteredTrademarks, setFilteredTrademarks] = useState<number[]>([])
  const [filteredCountries, setFilteredCountries] = useState<number[]>([])
  useEffect(() => {
    axios.get('http://localhost:5000/api/trademarks')
        .then(res => setTrademarks(res.data.data || []));
    axios.get('http://localhost:5000/api/countries')
        .then(res => setCountries(res.data.data || []));
  }, []);
  useEffect(() => {
    if(!productsState.items.length) return;
    const trademarksIds = Array.from(
      new Set(productsState.items.map(p => p.trademarkId).filter((id): id is number => id != null))
    );
    const couuntyIds = Array.from(
      new Set(productsState.items.map(p => p.countryId).filter((id): id is number => id != null))
    );
    setFilteredTrademarks(trademarksIds);
    setFilteredCountries(couuntyIds);
  }, [productsState.items]);
  const visiableTrademarks = trademarks.filter(t => filteredTrademarks.includes(t.id));
  const visiableCountries = countries.filter(c => filteredCountries.includes(c.id));
  useEffect(() => {
    if (slug) {
      dispatch(fetchCategoryBySlug(slug))
    }
  }, [dispatch, slug])
  useEffect(() => {
    if (!slug) return
    if (!selectedSubSlug) {
      dispatch(fetchProductsByParent(slug))
    } else {
      dispatch(fetchProductsByCategory(selectedSubSlug))
    }
  }, [dispatch, slug, selectedSubSlug])
  useEffect(() => {
    if(productsState.items.length) {
        const prices = productsState.items.map((p) => p.price);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        setRangeMin(min);
        setRangeMax(max);
        setRange([min, max]);
        setMinPrice(min);
        setMaxPrice(max);
    }
  }, [productsState.items]);
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
  const filteredItems = useMemo(() => {
    let list = productsState.items
    if (selectedBrands.length > 0) {
      list = list.filter(p => p.trademarkId && selectedBrands.includes(p.trademarkId))
    }
    if (selectedCountries.length > 0) {
        list = list.filter(p => p.countryId && selectedCountries.includes(p.countryId))
    }
    if (minPrice != null) {
        list = list.filter(p => p.price >= minPrice)
    }
    if (maxPrice != null) {
        list = list.filter(p => p.price <= maxPrice)
    }
    list = [...list].sort((a, b) => sortOrder === 'new' ? b.id - a.id : a.id - b.id)
    return list
  }, [productsState.items, selectedBrands, selectedCountries, minPrice, maxPrice, sortOrder])
  const [page, setPage] = useState<number>(1)
  const { items: pageItems, page: current, totalPages } = getPageSlice<ProductType>(filteredItems, page, PER_PAGE)
  const isFiltered = selectedBrands.length > 0 || selectedCountries.length > 0 || (minPrice != null && maxPrice != null && (minPrice > rangeMin || maxPrice < rangeMax))
  if (loading) return <Loading />
  if (error) return <p>Error: {error}</p>
  if (!data) return null
  const { category, subcategories } = data
  return (
    <div className="mt-10">
      <h1 className="text-3xl text-center md:text-4xl font-bold pb-4">Категорія: <span className='text-primary'>{category.name}</span></h1>
      <h2 className="text-2xl md:text-3xl font-medium mb-4">Підкатегорії</h2>
      <Subcategories subcategories={subcategories} selectedSubSlug={selectedSubSlug} setSelectedSubSlug={setSelectedSubSlug}  />
      <div className="mt-10 mb-39">
        <h2 className="text-2xl md:text-3xl font-medium mb-4">Товари</h2>
        <SortDrawer
              trademarks={visiableTrademarks}
              countries={visiableCountries}
              selectedBrands={selectedBrands}
              selectedCountries={selectedCountries}
              minPrice={minPrice}
              maxPrice={maxPrice}
              isFiltered={isFiltered}
              sortOrder={sortOrder}
              onChangeSortOrder={setSortOrder}
              onChangeBrand={(b, checked) =>
                  setSelectedBrands(prev => checked ? [...prev, b] : prev.filter(x => x !== b))}
              onChangeCountry={(c, checked) =>
                  setSelectedCountries(prev => checked ? [...prev, c] : prev.filter(x => x !== c))}
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
        {productsState.loading ? (
          <p>Loading products...</p>
        ) : productsState.error ? (
          <p>Error: {productsState.error}</p>
        ) : filteredItems.length === 0 ? (
          <p>Поки що немає товарів</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {pageItems.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-15">
            <button className="btn" disabled={current <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Попередня</button>
            <span className="px-3 py-2 border rounded-md">{current} / {totalPages}</span>
            <button className="btn" disabled={current >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Наступна</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryPage