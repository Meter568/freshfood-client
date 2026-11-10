import { useEffect, useState } from "react";
import { useUserContext } from "../context/useUserContext"
import type { User } from "../types/user";
import toast from "react-hot-toast";
import Loading from "../components/Loading";

const ProfilePage = () => {
    const {user, setUser} = useUserContext();
    const [formData, setFormData] = useState<User | null>(null);
    const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
    const [saving, setSaving] = useState(false);
    const [showEmailVerificationModal, setShowEmailVerificationModal] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [verifying, setVerifying] = useState(false);
    useEffect(() => {
        fetch('http://localhost:5000/api/cities')
            .then(response => response.json())
            .then(data => setCities(data.data))
            .catch(error => console.error('Error fetching cities:', error));
    }, []);
    useEffect(() => {
        if(user){
            setFormData(user);
        }
    }, [user]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if(!formData) return;
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]:
                name === "houseNumber" || name === "cityId"
                    ? parseInt(value) || undefined
                    : value,
        });
    };
    const handleSave = async () => {
        if(!formData || !user) return;
        if (formData.email !== user.email && formData.email) {
            try {
                const token = localStorage.getItem('token');
                if(!token) return;
                const response = await fetch('http://localhost:5000/api/auth/send-email-change-code', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ newEmail: formData.email }),
                });
                if (!response.ok) {
                    const data = await response.json();
                    toast.error(data.message || 'Не вдалося відправити код');
                    return;
                }
                setShowEmailVerificationModal(true);
                toast.success('Код підтвердження відправлено на нову пошту');
                return;
            } catch (error) {
                console.log(error);
                toast.error('Помилка відправки коду');
                return;
            }
        }
        await saveProfile();
    };
    const handleVerifyCode = async () => {
        if(!formData) return;
        setVerifying(true);
        try {
            const token = localStorage.getItem('token');
            if(!token) return;
            const response = await fetch('http://localhost:5000/api/auth/verify-email-change-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ 
                    newEmail: formData.email, 
                    code: verificationCode 
                }),
            });
            if (!response.ok) {
                const data = await response.json();
                toast.error(data.message || 'Невірний код');
                setVerifying(false);
                return;
            }
            toast.success('Код підтверджено');
            setShowEmailVerificationModal(false);
            setVerificationCode("");
            await saveProfile();
        } catch (error) {
            console.log(error);
            toast.error('Помилка перевірки коду');
        } finally {
            setVerifying(false);
        }
    };
    const saveProfile = async () => {
        if(!formData) return;
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            if(!token) return;
            const response = await fetch('http://localhost:5000/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    cityId: formData.cityId,
                    street: formData.street,
                    houseNumber: formData.houseNumber,
                    apartmentNumber: formData.apartmentNumber,
                    phoneNumber: formData.phoneNumber,
                }),
            });
            if(!response.ok) throw new Error("Error updating profile");
            const data = await response.json();
            setUser(data.user);
            setFormData(data.user);
            toast.success("Профіль успішно оновлено");
        } catch (error) {
            console.log(error)
            toast.error("Не вдалося оновити профіль");
        } finally {
            setSaving(false);
        }
    }
    if (!formData) return (
        <Loading />
    );
    return (
        <>
        <div className="max-w-md mx-auto mt-10 mb-20 bg-white p-6 border border-primary rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-primary">Ваш профіль</h2>
        <div className="space-y-4">
            <div>
                <label className="block text-gray-600 text-sm mb-1">Ім'я</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full input input-primary p-2"
                />
            </div>
            <div>
                <label className="block text-gray-600 text-sm mb-1">Електронна пошта</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email ?? ""}
                    onChange={handleChange}
                    placeholder="Введите email"
                    className="w-full input input-primary p-2"
                />
            </div>
            <div>
                <label className="block text-gray-600 text-sm mb-1">Номер телефону</label>
                <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber ?? ""}
                    onChange={handleChange}
                    placeholder="Введите номер телефона"
                    className="w-full input input-primary p-2"
                />
            </div>
            <div>
                <label className="block text-gray-600 text-sm mb-1">Місто</label>
                <select
                    name="cityId"
                    value={formData.cityId ?? ""}
                    onChange={handleChange}
                    className="w-full select select-primary p-2"
                >
                    <option value="">Виберіть місто</option>
                    {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                        {c.name}
                    </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-gray-600 text-sm mb-1">Вулиця</label>
                <input
                    name="street"
                    value={formData.street ?? ""}
                    onChange={handleChange}
                    placeholder="Введите улицу"
                    className="w-full input input-primary p-2"
                />
            </div>
            <div className="grid grid-cols-2 gap-2">
            <div>
                <label className="block text-gray-600 text-sm mb-1">Будинок</label>
                <input
                name="houseNumber"
                type="number"
                value={formData.houseNumber ?? ""}
                onChange={handleChange}
                className="w-full input input-primary p-2"
                />
            </div>
            <div>
                <label className="block text-gray-600 text-sm mb-1">Квартира</label>
                <input
                name="apartmentNumber"
                type="text"
                value={formData.apartmentNumber ?? ""}
                onChange={handleChange}
                className="w-full input input-primary p-2"
                />
            </div>
            </div>
            <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-full btn btn-primary text-white"
            >
            {saving ? "Збереження..." : "Зберегти зміни"}
            </button>
        </div>
        </div>
        {showEmailVerificationModal && (
            <div className="fixed inset-0 bg-gray-50 bg-opacity-10 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full mx-4">
                    <h3 className="text-2xl font-bold mb-4 text-center text-primary">
                        Підтвердження email
                    </h3>
                    <p className="text-gray-600 mb-2">
                        Ми відправили код на адресу: <strong>{formData?.email}</strong>
                    </p>
                    <p className="text-gray-500 text-sm mb-4">
                        Введіть код з email для підтвердження зміни адреси
                    </p>
                    
                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm mb-1">
                            Код підтвердження
                        </label>
                        <input
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            placeholder="Введите код"
                            className="w-full input p-2"
                            maxLength={5}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                setShowEmailVerificationModal(false);
                                setVerificationCode("");
                                if (formData && user) {
                                    setFormData({ ...formData, email: user.email });
                                }
                            }}
                            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Скасувати
                        </button>
                        <button
                            type="button"
                            onClick={handleVerifyCode}
                            disabled={verifying || verificationCode.length !== 5}
                            className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary-dull transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {verifying ? "Перевірка..." : "Підтвердити"}
                        </button>
                    </div>
                </div>
            </div>
        )}
    </>
    );
}

export default ProfilePage