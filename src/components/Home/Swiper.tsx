import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import MainBanner from '../Banners/MainBanner';
import { Autoplay, Navigation } from 'swiper/modules';
import VegetabesBanner from '../Banners/VegetabesBanner';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import DrinksBanner from '../Banners/DrinksBanner';

const SwiperComponent = () => {
    return (
        <div className="swiper-container relative">
            <Swiper
                spaceBetween={50}
                modules={[Navigation, Autoplay]}
                slidesPerView={1}
                navigation={{
                    prevEl: '.home-swiper-prev',
                    nextEl: '.home-swiper-next',
                }}
                autoplay={{ delay: 5000 }}
            >
                <SwiperSlide><MainBanner /></SwiperSlide>
                <SwiperSlide><VegetabesBanner /></SwiperSlide>
                <SwiperSlide><DrinksBanner /></SwiperSlide>
            </Swiper>
            <button aria-label="Previous slide" className="home-swiper-prev absolute left-2 top-1/2 -translate-y-1/2 z-10 hidden md:grid place-items-center w-10 h-10 rounded-xl bg-white/80 hover:bg-white shadow transition cursor-pointer">
                <span className="sr-only">Prev</span>
                <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <button aria-label="Next slide" className="home-swiper-next absolute right-2 top-1/2 -translate-y-1/2 z-10 hidden md:grid place-items-center w-10 h-10 rounded-xl bg-white/80 hover:bg-white shadow transition cursor-pointer">
                <span className="sr-only">Next</span>
                <ArrowRightIcon className="w-5 h-5" />
            </button>
        </div>
    );
}

export default SwiperComponent
