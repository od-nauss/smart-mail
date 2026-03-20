'use client';

import { TableProps } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export function Table({
  columns,
  data,
  onRowAdd,
  onRowDelete,
  onCellChange,
  readOnly = false,
}: TableProps) {
  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-2xl border border-gray-200">
        <table className="table-styled min-w-full">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col} className="px-4 py-3 text-right text-sm">
                  {col}
                </th>
              ))}
              {!readOnly ? <th className="px-4 py-3 text-center text-sm w-20">حذف</th> : null}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (readOnly ? 0 : 1)} className="px-4 py-6 text-center text-gray-400">
                  لا توجد بيانات بعد
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col, colIndex) => (
                    <td key={`${rowIndex}-${col}`}>
                      {readOnly ? (
                        <div className="px-4 py-3 text-sm text-gray-700">{row[col] || '-'}</div>
                      ) : (
                        <input
                          type="text"
                          value={row[col] || ''}
                          onChange={(e) => onCellChange?.(rowIndex, colIndex, e.target.value)}
                          className={cn(
                            'm-1 w-[calc(100%-0.5rem)] rounded-lg border border-gray-200 px-3 py-2 text-sm',
                            'focus:outline-none focus:border-naif-primary'
                          )}
                          placeholder={col}
                        />
                      )}
                    </td>
                  ))}
                  {!readOnly ? (
                    <td className="px-2 py-2 text-center">
                      <Button variant="ghost" size="sm" onClick={() => onRowDelete?.(rowIndex)}>
                        حذف
                      </Button>
                    </td>
                  ) : null}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {!readOnly && onRowAdd ? (
        <Button variant="outline" size="sm" onClick={onRowAdd}>
          إضافة صف
        </Button>
      ) : null}
    </div>
  );
}
