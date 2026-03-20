'use client';

import { useMemo, useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import EmptyState from '@/components/ui/EmptyState';
import CopyButton from '@/components/ui/CopyButton';
import EmailPreview from '@/components/email/EmailPreview';
import { useWeeklyContext } from '@/contexts/WeeklyContext';
import { departmentList } from '@/core/config';
import type { DepartmentType, EmailTemplateConfig } from '@/core/types';
import { generateEmail } from '@/engine/templates/registry';

export default function WeeklyEmailsPage() {
  const { state, getSelectedCourses } = useWeeklyContext();
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentType>('hospitality');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [attachmentInput, setAttachmentInput] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [config, setConfig] = useState<EmailTemplateConfig>({
    includeBreakSchedule: true,
    includeParticipantList: true,
    includeFinalConfirmationNote: false,
    includeVipHospitality: true,
    vipCount: 15,
    securityLevel: 'عادي'
  });

  const courses = useMemo(() => {
    const selected = getSelectedCourses();
    return selected.length ? selected : state.courses;
  }, [getSelectedCourses, state.courses]);

  const html = useMemo(() => generateEmail(selectedDepartment, courses, config, attachments, additionalNotes), [selectedDepartment, courses, config, attachments, additionalNotes]);

  return (
    <AppShell>
      <div className="container-app py-8">
        <PageHeader title="توليد البريد الأسبوعي" subtitle="اختر الجهة المستهدفة ثم اضبط الإعدادات والمرفقات والملاحظات قبل النسخ." breadcrumbs={[{ label: 'الرئيسية', href: '/' }, { label: 'البريد الأسبوعي' }]} />

        {!state.courses.length ? (
          <EmptyState title="لا توجد بيانات أسبوعية" description="أدخل بيانات الدورات أولًا من صفحة البيانات الأسبوعية." />
        ) : (
          <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
            <div className="space-y-6">
              <Card>
                <h3 className="text-lg font-bold">الجهة المستهدفة</h3>
                <div className="mt-4 grid gap-3">
                  {departmentList.map((department) => (
                    <button key={department.id} onClick={() => setSelectedDepartment(department.id)} className={`flex items-center gap-3 rounded-2xl border p-4 text-right transition ${selectedDepartment === department.id ? 'border-primary-300 bg-primary-50' : 'border-slate-200 bg-white hover:border-primary-200'}`}>
                      <div className={`grid h-12 w-12 place-items-center rounded-2xl text-2xl ${department.color}`}>{department.icon}</div>
                      <div>
                        <p className="font-bold text-slate-900">{department.title}</p>
                        <p className="text-xs text-slate-500">{department.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-bold">إعدادات سريعة</h3>
                <div className="mt-4 space-y-3">
                  <Checkbox label="إظهار جدول الاستراحات" checked={!!config.includeBreakSchedule} onChange={(e) => setConfig({ ...config, includeBreakSchedule: e.target.checked })} />
                  <Checkbox label="الإشارة إلى قائمة أسماء المشاركين" checked={!!config.includeParticipantList} onChange={(e) => setConfig({ ...config, includeParticipantList: e.target.checked })} />
                  <Checkbox label="إظهار ملاحظة التأكيد النهائي" checked={!!config.includeFinalConfirmationNote} onChange={(e) => setConfig({ ...config, includeFinalConfirmationNote: e.target.checked })} />
                  <Checkbox label="إظهار ضيافة VIP" checked={!!config.includeVipHospitality} onChange={(e) => setConfig({ ...config, includeVipHospitality: e.target.checked })} />
                  {selectedDepartment === 'security' && <Input label="مستوى التأمين" value={config.securityLevel || ''} onChange={(e) => setConfig({ ...config, securityLevel: e.target.value as 'عادي' | 'مُعزز' | 'خاص' })} />}
                  {selectedDepartment === 'hospitality' && <Input label="عدد ضيوف VIP" type="number" value={config.vipCount || 0} onChange={(e) => setConfig({ ...config, vipCount: Number(e.target.value) })} />}
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-bold">المرفقات والملاحظات</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex gap-2">
                    <Input placeholder="اسم المرفق" value={attachmentInput} onChange={(e) => setAttachmentInput(e.target.value)} />
                    <Button variant="secondary" onClick={() => { if (attachmentInput.trim()) { setAttachments([...attachments, attachmentInput.trim()]); setAttachmentInput(''); } }}>إضافة</Button>
                  </div>
                  {attachments.length > 0 && <div className="flex flex-wrap gap-2">{attachments.map((attachment, index) => <span key={`${attachment}-${index}`} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs">{attachment}</span>)}</div>}
                  <Textarea label="ملاحظات إضافية" value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} />
                </div>
              </Card>
            </div>

            <Card className="overflow-hidden p-4 sm:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold">المعاينة النهائية</h3>
                  <p className="text-sm text-slate-500">المخرجات متجاوبة ويمكن نسخها مباشرة.</p>
                </div>
                <CopyButton text={html} />
              </div>
              <EmailPreview html={html} />
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}
