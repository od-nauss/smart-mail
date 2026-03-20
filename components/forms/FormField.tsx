'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  children: ReactNode;
  label: string;
  required?: boolean;
  error?: string;
  description?: string;
  className?: string;
}

export function FormField({ children, label, required, error, description, className }: FormFieldProps) {
  return (
    <div className={cn('space-y-1', className)}>
      <label className="block text-xs font-medium text-gray-600">
        {label}
        {required && <span className="text-naif-maroon mr-0.5">*</span>}
      </label>
      {children}
      {description && !error && (
        <p className="text-xs text-naif-blueGray">{description}</p>
      )}
      {error && (
        <p className="text-xs text-naif-maroon">{error}</p>
      )}
    </div>
  );
}