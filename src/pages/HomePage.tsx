import Categories from "../components/Home/Categories"
import DiscountProducts from "../components/Home/DiscountProducts"
import SwiperComponent from "../components/Home/Swiper"

function HomePage() {
    return (
        <div className="mt-[2.5rem]">
            <SwiperComponent />
            <Categories />
            <DiscountProducts />
        </div>
    )
}

export default HomePage
