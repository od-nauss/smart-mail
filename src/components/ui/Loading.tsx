export default function Loading({ label = 'جاري التحميل...', fullScreen = false }: { label?: string; fullScreen?: boolean }) {
  const wrapper = fullScreen ? 'min-h-screen' : 'min-h-[240px]';
  return <div className={`${wrapper} grid place-items-center`}><div className="text-center"><div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-primary-500" /><p className="mt-4 text-sm text-slate-600">{label}</p></div></div>;
}
