import { createContext, useEffect, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { User, SignInPayload, SignUpPayload, AuthResponse } from './auth.types'
import type { ApiResponse} from '../../types/api.types';

import { 
    signIn as signInService, 
    signUp as signUpService, 
    getMe } from '../../services/auth.api';

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    signUp: (data: SignUpPayload) => Promise<void>;
    signIn: (data: SignInPayload) => Promise<ApiResponse<AuthResponse>>;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider ({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const isAuthenticated = !!user;

    const signUp = async (data: SignUpPayload) => {
        setLoading(true);
        try {
            await signUpService(data);
        } catch(err: any) {
            throw err;
        } finally {
            setLoading(false);
        }
    }

    const signIn = async (data: SignInPayload) => {
        setLoading(true);
        try {
            const res = await signInService(data);
            localStorage.setItem("token", res.data.token);
            setUser(res.data.user);
            return res;
        } catch(err: any) {
            throw err;
        } finally {
            setLoading(false);
        }
    }

    const signOut = () => {
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
        .catch(() => signOut())
        .finally(() => setLoading(false));
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, signUp, signIn, signOut }}>
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