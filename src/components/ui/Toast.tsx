import { cn } from '@/lib/utils';

export default function Toast({ type, message }: { type: 'success' | 'error' | 'info'; message: string }) {
  const styles = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-slate-900 text-white'
  };
  return <div className={cn('rounded-2xl px-4 py-3 text-sm shadow-elevated', styles[type])}>{message}</div>;
}
