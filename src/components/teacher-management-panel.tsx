
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useToast } from '@/hooks/use-toast';
import { collegeData } from '@/lib/mock-data';

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

  const onStudentSubmit = (data: StudentFormData) => {
    console.log('New student data:', data);
    toast({
      title: 'Student Added',
      description: `Successfully added ${data.name}.`,
    });
    form.reset();
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Management Panel</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="add-student">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="add-student">Add Student</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="years">Years</TabsTrigger>
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
        </Tabs>
      </CardContent>
    </Card>
  );
}
