const VegetabesBanner = () => {
    return (
        <div className="relative">
            <img src="/images/Banner/vegetables_banner_bg.png" alt="banner" className="w-full rounded-[2rem] hidden md:block" />
            <img src="/images/Banner/vegetables_banner_bg_sm.png" alt="banner" className="w-full rounded-[2rem] md:hidden" />
            <div className="absolute inset-0 flex flex-col items-center  justify-center pb-3 md:pb-0 px-4 md:pl-15 pl-5">
                <p className="text-1xl md:text-1xl xl:text-3xl font-bold mb-1">СВІЖІ ОВОЧІ</p>
                <p className="text-xl md:text-2xl xl:text-4xl font-bold mb-4">ВЕЛИКИЙ РОЗПРОДАЖ</p>
                <img src="/images/Banner/vegetables_banner_logo.png" className="w-[13rem]  xl:w-[20rem] h-[11rem] xl:h-[15rem] transition-all duration-300 mb-2" alt="Vegetables logo" />
            </div>
        </div>
    )
}

export default VegetabesBanner
