'use client';

import { InputProps } from '@/lib/types';
import { cn } from '@/lib/utils';

export function Input({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required,
  disabled,
  className,
  icon,
}: InputProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label ? (
        <label htmlFor={id} className="block text-sm font-semibold text-gray-700">
          {label}
          {required ? <span className="text-red-500 mr-1">*</span> : null}
        </label>
      ) : null}
      <div className="relative">
        {icon ? <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">{icon}</span> : null}
        <input
          id={id}
          type={type}
          value={value ?? ''}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          className={cn(
            'input-field w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm',
            'focus:outline-none focus:border-naif-gold',
            icon && 'pr-10',
            error && 'border-red-400 focus:border-red-400'
          )}
        />
      </div>
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
