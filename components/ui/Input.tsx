'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { InputProps } from '@/lib/types';

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ id, label, type = 'text', placeholder, value, onChange, error, required, disabled, className }, ref) => {
    return (
      <div className={cn('space-y-1', className)}>
        {label && (
          <label htmlFor={id} className="block text-xs text-gray-600">
            {label} {required && <span className="text-naif-maroon">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          required={required}
          className={cn(
            'w-full px-3 py-2 rounded-lg text-sm',
            'border border-naif-gray bg-naif-white',
            'text-gray-800 placeholder:text-naif-blueGray',
            'focus:outline-none focus:border-naif-gold focus:ring-1 focus:ring-naif-gold/30',
            'disabled:bg-naif-gray/30 disabled:cursor-not-allowed',
            error && 'border-naif-maroon'
          )}
        />
        {error && <p className="text-xs text-naif-maroon">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export { Input };