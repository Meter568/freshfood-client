const AboutPage = () => {
    return (
        <div className="mt-10">
            <h1 className="text-3xl text-center md:text-4xl font-bold">Про <span className='text-primary'>нас</span></h1>
            <section className="pt-10 pb-20 relative">
                <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
                    <div className="w-full justify-start items-center gap-10 grid lg:grid-cols-2 grid-cols-1">
                        <div className="w-full flex-col justify-start lg:items-start items-center gap-10 inline-flex">
                            <div className="w-full flex-col justify-start lg:items-start items-center gap-4 flex">
                                <h2 className="text-gray-900 text-4xl font-bold font-manrope leading-normal lg:text-justify text-center">Про компанію FreshFood</h2>
                                <p className="text-gray-500 text-base font-normal leading-relaxed lg:text-justify text-center">FreshFood - це сучасний продуктовий магазин, створений для тих, хто цінує свіжість, якість та турботу про своє харчування. Ми щодня відбираємо лише найкращі продукти від перевірених постачальників, щоб на вашому столі завжди були смачні та корисні продукти.</p>
                                <p className="text-gray-500 text-base font-normal leading-relaxed lg:text-justify text-center">У нашому асортименті — свіжі овочі та фрукти, натуральні молочні продукти, м'ясо та риба, бакалія, товари для дому та багато іншого. Ми прагнемо зробити покупки простими та приємними: будь то відвідування магазину поряд з будинком або замовлення онлайн зі швидкою доставкою.</p>
                                <p className="text-gray-500 text-base font-normal leading-relaxed lg:text-justify text-center">Наша місія — дарувати людям радість від здорового харчування та допомагати піклуватися про себе та своїх близьких.</p>
                                <p className="text-gray-500 text-base font-normal leading-relaxed lg:text-justify text-center">FreshFood - свіжість, якій можна довіряти.</p>
                            </div>
                        </div>
                        <img className="lg:mx-0 mx-auto h-full rounded-3xl object-cover" src="/about-image.png" alt="about Us image" />
                    </div>
                </div>
            </section>
        </div>
    )
}

export default AboutPage
