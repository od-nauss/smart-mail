import { cn } from '@/lib/utils';

export default function Badge({ children, className, removable, onRemove }: { children: React.ReactNode; className?: string; removable?: boolean; onRemove?: () => void }) {
  return (
    <span className={cn('inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700', className)}>
      {children}
      {removable && <button onClick={onRemove} className="text-slate-500">×</button>}
    </span>
  );
}
