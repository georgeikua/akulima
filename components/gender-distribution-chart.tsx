"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

const data = [
  { name: "Female", value: 65, color: "#ff6b6b" },
  { name: "Male", value: 35, color: "#4dabf7" },
]

export function GenderDistributionChart() {
  return (
    <div className="space-y-4">
      <div className="flex justify-around">
        <div className="text-center">
          <p className="text-sm font-medium">Female</p>
          <p className="text-2xl font-bold text-[#ff6b6b]">65%</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium">Male</p>
          <p className="text-2xl font-bold text-[#4dabf7]">35%</p>
        </div>
      </div>

      <ChartContainer className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
