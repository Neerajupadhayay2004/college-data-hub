import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScheduleEntry, Subject, Teacher, DAYS, TIME_SLOTS } from '@/types/schedule';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';
import { downloadTimetable } from '@/lib/exportTimetable';
import { toast } from 'sonner';

interface TimetableViewProps {
  schedule: ScheduleEntry[];
  subjects: Subject[];
  teachers: Teacher[];
  year: number;
  section: string;
}

export function TimetableView({ schedule, subjects, teachers, year, section }: TimetableViewProps) {
  const getSubjectName = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId)?.name || 'Unknown';
  };

  const getTeacherName = (teacherId: string) => {
    return teachers.find(t => t.id === teacherId)?.name || 'TBA';
  };

  const getEntryForSlot = (day: string, period: number) => {
    return schedule.find(
      entry => entry.timeSlot.day === day && entry.timeSlot.period === period
    );
  };

  const handleDownload = () => {
    downloadTimetable(schedule, subjects, teachers, year, section);
    toast.success('Timetable downloaded successfully!');
  };

  return (
    <Card className="glass-card p-6 overflow-x-auto">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold glow-text mb-2">
            Year {year} - Section {section}
          </h2>
          <p className="text-muted-foreground">Generated Timetable</p>
        </div>
        <Button onClick={handleDownload} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download CSV
        </Button>
      </div>

      <div className="min-w-[800px]">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-border bg-card p-3 text-left">Time</th>
              {DAYS.map(day => (
                <th key={day} className="border border-border bg-card p-3 text-center">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map(slot => (
              <tr key={slot.period} className="hover:bg-muted/50 transition-colors">
                <td className="border border-border p-3">
                  <div className="text-sm font-medium">{slot.startTime} - {slot.endTime}</div>
                  <div className="text-xs text-muted-foreground">Period {slot.period}</div>
                </td>
                {DAYS.map(day => {
                  const entry = getEntryForSlot(day, slot.period);
                  return (
                    <td key={day} className="border border-border p-2">
                      {entry ? (
                        <div className="space-y-1 animate-scale-in">
                          <Badge className="w-full justify-center bg-primary text-primary-foreground">
                            {getSubjectName(entry.subjectId)}
                          </Badge>
                          <div className="text-xs text-center text-muted-foreground">
                            {getTeacherName(entry.teacherId)}
                          </div>
                          {entry.room && (
                            <div className="text-xs text-center text-primary font-medium">
                              📍 {entry.room}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground text-xs">-</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
