import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TeacherForm } from '@/components/TeacherForm';
import { SubjectForm } from '@/components/SubjectForm';
import { TimetableView } from '@/components/TimetableView';
import { DataList } from '@/components/DataList';
import { Teacher, Subject, ScheduleEntry, YEARS } from '@/types/schedule';
import { generateSchedule, detectConflicts } from '@/lib/scheduleGenerator';
import { toast } from 'sonner';
import { Sparkles, Calendar, Database, Wand2 } from 'lucide-react';

const Index = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: '1',
      name: 'Dr. Rajesh Kumar',
      email: 'rajesh.kumar@college.edu',
      subjects: ['Data Structures', 'Algorithms', 'Computer Networks'],
      maxHoursPerWeek: 24
    },
    {
      id: '2',
      name: 'Prof. Priya Sharma',
      email: 'priya.sharma@college.edu',
      subjects: ['Database Management', 'Software Engineering', 'Web Development'],
      maxHoursPerWeek: 20
    },
    {
      id: '3',
      name: 'Dr. Amit Patel',
      email: 'amit.patel@college.edu',
      subjects: ['Operating Systems', 'Computer Architecture', 'System Programming'],
      maxHoursPerWeek: 22
    },
    {
      id: '4',
      name: 'Prof. Sneha Reddy',
      email: 'sneha.reddy@college.edu',
      subjects: ['Mathematics', 'Discrete Mathematics', 'Statistics'],
      maxHoursPerWeek: 24
    },
    {
      id: '5',
      name: 'Dr. Vikram Singh',
      email: 'vikram.singh@college.edu',
      subjects: ['Machine Learning', 'Artificial Intelligence', 'Data Science'],
      maxHoursPerWeek: 20
    }
  ]);
  
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 's1', name: 'Data Structures & Algorithms', code: 'CS201', hoursPerWeek: 5, year: 2, section: 'A', teacherId: '1' },
    { id: 's2', name: 'Database Management Systems', code: 'CS202', hoursPerWeek: 4, year: 2, section: 'A', teacherId: '2' },
    { id: 's3', name: 'Operating Systems', code: 'CS203', hoursPerWeek: 4, year: 2, section: 'A', teacherId: '3' },
    { id: 's4', name: 'Discrete Mathematics', code: 'MA201', hoursPerWeek: 4, year: 2, section: 'A', teacherId: '4' },
    { id: 's5', name: 'Computer Networks', code: 'CS204', hoursPerWeek: 4, year: 2, section: 'A', teacherId: '1' },
    { id: 's6', name: 'Software Engineering', code: 'CS205', hoursPerWeek: 3, year: 2, section: 'A', teacherId: '2' },
  ]);
  
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [selectedYear, setSelectedYear] = useState(2);
  const [selectedSection, setSelectedSection] = useState('A');
  const [activeTab, setActiveTab] = useState<'manage' | 'generate'>('manage');

  const handleAddTeacher = (teacher: Teacher) => {
    setTeachers([...teachers, teacher]);
    toast.success(`Teacher ${teacher.name} added successfully!`);
  };

  const handleAddSubject = (subject: Subject) => {
    setSubjects([...subjects, subject]);
    toast.success(`Subject ${subject.name} added successfully!`);
  };

  const handleDeleteTeacher = (id: string) => {
    setTeachers(teachers.filter(t => t.id !== id));
    toast.info('Teacher removed');
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
    toast.info('Subject removed');
  };

  const handleGenerateSchedule = () => {
    try {
      const newSchedule = generateSchedule({
        subjects,
        teachers,
        year: selectedYear,
        section: selectedSection
      });

      const conflicts = detectConflicts(newSchedule);
      
      if (conflicts.length > 0) {
        toast.warning('Schedule generated with conflicts', {
          description: `${conflicts.length} conflicts detected`
        });
      } else {
        toast.success('Perfect schedule generated!', {
          description: 'No conflicts detected'
        });
      }

      setSchedule(newSchedule);
      setActiveTab('generate');
    } catch (error) {
      toast.error('Failed to generate schedule', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Hero Section */}
      <motion.div 
        className="max-w-7xl mx-auto mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-3xl -z-10 animate-glow" />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="h-16 w-16 mx-auto mb-4 text-primary" />
          </motion.div>
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-4 glow-text"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            AI Class Scheduler Pro
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Advanced timetable generator with AI-powered optimization for colleges
          </motion.p>
        </div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-card p-2 mb-6 max-w-md mx-auto">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={activeTab === 'manage' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('manage')}
                className="w-full"
              >
                <Database className="h-4 w-4 mr-2" />
                Manage Data
              </Button>
              <Button
                variant={activeTab === 'generate' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('generate')}
                className="w-full"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Generate
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        {activeTab === 'manage' ? (
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Data Management Forms */}
            <motion.div 
              className="grid md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <TeacherForm onAdd={handleAddTeacher} />
              <SubjectForm onAdd={handleAddSubject} teachers={teachers} />
            </motion.div>

            {/* Data Lists */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <DataList
                teachers={teachers}
                subjects={subjects}
                onDeleteTeacher={handleDeleteTeacher}
                onDeleteSubject={handleDeleteSubject}
              />
            </motion.div>

            {/* Generate Button */}
            {subjects.length > 0 && teachers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="glass-card p-6 text-center hover-lift">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Wand2 className="h-12 w-12 mx-auto mb-4 text-primary" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4">Ready to Generate</h3>
                  <div className="flex gap-4 max-w-md mx-auto mb-6">
                    <div className="flex-1">
                      <label className="block text-sm mb-2 text-muted-foreground">Year</label>
                      <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
                        <SelectTrigger className="bg-card">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {YEARS.map(y => (
                            <SelectItem key={y} value={y.toString()}>Year {y}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm mb-2 text-muted-foreground">Section</label>
                      <Select value={selectedSection} onValueChange={setSelectedSection}>
                        <SelectTrigger className="bg-card">
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
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" onClick={handleGenerateSchedule} className="min-w-64">
                      <Sparkles className="h-5 w-5 mr-2" />
                      Generate AI Timetable
                    </Button>
                  </motion.div>
                </Card>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            {schedule.length > 0 ? (
              <TimetableView
                schedule={schedule}
                subjects={subjects}
                teachers={teachers}
                year={selectedYear}
                section={selectedSection}
              />
            ) : (
              <Card className="glass-card p-12 text-center">
                <Calendar className="h-24 w-24 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-2xl font-bold mb-2">No Timetable Generated</h3>
                <p className="text-muted-foreground mb-6">
                  Add teachers and subjects, then generate a timetable
                </p>
                <Button onClick={() => setActiveTab('manage')}>
                  Go to Manage Data
                </Button>
              </Card>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Index;
