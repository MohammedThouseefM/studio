'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, CalendarPlus, Info } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useCollegeData } from '@/context/college-data-context';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { students } from '@/lib/mock-data';
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from './ui/table';
import { Badge } from './ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const leaveSchema = z.object({
  dateRange: z.object({
    from: z.date({ required_error: 'A start date is required.' }),
    to: z.date({ required_error: 'An end date is required.' }),
  }),
  reason: z.string().min(10, 'Reason must be at least 10 characters.'),
});

type LeaveFormData = z.infer<typeof leaveSchema>;

export function LeaveManagement() {
  const { toast } = useToast();
  const { leaveRequests, addLeaveRequest } = useCollegeData();
  const studentId = students[0].id; // Mock: get current student's ID

  const studentLeaveRequests = leaveRequests.filter(req => req.studentId === studentId);

  const form = useForm<LeaveFormData>({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      reason: '',
    },
  });

  const onSubmit = (data: LeaveFormData) => {
    addLeaveRequest(
      studentId,
      format(data.dateRange.from, 'yyyy-MM-dd'),
      format(data.dateRange.to, 'yyyy-MM-dd'),
      data.reason
    );
    toast({
      title: 'Leave Request Submitted!',
      description: 'Your request has been sent for approval.',
    });
    form.reset();
  };
  
  const statusVariant = {
    pending: 'secondary' as const,
    approved: 'default' as const,
    rejected: 'destructive' as const,
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarPlus /> Apply for Leave
            </CardTitle>
            <CardDescription>
              Fill out the form to request leave. Please apply at least 3 days in advance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="dateRange"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Leave Dates</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value?.from && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value?.from ? (
                                field.value.to ? (
                                  <>
                                    {format(field.value.from, "LLL dd, y")} -{" "}
                                    {format(field.value.to, "LLL dd, y")}
                                  </>
                                ) : (
                                  format(field.value.from, "LLL dd, y")
                                )
                              ) : (
                                <span>Pick your leave dates</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="range"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            disabled={{ before: new Date() }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for Leave</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Explain your reason for leave in detail..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
                  Submit Request
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>My Leave History</CardTitle>
            <CardDescription>A record of all your past and pending leave applications.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentLeaveRequests.length > 0 ? (
                    studentLeaveRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{format(parseISO(request.startDate), 'PPP')}</TableCell>
                        <TableCell>{format(parseISO(request.endDate), 'PPP')}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{request.reason}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {request.status === 'rejected' && request.rejectionReason && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Reason: {request.rejectionReason}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            <Badge variant={statusVariant[request.status]} className="capitalize">{request.status}</Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        You haven't applied for any leave yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
