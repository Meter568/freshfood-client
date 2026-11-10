import { useState } from "react"
import { NavLink } from "react-router-dom"
import { CircleUserRoundIcon, MenuIcon, Search, ShoppingBasketIcon } from "lucide-react"
import { useDispatch } from "react-redux";
import { setSearchQuery } from "../features/products/productSlice";
import { useAppSelector } from "../store/hooks";
import { useUserContext } from "../context/useUserContext";

function Navbar() {
    const basketItems = useAppSelector((state) => state.basket.items);
    const [open, setOpen] = useState(false)
    const {navigate, user, setShowUserLogin, logout} = useUserContext()
    const [search, setSearch] = useState("");
    const dispatch = useDispatch();
    const totalQuantity = basketItems.reduce((total, item) => total + item.quantity, 0);
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const query = search.trim();
        if (query) {
            dispatch(setSearchQuery(search));
        } else {
            dispatch(setSearchQuery(""))
        }
        navigate("/products");
    };
    return (
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
            <NavLink to="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
                <img src="/logo.png" alt="logo" className="w-[3.2rem] h-[3.2rem]"/>
                <h1 className="text-black">FreshFood</h1>
            </NavLink>
            <div className="hidden sm:flex items-center gap-5">
                <NavLink to="/products" className="text-black hover:text-primary transition-colors duration-300">Усі товари</NavLink>
                <NavLink to="/about" className="text-black hover:text-primary transition-colors duration-300">Про нас</NavLink>
                <form onSubmit={handleSearch} className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                    <input
                        className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
                        type="text"
                        placeholder="Пошук товарів"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <button type="submit" className="group cursor-pointer">
                        <Search className="w-5 h-5 group-hover:text-primary transition-colors duration-300" />
                    </button>
                </form>
                
                <div onClick={() => navigate("/basket")} className="indicator cursor-pointer">
                    {totalQuantity > 0 && (
                        <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{totalQuantity}</button>
                    )}
                    <ShoppingBasketIcon className="text-black hover:text-primary transition-colors duration-300" />
                </div>
                {!user ? (
                    <button onClick={() => {
                        navigate("/auth")
                    }} className="btn btn-primary cursor-pointer px-8 py-2 transition text-white rounded-full">
                        Увійти
                    </button>
                ) : (
                    <div className="flex items-center gap-3">
                        <details className="dropdown relative">
                            <summary className="flex items-center gap-2 group cursor-pointer">
                                <CircleUserRoundIcon className="text-black group-hover:text-primary w-6 h-6" />
                                <span className="text-black group-hover:text-primary font-medium">{user.name}</span>
                            </summary>
                            <ul className="menu dropdown-content absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-200 z-50">
                                <li onClick={() => navigate("/profile")} className="px-4 py-3 text-black hover:bg-gray-50 cursor-pointer border-b border-gray-100">
                                    Профіль
                                </li>
                                <li onClick={() => navigate("/orders")} className="px-4 py-3 text-black hover:bg-gray-50 cursor-pointer border-b border-gray-100">
                                    Мої замовлення
                                </li>
                                <li onClick={logout} className="px-4 py-3 hover:bg-gray-50 rounded-lg cursor-pointer text-red-600">
                                    Вийти
                                </li>
                            </ul>
                        </details>
                        <div className="flex items-center gap-2">
                        </div>
                    </div>
                )}
            </div>
            <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="sm:hidden">
                <MenuIcon className="text-black cursor-pointer" />
            </button>
            { open && (
                <div className={`${open ? 'flex' : 'hidden'} z-100 absolute top-[5.2rem] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}>
                <NavLink 
                    to="/" 
                    className="block" 
                    onClick={() => setOpen(false)} 
                >
                    Головна
                </NavLink>
                <NavLink 
                    to="/products" 
                    className="block"
                    onClick={() => setOpen(false)}
                >
                    Усі товари
                </NavLink>
                {user && 
                <NavLink 
                    to="/orders" 
                    className="block" 
                    onClick={() => setOpen(false)}
                >
                    Мої замовлення
                </NavLink>}
                <NavLink 
                    to="/about" 
                    className="block"
                    onClick={() => setOpen(false)}
                >
                    Про нас
                </NavLink>
                {!user ? (
                    <button onClick={() => {
                        setOpen(false);
                        setShowUserLogin(true)
                    }} className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm">
                        Увійти
                    </button>
                ) : (
                    <div className="mt-2">
                        <div className="flex items-center gap-2 mb-3" onClick={() => {
                            navigate("/profile")
                            setOpen(false)
                        }}>
                            <CircleUserRoundIcon className="text-gray-500 w-5 h-5" />
                            <span className="text-gray-700 font-medium cursor-pointer">{user.name}</span>
                        </div>
                        <button className="cursor-pointer px-6 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm w-full" onClick={() => logout()}>
                            Вийти
                        </button>
                    </div>
                )}
            </div>
            )}
        </nav>
    )
}

export default Navbar
