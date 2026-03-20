'use client';

import { FormField as FormFieldType } from '@/lib/types';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { TableInput } from './TableInput';

interface Props {
  field: FormFieldType;
  value: string | Record<string, string>[];
  error?: string;
  onChange: (value: string | Record<string, string>[]) => void;
}

export function FormField({ field, value, error, onChange }: Props) {
  switch (field.type) {
    case 'textarea':
      return (
        <Textarea
          id={field.id}
          label={field.label}
          placeholder={field.placeholder}
          value={typeof value === 'string' ? value : ''}
          onChange={onChange as (value: string) => void}
          error={error}
          required={field.required}
        />
      );

    case 'select':
      return (
        <Select
          id={field.id}
          label={field.label}
          options={field.options || []}
          value={typeof value === 'string' ? value : ''}
          onChange={onChange as (value: string) => void}
          error={error}
          required={field.required}
        />
      );

    case 'table':
      return (
        <TableInput
          id={field.id}
          label={field.label}
          columns={field.columns || []}
          value={Array.isArray(value) ? value : []}
          onChange={onChange as (value: Record<string, string>[]) => void}
          error={error}
          required={field.required}
        />
      );

    default:
      return (
        <Input
          id={field.id}
          label={field.label}
          type={field.type}
          placeholder={field.placeholder}
          value={typeof value === 'string' ? value : ''}
          onChange={onChange as (value: string) => void}
          error={error}
          required={field.required}
        />
      );
  }
}