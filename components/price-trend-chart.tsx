"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  {
    date: "Jan",
    farmer: 60,
    market: 120,
    retailer: 180,
  },
  {
    date: "Feb",
    farmer: 55,
    market: 110,
    retailer: 170,
  },
  {
    date: "Mar",
    farmer: 70,
    market: 140,
    retailer: 200,
  },
  {
    date: "Apr",
    farmer: 75,
    market: 150,
    retailer: 220,
  },
  {
    date: "May",
    farmer: 80,
    market: 160,
    retailer: 230,
  },
  {
    date: "Jun",
    farmer: 90,
    market: 180,
    retailer: 250,
  },
  {
    date: "Jul",
    farmer: 85,
    market: 170,
    retailer: 240,
  },
  {
    date: "Aug",
    farmer: 95,
    market: 190,
    retailer: 260,
  },
  {
    date: "Sep",
    farmer: 100,
    market: 200,
    retailer: 280,
  },
  {
    date: "Oct",
    farmer: 110,
    market: 220,
    retailer: 300,
  },
  {
    date: "Nov",
    farmer: 120,
    market: 240,
    retailer: 320,
  },
  {
    date: "Dec",
    farmer: 130,
    market: 260,
    retailer: 350,
  },
]

interface PriceTrendChartProps {
  className?: string
  title?: string
  description?: string
}

export function PriceTrendChart({
  className,
  title = "Price Trends",
  description = "Market price comparison over time (KES/kg)",
}: PriceTrendChartProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="watermelon">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select crop" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="watermelon">Watermelon</SelectItem>
              <SelectItem value="tomatoes">Tomatoes</SelectItem>
              <SelectItem value="potatoes">Potatoes</SelectItem>
              <SelectItem value="onions">Onions</SelectItem>
              <SelectItem value="maize">Maize</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            farmer: {
              label: "Farmer Price",
              color: "hsl(var(--primary))",
            },
            market: {
              label: "Market Price",
              color: "hsl(var(--accent))",
            },
            retailer: {
              label: "Retail Price",
              color: "hsl(var(--secondary))",
            },
          }}
          className="h-80"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="farmer"
                strokeWidth={2}
                stroke="var(--color-farmer)"
                activeDot={{
                  r: 6,
                  fill: "var(--color-farmer)",
                  strokeWidth: 0,
                }}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="market"
                strokeWidth={2}
                stroke="var(--color-market)"
                activeDot={{
                  r: 6,
                  fill: "var(--color-market)",
                  strokeWidth: 0,
                }}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="retailer"
                strokeWidth={2}
                stroke="var(--color-retailer)"
                activeDot={{
                  r: 6,
                  fill: "var(--color-retailer)",
                  strokeWidth: 0,
                }}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
