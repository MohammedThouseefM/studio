
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle, Trash2, Megaphone, Pencil, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { collegeData, students as initialStudents, type Student } from '@/lib/mock-data';
import { useAnnouncements } from '@/context/announcements-context';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const studentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits.'),
  roll_no: z.string().min(1, 'Roll number is required.'),
  university_number: z.string().min(1, 'University number is required.'),
  department: z.string().min(1, 'Please select a department.'),
  year: z.string().min(1, 'Please select a year.'),
});

type StudentFormData = z.infer<typeof studentSchema>;

export function TeacherManagementPanel() {
  const { toast } = useToast();
  const [departments, setDepartments] = useState(collegeData.departments);
  const [newDepartment, setNewDepartment] = useState('');
  const [years, setYears] = useState(collegeData.years);
  const [newYear, setNewYear] = useState('');
  
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { announcements, addAnnouncement, deleteAnnouncement } = useAnnouncements();
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState('');
  const [newAnnouncementContent, setNewAnnouncementContent] = useState('');

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      roll_no: '',
      university_number: '',
      department: '',
      year: '',
    },
  });
  
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
      rollNumber: data.roll_no,
      dob: 'N/A', // DOB is not in the form, so setting a default
    };
    setStudents(prev => [newStudent, ...prev]);
    toast({
      title: 'Student Added',
      description: `Successfully added ${data.name}.`,
    });
    form.reset();
  };

  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    form.reset({
      name: student.name,
      email: student.email,
      phone: student.phone,
      roll_no: student.rollNumber,
      university_number: student.university_number,
      department: student.department,
      year: student.year,
    });
    setIsEditDialogOpen(true);
  };
  
  const onEditStudentSubmit = (data: StudentFormData) => {
    if (!editingStudent) return;
  
    setStudents(prev => 
      prev.map(s => 
        s.id === editingStudent.id 
          ? { 
              ...s, 
              ...data, 
              rollNumber: data.roll_no, 
              university_number: data.university_number, 
              id: data.university_number 
            } 
          : s
      )
    );
    
    toast({
      title: 'Student Updated',
      description: `Successfully updated ${data.name}.`,
    });
    
    setIsEditDialogOpen(false);
    setEditingStudent(null);
    form.reset();
  };

  const handleDeleteStudent = (student: Student) => {
    setStudents(prev => prev.filter(s => s.id !== student.id));
    toast({
      variant: 'destructive',
      title: 'Student Deleted',
      description: `${student.name} has been removed from the list.`,
    });
  };
  
  const handleAddDepartment = () => {
    if (newDepartment && !departments.includes(newDepartment)) {
      setDepartments([...departments, newDepartment]);
      setNewDepartment('');
      toast({ title: 'Department Added', description: `Added ${newDepartment}.` });
    }
  };
  
  const handleAddYear = () => {
    if (newYear && !years.includes(newYear)) {
      setYears([...years, newYear]);
      setNewYear('');
      toast({ title: 'Year Added', description: `Added ${newYear}.` });
    }
  };

  const handleAddAnnouncement = () => {
    if (newAnnouncementTitle && newAnnouncementContent) {
      addAnnouncement(newAnnouncementTitle, newAnnouncementContent);
      toast({ title: 'Announcement Added', description: `Added "${newAnnouncementTitle}".` });
      setNewAnnouncementTitle('');
      setNewAnnouncementContent('');
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Title and content cannot be empty.',
      });
    }
  };

  const handleDeleteAnnouncement = (id: string) => {
    const deletedAnnouncement = announcements.find((a) => a.id === id);
    if (deletedAnnouncement) {
      deleteAnnouncement(id);
      toast({ title: 'Announcement Deleted', description: `Deleted "${deletedAnnouncement.title}".` });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Management Panel</CardTitle>
        <CardDescription>Manage students, academic structure, and announcements.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="add-student">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="add-student">Add Student</TabsTrigger>
            <TabsTrigger value="manage-students">Manage Students</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="years">Years</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="add-student">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onStudentSubmit)} className="space-y-6 pt-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter student's name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="student@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="9876543210" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="roll_no"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Roll Number</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 3BCA-29" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="university_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>University Number</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 36623U09029" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a year" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full">
                  <PlusCircle /> Add Student
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="manage-students">
            <div className="pt-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Roll No.</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.rollNumber}</TableCell>
                          <TableCell>{student.department}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditClick(student)}>
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the student record for {student.name}.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteStudent(student)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No results found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="departments">
            <div className="pt-4 space-y-4">
              <div className="space-y-2">
                <Label>Existing Departments</Label>
                <div className="flex flex-wrap gap-2">
                  {departments.map(dept => (
                    <span key={dept} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">{dept}</span>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-department">Add New Department</Label>
                <div className="flex gap-2">
                  <Input 
                    id="new-department"
                    value={newDepartment}
                    onChange={e => setNewDepartment(e.target.value)}
                    placeholder="e.g., B.Tech"
                  />
                  <Button onClick={handleAddDepartment}><PlusCircle /> Add</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="years">
             <div className="pt-4 space-y-4">
              <div className="space-y-2">
                <Label>Existing Years</Label>
                <div className="flex flex-wrap gap-2">
                  {years.map(year => (
                    <span key={year} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">{year}</span>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-year">Add New Year</Label>
                <div className="flex gap-2">
                  <Input 
                    id="new-year"
                    value={newYear}
                    onChange={e => setNewYear(e.target.value)}
                    placeholder="e.g., 4th Year"
                  />
                  <Button onClick={handleAddYear}><PlusCircle /> Add</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="announcements">
            <div className="pt-4 space-y-6">
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold text-lg flex items-center gap-2"><Megaphone /> Create New Announcement</h3>
                <div className="space-y-2">
                  <Label htmlFor="new-announcement-title">Title</Label>
                  <Input
                    id="new-announcement-title"
                    value={newAnnouncementTitle}
                    onChange={(e) => setNewAnnouncementTitle(e.target.value)}
                    placeholder="e.g., Mid-term Exams"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-announcement-content">Content</Label>
                  <Textarea
                    id="new-announcement-content"
                    value={newAnnouncementContent}
                    onChange={(e) => setNewAnnouncementContent(e.target.value)}
                    placeholder="Enter the announcement details here..."
                  />
                </div>
                <Button onClick={handleAddAnnouncement} className="w-full">
                  <PlusCircle /> Post Announcement
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Existing Announcements</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                  {announcements.length > 0 ? (
                    announcements.map((announcement) => (
                      <div key={announcement.id} className="flex items-start justify-between gap-4 p-3 rounded-md border bg-card-foreground/5">
                        <div className="flex-1">
                          <p className="font-medium">{announcement.title}</p>
                          <p className="text-sm text-muted-foreground">{announcement.content}</p>
                          <p className="text-xs text-muted-foreground mt-1">{announcement.date}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="text-destructive shrink-0 hover:bg-destructive/10 h-8 w-8" onClick={() => handleDeleteAnnouncement(announcement.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No announcements yet.</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Edit Student: {editingStudent?.name}</DialogTitle>
            <DialogDescription>
              Update the student's details below. Click save to apply changes.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onEditStudentSubmit)} className="space-y-6 pt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter student's name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="student@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="roll_no"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Roll Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 3BCA-29" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="university_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>University Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 36623U09029" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
