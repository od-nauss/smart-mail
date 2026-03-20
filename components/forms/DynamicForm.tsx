'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FormField } from './FormField';
import { FormData, MessageTemplate } from '@/lib/types';

interface Props {
  template: MessageTemplate;
  onSubmit: (data: FormData) => void;
}

export function DynamicForm({ template, onSubmit }: Props) {
  const initialValues = useMemo(() => {
    const values: FormData = {};
    template.fields.forEach((field) => {
      values[field.id] = field.type === 'table' ? [] : field.defaultValue || '';
    });
    return values;
  }, [template.fields]);

  const [values, setValues] = useState<FormData>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setFieldValue = (fieldId: string, value: string | Record<string, string>[]) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
    setErrors((prev) => ({ ...prev, [fieldId]: '' }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    template.fields.forEach((field) => {
      const value = values[field.id];
      if (!field.required) return;

      if (field.type === 'table') {
        if (!Array.isArray(value) || value.length === 0) {
          nextErrors[field.id] = 'هذا الحقل مطلوب';
        }
      } else if (!String(value || '').trim()) {
        nextErrors[field.id] = 'هذا الحقل مطلوب';
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    onSubmit(values);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {template.fields.map((field) => (
          <div key={field.id} className={field.type === 'textarea' || field.type === 'table' ? 'md:col-span-2' : ''}>
            <FormField
              field={field}
              value={values[field.id] as string | Record<string, string>[]}
              error={errors[field.id]}
              onChange={(value) => setFieldValue(field.id, value)}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="submit" size="lg">
          توليد الرسالة
        </Button>
      </div>
    </form>
  );
}
