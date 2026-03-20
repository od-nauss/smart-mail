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
  className,
}: MessageTypeCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'template-card group relative overflow-hidden rounded-2xl px-3 py-3 text-right',
        'transition-all duration-200 hover:-translate-y-[1px]',
        'focus:outline-none focus:ring-2 focus:ring-[#016564]/20',
        className
      )}
    >
      <span className="absolute inset-y-0 right-0 w-1 rounded-r-2xl bg-[#d0b284]" />
      <span className="absolute left-3 top-3 h-2 w-2 rounded-full bg-[#016564]/12 transition group-hover:bg-[#d0b284]" />

      <div className="pr-2">
        <span className="block text-sm font-medium text-[#2f4f4f] transition-colors group-hover:text-[#016564] sm:text-[15px]">
          {template.title}
        </span>
      </div>
    </button>
  );
}