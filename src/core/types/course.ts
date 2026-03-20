import type { ID } from './common';

export type ScheduleType = 'صباحي' | 'مسائي';
export type CourseStatus = 'planned' | 'confirmed' | 'draft';

export interface Participant {
  id: ID;
  name: string;
  phone: string;
  sector: string;
}

export interface BreakSchedule {
  id: ID;
  day: string;
  morning: string;
  evening: string;
}

export interface Course {
  id: ID;
  title: string;
  scheduleType: ScheduleType;
  participantCount: number;
  duration: string;
  startDate: string;
  endDate: string;
  location: string;
  trainerName: string;
  supervisorName: string;
  sector: string;
  participants: Participant[];
  breakSchedule: BreakSchedule[];
  notes: string;
  attachmentType: string;
  status: CourseStatus;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyDataMeta {
  weekNumber: number;
  year: number;
}

export interface WeeklyData {
  meta: WeeklyDataMeta;
  courses: Course[];
}

export interface WeeklyDataStats {
  totalCourses: number;
  totalParticipants: number;
  uniqueTrainers: string[];
  uniqueLocations: string[];
  uniqueSectors: string[];
}
