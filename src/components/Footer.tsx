import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="px-6 md:px-16 lg:px-24 xl:px-32 pt-8 w-full text-black bg-green-50 border border-gray-500/30">
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 pb-6">
                <div className="md:max-w-96">
                    <div className="flex flex-row gap-2 items-center justify-center md:justify-start">
                        <img src="/logo.png" alt="Logo" className="w-[3.2rem] h-[3.2rem]" />
                        <p>FreshFood</p>
                    </div>
                    <div>
                        <p className="mt-6 text-sm text-center md:text-start">
                            FreshFood – це компанія, яка піклується про ваше здоров'я та пропонує лише свіжі та якісні продукти. У нас широкий асортимент овочів, фруктів, м'яса, риби, напоїв та горіхів для вашого щоденного раціону.
                        </p>
                        <ul className="flex flex-row gap-5 items-center mt-5 justify-center md:justify-start">
                            <li><Link to="https://www.instagram.com"><i className="bi bi-instagram text-xl hover:text-transparent hover:bg-gradient-to-r hover:from-yellow-300 hover:to-fuchsia-500 hover:bg-clip-text transition-all duration-300" /></Link></li>
                            <li><Link to="https://www.facebook.com"><i className="bi bi-facebook text-xl hover:text-transparent hover:bg-gradient-to-r hover:from-sky-400 hover:to-blue-600 hover:bg-clip-text transition-all duration-300" /></Link></li>
                            <li><Link to="https://x.com"><i className="bi bi-twitter-x text-xl hover:text-transparent hover:bg-gradient-to-r hover:from-slate-200 hover:to-gray-500 hover:bg-clip-text transition-all duration-300" /></Link></li>
                        </ul>
                    </div>
                </div>
                <div className="flex-1 flex items-start gap-10 md:gap-20 mx-auto md:justify-end md:mx-0">
                    <div>
                        <h2 className="font-semibold mb-5 text-gray-800 text-center">Компанія</h2>
                        <ul className="text-sm space-y-2 flex flex-col items-center justify-center text-center">
                            <li><Link to="/" className="hover:underline">Головна</Link></li>
                            <li><Link to="/products" className="hover:underline">Усі товари</Link></li>
                            <li><Link to="/about" className="hover:underline">Про нас</Link></li>
                            <li><Link to="/privacy" className="hover:underline">Політика конфіденційності</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-5 text-gray-800 text-center">Зв'яжіться з нами</h2>
                        <div className="text-sm space-y-2 flex flex-col items-center">
                            <p className="text-center">+38 060 123 98 43</p>
                            <p className="text-center">freshfood@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>
            <p className="pt-4 text-center text-xs md:text-sm pb-5">
                Авторське право 2026 © Розробник. Усі права захищено.
            </p>
        </footer>
    );
}

export default Footer
