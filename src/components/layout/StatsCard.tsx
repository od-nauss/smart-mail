export default function StatsCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-sand-200 bg-white p-4 shadow-soft">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-slate-900">{value}</p>
    </div>
  );
}
