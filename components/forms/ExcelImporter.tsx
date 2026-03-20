'use client';

import { useState, useRef, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { cn } from '@/lib/utils';
import { Button } from '../ui/Button';
import { showToast } from '../ui/Toast';

interface ExcelImporterProps {
  onImport: (data: Record<string, string>[]) => void;
  columns?: string[];
  className?: string;
}

function isExcelFile(file: File) {
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];

  return (
    validTypes.includes(file.type) ||
    file.name.toLowerCase().endsWith('.xlsx') ||
    file.name.toLowerCase().endsWith('.xls')
  );
}

async function parseExcelFile(file: File): Promise<Record<string, string>[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
    defval: '',
  });

  return rows.map((row) => {
    const normalized: Record<string, string> = {};
    Object.entries(row).forEach(([key, value]) => {
      normalized[String(key)] = value == null ? '' : String(value);
    });
    return normalized;
  });
}

export function ExcelImporter({ onImport, columns = [], className }: ExcelImporterProps) {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (file: File) => {
      if (!isExcelFile(file)) {
        showToast('ملف Excel غير صالح', 'error');
        return;
      }

      setIsLoading(true);

      try {
        const data = await parseExcelFile(file);

        if (!data.length) {
          showToast('الملف فارغ', 'warning');
          return;
        }

        const normalizedData =
          columns.length > 0
            ? data.map((row) => {
                const normalizedRow: Record<string, string> = {};
                columns.forEach((col) => {
                  normalizedRow[col] = row[col] ?? '';
                });
                return normalizedRow;
              })
            : data;

        onImport(normalizedData);
        showToast(`تم استيراد ${normalizedData.length} صف`, 'success');
      } catch {
        showToast('خطأ في قراءة الملف', 'error');
      } finally {
        setIsLoading(false);
      }
    },
    [columns, onImport]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [processFile]
  );

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        className="hidden"
      />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        isLoading={isLoading}
        className="text-xs text-naif-blueGray"
      >
        استيراد من Excel
      </Button>
    </div>
  );
}