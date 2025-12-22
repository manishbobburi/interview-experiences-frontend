type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonShape = 'rounded' | 'pill' | 'square';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    shape?: ButtonShape;
    isLoading?: boolean;
}

export type {
    ButtonVariant,
    ButtonSize,
    ButtonShape,
    ButtonProps,
}