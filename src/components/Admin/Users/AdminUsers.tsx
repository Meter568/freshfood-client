import { useEffect, useState } from 'react'
import type { AdminUsersType } from '../../../types/admin';
import axios from 'axios';
import toast from 'react-hot-toast';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import ModalAdminUser from './ModalAdminUser';
import ModalAdminUserOrders from './ModalAdminUserOrders';

const AdminUsers = () => {
    const [users, setUsers] = useState<AdminUsersType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<AdminUsersType | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [modalOpenOrders, setOpenModalOrders] = useState<boolean>(false);
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const adminToken = localStorage.getItem('adminToken');
            if (!adminToken) {
                setError('Необхідна авторизація адміністратора');
                return;
            }
            console.log('Making request to admin users with admin token');
            const res = await axios.get<AdminUsersType[]>("http://localhost:5000/api/user", {
                headers: {
                    Authorization: `Bearer ${adminToken}`
                }
            });
            console.log('users fetched successfully:', res.data.length);
            setUsers(res.data);
        } catch (e: unknown) {
            console.error('Error fetching users:', e);
            const message = axios.isAxiosError(e) ? (e.response?.data as { message?: string } | undefined)?.message ?? e.message : 'Failed to fetch users';
            setError(message);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => { 
        fetchUsers(); 
    }, []);
    const onToggleBlock = async (u: AdminUsersType, checked: boolean) => {
        try {
            const adminToken = localStorage.getItem('adminToken');
            await axios.put(`http://localhost:5000/api/user/admin/block/${u.id}`, { inBlock: checked }, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            toast.success(`Користувача ${checked ? 'заблоковано' : 'розблоковано'} успішно`);
            await fetchUsers();
        } catch (error) {
            toast.error('Помилка при зміні статусу блокування користувача');
        }
    }
    const openEdit = async (userId: number) => {
        try {
            const adminToken = localStorage.getItem('adminToken');
            const res = await axios.get<AdminUsersType>(`http://localhost:5000/api/user/admin/${userId}`, {
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            const userData = res.data as AdminUsersType;
            setSelectedUser(userData);
            setModalOpen(true);
        } catch (error) {
            toast.error('Помилка при завантаженні користувача');
        }
    }
    const deleteUser = async (id: number) => {
        const adminToken = localStorage.getItem('adminToken');
        if (!adminToken) {
            setError('Необхідна авторизація адміністратора');
            return;
        }
        if (!window.confirm("Видалити користувача?")) return;
        await axios.delete(`http://localhost:5000/api/user/admin/${id}`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        await fetchUsers();
        toast.success('Користувач успішно видалено');
    };
    const openOrders = (userId: number) => {
        setSelectedUserId(userId);
        setOpenModalOrders(true);
    }
    if (loading) return <span className="loading loading-spinner loading-lg text-primary"></span>;
    if (error) return <p className="text-red-500">{error}</p>;
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-4 gap-5 lg:gap-0">
            <h2 className="text-xl font-bold">Користувачі</h2>
            <div className="flex flex-col md:flex-row gap-5 items-center">
                <span className="ml-0 md:ml-4 text-gray-500 flex flex-row items-center gap-3">Всього: <b>{users.length}</b></span>
            </div>
        </div>
        {loading ? <div>Завантаження...</div> : (
            <table className="table table-fixed w-full">
                <thead className="text-center">
                    <tr>
                        <th className="hidden xl:table-cell">Заблокувати</th>
                        <th className="hidden xl:table-cell">ID</th>
                        <th>Користувач</th>
                        <th className="hidden xl:table-cell">Телефон</th>
                        <th className="hidden xl:table-cell">Дії</th>
                        <th className="hidden xl:table-cell">Замовлення</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, idx) => (
                        <tr key={user.id} className="text-center flex flex-col lg:table-row">
                            <td>
                                <button>
                                <label className="table-cell lg:hidden">Заблокувати:</label>
                                <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                                    <input type="checkbox" className="toggle sr-only peer" defaultChecked={user.inBlock} onChange={(e)=> onToggleBlock(user, e.target.checked)} />
                                    <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-red-600 transition-colors duration-200"></div>
                                    <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                                </label>
                                </button>
                            </td>
                            <td className="hidden xl:table-cell">{idx + 1}</td>
                            <td>{user.name} ({user.email})</td>
                            <td>{user.phoneNumber ? user.phoneNumber : "Немає"}</td>
                            <td>
                                <div className="flex items-center justify-center gap-2">
                                    <button className="btn btn-sm bg-white text-primary" onClick={() => openEdit(user.id)}>
                                        <PencilIcon className='w-4' />
                                    </button>
                                    <button className="btn btn-sm bg-white text-red-400" onClick={() => deleteUser(user.id)}>
                                        <Trash2Icon className='w-4' />
                                    </button>
                                </div>
                            </td>
                            <td>
                                <button 
                                    className="btn btn-primary btn-sm text-white"
                                    onClick={() => openOrders(user.id)}
                                >
                                    Переглянути замовлення
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
        {modalOpen && selectedUser && (
            <ModalAdminUser 
                user={selectedUser}
                onClose={() => setModalOpen(false)}
                onSaved={() => { setModalOpen(false); fetchUsers(); }}
            />
        )}
        {modalOpenOrders && selectedUserId && (
            <ModalAdminUserOrders 
                userId={selectedUserId}
                onClose={() => setOpenModalOrders(false)}
            />
        )}
    </div>
    )
}

export default AdminUsers
