'use client';

import { useMemo } from 'react';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { ExcelImporter } from './ExcelImporter';

interface Props {
  id: string;
  label: string;
  columns: string[];
  value: Record<string, string>[];
  onChange: (value: Record<string, string>[]) => void;
  error?: string;
  required?: boolean;
}

export function TableInput({ label, columns, value, onChange, error, required }: Props) {
  const emptyRow = useMemo(() => Object.fromEntries(columns.map((column) => [column, ''])), [columns]);

  const handleAddRow = () => onChange([...value, { ...emptyRow }]);

  const handleDeleteRow = (index: number) => onChange(value.filter((_, rowIndex) => rowIndex !== index));

  const handleCellChange = (rowIndex: number, colIndex: number, cellValue: string) => {
    const next = [...value];
    const colName = columns[colIndex];
    next[rowIndex] = { ...next[rowIndex], [colName]: cellValue };
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="block text-sm font-semibold text-gray-700">
          {label}
          {required ? <span className="text-red-500 mr-1">*</span> : null}
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <ExcelImporter columns={columns} onImport={onChange} />
          <Button variant="outline" size="sm" onClick={handleAddRow}>
            إضافة صف يدويًا
          </Button>
        </div>
      </div>

      <Table columns={columns} data={value} onRowAdd={handleAddRow} onRowDelete={handleDeleteRow} onCellChange={handleCellChange} />
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
