'use client';

import { ChangeEvent } from 'react';
import { parseExcelFile } from '@/lib/utils/excel';
import { showToast } from '@/components/ui/Toast';

interface Props {
  columns: string[];
  onImport: (rows: Record<string, string>[]) => void;
}

export function ExcelImporter({ columns, onImport }: Props) {
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const result = await parseExcelFile(file);
    if (!result.success) {
      showToast(result.errors[0] || 'تعذر استيراد الملف', 'error');
      return;
    }

    const normalized = result.data.map((row) => {
      const normalizedRow: Record<string, string> = {};
      columns.forEach((column) => {
        normalizedRow[column] = row[column] ?? '';
      });
      return normalizedRow;
    });

    onImport(normalized);
    showToast(`تم استيراد ${normalized.length} صف`, 'success');
    event.target.value = '';
  };

  return (
    <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-naif-primary px-3 py-2 text-sm font-semibold text-naif-primary hover:bg-naif-primary/5">
      استيراد من Excel
      <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFileChange} />
    </label>
  );
}
