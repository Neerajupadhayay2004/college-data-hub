import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Teacher, Subject, ScheduleEntry, DAYS, TIME_SLOTS } from '@/types/schedule';
import { Plus, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';

interface ManualTimetableEditorProps {
  teachers: Teacher[];
  subjects: Subject[];
  schedule: ScheduleEntry[];
  year: number;
  section: string;
  onScheduleUpdate: (schedule: ScheduleEntry[]) => void;
}

export const ManualTimetableEditor = ({
  teachers,
  subjects,
  schedule,
  year,
  section,
  onScheduleUpdate
}: ManualTimetableEditorProps) => {
  const [selectedDay, setSelectedDay] = useState(DAYS[0]);
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [room, setRoom] = useState('');

  const filteredSubjects = subjects.filter(s => s.year === year && s.section === section);

  const addManualEntry = () => {
    if (!selectedSubject || !selectedTeacher) {
      toast.error('Please select subject and teacher');
      return;
    }

    const timeSlot = TIME_SLOTS.find(t => t.period === selectedPeriod);
    if (!timeSlot) return;

    const existingEntry = schedule.find(
      e => e.timeSlot.day === selectedDay && 
           e.timeSlot.period === selectedPeriod &&
           e.year === year &&
           e.section === section
    );

    if (existingEntry) {
      toast.warning('Slot already occupied', {
        description: 'This time slot is already taken'
      });
      return;
    }

    const newEntry: ScheduleEntry = {
      id: `manual-${Date.now()}`,
      subjectId: selectedSubject,
      teacherId: selectedTeacher,
      year,
      section,
      room: room || undefined,
      timeSlot: {
        day: selectedDay,
        period: selectedPeriod,
        startTime: timeSlot.startTime,
        endTime: timeSlot.endTime
      }
    };

    onScheduleUpdate([...schedule, newEntry]);
    toast.success('Class added successfully!');
    setRoom('');
  };

  const removeEntry = (entryId: string) => {
    onScheduleUpdate(schedule.filter(e => e.id !== entryId));
    toast.info('Class removed');
  };

  const currentSlotEntries = schedule.filter(
    e => e.timeSlot.day === selectedDay && 
         e.timeSlot.period === selectedPeriod &&
         e.year === year &&
         e.section === section
  );

  return (
    <Card className="glass-card p-4 md:p-6">
      <div className="flex items-center gap-2 mb-6">
        <Plus className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-bold">Manual Timetable Editor</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <Label className="text-sm mb-2">Day</Label>
          <Select value={selectedDay} onValueChange={setSelectedDay}>
            <SelectTrigger className="bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DAYS.map(day => (
                <SelectItem key={day} value={day}>{day}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm mb-2">Period</Label>
          <Select value={selectedPeriod.toString()} onValueChange={(v) => setSelectedPeriod(parseInt(v))}>
            <SelectTrigger className="bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIME_SLOTS.map(slot => (
                <SelectItem key={slot.period} value={slot.period.toString()}>
                  Period {slot.period} ({slot.startTime}-{slot.endTime})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm mb-2">Subject</Label>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="bg-card">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {filteredSubjects.map(subject => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.code} - {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm mb-2">Teacher</Label>
          <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
            <SelectTrigger className="bg-card">
              <SelectValue placeholder="Select teacher" />
            </SelectTrigger>
            <SelectContent>
              {teachers.map(teacher => (
                <SelectItem key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm mb-2">Room (Optional)</Label>
          <Input
            placeholder="e.g., Room 101"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="bg-card"
          />
        </div>

        <div className="flex items-end">
          <Button onClick={addManualEntry} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Class
          </Button>
        </div>
      </div>

      {currentSlotEntries.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold mb-3 text-muted-foreground">
            Current entries for {selectedDay}, Period {selectedPeriod}:
          </h4>
          <div className="space-y-2">
            {currentSlotEntries.map(entry => {
              const subject = subjects.find(s => s.id === entry.subjectId);
              const teacher = teachers.find(t => t.id === entry.teacherId);
              return (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{subject?.code} - {subject?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {teacher?.name} {entry.room && `• ${entry.room}`}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEntry(entry.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
};
