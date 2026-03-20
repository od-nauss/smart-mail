'use client';

import { useEffect, useState } from 'react';
import { ToastProps } from '@/lib/types';
import { cn } from '@/lib/utils';

const variantStyles = {
  success: 'bg-green-600 text-white',
  error: 'bg-red-600 text-white',
  warning: 'bg-amber-500 text-white',
  info: 'bg-blue-600 text-white',
};

interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

let toasts: ToastData[] = [];
let toastId = 0;
const listeners = new Set<(items: ToastData[]) => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener([...toasts]));
}

export function showToast(message: string, type: ToastData['type'] = 'success') {
  const id = `toast-${++toastId}`;
  toasts = [...toasts, { id, message, type }];
  notifyListeners();
}

export function Toast({ message, type = 'success', duration = 3000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setVisible(false);
      window.setTimeout(() => onClose?.(), 250);
    }, duration);
    return () => window.clearTimeout(t);
  }, [duration, onClose]);

  return (
    <div
      role="alert"
      className={cn(
        'rounded-xl px-4 py-3 shadow-xl transition-all duration-300',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3',
        variantStyles[type]
      )}
    >
      {message}
    </div>
  );
}

export function ToastContainer() {
  const [items, setItems] = useState<ToastData[]>([]);

  useEffect(() => {
    const listener = (next: ToastData[]) => setItems(next);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  if (!items.length) return null;

  return (
    <div className="fixed bottom-5 left-1/2 z-[100] -translate-x-1/2 space-y-2">
      {items.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => {
            toasts = toasts.filter((item) => item.id !== toast.id);
            notifyListeners();
          }}
        />
      ))}
    </div>
  );
}
