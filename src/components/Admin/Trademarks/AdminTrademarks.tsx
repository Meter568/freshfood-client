import { useEffect, useState } from 'react';
import axios from 'axios';
import { PencilIcon, Trash2Icon } from 'lucide-react';

interface Trademark {
    id: number;
    name: string;
}

const API = 'http://localhost:5000/api/trademarks';

const AdminTrademarks = () => {
    const [trademarks, setTrademarks] = useState<Trademark[]>([]);
    const [loading, setLoading] = useState(true);
    const [newTrademark, setNewTrademark] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const fetchTrademarks = async () => {
        setLoading(true);
        const { data } = await axios.get(API);
        setTrademarks(data.data || []);
        setLoading(false);
    };
    useEffect(() => { fetchTrademarks(); }, []);
    const handleAdd = async () => {
        if (!newTrademark.trim()) return;
        await axios.post(API, { name: newTrademark });
        setNewTrademark('');
        fetchTrademarks();
    };
    const handleDelete = async (id: number) => {
        await axios.delete(`${API}/${id}`);
        fetchTrademarks();
    };
    const startEdit = (trademark: Trademark) => {
        setEditingId(trademark.id); setEditName(trademark.name);
    };
    const handleEdit = async (id: number) => {
        await axios.put(`${API}/${id}`, { name: editName });
        setEditingId(null); setEditName('');
        fetchTrademarks();
    };
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col lg:flex-row justify-between items-center mb-4 gap-5 lg:gap-0">
                <h2 className="text-xl font-bold">Торгові марки</h2>
                <div className="flex flex-col md:flex-row gap-5 items-center">
                    <input type="text" className="input input-primary" value={newTrademark} onChange={e=>setNewTrademark(e.target.value)} placeholder="Нова назва марки" />
                    <button className="btn btn-primary text-white" onClick={handleAdd}>Додати</button>
                    <span className="ml-0 md:ml-4 text-gray-500 flex flex-row items-center gap-3">Всього: <b>{trademarks.length}</b></span>
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
                        {trademarks.map((trademark, idx) => (
                            <tr key={trademark.id} className="text-center flex flex-col md:table-row">
                                <td className="hidden md:table-cell">{idx + 1}</td>
                                <td className="hidden md:table-cell">{trademark.id}</td>
                                <td>
                                    {editingId === trademark.id ? (
                                        <input
                                            className="input input-sm input-primary"
                                            value={editName}
                                            onChange={e=>setEditName(e.target.value)}
                                        />
                                    ) : trademark.name}
                                </td>
                                <td className="flex items-center justify-center gap-2">
                                    {editingId === trademark.id ? (
                                        <>
                                            <button className="btn btn-sm btn-primary text-white" onClick={()=>handleEdit(trademark.id)}>Зберегти</button>
                                            <button className="btn btn-sm" onClick={()=>setEditingId(null)}>Скасувати</button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="btn btn-sm bg-white text-primary" onClick={()=>startEdit(trademark)}><PencilIcon className='w-4' /></button>
                                            <button className="btn btn-sm bg-white text-red-400" onClick={()=>handleDelete(trademark.id)}><Trash2Icon className='w-4' /></button>
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

export default AdminTrademarks;