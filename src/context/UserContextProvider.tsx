import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { UserContextProviderProps, User } from "../types/user";
import { UserContext } from "./UserContext";
import { useAppDispatch } from "../store/hooks";
import { fetchBasket } from "../features/basket/basketSlice";

export const UserContextProvider = ({children}: UserContextProviderProps) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [user, setUser] = useState<User | null>(null)
    const [isSeller, setIsSeller] = useState(false)
    const [showUserLogin, setShowUserLogin] = useState(false)

    const fetchUserFromServer = useCallback(async (token: string) => {
        try {
            const response = await fetch('http://localhost:5000/api/user/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData.user);
            } else if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/auth')
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        } catch (error) {
            console.error('Error fetching user from server:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }, [navigate]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(!token) return;
        fetchUserFromServer(token)
        dispatch(fetchBasket());
    }, [dispatch, fetchUserFromServer]);

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch('http://localhost:5000/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if(response.status === 403) {
                throw new Error('Ваш акаунт заблоковано. Будь ласка, зверніться до підтримки.');
            }

            if (!response.ok) {
                throw new Error('Неправильно введено пароль або пошту');
            }

            const data = await response.json();
            const token = data.token;

            localStorage.setItem('token', token);
            
            await fetchUserFromServer(token);
            navigate('/');
        } catch (error) {
            console.log('Login error:', error);
            throw error;
        }
    };

    const register = async (userData: {
        name: string;
        email: string;
        password: string;
        cityId?: string;
        street?: string;
        houseNumber?: string;
        apartmentNumber?: string;
        phoneNumber?: string;
    }) => {
        try {
            console.log('Register function called with:', userData);
            const response = await fetch('http://localhost:5000/api/user/registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...userData,
                    role: 'user'
                }),
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            const data = await response.json();
            const token = data.token;

            localStorage.setItem('token', token);

            await fetchUserFromServer(token);
            navigate('/profile');
        } catch (error) {
            console.log('Registration error:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
        window.location.reload();
    };

    const value = {
        navigate, 
        user, 
        setUser, 
        isSeller, 
        setIsSeller, 
        showUserLogin, 
        setShowUserLogin,
        login,
        logout,
        register
    };

    

    return <UserContext.Provider value={value}>
        {children}
    </UserContext.Provider>
}