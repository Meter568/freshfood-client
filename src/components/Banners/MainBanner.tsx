import { Link } from "react-router-dom"
import { MoveRightIcon } from "lucide-react"

function MainBanner() {
    return (
        <div className="relative">
            <img src="/images/Banner/main_banner_bg.png" alt="banner" className="w-full rounded-[2rem] hidden md:block object-cover" />
            <img src="/images/Banner/main_banner_bg_sm.png" alt="banner" className="w-full rounded-[2rem] md:hidden object-cover" />
            <div className="absolute inset-0 flex flex-col items-center justify-center pb-3 md:pb-0 px-4 md:pl-15 pl-5">
                <h1 className="text-white text-xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-3xl font-bold text-center max-w-72 md:max-w-90 lg:max-w-105 leading-tight lg:leading-15">Свіжість, якій ви можете довіряти, економія, яку ви полюбите!</h1>
                <div className="flex items-center mt-6 font-medium">
                    <Link to="/products" className="group flex items-center gap-2 px-7 py-2 bg-primary hover:bg-primary-dull rounded text-white transition-all duration-300 ease-in-out cursor-pointer">
                        Купити зараз
                        <MoveRightIcon className="md:hidden transition-all group-focus:translete-x-1 text-white" />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default MainBanner