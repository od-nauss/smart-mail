import { MessageTemplate } from '../types';
import { weeklyTemplates } from './weekly';
import { operationalTemplates } from './operational';
import { leadershipTemplates } from './leadership';
import { generalTemplates } from './general';

export const allTemplates: MessageTemplate[] = [
  ...weeklyTemplates,
  ...operationalTemplates,
  ...leadershipTemplates,
  ...generalTemplates,
];

export function getTemplateById(id: string): MessageTemplate | undefined {
  return allTemplates.find((template) => template.id === id);
}

export function getTemplatesByGroup(group: string): MessageTemplate[] {
  return allTemplates.filter((template) => template.group === group);
}

export {
  weeklyTemplates,
  operationalTemplates,
  leadershipTemplates,
  generalTemplates,
};
