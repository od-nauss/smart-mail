'use client';

import { useEffect, useState } from 'react';
import type { Course, Participant, BreakSchedule } from '@/core/types';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Tabs, { TabsList, TabTrigger, TabContent } from '@/components/ui/Tabs';
import DynamicTable from './DynamicTable';
import { generateId } from '@/lib/utils';

const participantColumns = [
  { key: 'name', label: 'الاسم' },
  { key: 'phone', label: 'الجوال' },
  { key: 'sector', label: 'القطاع / الجهة' }
];

const breakColumns = [
  { key: 'day', label: 'اليوم' },
  { key: 'morning', label: 'الفترة الصباحية' },
  { key: 'evening', label: 'الفترة المسائية' }
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialValue?: Course | null;
}

export default function CourseForm({ isOpen, onClose, onSubmit, initialValue }: Props) {
  const [title, setTitle] = useState('');
  const [scheduleType, setScheduleType] = useState<'صباحي' | 'مسائي'>('صباحي');
  const [participantCount, setParticipantCount] = useState(0);
  const [duration, setDuration] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [trainerName, setTrainerName] = useState('');
  const [supervisorName, setSupervisorName] = useState('');
  const [sector, setSector] = useState('');
  const [notes, setNotes] = useState('');
  const [attachmentType, setAttachmentType] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [breakSchedule, setBreakSchedule] = useState<BreakSchedule[]>([]);

  useEffect(() => {
    if (initialValue) {
      setTitle(initialValue.title);
      setScheduleType(initialValue.scheduleType);
      setParticipantCount(initialValue.participantCount);
      setDuration(initialValue.duration);
      setStartDate(initialValue.startDate);
      setEndDate(initialValue.endDate);
      setLocation(initialValue.location);
      setTrainerName(initialValue.trainerName);
      setSupervisorName(initialValue.supervisorName);
      setSector(initialValue.sector);
      setNotes(initialValue.notes);
      setAttachmentType(initialValue.attachmentType);
      setParticipants(initialValue.participants);
      setBreakSchedule(initialValue.breakSchedule);
    }
  }, [initialValue]);

  const handleSubmit = () => {
    onSubmit({
      title,
      scheduleType,
      participantCount,
      duration,
      startDate,
      endDate,
      location,
      trainerName,
      supervisorName,
      sector,
      notes,
      attachmentType,
      participants: participants.map((p) => ({ ...p, id: p.id || generateId('participant') })),
      breakSchedule: breakSchedule.map((b) => ({ ...b, id: b.id || generateId('break') })),
      status: 'planned'
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialValue ? 'تعديل دورة' : 'إضافة دورة'} subtitle="أدخل بيانات الدورة والمشاركين والاستراحات عند الحاجة" size="2xl">
      <Tabs defaultValue="basic">
        <TabsList>
          <TabTrigger value="basic">البيانات الأساسية</TabTrigger>
          <TabTrigger value="participants">المشاركون</TabTrigger>
          <TabTrigger value="schedule">الاستراحات</TabTrigger>
        </TabsList>

        <TabContent value="basic">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="عنوان الدورة" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Select label="نوع الفترة" value={scheduleType} onChange={(e) => setScheduleType(e.target.value as 'صباحي' | 'مسائي')} options={[{ label: 'صباحي', value: 'صباحي' }, { label: 'مسائي', value: 'مسائي' }]} />
            <Input label="عدد المشاركين" type="number" value={participantCount} onChange={(e) => setParticipantCount(Number(e.target.value))} />
            <Input label="مدة البرنامج" value={duration} onChange={(e) => setDuration(e.target.value)} />
            <Input label="تاريخ البداية" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <Input label="تاريخ النهاية" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <Input label="الموقع" value={location} onChange={(e) => setLocation(e.target.value)} />
            <Input label="اسم المدرب" value={trainerName} onChange={(e) => setTrainerName(e.target.value)} />
            <Input label="اسم المشرف" value={supervisorName} onChange={(e) => setSupervisorName(e.target.value)} />
            <Input label="القطاع / الجهة" value={sector} onChange={(e) => setSector(e.target.value)} />
            <Input label="نوع المرفق" value={attachmentType} onChange={(e) => setAttachmentType(e.target.value)} />
            <div className="md:col-span-2"><Textarea label="ملاحظات" value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
          </div>
        </TabContent>

        <TabContent value="participants">
          <DynamicTable columns={participantColumns} value={participants as never[]} onChange={(rows) => setParticipants(rows as unknown as Participant[])} title="قائمة المشاركين" description="يمكنك إضافة الأسماء والجوالات والقطاعات" addButtonText="إضافة مشارك" />
        </TabContent>

        <TabContent value="schedule">
          <DynamicTable columns={breakColumns} value={breakSchedule as never[]} onChange={(rows) => setBreakSchedule(rows as unknown as BreakSchedule[])} title="جدول الاستراحات" description="اختياري ويستخدم عند الحاجة داخل الرسائل" addButtonText="إضافة استراحة" />
        </TabContent>
      </Tabs>

      <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5">
        <Button variant="ghost" onClick={onClose}>إلغاء</Button>
        <Button onClick={handleSubmit}>{initialValue ? 'حفظ التعديلات' : 'إضافة الدورة'}</Button>
      </div>
    </Modal>
  );
}
