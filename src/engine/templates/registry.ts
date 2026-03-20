import type { Course, DepartmentType, EmailTemplateConfig } from '@/core/types';
import { generateHospitalityEmail, generateProtocolEmail, generateSecurityEmail, generateMedicalEmail, generateSupportEmail, generateTrainersEmail } from './weekly';

export function generateEmail(
  department: DepartmentType,
  courses: Course[],
  config: EmailTemplateConfig = {},
  attachments: string[] = [],
  additionalNotes = ''
) {
  switch (department) {
    case 'hospitality':
      return generateHospitalityEmail(courses, config, attachments, additionalNotes);
    case 'protocol':
      return generateProtocolEmail(courses, config, attachments, additionalNotes);
    case 'security':
      return generateSecurityEmail(courses, config, attachments, additionalNotes);
    case 'medical':
      return generateMedicalEmail(courses, config, attachments, additionalNotes);
    case 'support':
      return generateSupportEmail(courses, config, attachments, additionalNotes);
    case 'trainers':
      return generateTrainersEmail(courses, config, attachments, additionalNotes);
    default:
      return '';
  }
}
