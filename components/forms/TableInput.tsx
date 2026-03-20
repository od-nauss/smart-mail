'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/Button';

interface TableInputProps {
  id: string;
  columns: string[];
  value?: Record<string, string>[];
  onChange?: (data: Record<string, string>[]) => void;
  error?: string;
}

export function TableInput({ id, columns, value = [], onChange, error }: TableInputProps) {
  
  const handleAddRow = useCallback(() => {
    const newRow: Record<string, string> = {};
    columns.forEach((col) => { newRow[col] = ''; });
    onChange?.([...value, newRow]);
  }, [columns, value, onChange]);

  const handleDeleteRow = useCallback((index: number) => {
    onChange?.(value.filter((_, i) => i !== index));
  }, [value, onChange]);

  const handleCellChange = useCallback((rowIndex: number, colIndex: number, cellValue: string) => {
    const newData = [...value];
    const colName = columns[colIndex];
    if (newData[rowIndex]) {
      newData[rowIndex] = { ...newData[rowIndex], [colName]: cellValue };
      onChange?.(newData);
    }
  }, [columns, value, onChange]);

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto rounded-lg border border-naif-gray text-xs">
        <table className="w-full">
          <thead>
            <tr className="bg-naif-primary/5">
              {columns.map((col, i) => (
                <th key={i} className="px-2 py-1.5 text-right font-normal text-naif-primary border-b border-naif-gray">
                  {col}
                </th>
              ))}
              <th className="w-8 px-1 py-1.5 border-b border-naif-gray"></th>
            </tr>
          </thead>
          <tbody>
            {value.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-2 py-4 text-center text-naif-blueGray">
                  لا توجد بيانات
                </td>
              </tr>
            ) : (
              value.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-naif-gray last:border-b-0 hover:bg-naif-gray/10">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="p-1">
                      <input
                        type="text"
                        value={row[col] || ''}
                        onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                        placeholder={col}
                        className="w-full px-2 py-1 text-xs border border-transparent focus:border-naif-gold rounded focus:outline-none bg-transparent"
                      />
                    </td>
                  ))}
                  <td className="p-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteRow(rowIndex)}
                      className="text-naif-blueGray hover:text-naif-maroon p-0.5"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="flex items-center justify-between">
        <Button type="button" variant="ghost" size="sm" onClick={handleAddRow} className="text-xs">
          + إضافة صف
        </Button>
        <span className="text-xs text-naif-blueGray">{value.length} صف</span>
      </div>

      {error && <p className="text-xs text-naif-maroon">{error}</p>}
    </div>
  );
}