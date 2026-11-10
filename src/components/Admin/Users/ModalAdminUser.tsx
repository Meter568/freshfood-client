import { useEffect, useState } from "react";
import type { ModalAdminUsersProps } from "../../../types/admin";
import axios from "axios";
import toast from "react-hot-toast";

const ModalAdminUser = ({user, onClose, onSaved}: ModalAdminUsersProps) => {
    const [cities, setCities] = useState<{ id: number; name: string }[]>([])
    useEffect(() => {
        fetch('http://localhost:5000/api/cities')
            .then(response => response.json())
            .then(data => setCities(data.data))
            .catch(error => console.error('Error fetching cities:', error));
    }, [])
    const [form, setForm] = useState(user)
    const handleSave = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`http://localhost:5000/api/user/admin/${user.id}`, form, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Профіль користувача успішно оновлено');
            onSaved();
        } catch (error) {
            toast.error('Помилка при оновленні профілю користувача');
            console.error('Error updating user profile:', error);
        }
    }
    const [selected, setSelected] = useState({
        first: true,
        second: false,
    })
    const handleCheckboxChange = (key: 'first' | 'second') => {
        if(key === 'second') {
            if(!selected.second) {
                setForm(form => ({...form, apartmentNumber: ""}))
            }
            setSelected((prev) => ({
                second: !prev.second,
                first: prev.second ? true : false,
            }))
        }
    }
    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="w-md mx-auto mt-10 mb-20 bg-white p-6 border border-primary rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-center text-primary">Профіль {user.name}</h2>
                <div className="space-y-3">
                    <div>
                        <div className="my-2">
                            <label className="block text-gray-600 text-sm mb-1">Ім'я</label>
                            <input 
                                className="input input-primary w-full"
                                placeholder="Ім'я"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                        </div>
                        <div className="my-2">
                            <label className="block text-gray-600 text-sm mb-1">Електронна пошта</label>
                            <input 
                                className="input input-primary w-full"
                                placeholder="Email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                        </div>
                        <div className="my-2">
                            <label className="block text-gray-600 text-sm mb-1">Телефон</label>
                            <input 
                                className="input input-primary w-full"
                                placeholder="Телефон"
                                value={form.phoneNumber}
                                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                            />
                        </div>
                        <div className="my-2">
                            <label className="block text-gray-600 text-sm mb-1">Місто</label>
                            <select className="select select-primary w-full" value={form.cityId} onChange={e => setForm(form => ({...form, cityId: Number(e.target.value)}))} required>
                                <option value="">Оберіть місто</option>
                                {cities.map(city => (
                                    <option key={city.id} value={city.id}>{city.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="my-2">
                            <label className="block text-gray-600 text-sm mb-1">Вулиця</label>
                            <input 
                                className="input input-primary w-full"
                                placeholder="Вулиця"
                                value={form.street}
                                onChange={(e) => setForm({ ...form, street: e.target.value })}
                            />
                        </div>
                        <div className="my-2">
                            <label className="block text-gray-600 text-sm mb-1">Будинок</label>
                            <input 
                                className="input input-primary w-full"
                                placeholder="Будинок"
                                value={form.houseNumber}
                                onChange={(e) => setForm({ ...form, houseNumber: e.target.value })}
                            />
                        </div>
                        <div className="my-2">
                            <label className="block text-gray-600 text-sm mb-1">Який будинок?</label>
                            <label className="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    className="checkbox checkbox-primary text-white checkbox-sm"
                                    checked={form.apartmentNumber === null ? false : selected.first}
                                    readOnly
                                />
                                Багатоповерховий
                            </label>
                            <label className="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    className="checkbox checkbox-primary text-white checkbox-sm" 
                                    checked={form.apartmentNumber === null ? true : selected.second}
                                    onChange={() => handleCheckboxChange('second')}
                                />
                                Приватний
                            </label>
                        </div>
                        <div className="my-2">
                            <label className="block text-gray-600 text-sm mb-1">Квартира</label>
                            <input 
                                className="input input-primary w-full"
                                placeholder="Квартира"
                                value={selected.first ? (form.apartmentNumber ?? "") : ""}
                                onChange={(e) => setForm({ ...form, apartmentNumber: e.target.value })}
                                disabled={selected.second || form.apartmentNumber === null}
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-2">
                        <button className="btn btn-ghost" onClick={onClose}>
                            Закрити
                        </button>
                        <button className="btn btn-primary text-white" onClick={handleSave}>
                            Зберегти
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalAdminUser
