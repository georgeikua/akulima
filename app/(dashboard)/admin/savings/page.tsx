"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
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

// Sample data for savings growth
const savingsGrowthData = [
  { name: "Jan", savings: 1200000, interest: 12000 },
  { name: "Feb", savings: 1450000, interest: 14500 },
  { name: "Mar", savings: 1750000, interest: 17500 },
  { name: "Apr", savings: 2100000, interest: 21000 },
  { name: "May", savings: 2500000, interest: 25000 },
  { name: "Jun", savings: 2950000, interest: 29500 },
]

// Sample data for savings by group
const savingsByGroupData = [
  { name: "Nyeri Farmers Cooperative", savings: 650000, members: 45, avgPerMember: 14444 },
  { name: "Meru Vegetable Growers", savings: 520000, members: 32, avgPerMember: 16250 },
  { name: "Nakuru Farmers Association", savings: 480000, members: 38, avgPerMember: 12632 },
  { name: "Kiambu Growers Cooperative", savings: 420000, members: 29, avgPerMember: 14483 },
  { name: "Machakos Farmers Group", savings: 380000, members: 25, avgPerMember: 15200 },
]

// Sample data for savings by region
const savingsByRegionData = [
  { name: "Central", value: 1170000 },
  { name: "Eastern", value: 900000 },
  { name: "Rift Valley", value: 480000 },
  { name: "Western", value: 250000 },
  { name: "Nairobi", value: 150000 },
]

// Sample data for savings forecast
const savingsForecastData = [
  { name: "Jul", projected: 3400000, interest: 34000 },
  { name: "Aug", projected: 3900000, interest: 39000 },
  { name: "Sep", projected: 4450000, interest: 44500 },
  { name: "Oct", projected: 5050000, interest: 50500 },
  { name: "Nov", projected: 5700000, interest: 57000 },
  { name: "Dec", projected: 6400000, interest: 64000 },
]

// Sample data for upcoming payouts
const upcomingPayoutsData = [
  {
    id: "PAY-12345",
    date: "2023-12-15",
    group: "Nyeri Farmers Cooperative",
    members: 45,
    totalSavings: 650000,
    interest: 65000,
    totalPayout: 715000,
  },
  {
    id: "PAY-12346",
    date: "2023-12-15",
    group: "Meru Vegetable Growers",
    members: 32,
    totalSavings: 520000,
    interest: 52000,
    totalPayout: 572000,
  },
  {
    id: "PAY-12347",
    date: "2023-12-15",
    group: "Nakuru Farmers Association",
    members: 38,
    totalSavings: 480000,
    interest: 48000,
    totalPayout: 528000,
  },
  {
    id: "PAY-12348",
    date: "2023-12-15",
    group: "Kiambu Growers Cooperative",
    members: 29,
    totalSavings: 420000,
    interest: 42000,
    totalPayout: 462000,
  },
  {
    id: "PAY-12349",
    date: "2023-12-15",
    group: "Machakos Farmers Group",
    members: 25,
    totalSavings: 380000,
    interest: 38000,
    totalPayout: 418000,
  },
]

export default function SavingsManagementPage() {
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -180),
    to: new Date(),
  })

  // Calculate total savings
  const totalSavings = savingsByGroupData.reduce((sum, group) => sum + group.savings, 0)
  const totalMembers = savingsByGroupData.reduce((sum, group) => sum + group.members, 0)
  const totalInterest = savingsGrowthData.reduce((sum, month) => sum + month.interest, 0)
  const avgSavingsPerMember = Math.round(totalSavings / totalMembers)

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Savings Management</h1>
            <p className="text-muted-foreground">Monitor and manage farmer savings collected through the platform.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Total Savings</CardTitle>
              <CardDescription>All farmer groups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KES {totalSavings.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Total Members</CardTitle>
              <CardDescription>Contributing farmers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMembers.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Interest Accrued</CardTitle>
              <CardDescription>Year to date</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KES {totalInterest.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Avg. per Member</CardTitle>
              <CardDescription>Average savings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KES {avgSavingsPerMember.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Savings Overview</TabsTrigger>
            <TabsTrigger value="by-group">By Group</TabsTrigger>
            <TabsTrigger value="forecast">Forecast & Payouts</TabsTrigger>
          </TabsList>

          {/* Savings Overview Tab */}
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Savings Growth</CardTitle>
                <CardDescription>Monthly growth of savings and interest accrued</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ChartContainer
                    config={{
                      savings: {
                        label: "Total Savings",
                        color: "hsl(var(--chart-1))",
                      },
                      interest: {
                        label: "Interest Accrued",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={savingsGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="savings"
                          stroke="var(--color-savings)"
                          fill="var(--color-savings)"
                          fillOpacity={0.3}
                          name="Total Savings"
                        />
                        <Area
                          type="monotone"
                          dataKey="interest"
                          stroke="var(--color-interest)"
                          fill="var(--color-interest)"
                          fillOpacity={0.3}
                          name="Interest Accrued"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* By Group Tab */}
          <TabsContent value="by-group">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Savings by Group</CardTitle>
                  <CardDescription>Breakdown of savings by farmer group</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="savings">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="savings">Sort by Savings</SelectItem>
                      <SelectItem value="members">Sort by Members</SelectItem>
                      <SelectItem value="average">Sort by Average</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] mb-6">
                  <ChartContainer
                    config={{
                      savings: {
                        label: "Total Savings",
                        color: "hsl(var(--chart-1))",
                      },
                      avgPerMember: {
                        label: "Avg. per Member",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={savingsByGroupData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" orientation="left" stroke="var(--color-savings)" />
                        <YAxis yAxisId="right" orientation="right" stroke="var(--color-avgPerMember)" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar yAxisId="left" dataKey="savings" fill="var(--color-savings)" name="Total Savings" />
                        <Bar
                          yAxisId="right"
                          dataKey="avgPerMember"
                          fill="var(--color-avgPerMember)"
                          name="Avg. per Member"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Group Name</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Total Savings (KES)</TableHead>
                      <TableHead>Avg. per Member (KES)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {savingsByGroupData.map((group) => (
                      <TableRow key={group.name}>
                        <TableCell className="font-medium">{group.name}</TableCell>
                        <TableCell>{group.members}</TableCell>
                        <TableCell>{group.savings.toLocaleString()}</TableCell>
                        <TableCell>{group.avgPerMember.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forecast & Payouts Tab */}
          <TabsContent value="forecast">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Savings Forecast</CardTitle>
                  <CardDescription>Projected savings growth for the next 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ChartContainer
                      config={{
                        projected: {
                          label: "Projected Savings",
                          color: "hsl(var(--chart-1))",
                        },
                        interest: {
                          label: "Projected Interest",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={savingsForecastData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="projected"
                            stroke="var(--color-projected)"
                            name="Projected Savings"
                          />
                          <Line
                            type="monotone"
                            dataKey="interest"
                            stroke="var(--color-interest)"
                            name="Projected Interest"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Payouts</CardTitle>
                  <CardDescription>Scheduled annual savings payouts to farmer groups</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Group</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Savings</TableHead>
                        <TableHead>Interest</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingPayoutsData.map((payout) => (
                        <TableRow key={payout.id}>
                          <TableCell className="font-medium">{payout.group}</TableCell>
                          <TableCell>{payout.date}</TableCell>
                          <TableCell>KES {payout.totalSavings.toLocaleString()}</TableCell>
                          <TableCell>KES {payout.interest.toLocaleString()}</TableCell>
                          <TableCell>KES {payout.totalPayout.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
