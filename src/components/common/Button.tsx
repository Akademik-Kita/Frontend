import type { ButtonHTMLAttributes } from 'react';
import { cx } from '../../utils/cx';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-dark active:bg-primary-dark',
  secondary: 'bg-surface text-link border border-primary hover:bg-lavender active:bg-lavender',
  danger: 'bg-danger text-white hover:opacity-90 active:opacity-80',
  ghost: 'bg-transparent text-link hover:bg-lavender active:bg-lavender',
};

export function Button({
  variant = 'primary',
  loading = false,
  loadingText = 'Memproses…',
  fullWidth = false,
  disabled,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx(
        'inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        'disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {loading ? loadingText : children}
    </button>
  );
}
