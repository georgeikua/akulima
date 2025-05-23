"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BarChart3,
  CheckSquare,
  ChevronRight,
  DollarSign,
  Download,
  FileText,
  Package,
  Percent,
  PieChart,
  PiggyBank,
  Plus,
  TrendingUp,
  Upload,
  Users,
  Truck,
} from "lucide-react"
import { Bar, BarChart, ResponsiveContainer } from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { ProtectedRoute } from "@/components/protected-route"
import { ChartContainer } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { addDays } from "date-fns"

// Sample data for charts
const revenueData = [
  { name: "Jan", total: 1200000 },
  { name: "Feb", total: 1500000 },
  { name: "Mar", total: 1800000 },
  { name: "Apr", total: 2200000 },
  { name: "May", total: 2800000 },
  { name: "Jun", total: 3200000 },
]

const savingsData = [
  { name: "Jan", total: 800000 },
  { name: "Feb", total: 1000000 },
  { name: "Mar", total: 1300000 },
  { name: "Apr", total: 1700000 },
  { name: "May", total: 2100000 },
  { name: "Jun", total: 2600000 },
]

const transactionsData = [
  { name: "Jan", total: 120 },
  { name: "Feb", total: 145 },
  { name: "Mar", total: 165 },
  { name: "Apr", total: 190 },
  { name: "May", total: 220 },
  { name: "Jun", total: 250 },
]

export default function AdminDashboardPage() {
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  })

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex flex-col">
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
            <div className="flex items-center space-x-2">
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="savings">Savings</TabsTrigger>
              <TabsTrigger value="management">Management</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">KES 12,700,000</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Savings Under Management</CardTitle>
                    <PiggyBank className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">KES 9,500,000</div>
                    <p className="text-xs text-muted-foreground">+15.3% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">245</div>
                    <p className="text-xs text-muted-foreground">+12 from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                    <CheckSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">18</div>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">
                        Groups: 8
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Transporters: 6
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Graders: 4
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Revenue Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <ChartContainer
                      config={{
                        total: {
                          label: "Revenue",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={revenueData}>
                          <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Manage key platform functions</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    <Button asChild variant="outline" className="justify-between">
                      <Link href="/admin/produce-categories">
                        <div className="flex items-center">
                          <Package className="mr-2 h-4 w-4" />
                          Manage Produce Categories
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-between">
                      <Link href="/admin/market-prices/upload">
                        <div className="flex items-center">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Market Prices
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-between">
                      <Link href="/admin/commission-tiers">
                        <div className="flex items-center">
                          <Percent className="mr-2 h-4 w-4" />
                          Set Commission Tiers
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-between">
                      <Link href="/admin/approvals">
                        <div className="flex items-center">
                          <CheckSquare className="mr-2 h-4 w-4" />
                          Review Pending Approvals
                        </div>
                        <Badge className="ml-2">18</Badge>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-between">
                      <Link href="/admin/floor-prices">
                        <div className="flex items-center">
                          <TrendingUp className="mr-2 h-4 w-4" />
                          Update Floor Prices
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Latest platform transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          id: "TX-12345",
                          buyer: "Metro Supermarkets",
                          group: "Nyeri Farmers Cooperative",
                          amount: 900000,
                          date: "2023-06-15",
                        },
                        {
                          id: "TX-12344",
                          buyer: "Fresh Grocers Ltd",
                          group: "Meru Vegetable Growers",
                          amount: 750000,
                          date: "2023-06-14",
                        },
                        {
                          id: "TX-12343",
                          buyer: "Hotel Suppliers Co.",
                          group: "Nakuru Farmers Association",
                          amount: 600000,
                          date: "2023-06-13",
                        },
                      ].map((tx) => (
                        <div key={tx.id} className="flex items-center">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">{tx.buyer}</p>
                            <p className="text-sm text-muted-foreground">{tx.group}</p>
                          </div>
                          <div className="ml-auto text-right">
                            <p className="text-sm font-medium">KES {tx.amount.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">{tx.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/admin/revenue-reports">
                        <FileText className="mr-2 h-4 w-4" />
                        View All Transactions
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Top Performing Groups</CardTitle>
                    <CardDescription>Groups with highest transaction volume</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          name: "Nyeri Farmers Cooperative",
                          location: "Nyeri County",
                          transactions: 32,
                          volume: 4500000,
                        },
                        {
                          name: "Meru Vegetable Growers",
                          location: "Meru County",
                          transactions: 28,
                          volume: 3800000,
                        },
                        {
                          name: "Nakuru Farmers Association",
                          location: "Nakuru County",
                          transactions: 25,
                          volume: 3200000,
                        },
                      ].map((group) => (
                        <div key={group.name} className="flex items-center">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">{group.name}</p>
                            <p className="text-sm text-muted-foreground">{group.location}</p>
                          </div>
                          <div className="ml-auto text-right">
                            <p className="text-sm font-medium">KES {group.volume.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">{group.transactions} transactions</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/admin/groups">
                        <Users className="mr-2 h-4 w-4" />
                        View All Groups
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Top Buyers</CardTitle>
                    <CardDescription>Buyers with highest purchase volume</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          name: "Metro Supermarkets",
                          location: "Nairobi",
                          transactions: 45,
                          volume: 5200000,
                        },
                        {
                          name: "Fresh Grocers Ltd",
                          location: "Nairobi, Mombasa",
                          transactions: 38,
                          volume: 4300000,
                        },
                        {
                          name: "Hotel Suppliers Co.",
                          location: "Nairobi, Nakuru",
                          transactions: 30,
                          volume: 3500000,
                        },
                      ].map((buyer) => (
                        <div key={buyer.name} className="flex items-center">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">{buyer.name}</p>
                            <p className="text-sm text-muted-foreground">{buyer.location}</p>
                          </div>
                          <div className="ml-auto text-right">
                            <p className="text-sm font-medium">KES {buyer.volume.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">{buyer.transactions} transactions</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/admin/buyers">
                        <Users className="mr-2 h-4 w-4" />
                        View All Buyers
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="revenue" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">KES 12,700,000</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Platform Fees</CardTitle>
                    <Percent className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">KES 1,270,000</div>
                    <p className="text-xs text-muted-foreground">10% of total revenue</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Finance Markup</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">KES 381,000</div>
                    <p className="text-xs text-muted-foreground">3% of total revenue</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Transport & QC</CardTitle>
                    <Truck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">KES 635,000</div>
                    <p className="text-xs text-muted-foreground">5% of total revenue</p>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                  <CardDescription>Monthly revenue from all sources</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <ChartContainer
                    config={{
                      total: {
                        label: "Revenue",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={revenueData}>
                        <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button asChild variant="outline">
                    <Link href="/admin/revenue-reports">
                      <PieChart className="mr-2 h-4 w-4" />
                      Detailed Reports
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/admin/commission-tiers">
                      <Percent className="mr-2 h-4 w-4" />
                      Manage Commission Tiers
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="savings" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
                    <PiggyBank className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">KES 9,500,000</div>
                    <p className="text-xs text-muted-foreground">+15.3% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Interest Accrued</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">KES 950,000</div>
                    <p className="text-xs text-muted-foreground">10% annual rate</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Contributing Farmers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,245</div>
                    <p className="text-xs text-muted-foreground">+85 from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. per Farmer</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">KES 7,630</div>
                    <p className="text-xs text-muted-foreground">+5.2% from last month</p>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Savings Growth</CardTitle>
                  <CardDescription>Monthly savings accumulation</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <ChartContainer
                    config={{
                      total: {
                        label: "Savings",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={savingsData}>
                        <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/admin/savings">
                      <PiggyBank className="mr-2 h-4 w-4" />
                      Manage Savings
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="management" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Produce Management</CardTitle>
                    <CardDescription>Manage produce categories and pricing</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    <Button asChild variant="outline" className="justify-between">
                      <Link href="/admin/produce-categories">
                        <div className="flex items-center">
                          <Package className="mr-2 h-4 w-4" />
                          Manage Categories
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-between">
                      <Link href="/admin/produce">
                        <div className="flex items-center">
                          <Plus className="mr-2 h-4 w-4" />
                          Add New Produce
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-between">
                      <Link href="/admin/floor-prices">
                        <div className="flex items-center">
                          <TrendingUp className="mr-2 h-4 w-4" />
                          Set Floor Prices
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Market Data</CardTitle>
                    <CardDescription>Manage market prices and trends</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    <Button asChild variant="outline" className="justify-between">
                      <Link href="/admin/market-prices/upload">
                        <div className="flex items-center">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Market Prices
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-between">
                      <Link href="/admin/prices">
                        <div className="flex items-center">
                          <BarChart3 className="mr-2 h-4 w-4" />
                          View Price History
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Settings</CardTitle>
                    <CardDescription>Configure platform parameters</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    <Button asChild variant="outline" className="justify-between">
                      <Link href="/admin/commission-tiers">
                        <div className="flex items-center">
                          <Percent className="mr-2 h-4 w-4" />
                          Commission Tiers
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-between">
                      <Link href="/admin/approvals">
                        <div className="flex items-center">
                          <CheckSquare className="mr-2 h-4 w-4" />
                          Pending Approvals
                        </div>
                        <Badge className="ml-2">18</Badge>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-between">
                      <Link href="/admin/regions">
                        <div className="flex items-center">
                          <FileText className="mr-2 h-4 w-4" />
                          Manage Regions
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Platform Activity</CardTitle>
                  <CardDescription>Monthly transaction volume</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <ChartContainer
                    config={{
                      total: {
                        label: "Transactions",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={transactionsData}>
                        <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
