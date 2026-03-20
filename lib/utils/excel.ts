import * as XLSX from 'xlsx';
import { ExcelImportResult } from '@/lib/types';

export async function parseExcelFile(file: File): Promise<ExcelImportResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json<Record<string, string>>(firstSheet, { defval: '' });
    return {
      success: true,
      data: json,
      errors: [],
      rowCount: json.length,
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      errors: [error instanceof Error ? error.message : 'تعذر قراءة ملف Excel'],
      rowCount: 0,
    };
  }
}
