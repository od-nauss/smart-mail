import type { BreadcrumbItem } from '@/core/types';

export default function PageHeader({ title, subtitle, breadcrumbs }: { title: string; subtitle?: string; breadcrumbs?: BreadcrumbItem[] }) {
  return (
    <div className="mb-8">
      {breadcrumbs && <div className="mb-3 text-sm text-slate-500">{breadcrumbs.map((b) => b.label).join(' / ')}</div>}
      <h1 className="text-3xl font-black text-slate-900">{title}</h1>
      {subtitle && <p className="mt-2 max-w-3xl text-slate-600">{subtitle}</p>}
    </div>
  );
}
