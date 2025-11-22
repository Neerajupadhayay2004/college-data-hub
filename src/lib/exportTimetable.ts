import { ScheduleEntry, Subject, Teacher, DAYS, TIME_SLOTS } from '@/types/schedule';

export function exportTimetableAsCSV(
  schedule: ScheduleEntry[],
  subjects: Subject[],
  teachers: Teacher[],
  year: number,
  section: string
): string {
  const getSubjectName = (subjectId: string) => 
    subjects.find(s => s.id === subjectId)?.name || 'Unknown';
  
  const getTeacherName = (teacherId: string) => 
    teachers.find(t => t.id === teacherId)?.name || 'TBA';

  let csv = `Year ${year} - Section ${section} Timetable\n\n`;
  csv += 'Time,' + DAYS.join(',') + '\n';

  TIME_SLOTS.forEach(slot => {
    const row = [`${slot.startTime}-${slot.endTime}`];
    
    DAYS.forEach(day => {
      const entry = schedule.find(
        e => e.timeSlot.day === day && e.timeSlot.period === slot.period
      );
      
      if (entry) {
        row.push(`${getSubjectName(entry.subjectId)} (${getTeacherName(entry.teacherId)})`);
      } else {
        row.push('-');
      }
    });
    
    csv += row.join(',') + '\n';
  });

  return csv;
}

export function downloadTimetable(
  schedule: ScheduleEntry[],
  subjects: Subject[],
  teachers: Teacher[],
  year: number,
  section: string
) {
  const csv = exportTimetableAsCSV(schedule, subjects, teachers, year, section);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `timetable_year${year}_section${section}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
