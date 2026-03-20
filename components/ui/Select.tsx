'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { SelectProps } from '@/lib/types';

const ChevronDownIcon = () => (
  <svg className="w-4 h-4 text-naif-blueGray" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ id, label, options, value, onChange, error, required, disabled, placeholder = 'اختر...', className }, ref) => {
    return (
      <div className={cn('space-y-1', className)}>
        {label && (
          <label htmlFor={id} className="block text-xs text-gray-600">
            {label} {required && <span className="text-naif-maroon">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            name={id}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled}
            required={required}
            className={cn(
              'w-full px-3 py-2 rounded-lg text-sm appearance-none',
              'border border-naif-gray bg-naif-white',
              'text-gray-800',
              'focus:outline-none focus:border-naif-gold focus:ring-1 focus:ring-naif-gold/30',
              'disabled:bg-naif-gray/30 disabled:cursor-not-allowed',
              error && 'border-naif-maroon',
              !value && 'text-naif-blueGray'
            )}
          >
            <option value="" disabled>{placeholder}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronDownIcon />
          </div>
        </div>
        {error && <p className="text-xs text-naif-maroon">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export { Select };