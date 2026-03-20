'use client';

import { ButtonProps } from '@/lib/types';
import { cn } from '@/lib/utils';

const variantStyles = {
  primary: 'btn-primary text-white',
  secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  outline: 'border border-naif-primary text-naif-primary hover:bg-naif-primary/5',
  ghost: 'text-gray-600 hover:bg-gray-100',
  gold: 'btn-gold',
};

const sizeStyles = {
  sm: 'px-3 py-2 text-sm rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-5 py-3 text-base rounded-xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  children,
  onClick,
  type = 'button',
  className,
  icon,
  iconPosition = 'start',
  ariaLabel,
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
    >
      {isLoading ? (
        <>
          <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
          <span>جارٍ التنفيذ...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'start' ? icon : null}
          <span>{children}</span>
          {icon && iconPosition === 'end' ? icon : null}
        </>
      )}
    </button>
  );
}
