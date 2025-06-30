'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Progress } from '@/components/ui/progress';
import { studentAttendance } from '@/lib/mock-data';

export function StudentAttendanceSummary() {
  const chartConfig = {
    present: {
      label: 'Present',
      color: 'hsl(var(--primary))',
    },
    total: {
      label: 'Total',
      color: 'hsl(var(--secondary))',
    },
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Overall Attendance</CardTitle>
          <CardDescription>Your total attendance percentage across all subjects.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4">
          <div className="text-6xl font-bold text-primary">{studentAttendance.totalPercentage}%</div>
          <Progress value={studentAttendance.totalPercentage} className="w-full" />
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Subject-wise Attendance</CardTitle>
          <CardDescription>Breakdown of your attendance for each subject.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {studentAttendance.subjects.map((subject) => (
            <div key={subject.name}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{subject.name}</span>
                <span className="text-sm text-muted-foreground">{subject.percentage}%</span>
              </div>
              <Progress value={subject.percentage} />
            </div>
          ))}
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>Monthly Attendance</CardTitle>
          <CardDescription>Your monthly attendance trend for the last 6 months.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <ResponsiveContainer>
              <BarChart data={studentAttendance.monthly} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="present" fill="var(--color-present)" radius={8} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
