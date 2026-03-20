'use client';

import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import type { Course, WeeklyDataStats } from '@/core/types';
import { getCourses, saveCourses, clearAllCourses as storageClearAll } from '@/services/storage/courseStorage';
import { useToast } from '@/contexts/ToastContext';
import { generateId } from '@/lib/utils';

interface WeeklyState {
  courses: Course[];
  selectedCourseIds: string[];
  stats: WeeklyDataStats;
  isLoading: boolean;
}

type Action =
  | { type: 'SET_COURSES'; payload: Course[] }
  | { type: 'ADD_COURSE'; payload: Course }
  | { type: 'UPDATE_COURSE'; payload: Course }
  | { type: 'DELETE_COURSE'; payload: string }
  | { type: 'SET_SELECTED'; payload: string[] }
  | { type: 'CLEAR_ALL' };

const emptyStats: WeeklyDataStats = {
  totalCourses: 0,
  totalParticipants: 0,
  uniqueTrainers: [],
  uniqueLocations: [],
  uniqueSectors: []
};

const initialState: WeeklyState = {
  courses: [],
  selectedCourseIds: [],
  stats: emptyStats,
  isLoading: true,
};

function stats(courses: Course[]): WeeklyDataStats {
  return {
    totalCourses: courses.length,
    totalParticipants: courses.reduce((sum, c) => sum + c.participantCount, 0),
    uniqueTrainers: [...new Set(courses.map((c) => c.trainerName).filter(Boolean))],
    uniqueLocations: [...new Set(courses.map((c) => c.location).filter(Boolean))],
    uniqueSectors: [...new Set(courses.map((c) => c.sector).filter(Boolean))]
  };
}

function reducer(state: WeeklyState, action: Action): WeeklyState {
  switch (action.type) {
    case 'SET_COURSES':
      return { ...state, courses: action.payload, stats: stats(action.payload), isLoading: false };
    case 'ADD_COURSE': {
      const courses = [...state.courses, action.payload];
      return { ...state, courses, stats: stats(courses) };
    }
    case 'UPDATE_COURSE': {
      const courses = state.courses.map((c) => (c.id === action.payload.id ? action.payload : c));
      return { ...state, courses, stats: stats(courses) };
    }
    case 'DELETE_COURSE': {
      const courses = state.courses.filter((c) => c.id !== action.payload);
      return { ...state, courses, selectedCourseIds: state.selectedCourseIds.filter((id) => id !== action.payload), stats: stats(courses) };
    }
    case 'SET_SELECTED':
      return { ...state, selectedCourseIds: action.payload };
    case 'CLEAR_ALL':
      return { ...state, courses: [], selectedCourseIds: [], stats: emptyStats };
    default:
      return state;
  }
}

interface WeeklyContextValue {
  state: WeeklyState;
  addCourse: (input: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCourse: (id: string, input: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  importCourses: (courses: Course[]) => void;
  clearAllCourses: () => void;
  selectCourse: (id: string) => void;
  deselectCourse: (id: string) => void;
  selectAllCourses: () => void;
  deselectAllCourses: () => void;
  getSelectedCourses: () => Course[];
}

const WeeklyContext = createContext<WeeklyContextValue | null>(null);

export function WeeklyProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const toast = useToast();

  useEffect(() => {
    dispatch({ type: 'SET_COURSES', payload: getCourses() });
  }, []);

  useEffect(() => {
    if (!state.isLoading) saveCourses(state.courses);
  }, [state.courses, state.isLoading]);

  const value = useMemo<WeeklyContextValue>(() => ({
    state,
    addCourse: (input) => {
      dispatch({
        type: 'ADD_COURSE',
        payload: {
          ...input,
          id: generateId('course'),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          participants: input.participants || [],
          breakSchedule: input.breakSchedule || [],
          notes: input.notes || '',
          attachmentType: input.attachmentType || '',
          status: input.status || 'planned'
        }
      });
      toast.success('تمت إضافة الدورة بنجاح');
    },
    updateCourse: (id, input) => {
      const current = state.courses.find((c) => c.id === id);
      if (!current) return;
      dispatch({ type: 'UPDATE_COURSE', payload: { ...current, ...input, updatedAt: new Date().toISOString() } });
      toast.success('تم تحديث الدورة بنجاح');
    },
    deleteCourse: (id) => {
      dispatch({ type: 'DELETE_COURSE', payload: id });
      toast.info('تم حذف الدورة');
    },
    importCourses: (courses) => {
      courses.forEach((course) => dispatch({ type: 'ADD_COURSE', payload: course }));
      toast.success(`تم استيراد ${courses.length} دورة`);
    },
    clearAllCourses: () => {
      storageClearAll();
      dispatch({ type: 'CLEAR_ALL' });
      toast.info('تم مسح جميع البيانات');
    },
    selectCourse: (id) => {
      if (!state.selectedCourseIds.includes(id)) {
        dispatch({ type: 'SET_SELECTED', payload: [...state.selectedCourseIds, id] });
      }
    },
    deselectCourse: (id) => dispatch({ type: 'SET_SELECTED', payload: state.selectedCourseIds.filter((i) => i !== id) }),
    selectAllCourses: () => dispatch({ type: 'SET_SELECTED', payload: state.courses.map((c) => c.id) }),
    deselectAllCourses: () => dispatch({ type: 'SET_SELECTED', payload: [] }),
    getSelectedCourses: () => state.courses.filter((c) => state.selectedCourseIds.includes(c.id))
  }), [state, toast]);

  return <WeeklyContext.Provider value={value}>{children}</WeeklyContext.Provider>;
}

export function useWeeklyContext() {
  const context = useContext(WeeklyContext);
  if (!context) throw new Error('useWeeklyContext must be used within WeeklyProvider');
  return context;
}
