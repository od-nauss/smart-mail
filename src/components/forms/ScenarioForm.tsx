'use client';

import { useEffect } from 'react';
import type { Scenario, ScenarioField } from '@/core/types';
import { getFieldDefaultValue } from '@/core/types';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Checkbox from '@/components/ui/Checkbox';

export default function ScenarioForm({ scenario, values, onChange, errors = {} }: { scenario: Scenario; values: Record<string, string | number | boolean>; onChange: (values: Record<string, string | number | boolean>) => void; errors?: Record<string, string>; }) {
  useEffect(() => {
    const defaults: Record<string, string | number | boolean> = {};
    scenario.fields.forEach((field) => {
      defaults[field.id] = values[field.id] ?? getFieldDefaultValue(field);
    });
    onChange(defaults);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario.id]);

  const update = (fieldId: string, value: string | number | boolean) => onChange({ ...values, [fieldId]: value });

  const renderField = (field: ScenarioField) => {
    switch (field.type) {
      case 'textarea':
        return <Textarea label={field.label} value={String(values[field.id] ?? '')} onChange={(e) => update(field.id, e.target.value)} error={errors[field.id]} />;
      case 'select':
        return <Select label={field.label} value={String(values[field.id] ?? '')} onChange={(e) => update(field.id, e.target.value)} options={field.options || []} error={errors[field.id]} />;
      case 'checkbox':
        return <Checkbox label={field.label} checked={Boolean(values[field.id])} onChange={(e) => update(field.id, e.target.checked)} />;
      default:
        return <Input label={field.label} type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'} value={String(values[field.id] ?? '')} onChange={(e) => update(field.id, field.type === 'number' ? Number(e.target.value) : e.target.value)} error={errors[field.id]} placeholder={field.placeholder} />;
    }
  };

  return <div className="grid gap-4 md:grid-cols-2">{scenario.fields.map((field) => <div key={field.id} className={field.type === 'textarea' || field.type === 'checkbox' ? 'md:col-span-2' : ''}>{renderField(field)}</div>)}</div>;
}
