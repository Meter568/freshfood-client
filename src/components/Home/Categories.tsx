import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchCategories } from "../../features/categories/categorySlice";
import { useNavigate } from "react-router-dom";

function Categories() {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { items, loading, error } = useAppSelector(state => state.category)
    useEffect(() => {
        dispatch(fetchCategories())
    }, [dispatch])
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    return (
        <div className="mt-16">
            <p className="text-2xl md:text-3xl font-medium">Категорії</p>
            <div className="grid grod-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 mt-6 gap-6">
                {items.map(category => (
                    <div 
                        key={category.id} 
                        className="group cursor-pointer py-5 px-3 gap-2 rounded-xl flex flex-col justify-center items-center" 
                        style={{ backgroundColor: category.bgColor }}
                        onClick={() => {
                            if (category.slug) {
                                navigate(`/categories/${category.slug}`)
                                scrollTo(0,0)
                            }
                        }}
                    >
                        <img src={`http://localhost:5000${category.logo}`} alt={category.name} className="group-hover:scale-108 transition max-w-28" />
                        <p className="text-sm text-center font-medium">{category.name}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Categories
