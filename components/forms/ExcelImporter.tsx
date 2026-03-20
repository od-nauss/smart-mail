'use client';

import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/Button';
import { readExcelFile, isValidExcelFile } from '@/lib/utils/excel';
import { showToast } from '../ui/Toast';

interface ExcelImporterProps {
  onImport: (data: Record<string, string>[]) => void;
  columns?: string[];
  className?: string;
}

export function ExcelImporter({ onImport, columns = [], className }: ExcelImporterProps) {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    if (!isValidExcelFile(file)) {
      showToast('ملف Excel غير صالح', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const result = await readExcelFile(file);
      if (result.success && result.data.length > 0) {
        onImport(result.data);
        showToast(`تم استيراد ${result.rowCount} صف`, 'success');
      } else {
        showToast('الملف فارغ', 'warning');
      }
    } catch {
      showToast('خطأ في قراءة الملف', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [onImport]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [processFile]);

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