
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parseISO } from 'date-fns';
import { PlusCircle, Trash2, Megaphone, Pencil, Search, FileText, Loader2, Calendar as CalendarIcon, CalendarClock, User, X, BarChart, Users, KeyRound } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { students as initialStudents, type Student, type ClassTimeTable, defaultTimetable, type Teacher } from '@/lib/mock-data';
import { useAnnouncements } from '@/context/announcements-context';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { getDefaulterReport } from '@/lib/actions';
import type { DefaulterReportOutput } from '@/ai/flows/defaulter-report-flow';
import { useCollegeData, type CalendarEventWithId } from '@/context/college-data-context';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from './ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DepartmentAnalytics } from './department-analytics';

const studentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits.'),
  rollNumber: z.string().min(1, 'Roll number is required.'),
  university_number: z.string().min(1, 'University number is required.'),
  department: z.string().min(1, 'Please select a department.'),
  year: z.string().min(1, 'Please select a year.'),
  photoUrl: z.string().optional(),
  dob: z.date({ required_error: 'Date of birth is required.' }),
  gender: z.enum(['Male', 'Female', 'Other'], { required_error: 'Please select a gender.' }),
  currentSemester: z.string().min(1, 'Semester is required.'),
  academicYear: z.string().min(1, 'Academic year is required.'),
  address: z.string().min(1, 'Address is required.'),
});

type StudentFormData = z.infer<typeof studentSchema>;

const eventSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  date: z.date({ required_error: 'An event date is required.' }),
  type: z.enum(['holiday', 'exam', 'assignment', 'event']),
  description: z.string().optional(),
});
type EventFormData = z.infer<typeof eventSchema>;

const teacherSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  id: z.string().min(2, 'Staff ID is required.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});
type TeacherFormData = z.infer<typeof teacherSchema>;

const changePasswordSchema = z.object({
  password: z.string().min(6, 'New password must be at least 6 characters.'),
});
type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const daysOfWeek = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'];

export function TeacherManagementPanel() {
  const { toast } = useToast();
  // Academic Structure State
  const [newDepartment, setNewDepartment] = useState('');
  const [newYear, setNewYear] = useState('');
  const [newHour, setNewHour] = useState('');
  
  // Student Management State
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isStudentFormDialogOpen, setIsStudentFormDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Announcements State
  const { announcements, addAnnouncement, deleteAnnouncement } = useAnnouncements();
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState('');
  const [newAnnouncementContent, setNewAnnouncementContent] = useState('');

  // Reports State
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportData, setReportData] = useState<DefaulterReportOutput | null>(null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  // College Data from Context
  const { 
    events, addEvent, updateEvent, deleteEvent, 
    timeTable, updateTimeTable,
    departments, addDepartment, deleteDepartment,
    years, addYear, deleteYear,
    hours, addHour, deleteHour,
    teachers, addTeacher, updateTeacherPassword, deleteTeacher
  } = useCollegeData();

  // Calendar State
  const [isEventFormDialogOpen, setIsEventFormDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEventWithId | null>(null);
  
  // Timetable State
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [editableTimetable, setEditableTimetable] = useState<ClassTimeTable | null>(null);

  // Staff Management State
  const [isAddTeacherDialogOpen, setIsAddTeacherDialogOpen] = useState(false);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  
  const studentForm = useForm<StudentFormData>({ resolver: zodResolver(studentSchema) });
  const eventForm = useForm<EventFormData>({ resolver: zodResolver(eventSchema) });
  const teacherForm = useForm<TeacherFormData>({ resolver: zodResolver(teacherSchema) });
  const changePasswordForm = useForm<ChangePasswordFormData>({ resolver: zodResolver(changePasswordSchema) });

  useEffect(() => {
    if (selectedDept && selectedYear) {
      setEditableTimetable(JSON.parse(JSON.stringify(timeTable[selectedDept]?.[selectedYear] || defaultTimetable)));
    } else {
      setEditableTimetable(null);
    }
  }, [selectedDept, selectedYear, timeTable]);

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.university_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onStudentSubmit = (data: StudentFormData) => {
    const newStudent: Student = {
      ...data,
      id: data.university_number,
      dob: format(data.dob, 'yyyy-MM-dd'),
    };
    setStudents(prev => [newStudent, ...prev]);
    toast({ title: 'Student Added', description: `Successfully added ${data.name}.` });
    studentForm.reset();
  };

  const handleEditStudentClick = (student: Student) => {
    setEditingStudent(student);
    studentForm.reset({
      name: student.name,
      email: student.email,
      phone: student.phone,
      rollNumber: student.rollNumber,
      university_number: student.university_number,
      department: student.department,
      year: student.year,
      photoUrl: student.photoUrl || '',
      dob: parseISO(student.dob),
      gender: student.gender,
      currentSemester: student.currentSemester,
      academicYear: student.academicYear,
      address: student.address,
    });
    setIsStudentFormDialogOpen(true);
  };
  
  const onEditStudentSubmit = (data: StudentFormData) => {
    if (!editingStudent) return;
    setStudents(prev => prev.map(s => s.id === editingStudent.id ? { ...s, ...data, id: data.university_number, dob: format(data.dob, 'yyyy-MM-dd') } : s));
    toast({ title: 'Student Updated', description: `Successfully updated ${data.name}.` });
    setIsStudentFormDialogOpen(false);
    setEditingStudent(null);
  };

  const handleDeleteStudent = (student: Student) => {
    setStudents(prev => prev.filter(s => s.id !== student.id));
    toast({ variant: 'destructive', title: 'Student Deleted', description: `${student.name} has been removed.` });
  };
  
  const handleAddDepartment = () => { if (newDepartment) { addDepartment(newDepartment); setNewDepartment(''); toast({ title: 'Department Added' }); } };
  const handleAddYear = () => { if (newYear) { addYear(newYear); setNewYear(''); toast({ title: 'Year Added' }); } };
  const handleAddHour = () => { if (newHour) { addHour(newHour); setNewHour(''); toast({ title: 'Hour Added' }); } };
  const handleAddAnnouncement = () => { if (newAnnouncementTitle && newAnnouncementContent) { addAnnouncement(newAnnouncementTitle, newAnnouncementContent); toast({ title: 'Announcement Added' }); setNewAnnouncementTitle(''); setNewAnnouncementContent(''); } };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    const result = await getDefaulterReport();
    if (result.success && result.data) { setReportData(result.data); setIsReportDialogOpen(true); } 
    else { toast({ variant: 'destructive', title: 'Report Failed', description: result.error }); }
    setIsGeneratingReport(false);
  };

  const onEventSubmit = (data: EventFormData) => {
    const eventData = { ...data, date: format(data.date, 'yyyy-MM-dd') };
    if (editingEvent) { updateEvent(editingEvent.id, eventData); toast({ title: 'Event Updated' }); } 
    else { addEvent(eventData); toast({ title: 'Event Added' }); }
    setIsEventFormDialogOpen(false); setEditingEvent(null);
  };

  const handleAddEventClick = () => { setEditingEvent(null); eventForm.reset({ title: '', date: undefined, type: 'event', description: '' }); setIsEventFormDialogOpen(true); };
  const handleEditEventClick = (event: CalendarEventWithId) => { setEditingEvent(event); eventForm.reset({ title: event.title, date: parseISO(event.date), type: event.type, description: event.description || '' }); setIsEventFormDialogOpen(true); };
  const handleDeleteEvent = (eventId: string) => { deleteEvent(eventId); toast({ variant: 'destructive', title: 'Event Deleted' }); };
  
  const handleTimetableChange = (day: string, hourIndex: number, value: string) => {
    if (!editableTimetable) return;
    const newTimetable = { ...editableTimetable };
    if (!newTimetable[day]) { newTimetable[day] = []; }
    const newDaySchedule = [...newTimetable[day]];
    newDaySchedule[hourIndex] = value;
    setEditableTimetable({ ...newTimetable, [day]: newDaySchedule });
  };

  const handleSaveTimetable = () => { if (selectedDept && selectedYear && editableTimetable) { updateTimeTable(selectedDept, selectedYear, editableTimetable); toast({ title: 'Timetable Saved', description: `Timetable for ${selectedDept} - ${selectedYear} has been updated.` }); } };
  
  const onAddTeacherSubmit = (data: TeacherFormData) => {
    addTeacher(data.name, data.id, data.password);
    toast({ title: 'Teacher Added', description: `Successfully added ${data.name}.` });
    setIsAddTeacherDialogOpen(false);
  };
  
  const onChangePasswordSubmit = (data: ChangePasswordFormData) => {
    if (editingTeacher) {
      updateTeacherPassword(editingTeacher.id, data.password);
      toast({ title: 'Password Updated', description: `Password for ${editingTeacher.name} has been changed.` });
      setIsChangePasswordDialogOpen(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Management Panel</CardTitle>
          <CardDescription>Manage students, academic structure, announcements, and reports.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="add-student" className="min-h-[600px]">
            <TabsList className="grid h-auto w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
              <TabsTrigger value="add-student">Add Student</TabsTrigger>
              <TabsTrigger value="manage-students">Manage Students</TabsTrigger>
              <TabsTrigger value="manage-staff">Manage Staff</TabsTrigger>
              <TabsTrigger value="academic-structure">Academic Structure</TabsTrigger>
              <TabsTrigger value="announcements">Announcements</TabsTrigger>
              <TabsTrigger value="academic-settings">Academic Settings</TabsTrigger>
              <TabsTrigger value="timetable">Timetable</TabsTrigger>
              <TabsTrigger value="reports"><FileText className="mr-2 h-4 w-4" />Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="add-student">
              <Form {...studentForm}>
                <form onSubmit={studentForm.handleSubmit(onStudentSubmit)} className="space-y-6 pt-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={studentForm.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Full Name</FormLabel> <FormControl><Input placeholder="Enter student's name" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={studentForm.control} name="email" render={({ field }) => ( <FormItem> <FormLabel>Email</FormLabel> <FormControl><Input placeholder="student@example.com" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={studentForm.control} name="phone" render={({ field }) => ( <FormItem> <FormLabel>Phone Number</FormLabel> <FormControl><Input placeholder="9876543210" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={studentForm.control} name="rollNumber" render={({ field }) => ( <FormItem> <FormLabel>Roll Number</FormLabel> <FormControl><Input placeholder="e.g., 3BCA-29" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={studentForm.control} name="university_number" render={({ field }) => ( <FormItem> <FormLabel>University Number</FormLabel> <FormControl><Input placeholder="e.g., 36623U09029" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={studentForm.control} name="department" render={({ field }) => ( <FormItem> <FormLabel>Department</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select a department" /></SelectTrigger></FormControl> <SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                    <FormField control={studentForm.control} name="year" render={({ field }) => ( <FormItem> <FormLabel>Year</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select a year" /></SelectTrigger></FormControl> <SelectContent>{years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                    <FormField control={studentForm.control} name="dob" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Date of Birth</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)}/>
                    <FormField control={studentForm.control} name="gender" render={({ field }) => ( <FormItem> <FormLabel>Gender</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select a gender" /></SelectTrigger></FormControl> <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                    <FormField control={studentForm.control} name="currentSemester" render={({ field }) => ( <FormItem> <FormLabel>Current Semester</FormLabel> <FormControl><Input placeholder="e.g., 6th" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={studentForm.control} name="academicYear" render={({ field }) => ( <FormItem> <FormLabel>Academic Year</FormLabel> <FormControl><Input placeholder="e.g., 2024-2025" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                  </div>
                   <FormField control={studentForm.control} name="address" render={({ field }) => ( <FormItem> <FormLabel>Address</FormLabel> <FormControl><Textarea placeholder="Enter student's full address" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                  <FormField control={studentForm.control} name="photoUrl" render={({ field }) => ( <FormItem> <FormLabel>Profile Photo</FormLabel> <div className="flex items-center gap-4"> <Avatar className="h-20 w-20 border"> <AvatarImage src={studentForm.watch('photoUrl')} alt="Student avatar" data-ai-hint="student portrait" className="object-cover"/> <AvatarFallback><User className="h-10 w-10" /></AvatarFallback> </Avatar> <div className="w-full"> <FormControl> <Input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => { studentForm.setValue('photoUrl', reader.result as string); }; reader.readAsDataURL(file); } }} className="flex-1" /> </FormControl> <p className="text-xs text-muted-foreground mt-2">Upload a picture for the student's profile.</p> </div> </div> <FormMessage /> </FormItem> )}/>
                  <Button type="submit" className="w-full"><PlusCircle /> Add Student</Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="manage-students">
              <div className="pt-4 space-y-4">
                <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search students..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-full"/></div>
                <div className="rounded-md border"><Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Roll No.</TableHead><TableHead>Department</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>{filteredStudents.length > 0 ? (filteredStudents.map((student) => (<TableRow key={student.id}><TableCell className="font-medium">{student.name}</TableCell><TableCell>{student.rollNumber}</TableCell><TableCell>{student.department}</TableCell><TableCell className="text-right space-x-2"><Button variant="ghost" size="icon" onClick={() => handleEditStudentClick(student)}><Pencil className="h-4 w-4" /><span className="sr-only">Edit</span></Button><AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /><span className="sr-only">Delete</span></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete the student record for {student.name}.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteStudent(student)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></TableCell></TableRow>))) : (<TableRow><TableCell colSpan={4} className="h-24 text-center">No results found.</TableCell></TableRow>)}</TableBody></Table></div>
              </div>
            </TabsContent>

            <TabsContent value="manage-staff">
              <div className="pt-4 space-y-4">
                <div className="flex justify-end">
                  <Button onClick={() => { teacherForm.reset(); setIsAddTeacherDialogOpen(true); }}>
                    <PlusCircle /> Add New Staff
                  </Button>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Staff ID</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {teachers.map((teacher) => (
                        <TableRow key={teacher.id}>
                          <TableCell className="font-medium">{teacher.name}</TableCell>
                          <TableCell>{teacher.id}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => { setEditingTeacher(teacher); changePasswordForm.reset(); setIsChangePasswordDialogOpen(true); }}>
                              <KeyRound className="h-4 w-4" /><span className="sr-only">Change Password</span>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /><span className="sr-only">Delete</span></Button></AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the staff account for {teacher.name}. They will lose all access.</AlertDialogDescription></AlertDialogHeader>
                                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteTeacher(teacher.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="academic-structure">
              <div className="grid md:grid-cols-3 gap-8 pt-4">
                <div className="space-y-4">
                    <Label>Existing Departments</Label>
                    <div className="flex flex-wrap gap-2">
                        {departments.map(dept => (
                        <div key={dept} className="flex items-center gap-1.5 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                            <span>{dept}</span>
                            <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <button className="flex items-center justify-center h-4 w-4 rounded-full bg-secondary-foreground/20 text-secondary-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"><X className="h-3 w-3" /></button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>Deleting "{dept}" will remove it from the list of available departments.</AlertDialogDescription></AlertDialogHeader>
                                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteDepartment(dept)}>Delete</AlertDialogAction></AlertDialogFooter>
                            </AlertDialogContent>
                            </AlertDialog>
                        </div>
                        ))}
                    </div>
                    <div className="space-y-2"><Label htmlFor="new-department">Add New Department</Label><div className="flex gap-2"><Input id="new-department" value={newDepartment} onChange={e => setNewDepartment(e.target.value)} placeholder="e.g., B.Tech"/><Button onClick={handleAddDepartment}><PlusCircle /> Add</Button></div></div>
                </div>
                <div className="space-y-4">
                    <Label>Existing Years</Label>
                    <div className="flex flex-wrap gap-2">
                        {years.map(year => (
                           <div key={year} className="flex items-center gap-1.5 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                           <span>{year}</span>
                           <AlertDialog>
                           <AlertDialogTrigger asChild>
                                <button className="flex items-center justify-center h-4 w-4 rounded-full bg-secondary-foreground/20 text-secondary-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"><X className="h-3 w-3" /></button>
                           </AlertDialogTrigger>
                           <AlertDialogContent>
                               <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>Deleting "{year}" will remove it from the list of available years.</AlertDialogDescription></AlertDialogHeader>
                               <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteYear(year)}>Delete</AlertDialogAction></AlertDialogFooter>
                           </AlertDialogContent>
                           </AlertDialog>
                       </div>
                        ))}
                    </div>
                    <div className="space-y-2"><Label htmlFor="new-year">Add New Year</Label><div className="flex gap-2"><Input id="new-year" value={newYear} onChange={e => setNewYear(e.target.value)} placeholder="e.g., 4th Year"/><Button onClick={handleAddYear}><PlusCircle /> Add</Button></div></div>
                </div>
                <div className="space-y-4">
                    <Label>Class Hours</Label>
                    <div className="flex flex-wrap gap-2">
                        {hours.map(hour => (
                            <div key={hour} className="flex items-center gap-1.5 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                            <span>{hour}</span>
                            <AlertDialog>
                            <AlertDialogTrigger asChild>
                                 <button className="flex items-center justify-center h-4 w-4 rounded-full bg-secondary-foreground/20 text-secondary-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"><X className="h-3 w-3" /></button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>Deleting "{hour}" will remove it from the list of available class hours.</AlertDialogDescription></AlertDialogHeader>
                                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteHour(hour)}>Delete</AlertDialogAction></AlertDialogFooter>
                            </AlertDialogContent>
                            </AlertDialog>
                        </div>
                        ))}
                    </div>
                    <div className="space-y-2"><Label htmlFor="new-hour">Add New Hour</Label><div className="flex gap-2"><Input id="new-hour" value={newHour} onChange={e => setNewHour(e.target.value)} placeholder="e.g., 6th Hour"/><Button onClick={handleAddHour}><PlusCircle /> Add</Button></div></div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="announcements">
              <div className="pt-4 space-y-6"><div className="space-y-4 p-4 border rounded-lg"><h3 className="font-semibold text-lg flex items-center gap-2"><Megaphone /> Create New Announcement</h3><div className="space-y-2"><Label htmlFor="new-announcement-title">Title</Label><Input id="new-announcement-title" value={newAnnouncementTitle} onChange={(e) => setNewAnnouncementTitle(e.target.value)} placeholder="e.g., Mid-term Exams"/></div><div className="space-y-2"><Label htmlFor="new-announcement-content">Content</Label><Textarea id="new-announcement-content" value={newAnnouncementContent} onChange={(e) => setNewAnnouncementContent(e.target.value)} placeholder="Enter the announcement details here..."/></div><Button onClick={handleAddAnnouncement} className="w-full"><PlusCircle /> Post Announcement</Button></div><div className="space-y-4"><h3 className="font-semibold text-lg">Existing Announcements</h3><div className="space-y-2 max-h-96 overflow-y-auto pr-2">{announcements.length > 0 ? (announcements.map((announcement) => (<div key={announcement.id} className="flex items-start justify-between gap-4 p-3 rounded-md border bg-card-foreground/5"><div className="flex-1"><p className="font-medium">{announcement.title}</p><p className="text-sm text-muted-foreground">{announcement.content}</p><p className="text-xs text-muted-foreground mt-1">{announcement.date}</p></div><Button variant="ghost" size="icon" className="text-destructive shrink-0 hover:bg-destructive/10 h-8 w-8" onClick={() => deleteAnnouncement(announcement.id)}><Trash2 className="h-4 w-4" /></Button></div>))) : (<p className="text-sm text-muted-foreground text-center py-4">No announcements yet.</p>)}</div></div></div>
            </TabsContent>

            <TabsContent value="academic-settings">
              <div className="pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Manage Academic Calendar</h3>
                  <Button onClick={handleAddEventClick}><PlusCircle /> Add Event</Button>
                </div>
                <div className="rounded-md border"><Table><TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Date</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>{events.map((event) => (<TableRow key={event.id}><TableCell className="font-medium">{event.title}</TableCell><TableCell>{format(parseISO(event.date), 'PPP')}</TableCell><TableCell><span className="capitalize">{event.type}</span></TableCell><TableCell className="text-right space-x-2"><Button variant="ghost" size="icon" onClick={() => handleEditEventClick(event)}><Pencil className="h-4 w-4" /></Button><AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the event "{event.title}".</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteEvent(event.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></TableCell></TableRow>))}</TableBody></Table></div>
              </div>
            </TabsContent>
            
            <TabsContent value="timetable">
              <div className="pt-4 space-y-4">
                <div className="flex items-center gap-2">
                  <CalendarClock className="h-6 w-6" />
                  <h3 className="font-semibold text-lg">Manage Class Timetables</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4 p-4 border rounded-lg">
                  <div>
                    <Label>Department</Label>
                    <Select value={selectedDept} onValueChange={setSelectedDept}>
                      <SelectTrigger><SelectValue placeholder="Select Department" /></SelectTrigger>
                      <SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Year</Label>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger><SelectValue placeholder="Select Year" /></SelectTrigger>
                      <SelectContent>{years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>

                {editableTimetable ? (
                  <div className="space-y-4">
                    <div className="rounded-md border">
                    <Table>
                      <TableHeader><TableRow><TableHead>Day</TableHead>{hours.map(h => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader>
                      <TableBody>
                        {daysOfWeek.map((day) => (
                          <TableRow key={day}>
                            <TableCell className="font-medium">{day}</TableCell>
                            {hours.map((_, hourIndex) => (
                              <TableCell key={hourIndex}>
                                <Input
                                  value={editableTimetable[day]?.[hourIndex] || ''}
                                  onChange={(e) => handleTimetableChange(day, hourIndex, e.target.value)}
                                  className="h-8"
                                />
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    </div>
                    <Button onClick={handleSaveTimetable} className="w-full md:w-auto">Save Timetable</Button>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">Select a department and year to edit the timetable.</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="reports">
               <div className="grid md:grid-cols-2 gap-6 pt-4">
                <Card className="p-6 text-center">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle>Attendance Defaulter Report</CardTitle>
                    <CardDescription>Generate an AI-summarized report of students with attendance below 75%.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Button onClick={handleGenerateReport} disabled={isGeneratingReport}>{isGeneratingReport ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</>) : (<><FileText className="mr-2 h-4 w-4" />Generate Report</>)}</Button>
                  </CardContent>
                </Card>
                <Card className="p-6 text-center">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle>Department Analytics</CardTitle>
                    <CardDescription>View a dashboard of attendance statistics across departments and classes.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Button onClick={() => setIsAnalyticsOpen(true)}>
                      <BarChart className="mr-2 h-4 w-4" />
                      View Analytics
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}><DialogContent className="sm:max-w-2xl"><DialogHeader><DialogTitle>Attendance Defaulter Report</DialogTitle><DialogDescription>An AI-generated summary and list of students with attendance below 75%.</DialogDescription></DialogHeader>{reportData && (<div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4"><blockquote className="mt-2 border-l-2 pl-6 italic">"{reportData.summary}"</blockquote><div className="rounded-md border"><Table><TableHeader><TableRow><TableHead>Roll No.</TableHead><TableHead>Name</TableHead><TableHead>Department</TableHead><TableHead className="text-right">Attendance</TableHead></TableRow></TableHeader><TableBody>{reportData.defaulters.map(student => (<TableRow key={student.id}><TableCell>{student.rollNumber}</TableCell><TableCell className="font-medium">{student.name}</TableCell><TableCell>{student.department}</TableCell><TableCell className="text-right text-destructive font-bold">{student.attendancePercentage}%</TableCell></TableRow>))}</TableBody></Table></div></div>)}<DialogFooter><Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>Close</Button></DialogFooter></DialogContent></Dialog>
      <Dialog open={isAnalyticsOpen} onOpenChange={setIsAnalyticsOpen}><DialogContent className="max-w-4xl w-full"><DialogHeader><DialogTitle>Department-wise Attendance Analytics</DialogTitle><DialogDescription>An overview of attendance performance across different departments and classes.</DialogDescription></DialogHeader><div className="mt-4 max-h-[70vh] overflow-y-auto pr-4"><DepartmentAnalytics /></div></DialogContent></Dialog>
      <Dialog open={isStudentFormDialogOpen} onOpenChange={setIsStudentFormDialogOpen}><DialogContent className="sm:max-w-2xl"><DialogHeader><DialogTitle>Edit Student: {editingStudent?.name}</DialogTitle><DialogDescription>Update the student's details below. Click save to apply changes.</DialogDescription></DialogHeader><Form {...studentForm}><form onSubmit={studentForm.handleSubmit(onEditStudentSubmit)} className="space-y-6 pt-4 max-h-[70vh] overflow-y-auto pr-4"><div className="grid md:grid-cols-2 gap-4"><FormField control={studentForm.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Full Name</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/><FormField control={studentForm.control} name="email" render={({ field }) => ( <FormItem> <FormLabel>Email</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/><FormField control={studentForm.control} name="phone" render={({ field }) => ( <FormItem> <FormLabel>Phone</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/><FormField control={studentForm.control} name="rollNumber" render={({ field }) => ( <FormItem> <FormLabel>Roll No</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/><FormField control={studentForm.control} name="university_number" render={({ field }) => ( <FormItem> <FormLabel>University No</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/><FormField control={studentForm.control} name="department" render={({ field }) => ( <FormItem> <FormLabel>Department</FormLabel> <Select onValueChange={field.onChange} value={field.value}> <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl> <SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent> </Select> <FormMessage /> </FormItem> )}/><FormField control={studentForm.control} name="year" render={({ field }) => ( <FormItem> <FormLabel>Year</FormLabel> <Select onValueChange={field.onChange} value={field.value}> <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl> <SelectContent>{years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent> </Select> <FormMessage /> </FormItem> )}/><FormField control={studentForm.control} name="dob" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Date of Birth</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)}/>
                <FormField control={studentForm.control} name="gender" render={({ field }) => ( <FormItem> <FormLabel>Gender</FormLabel> <Select onValueChange={field.onChange} value={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select a gender" /></SelectTrigger></FormControl> <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent> </Select> <FormMessage /> </FormItem> )}/><FormField control={studentForm.control} name="currentSemester" render={({ field }) => ( <FormItem> <FormLabel>Current Semester</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/><FormField control={studentForm.control} name="academicYear" render={({ field }) => ( <FormItem> <FormLabel>Academic Year</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/></div><FormField control={studentForm.control} name="address" render={({ field }) => ( <FormItem> <FormLabel>Address</FormLabel> <FormControl><Textarea {...field} /></FormControl> <FormMessage /> </FormItem> )}/><FormField control={studentForm.control} name="photoUrl" render={({ field }) => ( <FormItem> <FormLabel>Profile Photo</FormLabel> <div className="flex items-center gap-4"> <Avatar className="h-20 w-20 border"> <AvatarImage src={studentForm.watch('photoUrl')} alt="Student avatar" data-ai-hint="student portrait" className="object-cover" /> <AvatarFallback><User className="h-10 w-10" /></AvatarFallback> </Avatar> <div className="w-full"> <FormControl> <Input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => { studentForm.setValue('photoUrl', reader.result as string); }; reader.readAsDataURL(file); } }} className="flex-1" /> </FormControl> <p className="text-xs text-muted-foreground mt-2">Upload a picture for the student's profile.</p> </div> </div> <FormMessage /> </FormItem> )}/><DialogFooter><Button type="button" variant="outline" onClick={() => setIsStudentFormDialogOpen(false)}>Cancel</Button><Button type="submit">Save Changes</Button></DialogFooter></form></Form></DialogContent></Dialog>
      <Dialog open={isEventFormDialogOpen} onOpenChange={setIsEventFormDialogOpen}><DialogContent className="sm:max-w-[425px]"><DialogHeader><DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle><DialogDescription>Fill in the details for the academic event.</DialogDescription></DialogHeader><Form {...eventForm}><form onSubmit={eventForm.handleSubmit(onEventSubmit)} className="space-y-4 py-4"><FormField control={eventForm.control} name="title" render={({ field }) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., Mid-term Exams" {...field} /></FormControl><FormMessage /></FormItem>)}/><FormField control={eventForm.control} name="date" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)}/>
              <FormField control={eventForm.control} name="type" render={({ field }) => (<FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select event type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="exam">Exam</SelectItem><SelectItem value="holiday">Holiday</SelectItem><SelectItem value="assignment">Assignment</SelectItem><SelectItem value="event">Event</SelectItem></SelectContent></Select><FormMessage /></FormItem>)}/><FormField control={eventForm.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description (Optional)</FormLabel><FormControl><Textarea placeholder="Add a short description..." {...field} /></FormControl><FormMessage /></FormItem>)}/><DialogFooter><Button type="button" variant="outline" onClick={() => setIsEventFormDialogOpen(false)}>Cancel</Button><Button type="submit">Save</Button></DialogFooter></form></Form></DialogContent></Dialog>
      <Dialog open={isAddTeacherDialogOpen} onOpenChange={setIsAddTeacherDialogOpen}><DialogContent className="sm:max-w-[425px]"><DialogHeader><DialogTitle>Add New Staff Member</DialogTitle><DialogDescription>Create a new account for a teacher.</DialogDescription></DialogHeader><Form {...teacherForm}><form onSubmit={teacherForm.handleSubmit(onAddTeacherSubmit)} className="space-y-4 py-4"><FormField control={teacherForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="e.g., Dr. Evelyn Reed" {...field} /></FormControl><FormMessage /></FormItem>)}/><FormField control={teacherForm.control} name="id" render={({ field }) => (<FormItem><FormLabel>Staff ID</FormLabel><FormControl><Input placeholder="e.g., TEACHER03" {...field} /></FormControl><FormMessage /></FormItem>)}/><FormField control={teacherForm.control} name="password" render={({ field }) => (<FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="Min. 6 characters" {...field} /></FormControl><FormMessage /></FormItem>)}/><DialogFooter><Button type="button" variant="outline" onClick={() => setIsAddTeacherDialogOpen(false)}>Cancel</Button><Button type="submit">Add Staff</Button></DialogFooter></form></Form></DialogContent></Dialog>
      <Dialog open={isChangePasswordDialogOpen} onOpenChange={setIsChangePasswordDialogOpen}><DialogContent className="sm:max-w-[425px]"><DialogHeader><DialogTitle>Change Password for {editingTeacher?.name}</DialogTitle><DialogDescription>Enter a new password for Staff ID: {editingTeacher?.id}</DialogDescription></DialogHeader><Form {...changePasswordForm}><form onSubmit={changePasswordForm.handleSubmit(onChangePasswordSubmit)} className="space-y-4 py-4"><FormField control={changePasswordForm.control} name="password" render={({ field }) => (<FormItem><FormLabel>New Password</FormLabel><FormControl><Input type="password" placeholder="Min. 6 characters" {...field} /></FormControl><FormMessage /></FormItem>)}/><DialogFooter><Button type="button" variant="outline" onClick={() => setIsChangePasswordDialogOpen(false)}>Cancel</Button><Button type="submit">Save Password</Button></DialogFooter></form></Form></DialogContent></Dialog>
    </>
  );
}
