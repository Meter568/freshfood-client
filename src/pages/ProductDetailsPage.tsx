import { useParams, Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { useState, useEffect, useMemo } from "react";
import { fetchProductByServername } from "../features/products/productSlice";
import Loading from "../components/Loading";
import { removeFromBasket, updateQuantity } from "../features/basket/basketSlice";
import DetailsProduct from "../components/ProductsDetails/DetailsProduct";
import GalleryImagesProduct from "../components/ProductsDetails/GalleryImagesProduct";
import toast from "react-hot-toast";

const ProductDetailsPage = () => {
    const { servername } = useParams();
    const dispatch = useAppDispatch();
    const { items, productDetails, loading, error } = useAppSelector((state) => state.product);
    const basketItems = useAppSelector((state) => state.basket.items);
    const [count, setCount] = useState(0);
    const product = items.find((item) => item.servername === servername) || productDetails;
    useEffect(() => {
        if (!items.find((item) => item.servername === servername) && servername) {
            dispatch(fetchProductByServername(servername));
        }
    }, [dispatch, items, servername]);
    const images = useMemo(() => product?.productImages?.map(img => `http://localhost:5000/static/${img.link}`) || [], [product]);
    const [thumbnail, setThumbnail] = useState(images[0] || null);
    const handleChangeQuantity = (newCount: number) => {
        if (!product?.id) return;
        if (newCount <= 0) {
            setCount(0);
            dispatch(removeFromBasket(product.id));
            toast.success("Товар прибрано з кошика")
        } else {
            setCount(newCount);
            dispatch(updateQuantity({ productId: product.id, quantity: newCount }));
        }
    }
    useEffect(() => {
        if (!product?.id) {
            setCount(0);
            return;
        }
        const existing = basketItems.find(i => i.productId === product.id)
        setCount(existing ? existing.quantity : 0)
    }, [basketItems, product])
    useEffect(() => {
        setThumbnail(images[0] || null);
    }, [product, images]);
    if (loading) return <><Loading /></>;
    if (error) return <div>Помилка: {error}</div>;
    if (!product) return <div>Такий продукт не знайдено!</div>;
    return (
        <div className="my-12">
            <p>
                <Link to={"/"}>Головна</Link> /
                <Link to={"/products"}> Продукти</Link> /
                <span className="text-primary"> {product.name}</span>
            </p>
            <div className="flex flex-col xl:flex-row justify-between gap-10 mt-4">
                <GalleryImagesProduct images={images} thumbnail={thumbnail} setThumbnail={setThumbnail} count={count}  />
                <DetailsProduct product={product} count={count} handleChangeQuantity={handleChangeQuantity} setCount={setCount} />
            </div>
        </div>
    );
};

export default ProductDetailsPage;
