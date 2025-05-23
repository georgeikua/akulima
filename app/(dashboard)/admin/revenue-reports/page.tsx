"use client"

import { useState } from "react"
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
import { Download, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProtectedRoute } from "@/components/protected-route"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { addDays } from "date-fns"

// Sample data for revenue by source
const revenueBySourceData = [
  { name: "Jan", platformFee: 120000, financeMarkup: 45000, transportMarkup: 80000, qcFacilitation: 30000 },
  { name: "Feb", platformFee: 150000, financeMarkup: 55000, transportMarkup: 100000, qcFacilitation: 35000 },
  { name: "Mar", platformFee: 180000, financeMarkup: 65000, transportMarkup: 120000, qcFacilitation: 45000 },
  { name: "Apr", platformFee: 220000, financeMarkup: 75000, transportMarkup: 150000, qcFacilitation: 55000 },
  { name: "May", platformFee: 280000, financeMarkup: 85000, transportMarkup: 180000, qcFacilitation: 65000 },
  { name: "Jun", platformFee: 320000, financeMarkup: 95000, transportMarkup: 210000, qcFacilitation: 75000 },
]

// Sample data for revenue by produce type
const revenueByProduceData = [
  { name: "Potatoes", value: 450000 },
  { name: "Tomatoes", value: 380000 },
  { name: "Onions", value: 320000 },
  { name: "Cabbage", value: 280000 },
  { name: "Kale", value: 250000 },
  { name: "Others", value: 420000 },
]

// Sample data for revenue by region
const revenueByRegionData = [
  { name: "Nairobi", value: 580000 },
  { name: "Central", value: 420000 },
  { name: "Eastern", value: 350000 },
  { name: "Rift Valley", value: 300000 },
  { name: "Western", value: 250000 },
  { name: "Others", value: 200000 },
]

// Sample data for detailed transactions
const detailedTransactionsData = [
  {
    id: "TX-12345",
    date: "2023-06-15",
    buyer: "Metro Supermarkets",
    group: "Nyeri Farmers Cooperative",
    produce: "Potatoes",
    amount: 900000,
    platformFee: 90000,
    financeMarkup: 27000,
    transportMarkup: 45000,
    qcFacilitation: 18000,
    netAmount: 720000,
  },
  {
    id: "TX-12344",
    date: "2023-06-14",
    buyer: "Fresh Grocers Ltd",
    group: "Meru Vegetable Growers",
    produce: "Tomatoes",
    amount: 750000,
    platformFee: 75000,
    financeMarkup: 22500,
    transportMarkup: 37500,
    qcFacilitation: 15000,
    netAmount: 600000,
  },
  {
    id: "TX-12343",
    date: "2023-06-13",
    buyer: "Hotel Suppliers Co.",
    group: "Nakuru Farmers Association",
    produce: "Onions",
    amount: 600000,
    platformFee: 60000,
    financeMarkup: 18000,
    transportMarkup: 30000,
    qcFacilitation: 12000,
    netAmount: 480000,
  },
  {
    id: "TX-12342",
    date: "2023-06-12",
    buyer: "Metro Supermarkets",
    group: "Kiambu Growers Cooperative",
    produce: "Cabbage",
    amount: 450000,
    platformFee: 45000,
    financeMarkup: 13500,
    transportMarkup: 22500,
    qcFacilitation: 9000,
    netAmount: 360000,
  },
  {
    id: "TX-12341",
    date: "2023-06-11",
    buyer: "Fresh Grocers Ltd",
    group: "Nyeri Farmers Cooperative",
    produce: "Kale",
    amount: 350000,
    platformFee: 35000,
    financeMarkup: 10500,
    transportMarkup: 17500,
    qcFacilitation: 7000,
    netAmount: 280000,
  },
]

// Colors for pie chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export default function RevenueReportsPage() {
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  })

  // Calculate total revenue
  const totalPlatformFee = revenueBySourceData.reduce((sum, item) => sum + item.platformFee, 0)
  const totalFinanceMarkup = revenueBySourceData.reduce((sum, item) => sum + item.financeMarkup, 0)
  const totalTransportMarkup = revenueBySourceData.reduce((sum, item) => sum + item.transportMarkup, 0)
  const totalQcFacilitation = revenueBySourceData.reduce((sum, item) => sum + item.qcFacilitation, 0)
  const totalRevenue = totalPlatformFee + totalFinanceMarkup + totalTransportMarkup + totalQcFacilitation

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Revenue Reports</h1>
            <p className="text-muted-foreground">
              Detailed breakdown of platform revenue from various sources and categories.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Total Revenue</CardTitle>
              <CardDescription>All revenue sources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KES {totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Platform Fees</CardTitle>
              <CardDescription>10-15% commission</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KES {totalPlatformFee.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Finance Markup</CardTitle>
              <CardDescription>3% of transaction value</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KES {totalFinanceMarkup.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Transport & QC</CardTitle>
              <CardDescription>Transport & quality control</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                KES {(totalTransportMarkup + totalQcFacilitation).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Revenue Overview</TabsTrigger>
            <TabsTrigger value="by-produce">By Produce</TabsTrigger>
            <TabsTrigger value="by-region">By Region</TabsTrigger>
            <TabsTrigger value="transactions">Detailed Transactions</TabsTrigger>
          </TabsList>

          {/* Revenue Overview Tab */}
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Source</CardTitle>
                <CardDescription>Monthly breakdown of revenue from different sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ChartContainer
                    config={{
                      platformFee: {
                        label: "Platform Fee",
                        color: "hsl(var(--chart-1))",
                      },
                      financeMarkup: {
                        label: "Finance Markup",
                        color: "hsl(var(--chart-2))",
                      },
                      transportMarkup: {
                        label: "Transport Markup",
                        color: "hsl(var(--chart-3))",
                      },
                      qcFacilitation: {
                        label: "QC Facilitation",
                        color: "hsl(var(--chart-4))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueBySourceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="platformFee" stackId="a" fill="var(--color-platformFee)" name="Platform Fee" />
                        <Bar
                          dataKey="financeMarkup"
                          stackId="a"
                          fill="var(--color-financeMarkup)"
                          name="Finance Markup"
                        />
                        <Bar
                          dataKey="transportMarkup"
                          stackId="a"
                          fill="var(--color-transportMarkup)"
                          name="Transport Markup"
                        />
                        <Bar
                          dataKey="qcFacilitation"
                          stackId="a"
                          fill="var(--color-qcFacilitation)"
                          name="QC Facilitation"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* By Produce Tab */}
          <TabsContent value="by-produce">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Produce Type</CardTitle>
                <CardDescription>Distribution of revenue across different produce types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueByProduceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {revenueByProduceData.map((entry, index) => (
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
          </TabsContent>

          {/* By Region Tab */}
          <TabsContent value="by-region">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Region</CardTitle>
                <CardDescription>Distribution of revenue across different regions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueByRegionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {revenueByRegionData.map((entry, index) => (
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
          </TabsContent>

          {/* Detailed Transactions Tab */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Detailed Transactions</CardTitle>
                  <CardDescription>Breakdown of individual transactions and revenue components</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by produce" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Produce</SelectItem>
                      <SelectItem value="potatoes">Potatoes</SelectItem>
                      <SelectItem value="tomatoes">Tomatoes</SelectItem>
                      <SelectItem value="onions">Onions</SelectItem>
                      <SelectItem value="cabbage">Cabbage</SelectItem>
                      <SelectItem value="kale">Kale</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Group</TableHead>
                      <TableHead>Produce</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Platform Fee</TableHead>
                      <TableHead>Finance</TableHead>
                      <TableHead>Transport</TableHead>
                      <TableHead>QC</TableHead>
                      <TableHead>Net Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detailedTransactionsData.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-medium">{tx.id}</TableCell>
                        <TableCell>{tx.date}</TableCell>
                        <TableCell>{tx.buyer}</TableCell>
                        <TableCell>{tx.group}</TableCell>
                        <TableCell>{tx.produce}</TableCell>
                        <TableCell>KES {tx.amount.toLocaleString()}</TableCell>
                        <TableCell>KES {tx.platformFee.toLocaleString()}</TableCell>
                        <TableCell>KES {tx.financeMarkup.toLocaleString()}</TableCell>
                        <TableCell>KES {tx.transportMarkup.toLocaleString()}</TableCell>
                        <TableCell>KES {tx.qcFacilitation.toLocaleString()}</TableCell>
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
    </ProtectedRoute>
  )
}
