"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  {
    age: "18-24",
    count: 15,
  },
  {
    age: "25-34",
    count: 28,
  },
  {
    age: "35-44",
    count: 32,
  },
  {
    age: "45-54",
    count: 18,
  },
  {
    age: "55+",
    count: 7,
  },
]

export function AgeDistributionChart() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-primary/10 p-3 text-center">
        <p className="text-sm font-medium">Average Age</p>
        <p className="text-2xl font-bold text-primary">37.5</p>
        <p className="text-xs text-muted-foreground">Years</p>
      </div>

      <ChartContainer
        config={{
          count: {
            label: "Farmers",
            color: "hsl(var(--primary))",
          },
        }}
        className="h-[200px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="age" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} name="Farmers" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
