import type { ReactNode } from "react";
import type { NavigateFunction } from "react-router-dom";

export type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    cityId?: number;
    street?: string;
    houseNumber?: number;
    apartmentNumber?: string;
    phoneNumber?: string;
};

export type UserContextProviderProps = {
    children: ReactNode;
};

export type UserContextType = {
    navigate: NavigateFunction;
    user: User | null;
    setUser: (user: User | null) => void;
    isSeller: boolean;
    setIsSeller: (value: boolean) => void;
    showUserLogin: boolean;
    setShowUserLogin: (show: boolean) => void;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (userData: {
        name: string;
        email: string;
        password: string;
        cityId?: string;
        street?: string;
        houseNumber?: string;
        apartmentNumber?: string;
        phoneNumber?: string;
    }) => Promise<void>;
}