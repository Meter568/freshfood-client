const DrinksBanner = () => {
    return (
        <div className="relative">
            <img src="/images/Banner/drinks_banner_bg.png" alt="banner" className="w-full rounded-[2rem] hidden md:block" />
            <img src="/images/Banner/drinks_banner_bg_sm.png" alt="banner" className="w-full rounded-[2rem] md:hidden" />
            <div className="absolute inset-0 flex flex-col md:flex-row gap-5 items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                    <div className="relative">
                        <span className="absolute md:p-[0.1rem] top-[-0.6rem] left-[1rem] bg-[#FF9564] font-bold">ДО</span>
                        <p className="text-xl md:text-2xl xl:text-4xl font-bold px-17 py-3 md:px-13 md:py-5 border-2 border-black">20%</p>
                        <span className="absolute p-[0.1rem] bottom-[-0.6rem] right-[1rem] bg-[#FF9564] font-bold">ЗНИЖКА</span>
                    </div>
                    <p className="text-white mt-5 text-center">НАСОЛОДЖУЙТЕСЯ СВІЖИМ НАПОЄМ</p>
                </div>
                <img src="/images/Banner/drinks_banner_logo.png" className="w-[13rem] md:w-[17rem] lg:w-[20rem] xl:w-[25rem] transition-all duration-300 mb-2" alt="Drinks logo" />
            </div>
        </div>
    )
}

export default DrinksBanner