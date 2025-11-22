import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Teacher } from '@/types/schedule';
import { Plus, X } from 'lucide-react';

interface TeacherFormProps {
  onAdd: (teacher: Teacher) => void;
}

export function TeacherForm({ onAdd }: TeacherFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subjects, setSubjects] = useState<string[]>(['']);
  const [maxHours, setMaxHours] = useState(24);

  const handleAddSubject = () => {
    setSubjects([...subjects, '']);
  };

  const handleRemoveSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const handleSubjectChange = (index: number, value: string) => {
    const newSubjects = [...subjects];
    newSubjects[index] = value;
    setSubjects(newSubjects);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const teacher: Teacher = {
      id: crypto.randomUUID(),
      name,
      email,
      subjects: subjects.filter(s => s.trim() !== ''),
      maxHoursPerWeek: maxHours
    };

    onAdd(teacher);
    setName('');
    setEmail('');
    setSubjects(['']);
    setMaxHours(24);
  };

  return (
    <Card className="glass-card p-6 hover-lift">
      <h3 className="text-2xl font-bold mb-6 glow-text">Add Teacher</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-foreground">Teacher Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Dr. Rajesh Kumar"
            required
            className="bg-card border-border"
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-foreground">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="rajesh.kumar@college.edu"
            required
            className="bg-card border-border"
          />
        </div>

        <div>
          <Label className="text-foreground mb-2 block">Subjects</Label>
          {subjects.map((subject, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input
                value={subject}
                onChange={(e) => handleSubjectChange(index, e.target.value)}
                placeholder="Data Structures"
                className="bg-card border-border"
              />
              {subjects.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveSubject(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddSubject}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Subject
          </Button>
        </div>

        <div>
          <Label htmlFor="maxHours" className="text-foreground">Max Hours Per Week</Label>
          <Input
            id="maxHours"
            type="number"
            value={maxHours}
            onChange={(e) => setMaxHours(parseInt(e.target.value))}
            min={1}
            max={48}
            className="bg-card border-border"
          />
        </div>

        <Button type="submit" className="w-full">
          Add Teacher
        </Button>
      </form>
    </Card>
  );
}
