import type { Course } from '@/core/types';
import { STORAGE_KEYS } from '@/core/config';
import { getStorageItem, setStorageItem } from './localStorage';

export function getCourses(): Course[] {
  return getStorageItem<Course[]>(STORAGE_KEYS.courses, []);
}

export function saveCourses(courses: Course[]) {
  setStorageItem(STORAGE_KEYS.courses, courses);
}

export function clearAllCourses() {
  setStorageItem(STORAGE_KEYS.courses, []);
}
