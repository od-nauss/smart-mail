'use client';

import { ChangeEvent, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Option = {
  label: string;
  value: string;
};

type InputSize = 'sm' | 'md' | 'lg';

interface Props
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'onChange'> {
  label?: string;
  options: Option[];
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  hint?: string;
  required?: boolean;
  placeholder?: string;
  inputSize?: InputSize;
}

const sizeClasses: Record<InputSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-3.5 text-sm',
  lg: 'h-12 px-4 text-base',
};

export default function Select({
  label,
  options,
  value,
  onChange,
  error,
  hint,
  required,
  placeholder,
  className,
  disabled,
  inputSize = 'md',
  id,
  ...props
}: Props) {
  const selectId = id || `select-${label || 'field'}`;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-semibold text-slate-800">
          {label}
          {required && <span className="mr-1 text-red-500">*</span>}
        </label>
      )}

      <select
        id={selectId}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={cn(
          'w-full rounded-xl border bg-white text-slate-800 outline-none transition',
          'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
          'disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400',
          error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-300',
          sizeClasses[inputSize],
          className
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}