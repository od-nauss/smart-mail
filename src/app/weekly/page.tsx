'use client';

import { useMemo, useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import EmptyState from '@/components/ui/EmptyState';
import StatsCard from '@/components/layout/StatsCard';
import CourseForm from '@/components/forms/CourseForm';
import ExcelImporter from '@/components/data/ExcelImporter';
import { useWeeklyContext } from '@/contexts/WeeklyContext';
import type { Course } from '@/core/types';

export default function WeeklyPage() {
  const { state, addCourse, deleteCourse, importCourses, selectAllCourses, deselectAllCourses } = useWeeklyContext();
  const [open, setOpen] = useState(false);

  const rows = useMemo(() => state.courses.map((course, index) => [
    index + 1,
    course.title,
    course.scheduleType,
    course.participantCount,
    course.duration,
    `${course.startDate} - ${course.endDate}`,
    course.location
  ]), [state.courses]);

  return (
    <AppShell>
      <div className="container-app py-8">
        <PageHeader title="البيانات الأسبوعية" subtitle="أدخل بيانات الدورات مرة واحدة ثم ولّد البريد الأسبوعي للجهات المختلفة." breadcrumbs={[{ label: 'الرئيسية', href: '/' }, { label: 'البيانات الأسبوعية' }]} />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard label="عدد الدورات" value={state.stats.totalCourses} />
          <StatsCard label="إجمالي المشاركين" value={state.stats.totalParticipants} />
          <StatsCard label="المدربون" value={state.stats.uniqueTrainers.length} />
          <StatsCard label="المواقع" value={state.stats.uniqueLocations.length} />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-bold">قائمة الدورات</h3>
                  <p className="text-sm text-slate-500">تظهر هنا جميع الدورات المدخلة للأسبوع الحالي.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="ghost" onClick={selectAllCourses}>تحديد الكل</Button>
                  <Button variant="ghost" onClick={deselectAllCourses}>إلغاء التحديد</Button>
                  <Button onClick={() => setOpen(true)}>إضافة دورة</Button>
                </div>
              </div>
              <div className="mt-5">
                {state.courses.length ? <Table columns={['م', 'عنوان الدورة', 'نوع الفترة', 'عدد المشاركين', 'المدة', 'التاريخ', 'الموقع']} rows={rows} /> : <EmptyState title="لا توجد دورات بعد" description="ابدأ بإضافة دورة جديدة أو استيراد ملف Excel." />}
              </div>
            </Card>

            {state.courses.length > 0 && (
              <Card>
                <h3 className="text-lg font-bold">إجراءات سريعة</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {state.courses.slice(0, 4).map((course) => (
                    <div key={course.id} className="rounded-2xl border border-slate-200 p-4">
                      <p className="font-bold text-slate-900">{course.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{course.location} • {course.participantCount} مشارك</p>
                      <div className="mt-3"><Button variant="ghost" onClick={() => deleteCourse(course.id)}>حذف</Button></div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <ExcelImporter onImport={importCourses} />
            <Card>
              <h3 className="text-lg font-bold">توصية تشغيلية</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                بعد اكتمال إدخال البيانات، انتقل إلى صفحة البريد الأسبوعي لتوليد نسخ مخصصة للضيافة والأمن والعيادة والخدمات المساندة والمدربين.
              </p>
            </Card>
          </div>
        </div>

        <CourseForm isOpen={open} onClose={() => setOpen(false)} onSubmit={addCourse as (data: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => void} />
      </div>
    </AppShell>
  );
}
