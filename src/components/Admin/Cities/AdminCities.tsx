import { useEffect, useState } from 'react';
import axios from 'axios';
import type { CityType } from '../../../types/admin';
import { PencilIcon, Trash2Icon } from 'lucide-react';

const API = 'http://localhost:5000/api/cities';
const AdminCities = () => {
    const [cities, setCities] = useState<CityType[]>([]);
    const [loading, setLoading] = useState(true);
    const [newCity, setNewCity] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const fetchCities = async () => {
        setLoading(true);
        const { data } = await axios.get(API);
        setCities(data.data || []);
        setLoading(false);
    };
    useEffect(() => { fetchCities(); }, []);
    const handleAdd = async () => {
        if (!newCity.trim()) return;
        await axios.post(API, { name: newCity });
        setNewCity('');
        fetchCities();
    };
    const handleDelete = async (id: number) => {
        await axios.delete(`${API}/${id}`);
        fetchCities();
    };
    const startEdit = (city: CityType) => {
        setEditingId(city.id); setEditName(city.name);
    };
    const handleEdit = async (id: number) => {
        await axios.put(`${API}/${id}`, { name: editName });
        setEditingId(null); setEditName('');
        fetchCities();
    };
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col lg:flex-row justify-between items-center mb-4 gap-5 lg:gap-0">
                <h2 className="text-xl font-bold">Міста</h2>
                <div className="flex flex-col md:flex-row gap-5 items-center">
                    <input type="text" className="input input-primary" value={newCity} onChange={e=>setNewCity(e.target.value)} placeholder="Нова назва міста" />
                    <button className="btn btn-primary text-white" onClick={handleAdd}>Додати</button>
                    <span className="ml-0 md:ml-4 text-gray-500 flex flex-row items-center gap-3">Всього: <b>{cities.length}</b></span>
                </div>
            </div>
            {loading ? <div>Завантаження...</div> : (
                <table className="table table-fixed w-full">
                    <thead className="text-center">
                        <tr>
                            <th className="hidden md:table-cell">#</th>
                            <th className="hidden md:table-cell">ID</th>
                            <th>Назва</th>
                            <th className="hidden md:table-cell"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {cities.map((city, idx) => (
                            <tr key={city.id} className="text-center flex flex-col md:table-row">
                                <td className="hidden md:table-cell">{idx + 1}</td>
                                <td className="hidden md:table-cell">{city.id}</td>
                                <td>
                                    {editingId === city.id ? (
                                        <input
                                            className="input input-sm input-primary"
                                            value={editName}
                                            onChange={e=>setEditName(e.target.value)}
                                        />
                                    ) : city.name}
                                </td>
                                <td className="flex items-center justify-center gap-2">
                                    {editingId === city.id ? (
                                        <>
                                            <button className="btn btn-sm btn-primary text-white" onClick={()=>handleEdit(city.id)}>Зберегти</button>
                                            <button className="btn btn-sm" onClick={()=>setEditingId(null)}>Скасувати</button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="btn btn-sm bg-white text-primary" onClick={()=>startEdit(city)}><PencilIcon className='w-4' /></button>
                                            <button className="btn btn-sm bg-white text-red-400" onClick={()=>handleDelete(city.id)}><Trash2Icon className='w-4' /></button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AdminCities;
