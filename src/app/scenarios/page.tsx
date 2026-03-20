'use client';

import { useMemo, useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import PageHeader from '@/components/layout/PageHeader';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Tabs, { TabsList, TabTrigger, TabContent } from '@/components/ui/Tabs';
import Button from '@/components/ui/Button';
import CopyButton from '@/components/ui/CopyButton';
import Badge from '@/components/ui/Badge';
import EmailPreview from '@/components/email/EmailPreview';
import ScenarioGrid from '@/components/scenarios/ScenarioGrid';
import ScenarioForm from '@/components/forms/ScenarioForm';
import { allScenarios, getScenariosByCategory } from '@/engine/templates/scenarios';
import { SCENARIO_CATEGORIES } from '@/core/config';
import type { Scenario, ScenarioCategory } from '@/core/types';
import { generateScenarioEmail } from '@/engine/generators/scenarioGenerator';

export default function ScenariosPage() {
  const [category, setCategory] = useState<ScenarioCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Scenario | null>(null);
  const [values, setValues] = useState<Record<string, string | number | boolean>>({});
  const [attachments, setAttachments] = useState<string[]>([]);
  const [attachmentInput, setAttachmentInput] = useState('');

  const scenarios = useMemo(() => {
    const source = category === 'all' ? allScenarios : getScenariosByCategory(category);
    return source.filter((scenario) => scenario.title.includes(search) || scenario.description.includes(search) || (scenario.tags || []).some((tag) => tag.includes(search)));
  }, [category, search]);

  const html = selected ? generateScenarioEmail(selected, values, attachments) : '';

  return (
    <AppShell>
      <div className="container-app py-8">
        <PageHeader title="مكتبة السيناريوهات" subtitle="اختر نوع المراسلة، املأ الحقول الأساسية، ثم انسخ الصياغة النهائية مباشرة." breadcrumbs={[{ label: 'الرئيسية', href: '/' }, { label: 'مكتبة السيناريوهات' }]} />
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full max-w-md"><Input placeholder="ابحث في السيناريوهات..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <div className="flex flex-wrap gap-2">
            <Button variant={category === 'all' ? 'primary' : 'ghost'} onClick={() => setCategory('all')}>الكل</Button>
            {SCENARIO_CATEGORIES.map((item) => <Button key={item.value} variant={category === item.value ? 'primary' : 'ghost'} onClick={() => setCategory(item.value)}>{item.icon} {item.label}</Button>)}
          </div>
        </div>
        <ScenarioGrid scenarios={scenarios} onSelect={setSelected} />
      </div>

      {selected && (
        <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected.title} subtitle={selected.description} size="2xl">
          <Tabs defaultValue="form">
            <TabsList>
              <TabTrigger value="form">النموذج</TabTrigger>
              <TabTrigger value="preview">المعاينة</TabTrigger>
            </TabsList>
            <TabContent value="form">
              <ScenarioForm scenario={selected} values={values} onChange={setValues} />
              <div className="mt-6 rounded-2xl border border-slate-200 p-4">
                <label className="mb-2 block text-sm font-medium">المرفقات (اختياري)</label>
                <div className="flex gap-2">
                  <Input value={attachmentInput} onChange={(e) => setAttachmentInput(e.target.value)} placeholder="اسم المرفق" />
                  <Button variant="secondary" onClick={() => { if (attachmentInput.trim()) { setAttachments([...attachments, attachmentInput.trim()]); setAttachmentInput(''); } }}>إضافة</Button>
                </div>
                {attachments.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{attachments.map((attachment, index) => <Badge key={`${attachment}-${index}`}>{attachment}</Badge>)}</div>}
              </div>
            </TabContent>
            <TabContent value="preview">
              <div className="mb-4 flex justify-end"><CopyButton text={html} /></div>
              <EmailPreview html={html} />
            </TabContent>
          </Tabs>
        </Modal>
      )}
    </AppShell>
  );
}
