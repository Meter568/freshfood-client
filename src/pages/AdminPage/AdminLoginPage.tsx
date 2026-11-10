import { useState } from 'react';
import type { LoginFormData } from '../../types/auth';
import Login from '../../components/Auth/Login';

const AdminLoginPage = () => {
    const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const loginRes = await fetch('http://localhost:5000/api/user/login-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!loginRes.ok) {
                const msg = await loginRes.json();
                throw new Error(msg.message || 'Невірна пошта або пароль!');
            }

            const loginData = await loginRes.json();
            const token = loginData.token;

            const profileRes = await fetch('http://localhost:5000/api/user/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            if (!profileRes.ok) {
                throw new Error('Ошибка получения данных профиля');
            }
            const profileData = await profileRes.json();
            const user = profileData.user;

            if (user.role === 'admin') {
                localStorage.setItem('adminToken', token);
                localStorage.setItem('adminUser', JSON.stringify(user));
                window.location.assign('/admin-panel');
            } else {
                setError('Доступ только для администратора!');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-green-100">
            <form onSubmit={handleSubmit} className="sm:w-[350px] w-full text-center border border-black rounded-2xl px-8 bg-white">
                <h1 className="text-gray-900 text-3xl mt-10 font-medium">Вхід для адміністратора</h1>
                <p className="text-gray-500 text-sm mt-2">Вхід тільки для адмінів</p>
                <Login formData={formData} handleChange={handleChange} />
                {error && <div className="text-red-500 mt-3">{error}</div>}
                <button type="submit" disabled={loading} className="mt-4 w-full h-11 rounded-full text-white bg-primary hover:bg-primary-dull transition-colors cursor-pointer">
                    {loading ? 'Загрузка...' : 'Увійти як адміністратор'}
                </button>
                <div className="mb-5" />
            </form>
        </div>
    );
};

export default AdminLoginPage;
