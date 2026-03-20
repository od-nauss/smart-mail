import { BadgeProps } from '@/lib/types';
import { cn } from '@/lib/utils';

const variantStyles = {
  primary: 'bg-naif-primary/10 text-naif-primary',
  secondary: 'bg-gray-100 text-gray-600',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  error: 'bg-red-100 text-red-700',
  gold: 'bg-naif-gold/20 text-naif-goldDark',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

export function Badge({ children, variant = 'primary', size = 'md', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center rounded-full font-medium', variantStyles[variant], sizeStyles[size], className)}>
      {children}
    </span>
  );
}
