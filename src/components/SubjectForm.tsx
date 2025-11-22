import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Subject, Teacher, YEARS } from '@/types/schedule';

interface SubjectFormProps {
  onAdd: (subject: Subject) => void;
  teachers: Teacher[];
}

export function SubjectForm({ onAdd, teachers }: SubjectFormProps) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [hours, setHours] = useState(4);
  const [year, setYear] = useState(1);
  const [section, setSection] = useState('A');
  const [teacherId, setTeacherId] = useState('');
  const [room, setRoom] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const subject: Subject = {
      id: crypto.randomUUID(),
      name,
      code,
      hoursPerWeek: hours,
      year,
      section,
      teacherId: teacherId || undefined,
      room: room || undefined
    };

    onAdd(subject);
    setName('');
    setCode('');
    setHours(4);
    setRoom('');
  };

  return (
    <Card className="glass-card p-6 hover-lift">
      <h3 className="text-2xl font-bold mb-6 glow-text">Add Subject</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="subjectName" className="text-foreground">Subject Name</Label>
          <Input
            id="subjectName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Data Structures & Algorithms"
            required
            className="bg-card border-border"
          />
        </div>

        <div>
          <Label htmlFor="code" className="text-foreground">Subject Code</Label>
          <Input
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="CS201"
            required
            className="bg-card border-border"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="year" className="text-foreground">Year</Label>
            <Select value={year.toString()} onValueChange={(v) => setYear(parseInt(v))}>
              <SelectTrigger className="bg-card border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map(y => (
                  <SelectItem key={y} value={y.toString()}>Year {y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="section" className="text-foreground">Section</Label>
            <Select value={section} onValueChange={setSection}>
              <SelectTrigger className="bg-card border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['A', 'B', 'C', 'D'].map(s => (
                  <SelectItem key={s} value={s}>Section {s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="hours" className="text-foreground">Hours Per Week</Label>
          <Input
            id="hours"
            type="number"
            value={hours}
            onChange={(e) => setHours(parseInt(e.target.value))}
            min={1}
            max={10}
            className="bg-card border-border"
          />
        </div>

        <div>
          <Label htmlFor="teacher" className="text-foreground">Assign Teacher</Label>
          <Select value={teacherId} onValueChange={setTeacherId}>
            <SelectTrigger className="bg-card border-border">
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
          <Label htmlFor="room" className="text-foreground">Room (Optional)</Label>
          <Input
            id="room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="e.g., Room 101, Lab A"
            className="bg-card border-border"
          />
        </div>

        <Button type="submit" className="w-full">
          Add Subject
        </Button>
      </form>
    </Card>
  );
}
