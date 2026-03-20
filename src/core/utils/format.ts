'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Scenario, ScenarioField, getFieldDefaultValue } from '@/core/types';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Checkbox from '@/components/ui/Checkbox';

export interface ScenarioFormProps {
  scenario: Scenario;
  values: Record<string, string | number | boolean>;
  onChange: (values: Record<string, string | number | boolean>) => void;
  errors?: Record<string, string>;
}

export default function ScenarioForm({
  scenario,
  values,
  onChange,
  errors = {},
}: ScenarioFormProps) {
  useEffect(() => {
    const defaultValues: Record<string, string | number | boolean> = {};

    scenario.fields.forEach((field) => {
      defaultValues[field.id] = values[field.id] ?? getFieldDefaultValue(field);
    });

    onChange(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario.id]);

  const updateField = (fieldId: string, value: string | number | boolean) => {
    onChange({ ...values, [fieldId]: value });
  };

  const shouldShowField = (field: ScenarioField): boolean => {
    if (!field.conditional) return true;

    const {
      dependsOn,
      value: expectedValue,
      operator = 'equals',
    } = field.conditional;

    const dependentValue = values[dependsOn];

    switch (operator) {
      case 'equals':
        return dependentValue === expectedValue;
      case 'notEquals':
        return dependentValue !== expectedValue;
      case 'contains':
        return String(dependentValue ?? '').includes(String(expectedValue ?? ''));
      case 'gt':
        return Number(dependentValue) > Number(expectedValue);
      case 'lt':
        return Number(dependentValue) < Number(expectedValue);
      default:
        return true;
    }
  };

  const groupedFields = scenario.fields.reduce(
    (acc, field) => {
      const group = field.group || 'default';
      if (!acc[group]) acc[group] = [];
      acc[group].push(field);
      return acc;
    },
    {} as Record<string, ScenarioField[]>
  );

  const renderField = (field: ScenarioField) => {
    if (!shouldShowField(field)) return null;

    const fieldError = errors[field.id];
    const fieldValue = values[field.id];

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'date':
      case 'time':
      case 'url':
      case 'currency':
        return (
          <Input
            label={field.label}
            type={
              field.type === 'email'
                ? 'email'
                : field.type === 'date'
                ? 'date'
                : field.type === 'time'
                ? 'time'
                : field.type === 'phone'
                ? 'tel'
                : field.type === 'url'
                ? 'url'
                : 'text'
            }
            required={field.required}
            value={String(fieldValue ?? '')}
            onChange={(e) => updateField(field.id, e.target.value)}
            placeholder={field.placeholder}
            error={fieldError}
            hint={field.helperText}
          />
        );

      case 'number':
        return (
          <Input
            label={field.label}
            type="number"
            required={field.required}
            value={fieldValue !== undefined ? String(fieldValue) : ''}
            onChange={(e) =>
              updateField(field.id, e.target.value === '' ? 0 : Number(e.target.value))
            }
            placeholder={field.placeholder}
            error={fieldError}
            hint={field.helperText}
          />
        );

      case 'textarea':
        return (
          <Textarea
            label={field.label}
            required={field.required}
            value={String(fieldValue ?? '')}
            onChange={(e) => updateField(field.id, e.target.value)}
            placeholder={field.placeholder}
            error={fieldError}
            hint={field.helperText}
            rows={3}
          />
        );

      case 'select':
        return (
          <Select
            label={field.label}
            required={field.required}
            options={field.options || []}
            value={String(fieldValue ?? '')}
            onChange={(e) => updateField(field.id, e.target.value)}
            error={fieldError}
            hint={field.helperText}
          />
        );

      case 'checkbox':
        return (
          <Checkbox
            label={field.label}
            checked={Boolean(fieldValue)}
            onChange={(e) => updateField(field.id, e.target.checked)}
            description={field.helperText}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedFields).map(([groupName, fields]) => (
        <div key={groupName}>
          {groupName !== 'default' && (
            <h4 className="mb-3 font-semibold text-gray-900">{groupName}</h4>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {fields.map((field) => (
              <div
                key={field.id}
                className={cn(
                  field.type === 'textarea' && 'md:col-span-2',
                  field.type === 'checkbox' && 'md:col-span-2'
                )}
              >
                {renderField(field)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}