import type { Course } from './course';

export type DepartmentType =
  | 'hospitality'
  | 'protocol'
  | 'security'
  | 'medical'
  | 'support'
  | 'trainers';

export interface EmailTemplateConfig {
  includeBreakSchedule?: boolean;
  includeParticipantList?: boolean;
  includeVipHospitality?: boolean;
  includeFinalConfirmationNote?: boolean;
  vipCount?: number;
  specialInstructions?: string;
  securityLevel?: 'عادي' | 'مُعزز' | 'خاص';
}

export interface EmailOutput {
  subject: string;
  to?: string;
  cc?: string;
  body: string;
  signature?: string;
}

export interface DepartmentConfig {
  id: DepartmentType;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface DraftPayload {
  department: DepartmentType;
  courses: Course[];
  config: EmailTemplateConfig;
  attachments: string[];
  additionalNotes: string;
}
