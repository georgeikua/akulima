"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  {
    month: "Jan",
    earnings: 5200,
  },
  {
    month: "Feb",
    earnings: 4800,
  },
  {
    month: "Mar",
    earnings: 6500,
  },
  {
    month: "Apr",
    earnings: 7200,
  },
  {
    month: "May",
    earnings: 8100,
  },
  {
    month: "Jun",
    earnings: 9500,
  },
]

export function FarmerAnalyticsChart() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-primary/10 p-3 text-center">
        <p className="text-sm font-medium">Average Monthly Earnings</p>
        <p className="text-2xl font-bold text-primary">KES 6,883</p>
        <p className="text-xs text-muted-foreground">Per farmer</p>
      </div>

      <ChartContainer
        config={{
          earnings: {
            label: "Earnings (KES)",
            color: "hsl(var(--primary))",
          },
        }}
        className="h-[200px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}K`} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="earnings" fill="var(--color-earnings)" radius={[4, 4, 0, 0]} name="Earnings (KES)" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
