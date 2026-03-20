'use client';

import { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import type { Course } from '@/core/types';
import { generateId } from '@/lib/utils';
import { useToast } from '@/contexts/ToastContext';

export default function ExcelImporter({ onImport }: { onImport: (courses: Course[]) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewCount, setPreviewCount] = useState<number | null>(null);
  const toast = useToast();

  const readFile = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<Record<string, string | number>>(worksheet, { defval: '' });

    const courses: Course[] = rows.map((row) => ({
      id: generateId('course'),
      title: String(row['عنوان الدورة'] || row['courseName'] || row['title'] || ''),
      scheduleType: String(row['نوع الفترة'] || row['scheduleType'] || 'صباحي') as 'صباحي' | 'مسائي',
      participantCount: Number(row['عدد المشاركين'] || row['participantCount'] || 0),
      duration: String(row['مدة البرنامج'] || row['duration'] || ''),
      startDate: String(row['تاريخ البداية'] || row['startDate'] || ''),
      endDate: String(row['تاريخ النهاية'] || row['endDate'] || row['startDate'] || ''),
      location: String(row['الموقع'] || row['location'] || ''),
      trainerName: String(row['المدرب'] || row['trainerName'] || ''),
      supervisorName: String(row['المشرف'] || row['supervisorName'] || ''),
      sector: String(row['القطاع'] || row['sector'] || ''),
      notes: '',
      attachmentType: '',
      participants: [],
      breakSchedule: [],
      status: 'planned',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    setPreviewCount(courses.length);
    onImport(courses);
    toast.success(`تم استيراد ${courses.length} دورة من الملف`);
  };

  return (
    <Card>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold">استيراد من Excel</h3>
          <p className="mt-1 text-sm text-slate-500">يمكنك استيراد عناوين الدورات وعدد المشاركين والمواقع من ملف Excel.</p>
          {previewCount !== null && <p className="mt-2 text-sm text-primary-700">آخر استيراد: {previewCount} دورة</p>}
        </div>
        <div>
          <input ref={inputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) readFile(file); }} />
          <Button onClick={() => inputRef.current?.click()}>اختر الملف</Button>
        </div>
      </div>
    </Card>
  );
}
