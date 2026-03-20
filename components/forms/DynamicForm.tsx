'use client';

import { useState, useCallback, useEffect } from 'react';
import { MessageTemplate, FormField as FormFieldType, FormData } from '@/lib/types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { TableInput } from './TableInput';
import { ExcelImporter } from './ExcelImporter';
import { FormField } from './FormField';
import { cn } from '@/lib/utils';

interface DynamicFormProps {
  template: MessageTemplate;
  onSubmit: (data: FormData) => void;
  initialData?: FormData;
  className?: string;
}

const validateField = (field: FormFieldType, value: unknown): string | null => {
  if (
    field.required &&
    (value === undefined ||
      value === null ||
      value === '' ||
      (Array.isArray(value) && value.length === 0))
  ) {
    return 'مطلوب';
  }

  return null;
};

function isTableRows(value: unknown): value is Record<string, string>[] {
  if (!Array.isArray(value)) return false;
  if (value.length === 0) return true;
  return typeof value[0] === 'object' && value[0] !== null && !Array.isArray(value[0]);
}

export function DynamicForm({
  template,
  onSubmit,
  initialData,
  className,
}: DynamicFormProps) {
  const [formData, setFormData] = useState<FormData>(initialData || {});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      const defaultData: FormData = {};
      template.fields.forEach((field) => {
        defaultData[field.id] = field.defaultValue || (field.type === 'table' ? [] : '');
      });
      setFormData(defaultData);
    }
  }, [template, initialData]);

  const updateField = useCallback(
    (fieldId: string, value: string | Record<string, string>[]) => {
      setFormData((prev) => ({ ...prev, [fieldId]: value }));

      if (errors[fieldId]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[fieldId];
          return next;
        });
      }
    },
    [errors]
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    template.fields.forEach((field) => {
      const error = validateField(field, formData[field.id]);
      if (error) newErrors[field.id] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [template, formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExcelImport = useCallback(
    (fieldId: string, data: Record<string, string>[]) => {
      updateField(fieldId, data);
    },
    [updateField]
  );

  const renderField = (field: FormFieldType) => {
    const value = formData[field.id];
    const error = errors[field.id];

    switch (field.type) {
      case 'text':
      case 'date':
      case 'time':
      case 'number':
      case 'tel':
      case 'email':
        return (
          <FormField key={field.id} label={field.label} required={field.required} error={error}>
            <Input
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              value={typeof value === 'string' ? value : ''}
              onChange={(v) => updateField(field.id, v)}
              error={error}
              required={field.required}
            />
          </FormField>
        );

      case 'textarea':
        return (
          <FormField key={field.id} label={field.label} required={field.required} error={error}>
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              value={typeof value === 'string' ? value : ''}
              onChange={(v) => updateField(field.id, v)}
              error={error}
              required={field.required}
              rows={3}
            />
          </FormField>
        );

      case 'select':
        return (
          <FormField key={field.id} label={field.label} required={field.required} error={error}>
            <Select
              id={field.id}
              options={field.options || []}
              value={typeof value === 'string' ? value : ''}
              onChange={(v) => updateField(field.id, v)}
              error={error}
              required={field.required}
              placeholder={field.placeholder}
            />
          </FormField>
        );

      case 'table': {
        const tableData: Record<string, string>[] = isTableRows(value) ? value : [];

        return (
          <div key={field.id} className="space-y-2">
            <FormField label={field.label} required={field.required} error={error}>
              <TableInput
                id={field.id}
                columns={field.columns || []}
                value={tableData}
                onChange={(v) => updateField(field.id, v)}
                error={error}
              />
            </FormField>

            <ExcelImporter
              columns={field.columns || []}
              onImport={(data) => handleExcelImport(field.id, data)}
            />
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4', className)}>
      {template.fields.map(renderField)}

      <div className="pt-3">
        <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isSubmitting}>
          توليد الرسالة
        </Button>
      </div>
    </form>
  );
}