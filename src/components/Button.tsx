import type { ButtonProps, ButtonVariant, ButtonShape, ButtonSize } from '../types/button.types';

const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100'
}

const shapeClasses: Record<ButtonShape, string> = {
    rounded: "rounded-lg",
    pill: "rounded-full",
    square: "rounded-none"
}

const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-3 text-base"
}

export function Button({
    variant = "primary",
    shape = "rounded",
    size = "md",
    isLoading = false,
    className = "",
    disabled,
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            disabled={disabled || isLoading}
            className={`inline-flex items-cener justify-center font-medium transition disabled:opacity-50 disabled:cursor-not-allowed
            ${variantClasses[variant]}
            ${sizeClasses[size]}
            ${shapeClasses[shape]}
            ${className}
            `}
            {...props}
        >
            {isLoading ? 'Loading...' : children}
        </button>
    )
}