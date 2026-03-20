import * as React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost';

export default function Button({ className, variant = 'primary', isLoading = false, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; isLoading?: boolean }) {
  const styles = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600',
    secondary: 'bg-gold-400 text-slate-900 hover:bg-gold-500',
    ghost: 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'
  };
  return (
    <button
      className={cn('inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50', styles[variant], className)}
      {...props}
    >
      {isLoading ? '...' : props.children}
    </button>
  );
}
