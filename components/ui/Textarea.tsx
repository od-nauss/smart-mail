'use client';

import { TextareaProps } from '@/lib/types';
import { cn } from '@/lib/utils';

export function Textarea({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  required,
  disabled,
  rows = 5,
  className,
}: TextareaProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label ? (
        <label htmlFor={id} className="block text-sm font-semibold text-gray-700">
          {label}
          {required ? <span className="text-red-500 mr-1">*</span> : null}
        </label>
      ) : null}
      <textarea
        id={id}
        value={value ?? ''}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          'input-field w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm resize-y',
          'focus:outline-none focus:border-naif-gold',
          error && 'border-red-400 focus:border-red-400',
          className
        )}
      />
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
