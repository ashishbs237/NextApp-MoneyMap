'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    name: string;
    email: string;
}

interface AuthContextProps {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
}

export const dataContext = createContext<AuthContextProps | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const logout = () => {
        setUser(null);
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    return (
        <dataContext.Provider value={{ user, setUser, logout }}>
            {children}
        </dataContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(dataContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
