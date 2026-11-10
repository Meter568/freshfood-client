import { useEffect, useState } from 'react';
import axios from 'axios';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import type { CountryType } from '../../../types/country';

const API = 'http://localhost:5000/api/countries';

const AdminCountries = () => {
    const [countries, setCountries] = useState<CountryType[]>([]);
    const [loading, setLoading] = useState(true);
    const [newCountry, setNewCountry] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const fetchCountries = async () => {
        setLoading(true);
        const { data } = await axios.get(API);
        setCountries(data.data || []);
        setLoading(false);
    };
    useEffect(() => { fetchCountries(); }, []);
    const handleAdd = async () => {
        if (!newCountry.trim()) return;
        await axios.post(API, { name: newCountry });
        setNewCountry('');
        fetchCountries();
    };
    const handleDelete = async (id: number) => {
        await axios.delete(`${API}/${id}`);
        fetchCountries();
    };
    const startEdit = (country: CountryType) => {
        setEditingId(country.id); setEditName(country.name);
    };
    const handleEdit = async (id: number) => {
        await axios.put(`${API}/${id}`, { name: editName });
        setEditingId(null); setEditName('');
        fetchCountries();
    };
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col lg:flex-row justify-between items-center mb-4 gap-5 lg:gap-0">
                <h2 className="text-xl font-bold">Країни</h2>
                <div className="flex flex-col md:flex-row gap-5 items-center">
                    <input type="text" className="input input-primary" value={newCountry} onChange={e=>setNewCountry(e.target.value)} placeholder="Нова назва країни" />
                    <button className="btn btn-primary text-white" onClick={handleAdd}>Додати</button>
                    <span className="ml-0 md:ml-4 text-gray-500 flex flex-row items-center gap-3">Всього: <b>{countries.length}</b></span>
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
                        {countries.map((country, idx) => (
                            <tr key={country.id} className="text-center flex flex-col md:table-row">
                                <td className="hidden md:table-cell">{idx + 1}</td>
                                <td className="hidden md:table-cell">{country.id}</td>
                                <td>
                                    {editingId === country.id ? (
                                        <input
                                            className="input input-sm input-primary"
                                            value={editName}
                                            onChange={e=>setEditName(e.target.value)}
                                        />
                                    ) : country.name}
                                </td>
                                <td className="flex items-center justify-center gap-2">
                                    {editingId === country.id ? (
                                        <>
                                            <button className="btn btn-sm btn-primary text-white" onClick={()=>handleEdit(country.id)}>Зберегти</button>
                                            <button className="btn btn-sm" onClick={()=>setEditingId(null)}>Скасувати</button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="btn btn-sm bg-white text-primary" onClick={()=>startEdit(country)}><PencilIcon className='w-4' /></button>
                                            <button className="btn btn-sm bg-white text-red-400" onClick={()=>handleDelete(country.id)}><Trash2Icon className='w-4' /></button>
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

export default AdminCountries;
