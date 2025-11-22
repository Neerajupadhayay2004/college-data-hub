import { Subject, Teacher, ScheduleEntry, TimeSlot, DAYS, TIME_SLOTS } from '@/types/schedule';

interface GenerateScheduleParams {
  subjects: Subject[];
  teachers: Teacher[];
  year: number;
  section: string;
}

export function generateSchedule({ subjects, teachers, year, section }: GenerateScheduleParams): ScheduleEntry[] {
  const schedule: ScheduleEntry[] = [];
  const teacherSchedule = new Map<string, Set<string>>();
  const sectionSchedule = new Set<string>();

  // Initialize teacher schedules
  teachers.forEach(teacher => {
    teacherSchedule.set(teacher.id, new Set());
  });

  // Filter subjects for this year and section
  const filteredSubjects = subjects.filter(s => s.year === year && s.section === section);

  // Distribute subjects across the week
  const totalSlots = DAYS.length * TIME_SLOTS.length;
  const slotsNeeded = filteredSubjects.reduce((sum, subject) => sum + subject.hoursPerWeek, 0);

  if (slotsNeeded > totalSlots) {
    throw new Error('Not enough time slots for all subjects');
  }

  // Shuffle and allocate subjects
  const shuffledSubjects = [...filteredSubjects];
  let slotIndex = 0;

  for (const subject of shuffledSubjects) {
    let hoursAllocated = 0;

    while (hoursAllocated < subject.hoursPerWeek && slotIndex < totalSlots) {
      const dayIndex = Math.floor(slotIndex / TIME_SLOTS.length);
      const periodIndex = slotIndex % TIME_SLOTS.length;
      
      const day = DAYS[dayIndex];
      const timeSlot: TimeSlot = {
        day,
        ...TIME_SLOTS[periodIndex]
      };

      const slotKey = `${day}-${timeSlot.period}-${year}-${section}`;
      const teacherSlotKey = `${day}-${timeSlot.period}-${subject.teacherId}`;

      // Check if slot is available for section and teacher
      if (!sectionSchedule.has(slotKey) && 
          (!subject.teacherId || !teacherSchedule.get(subject.teacherId)?.has(teacherSlotKey))) {
        
        const entry: ScheduleEntry = {
          id: `${subject.id}-${day}-${timeSlot.period}`,
          subjectId: subject.id,
          teacherId: subject.teacherId || '',
          year,
          section,
          timeSlot
        };

        schedule.push(entry);
        sectionSchedule.add(slotKey);
        
        if (subject.teacherId) {
          teacherSchedule.get(subject.teacherId)?.add(teacherSlotKey);
        }

        hoursAllocated++;
      }

      slotIndex++;
    }
  }

  return schedule;
}

export function detectConflicts(schedules: ScheduleEntry[]): string[] {
  const conflicts: string[] = [];
  const teacherSlots = new Map<string, ScheduleEntry[]>();
  const sectionSlots = new Map<string, ScheduleEntry[]>();

  schedules.forEach(entry => {
    const teacherKey = `${entry.teacherId}-${entry.timeSlot.day}-${entry.timeSlot.period}`;
    const sectionKey = `${entry.year}-${entry.section}-${entry.timeSlot.day}-${entry.timeSlot.period}`;

    if (!teacherSlots.has(teacherKey)) {
      teacherSlots.set(teacherKey, []);
    }
    teacherSlots.get(teacherKey)!.push(entry);

    if (!sectionSlots.has(sectionKey)) {
      sectionSlots.set(sectionKey, []);
    }
    sectionSlots.get(sectionKey)!.push(entry);
  });

  // Check for teacher conflicts
  teacherSlots.forEach((entries, key) => {
    if (entries.length > 1) {
      conflicts.push(`Teacher conflict: ${key}`);
    }
  });

  // Check for section conflicts
  sectionSlots.forEach((entries, key) => {
    if (entries.length > 1) {
      conflicts.push(`Section conflict: ${key}`);
    }
  });

  return conflicts;
}
