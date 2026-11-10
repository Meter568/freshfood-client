import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import ProductCard from "../ProductCard"
import { fetchAllProducts } from "../../features/products/productSlice"

function DiscountProducts() {
    const dispatch = useAppDispatch()
    const discounted = useAppSelector((state) => state.product.discountedItems)
    const randomDiscounted = [...discounted].sort(() => Math.random() - 0.5).slice(0, 6);
    useEffect(() => {
        dispatch(fetchAllProducts())
    }, [dispatch])
    return (
        <div className="my-[4rem]">
            <h3 className="text-2xl md:text-3xl font-medium">Акції</h3>
            <div className="grid gap-6 mt-6 w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {randomDiscounted.map((p) => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>
        </div>
    )
}

export default DiscountProducts
