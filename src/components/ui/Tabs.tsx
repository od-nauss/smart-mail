'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const TabsContext = React.createContext<{ value: string; setValue: (v: string) => void } | null>(null);

export default function Tabs({ defaultValue, children }: { defaultValue: string; children: React.ReactNode }) {
  const [value, setValue] = React.useState(defaultValue);
  return <TabsContext.Provider value={{ value, setValue }}>{children}</TabsContext.Provider>;
}

export function TabsList({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-wrap gap-2 rounded-2xl bg-slate-100 p-2', className)}>{children}</div>;
}

export function TabTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = React.useContext(TabsContext)!;
  return <button onClick={() => ctx.setValue(value)} className={cn('rounded-xl px-4 py-2 text-sm font-semibold', ctx.value === value ? 'bg-white text-primary-700 shadow' : 'text-slate-600')}>{children}</button>;
}

export function TabContent({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = React.useContext(TabsContext)!;
  if (ctx.value !== value) return null;
  return <div className="mt-5">{children}</div>;
}
