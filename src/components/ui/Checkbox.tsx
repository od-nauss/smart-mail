export default function Checkbox({ label, checked, onChange, description }: { label: string; checked?: boolean; onChange?: React.ChangeEventHandler<HTMLInputElement>; description?: string }) {
  return (
    <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <input type="checkbox" checked={checked} onChange={onChange} className="mt-1 h-4 w-4 accent-[#016564]" />
      <span>
        <span className="block text-sm font-medium text-slate-800">{label}</span>
        {description && <span className="mt-1 block text-xs text-slate-500">{description}</span>}
      </span>
    </label>
  );
}
