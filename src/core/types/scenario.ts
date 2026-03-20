import type { Option } from './common';

export type ScenarioCategory = 'weekly' | 'operational' | 'approval' | 'coordination';
export type FieldType = 'text' | 'textarea' | 'number' | 'date' | 'time' | 'checkbox' | 'select' | 'email' | 'phone' | 'url' | 'currency';

export interface FieldConditional {
  dependsOn: string;
  value: string | number | boolean;
  operator?: 'equals' | 'notEquals' | 'contains' | 'gt' | 'lt';
}

export interface FieldValidation {
  min?: number;
  max?: number;
  message?: string;
}

export interface ScenarioField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  helperText?: string;
  options?: Option[];
  group?: string;
  conditional?: FieldConditional;
  validation?: FieldValidation;
}

export interface Scenario {
  id: string;
  category: ScenarioCategory;
  title: string;
  description: string;
  icon: string;
  color: string;
  fields: ScenarioField[];
  subjectTemplate: string;
  templateKey: string;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export function getFieldDefaultValue(field: ScenarioField): string | number | boolean {
  if (field.type === 'checkbox') return false;
  if (field.type === 'number') return 0;
  return '';
}
