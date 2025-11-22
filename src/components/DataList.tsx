import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Teacher, Subject } from '@/types/schedule';
import { Trash2, Users, BookOpen } from 'lucide-react';

interface DataListProps {
  teachers: Teacher[];
  subjects: Subject[];
  onDeleteTeacher: (id: string) => void;
  onDeleteSubject: (id: string) => void;
}

export function DataList({ teachers, subjects, onDeleteTeacher, onDeleteSubject }: DataListProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Teachers List */}
      <Card className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-6 w-6 text-primary" />
          <h3 className="text-2xl font-bold glow-text">Teachers</h3>
          <Badge variant="secondary" className="ml-auto">{teachers.length}</Badge>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {teachers.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No teachers added yet</p>
          ) : (
            teachers.map(teacher => (
              <div
                key={teacher.id}
                className="p-4 bg-card rounded-lg border border-border hover:border-primary transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-foreground">{teacher.name}</h4>
                    <p className="text-sm text-muted-foreground">{teacher.email}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onDeleteTeacher(teacher.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {teacher.subjects.map((subject, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {subject}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Max: {teacher.maxHoursPerWeek}h/week
                </p>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Subjects List */}
      <Card className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-6 w-6 text-secondary" />
          <h3 className="text-2xl font-bold glow-text">Subjects</h3>
          <Badge variant="secondary" className="ml-auto">{subjects.length}</Badge>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {subjects.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No subjects added yet</p>
          ) : (
            subjects.map(subject => (
              <div
                key={subject.id}
                className="p-4 bg-card rounded-lg border border-border hover:border-secondary transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-foreground">{subject.name}</h4>
                    <p className="text-sm text-muted-foreground">{subject.code}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onDeleteSubject(subject.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary">Year {subject.year}</Badge>
                  <Badge variant="outline">Section {subject.section}</Badge>
                  <Badge>{subject.hoursPerWeek}h/week</Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
