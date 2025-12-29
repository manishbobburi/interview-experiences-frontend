import type { ButtonProps, ButtonVariant, ButtonShape, ButtonSize } from '../types';

const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-black px-4 py-2 text-sm text-white hover:bg-gray-800',
    secondary: 'px-4 py-2 text-sm text-gray-600 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100'
}

const shapeClasses: Record<ButtonShape, string> = {
    rounded: 'rounded',
    pill: 'rounded-full',
    square: 'rounded-none'
}

const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-base'
}

export default function Button({
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
            className={`inline-flex items-center justify-center font-medium transition disabled:opacity-50 disabled:cursor-not-allowed
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