import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Box, Tag, Globe, Building2, UserRoundIcon } from 'lucide-react';
import AdminCategories from '../../components/Admin/Categories/AdminCategories';
import AdminProducts from '../../components/Admin/Products/AdminProducts';
import AdminOrders from '../../components/Admin/Orders/AdminOrders';
import AdminCountries from '../../components/Admin/Countries/AdminCountries';
import AdminTrademarks from '../../components/Admin/Trademarks/AdminTrademarks';
import AdminCities from '../../components/Admin/Cities/AdminCities';
import AdminUsers from '../../components/Admin/Users/AdminUsers';

const navItems = [
    { key: 'categories', label: 'Категорії', icon: <Tag size={22} /> },
    { key: 'products', label: 'Товари', icon: <Box size={22} /> },
    { key: 'orders', label: 'Всі замовлення', icon: <List size={22} /> },
    { key: 'users', label: 'Користувачі', icon: <UserRoundIcon size={22} /> },
    { key: 'cities', label: 'Міста', icon: <Building2 size={22} /> },
    { key: 'countries', label: 'Країни', icon: <Globe size={22} /> },
    { key: 'trademarks', label: 'Торгові марки', icon: <Tag size={22} /> },
];

const AdminPanelPage = () => {
    const navigate = useNavigate();
    const adminUserRaw = localStorage.getItem('adminUser');
    let adminUser:any = null;
    try { adminUser = adminUserRaw ? JSON.parse(adminUserRaw) : null; } catch { adminUser = null; }
    const [active, setActive] = useState('categories');

    useEffect(() => {
        const adminToken = localStorage.getItem('adminToken');
        if (!adminToken || !adminUser || adminUser.role !== 'admin') {
            navigate('/admin', { replace: true });
        }
    }, [navigate, adminUser]);

    return (
        <div className="flex h-screen bg-gray-50">
            <aside className="w-22 md:w-64 bg-[#f5f6fc] border-r border-gray-200 flex flex-col py-8 px-3">
            <div className="mb-10 flex items-center gap-3 px-2">
                <img src="/logo.png" alt="logo" className="w-10 h-10" />
                <span className="hidden md:block text-lg font-bold text-center text-primary">Панель адміністратора</span>
            </div>
            <nav className="flex-1 space-y-3">
                {navItems.map(item => (
                <button
                    key={item.key}
                    className={`flex items-center w-full gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 font-medium text-gray-700 hover:bg-primary/10 hover:text-primary cursor-pointer ${active === item.key ? 'bg-primary/20 text-primary font-bold border-l-4 border-primary' : ''}`}
                    onClick={() => setActive(item.key)}
                >{item.icon}<span className="hidden md:block">{item.label}</span></button>))}
            </nav>
            <button className="mt-auto py-2 px-3 text-red-600 font-semibold hover:bg-red-50 rounded-lg transition-all cursor-pointer" onClick={() => { localStorage.removeItem('adminToken'); localStorage.removeItem('adminUser'); navigate('/', { replace: true }); }}>Вийти</button>
            </aside>
            <main className="flex-1 p-10 overflow-auto">
            <header className="flex justify-center md:justify-between items-center mb-8">
                <h1 className="text-xl md:text-3xl font-bold text-gray-800">Вітаю, {adminUser?.name}<span className="ml-3 text-base font-normal text-primary bg-primary/10 rounded px-2 py-0.5">admin</span></h1>
            </header>
            <section>
                {active === 'categories' && <AdminCategories />}
                {active === 'products' && <AdminProducts />}
                {active === 'orders' && <AdminOrders />}
                {active === 'users' && <AdminUsers />}
                {active === 'cities' && <AdminCities />}
                {active === 'countries' && <AdminCountries />}
                {active === 'trademarks' && <AdminTrademarks />}
            </section>
            </main>
        </div>
    );
};

export default AdminPanelPage;
