import type { ReactNode } from 'react';
import type { MessageGroupInfo } from '@/lib/types';

interface Props {
  group: MessageGroupInfo;
  children: ReactNode;
  className?: string;
}

export function MessageGroup({ group, children, className = '' }: Props) {
  return (
    <section className={`rounded-2xl border border-[#e7dfd2] bg-white p-4 sm:p-5 ${className}`}>
      <div className="mb-4 flex items-start justify-between gap-3 border-b border-[#f1ece3] pb-3">
        <div>
          <h3 className="text-xl font-medium text-[#016564]">{group.title}</h3>
          {group.description ? (
            <p className="mt-1 text-sm text-gray-500">{group.description}</p>
          ) : null}
        </div>

        <span className="mt-1 h-4 w-1 rounded-full bg-[#d0b284]" />
      </div>

      {children}
    </section>
  );
}