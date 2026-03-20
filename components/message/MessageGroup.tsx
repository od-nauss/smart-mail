'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { MessageGroupInfo } from '@/lib/types';

interface MessageGroupProps {
  group: MessageGroupInfo;
  children: ReactNode;
  className?: string;
}

const icons: Record<string, ReactNode> = {
  calendar: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3" y="4" width="18" height="18" rx="3" />
      <path d="M8 2v4M16 2v4M3 10h18" />
    </svg>
  ),
  settings: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 00.34 1.82l.06.06a2 2 0 010 2.84 2 2 0 01-2.84 0l-.06-.06a1.7 1.7 0 00-1.82-.34 1.7 1.7 0 00-1.04 1.56V21a2 2 0 01-4 0v-.09A1.7 1.7 0 009 19.35a1.7 1.7 0 00-1.82.34l-.06.06a2 2 0 01-2.84-2.84l.06-.06A1.7 1.7 0 004.69 15a1.7 1.7 0 00-1.56-1.04H3a2 2 0 010-4h.09A1.7 1.7 0 004.65 9a1.7 1.7 0 00-.34-1.82l-.06-.06a2 2 0 012.84-2.84l.06.06A1.7 1.7 0 009 4.65a1.7 1.7 0 001.04-1.56V3a2 2 0 014 0v.09A1.7 1.7 0 0015 4.65a1.7 1.7 0 001.82-.34l.06-.06a2 2 0 012.84 2.84l-.06.06A1.7 1.7 0 0019.35 9a1.7 1.7 0 001.56 1.04H21a2 2 0 010 4h-.09A1.7 1.7 0 0019.4 15z" />
    </svg>
  ),
  users: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  mail: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M4 5h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2z" />
      <path d="M22 7l-10 7L2 7" />
    </svg>
  ),
};

export function MessageGroup({ group, children, className }: MessageGroupProps) {
  return (
    <section
      className={cn(
        'infographic-panel pattern-dots rounded-[22px] p-4 sm:p-5',
        'relative overflow-hidden transition-all duration-200',
        className
      )}
    >
      <div className="absolute right-0 top-0 h-full w-1 bg-[#016564]" />

      <div className="relative mb-4 flex items-center justify-between border-b border-[#e8ecec] pb-3">
        <div className="flex items-center gap-3">
          <div className="infographic-chip flex h-10 w-10 items-center justify-center rounded-2xl text-[#016564]">
            {icons[group.icon] || icons.mail}
          </div>

          <div>
            <h3 className="text-base font-semibold text-[#016564] sm:text-lg">
              {group.title}
            </h3>
            {group.description ? (
              <p className="mt-0.5 text-xs text-[#8c6968] sm:text-sm">
                {group.description}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {children}
    </section>
  );
}