'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import Toast from '@/components/ui/Toast';

type ToastItem = { id: string; type: 'success' | 'error' | 'info'; message: string };

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = (type: ToastItem['type'], message: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setItems((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== id)), 3000);
  };

  const value = useMemo(() => ({
    success: (message: string) => push('success', message),
    error: (message: string) => push('error', message),
    info: (message: string) => push('info', message),
  }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed left-4 top-4 z-50 flex w-[min(92vw,360px)] flex-col gap-2">
        {items.map((item) => <Toast key={item.id} type={item.type} message={item.message} />)}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
