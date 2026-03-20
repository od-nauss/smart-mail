'use client';

import { SelectProps } from '@/lib/types';
import { cn } from '@/lib/utils';

export function Select({
  id,
  label,
  options,
  value,
  onChange,
  error,
  required,
  disabled,
  placeholder = 'اختر من القائمة',
  className,
}: SelectProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label ? (
        <label htmlFor={id} className="block text-sm font-semibold text-gray-700">
          {label}
          {required ? <span className="text-red-500 mr-1">*</span> : null}
        </label>
      ) : null}
      <select
        id={id}
        value={value ?? ''}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          'input-field w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm',
          'focus:outline-none focus:border-naif-gold',
          error && 'border-red-400 focus:border-red-400'
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
