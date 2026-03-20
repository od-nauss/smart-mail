'use client';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

export interface DynamicTableColumn {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'select';
  options?: { label: string; value: string }[];
}

export default function DynamicTable<T extends Record<string, string | number>>({ columns, value, onChange, title, description, addButtonText }: { columns: DynamicTableColumn[]; value: T[]; onChange: (rows: T[]) => void; title: string; description?: string; addButtonText?: string }) {
  const addRow = () => {
    const row = Object.fromEntries(columns.map((c) => [c.key, c.type === 'number' ? 0 : ''])) as T;
    onChange([...value, row]);
  };

  const updateRow = (index: number, key: string, next: string | number) => {
    const rows = value.map((row, i) => (i === index ? { ...row, [key]: next } : row));
    onChange(rows as T[]);
  };

  const removeRow = (index: number) => onChange(value.filter((_, i) => i !== index));

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-bold text-slate-900">{title}</h3>
        {description && <p className="text-sm text-slate-500">{description}</p>}
      </div>
      <div className="space-y-4">
        {value.map((row, index) => (
          <div key={index} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {columns.map((column) => (
                <div key={column.key}>
                  {column.type === 'select' ? (
                    <Select label={column.label} value={String(row[column.key] ?? '')} onChange={(e) => updateRow(index, column.key, e.target.value)} options={column.options || []} inputSize="sm" />
                  ) : (
                    <Input key={column.key} label={column.label} value={String(row[column.key] ?? '')} onChange={(e) => updateRow(index, column.key, column.type === 'number' ? Number(e.target.value) : e.target.value)} type={column.type === 'number' ? 'number' : column.type === 'date' ? 'date' : 'text'} />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4"><Button variant="ghost" onClick={() => removeRow(index)}>حذف السطر</Button></div>
          </div>
        ))}
      </div>
      <Button variant="outline" onClick={addRow}>{addButtonText || 'إضافة سطر'}</Button>
    </div>
  );
}
