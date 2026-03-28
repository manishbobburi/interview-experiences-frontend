import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { CircleCheck } from 'lucide-react';

type ToastContextType = {
    showToast: (msg: string) => void
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toast, setToast] = useState({
        show: false,
        message: "",
    });

    const showToast = useCallback((message: string) => {
        setToast({ show: true, message });

        setTimeout(() => {
            setToast((prev) => prev.message === message ? { show: false, message: "" } : prev);
        }, 3000);
    }, []);
    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className={`fixed left-1/2 -translate-x-1/2 bottom-4 z-50 flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full shadow-lg w-fit max-w-[90vw] transition-all duration-300 ease-out
            ${toast.show ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-3 scale-95 pointer-events-none"}`}>
                <CircleCheck className="w-5 h-5 shrink-0"/>
                <p className="text-sm truncate">{toast.message}</p>
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if(!ctx) throw new Error("useToast must be inside ToastProvider");
    return ctx;
}