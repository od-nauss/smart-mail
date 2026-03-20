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
        'group relative overflow-hidden rounded-xl border border-[#e6ebeb] bg-white/90 px-3 py-3 text-right',
        'transition-all duration-200 hover:-translate-y-[1px] hover:border-[#d0b284] hover:shadow-[0_10px_24px_-18px_rgba(1,101,100,0.35)]',
        'focus:outline-none focus:ring-2 focus:ring-[#016564]/20',
        className
      )}
    >
      <span className="absolute inset-y-0 right-0 w-1 rounded-r-xl bg-gradient-to-b from-[#016564] to-[#d0b284] opacity-80" />

      <div className="pr-2">
        <span className="block text-sm font-medium text-[#2f4f4f] transition-colors group-hover:text-[#016564] sm:text-[15px]">
          {template.title}
        </span>
      </div>
    </button>
  );
}