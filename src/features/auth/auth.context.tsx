import { createContext, useEffect, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { User, SignInPayload } from './auth.types'
import { signIn, getMe } from '../../services/auth.api';

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    signInCxt: (data: SignInPayload) => Promise<void>;
    signOutCxt: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider ({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const isAuthenticated = !!user;

    const signInCxt = async (data: SignInPayload) => {
        setLoading(true);
        try {
            const res = await signIn(data);
            localStorage.setItem("token", res.data.token);
            setUser(res.data.user);
        } finally {
            setLoading(false);
        }
    }

    const signOutCxt = () => {
        console.log("token removed by signOutCxt");
        localStorage.removeItem("token");
        setUser(null);
    }

    useEffect(() => {
        const token = localStorage.getItem("token");

        if(!token) {
            setLoading(false);
            return;
        }

        getMe()
        .then(res => {
            setUser(res.data.user)
        })
        .catch(() => signOutCxt())
        .finally(() => setLoading(false));
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, signInCxt, signOutCxt }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if(!ctx) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return ctx;
}