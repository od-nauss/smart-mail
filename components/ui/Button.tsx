'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { ButtonProps } from '@/lib/types';

const variantStyles = {
  primary: 'bg-naif-primary text-white hover:bg-naif-dark',
  secondary: 'bg-naif-gray text-gray-700 hover:bg-naif-blueGray/30',
  outline: 'border border-naif-primary text-naif-primary hover:bg-naif-primary hover:text-white',
  ghost: 'text-gray-600 hover:bg-naif-gray',
  gold: 'bg-naif-gold text-naif-dark hover:bg-naif-goldDark',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, disabled, fullWidth, children, onClick, type = 'button', className, icon }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-1.5',
          'font-normal rounded-lg',
          'transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-naif-primary/30',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
      >
        {isLoading && (
          <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {!isLoading && icon && icon}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export { Button };