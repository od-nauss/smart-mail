import * as React from 'react';
import { cn } from '@/lib/utils';

export default function Card({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-3xl border border-sand-200 bg-white p-6 shadow-soft', className)}>{children}</div>;
}
