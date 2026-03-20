'use client';

import { MessageTemplate } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MessageTypeCardProps {
  template: MessageTemplate;
  onClick: () => void;
  variant?: 'grid' | 'list';
  className?: string;
}

export function MessageTypeCard({
  template,
  onClick,
  variant = 'grid',
  className,
}: MessageTypeCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group text-right px-2.5 py-2 rounded-md',
        'bg-naif-gray/30 hover:bg-naif-gold/20',
        'transition-all duration-150',
        'border border-transparent hover:border-naif-gold/30',
        'focus:outline-none focus:ring-1 focus:ring-naif-primary/30',
        'text-xs sm:text-sm text-gray-600 group-hover:text-naif-primary',
        className
      )}
    >
      <span className="font-normal">{template.title}</span>
    </button>
  );
}