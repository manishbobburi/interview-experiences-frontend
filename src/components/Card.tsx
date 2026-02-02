import type { ReactNode } from 'react';

type CardProps = {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export default function Card({children, className = "", onClick}: CardProps) {
    return (
        <div
            onClick={onClick}
            className={`
                bg-white 
                border border-gray-200 
                rounded-xl 
                p-4
                shadow-sm 
                hover:shadow-md 
                transition
                ${className}
            `}
        >
        {children}
        </div>
    );
}