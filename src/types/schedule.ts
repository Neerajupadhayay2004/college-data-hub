export interface Teacher {
  id: string;
  name: string;
  email: string;
  subjects: string[];
  maxHoursPerWeek: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  hoursPerWeek: number;
  year: number;
  section: string;
  teacherId?: string;
}

export interface TimeSlot {
  day: string;
  period: number;
  startTime: string;
  endTime: string;
}

export interface ScheduleEntry {
  id: string;
  subjectId: string;
  teacherId: string;
  year: number;
  section: string;
  timeSlot: TimeSlot;
}

export interface College {
  id: string;
  name: string;
  departments: string[];
}

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const PERIODS_PER_DAY = 8;
export const YEARS = [1, 2, 3, 4];

export const TIME_SLOTS: Omit<TimeSlot, 'day'>[] = [
  { period: 1, startTime: '08:00', endTime: '09:00' },
  { period: 2, startTime: '09:00', endTime: '10:00' },
  { period: 3, startTime: '10:00', endTime: '11:00' },
  { period: 4, startTime: '11:00', endTime: '12:00' },
  { period: 5, startTime: '12:00', endTime: '13:00' },
  { period: 6, startTime: '13:00', endTime: '14:00' },
  { period: 7, startTime: '14:00', endTime: '15:00' },
  { period: 8, startTime: '15:00', endTime: '16:00' },
];
