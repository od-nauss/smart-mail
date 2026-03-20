'use client';

import { useCallback } from 'react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';

export interface DynamicTableColumn {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'time' | 'select';
  placeholder?: string;
  required?: boolean;
  width?: string | number;
  options?: Array<{ label: string; value: string }>;
}

export interface DynamicTableProps {
  columns: DynamicTableColumn[];
  value: Array<Record<string, string | number>>;
  onChange: (rows: Array<Record<string, string | number>>) => void;
  title?: string;
  description?: string;
  addButtonText?: string;
  className?: string;
  editable?: boolean;
  maxRows?: number;
}

export default function DynamicTable({
  columns,
  value,
  onChange,
  title,
  description,
  addButtonText = 'إضافة صف',
  className,
  editable = true,
  maxRows,
}: DynamicTableProps) {
  const createEmptyRow = useCallback(() => {
    const row: Record<string, string | number> = {};
    columns.forEach((col) => {
      row[col.key] = col.type === 'number' ? 0 : '';
    });
    return row;
  }, [columns]);

  const handleAddRow = () => {
    if (maxRows && value.length >= maxRows) return;
    onChange([...value, createEmptyRow()]);
  };

  const handleRemoveRow = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleUpdateCell = (
    rowIndex: number,
    key: string,
    cellValue: string | number
  ) => {
    const newData = [...value];
    newData[rowIndex] = {
      ...newData[rowIndex],
      [key]: cellValue,
    };
    onChange(newData);
  };

  const handleDuplicateLast = () => {
    if (value.length === 0) return;
    onChange([...value, { ...value[value.length - 1] }]);
  };

  return (
    <div className={cn('space-y-3', className)}>
      {(title || description) && (
        <div>
          {title && <h4 className="font-semibold text-gray-900">{title}</h4>}
          {description && (
            <p className="mt-0.5 text-sm text-gray-500">{description}</p>
          )}
        </div>
      )}

      {value.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-3 py-2.5 text-right text-sm font-medium text-gray-700"
                    style={{ width: col.width }}
                  >
                    {col.label}
                    {col.required && <span className="mr-1 text-red-500">*</span>}
                  </th>
                ))}
                {editable && (
                  <th className="w-12 px-2 py-2.5 text-center">
                    <span className="sr-only">إجراءات</span>
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {value.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50/50">
                  {columns.map((col) => (
                    <td key={col.key} className="px-2 py-1.5">
                      {col.type === 'select' ? (
                        <Select
                          options={col.options || []}
                          value={String(row[col.key] || '')}
                          onChange={(e) =>
                            handleUpdateCell(rowIndex, col.key, e.target.value)
                          }
                          disabled={!editable}
                        />
                      ) : col.type === 'date' ? (
                        <input
                          type="date"
                          value={String(row[col.key] || '')}
                          onChange={(e) =>
                            handleUpdateCell(rowIndex, col.key, e.target.value)
                          }
                          disabled={!editable}
                          className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20"
                        />
                      ) : col.type === 'time' ? (
                        <input
                          type="time"
                          value={String(row[col.key] || '')}
                          onChange={(e) =>
                            handleUpdateCell(rowIndex, col.key, e.target.value)
                          }
                          disabled={!editable}
                          className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20"
                        />
                      ) : (
                        <input
                          type={col.type === 'number' ? 'number' : 'text'}
                          value={row[col.key] ?? ''}
                          onChange={(e) =>
                            handleUpdateCell(
                              rowIndex,
                              col.key,
                              col.type === 'number'
                                ? Number(e.target.value || 0)
                                : e.target.value
                            )
                          }
                          placeholder={col.placeholder}
                          disabled={!editable}
                          className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 disabled:bg-gray-50"
                        />
                      )}
                    </td>
                  ))}

                  {editable && (
                    <td className="px-2 py-1.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(rowIndex)}
                        className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                        aria-label="حذف الصف"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editable && (
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={handleAddRow}>
            {addButtonText}
          </Button>

          {value.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleDuplicateLast}
            >
              تكرار الأخير
            </Button>
          )}
        </div>
      )}

      {maxRows && value.length >= maxRows && (
        <p className="text-sm text-amber-600">
          تم الوصول للحد الأقصى ({maxRows} صفوف)
        </p>
      )}
    </div>
  );
}