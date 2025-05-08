"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { addDays } from "date-fns"

// Mock data for revenue by truck size
const revenueTruckSizeData = [
  { name: "1 Ton", value: 450000, count: 45 },
  { name: "3 Ton", value: 960000, count: 30 },
  { name: "5 Ton", value: 1080000, count: 18 },
  { name: "7 Ton", value: 1250000, count: 10 },
]

// Mock data for revenue by month
const revenueMonthlyData = [
  { name: "Jan", platformFee: 120000, transportFee: 80000, gradingFee: 40000, qualityControlFee: 30000 },
  { name: "Feb", platformFee: 150000, transportFee: 100000, gradingFee: 50000, qualityControlFee: 35000 },
  { name: "Mar", platformFee: 180000, transportFee: 120000, gradingFee: 60000, qualityControlFee: 45000 },
  { name: "Apr", platformFee: 220000, transportFee: 150000, gradingFee: 70000, qualityControlFee: 55000 },
  { name: "May", platformFee: 280000, transportFee: 180000, gradingFee: 90000, qualityControlFee: 65000 },
  { name: "Jun", platformFee: 320000, transportFee: 210000, gradingFee: 100000, qualityControlFee: 75000 },
]

// Mock data for recent transactions
const recentTransactions = [
  {
    id: "TX-12345",
    date: "2023-06-15",
    buyerCode: "BUY-789",
    groupCode: "GRP-456",
    truckSize: "5ton",
    totalAmount: 900000,
    platformFee: 54000,
    transportFee: 18000,
    gradingFee: 6000,
    qualityControlFee: 4500,
    netAmount: 817500,
  },
  {
    id: "TX-12344",
    date: "2023-06-14",
    buyerCode: "BUY-123",
    groupCode: "GRP-789",
    truckSize: "3ton",
    totalAmount: 600000,
    platformFee: 48000,
    transportFee: 12000,
    gradingFee: 4000,
    qualityControlFee: 3000,
    netAmount: 533000,
  },
  {
    id: "TX-12343",
    date: "2023-06-13",
    buyerCode: "BUY-456",
    groupCode: "GRP-123",
    truckSize: "1ton",
    totalAmount: 200000,
    platformFee: 20000,
    transportFee: 5000,
    gradingFee: 2000,
    qualityControlFee: 1500,
    netAmount: 171500,
  },
  {
    id: "TX-12342",
    date: "2023-06-12",
    buyerCode: "BUY-789",
    groupCode: "GRP-456",
    truckSize: "7ton",
    totalAmount: 1400000,
    platformFee: 70000,
    transportFee: 25000,
    gradingFee: 8000,
    qualityControlFee: 6000,
    netAmount: 1291000,
  },
  {
    id: "TX-12341",
    date: "2023-06-11",
    buyerCode: "BUY-123",
    groupCode: "GRP-789",
    truckSize: "3ton",
    totalAmount: 550000,
    platformFee: 44000,
    transportFee: 12000,
    gradingFee: 4000,
    qualityControlFee: 3000,
    netAmount: 487000,
  },
]

// Colors for pie chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export function AdminRevenueDashboard() {
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  })

  // Calculate total revenue
  const totalPlatformFee = recentTransactions.reduce((sum, tx) => sum + tx.platformFee, 0)
  const totalTransportFee = recentTransactions.reduce((sum, tx) => sum + tx.transportFee, 0)
  const totalGradingFee = recentTransactions.reduce((sum, tx) => sum + tx.gradingFee, 0)
  const totalQualityControlFee = recentTransactions.reduce((sum, tx) => sum + tx.qualityControlFee, 0)
  const totalRevenue = totalPlatformFee + totalTransportFee + totalGradingFee + totalQualityControlFee

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Revenue Dashboard</h1>
          <p className="text-muted-foreground">Monitor platform revenue and transaction fees</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by truck size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Truck Sizes</SelectItem>
              <SelectItem value="1ton">1 Ton</SelectItem>
              <SelectItem value="3ton">3 Ton</SelectItem>
              <SelectItem value="5ton">5 Ton</SelectItem>
              <SelectItem value="7ton">7 Ton</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total Revenue</CardTitle>
            <CardDescription>All fees combined</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Platform Fees</CardTitle>
            <CardDescription>5-10% of transaction value</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {totalPlatformFee.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Transport Fees</CardTitle>
            <CardDescription>Based on truck size</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {totalTransportFee.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Other Fees</CardTitle>
            <CardDescription>Grading & Quality Control</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {(totalGradingFee + totalQualityControlFee).toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Revenue Overview</TabsTrigger>
          <TabsTrigger value="by-truck">By Truck Size</TabsTrigger>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue Breakdown</CardTitle>
              <CardDescription>Revenue by fee type over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    platformFee: {
                      label: "Platform Fee",
                      color: "hsl(var(--chart-1))",
                    },
                    transportFee: {
                      label: "Transport Fee",
                      color: "hsl(var(--chart-2))",
                    },
                    gradingFee: {
                      label: "Grading Fee",
                      color: "hsl(var(--chart-3))",
                    },
                    qualityControlFee: {
                      label: "Quality Control Fee",
                      color: "hsl(var(--chart-4))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueMonthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="platformFee" stackId="a" fill="var(--color-platformFee)" name="Platform Fee" />
                      <Bar dataKey="transportFee" stackId="a" fill="var(--color-transportFee)" name="Transport Fee" />
                      <Bar dataKey="gradingFee" stackId="a" fill="var(--color-gradingFee)" name="Grading Fee" />
                      <Bar
                        dataKey="qualityControlFee"
                        stackId="a"
                        fill="var(--color-qualityControlFee)"
                        name="Quality Control Fee"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-truck" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Truck Size</CardTitle>
                <CardDescription>Distribution of revenue across truck sizes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueTruckSizeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {revenueTruckSizeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `KES ${value.toLocaleString()}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transaction Count by Truck Size</CardTitle>
                <CardDescription>Number of transactions per truck size</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      count: {
                        label: "Transaction Count",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueTruckSizeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="count" fill="var(--color-count)" name="Transaction Count" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Details of recent platform transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Buyer Code</TableHead>
                    <TableHead>Group Code</TableHead>
                    <TableHead>Truck Size</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Platform Fee</TableHead>
                    <TableHead>Net Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-medium">{tx.id}</TableCell>
                      <TableCell>{tx.date}</TableCell>
                      <TableCell>{tx.buyerCode}</TableCell>
                      <TableCell>{tx.groupCode}</TableCell>
                      <TableCell>{tx.truckSize}</TableCell>
                      <TableCell>KES {tx.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>KES {tx.platformFee.toLocaleString()}</TableCell>
                      <TableCell>KES {tx.netAmount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
