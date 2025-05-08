"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Users, MapPin, Phone, Mail, Calendar, Star, User } from "lucide-react"

// Mock data for seller profile
interface SellerProfile {
  id: string
  name: string
  email: string
  phone: string
  location: string
  address: string
  registrationDate: string
  memberCount: number
  contactPerson: string
  trustScore: number
  verificationStatus: string
  totalIncome: string
  totalVolume: string
}

interface ProduceSubmission {
  id: string
  date: string
  produce: string
  quantity: string
  quality: string
  status: string
}

interface Order {
  id: string
  date: string
  produce: string
  quantity: string
  amount: string
  status: string
  buyerId: string
  buyerName: string
}

interface FarmerContribution {
  farmerId: string
  farmerName: string
  produce: string
  quantity: string
  percentage: number
  earnings: string
  orderId: string
}

interface SavingsSummary {
  totalSavings: string
  interestEarned: string
  projectedAnnualInterest: string
  nextPayoutDate: string
  savingsRate: string
}

interface MonthlyIncome {
  month: string
  income: number
}

interface ProduceDistribution {
  name: string
  value: number
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

export function SellerCRMProfile({ sellerId }: { sellerId: string }) {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data - in a real app, this would be fetched from an API
  const sellerProfile: SellerProfile = {
    id: sellerId,
    name: "Nyeri Farmers Cooperative",
    email: "info@nyerifarmers.co.ke",
    phone: "+254712345678",
    location: "Nyeri County",
    address: "Nyeri Town, Kimathi Way",
    registrationDate: "2021-03-10",
    memberCount: 120,
    contactPerson: "Mary Wanjiku",
    trustScore: 4.7,
    verificationStatus: "verified",
    totalIncome: "KES 4,800,000",
    totalVolume: "60 tons",
  }

  const recentProduceSubmissions: ProduceSubmission[] = [
    {
      id: "PRD-2023-001",
      date: "2023-06-15",
      produce: "Potatoes",
      quantity: "5 tons",
      quality: "Grade A",
      status: "Accepted",
    },
    {
      id: "PRD-2023-002",
      date: "2023-06-01",
      produce: "Potatoes",
      quantity: "4 tons",
      quality: "Grade A",
      status: "Accepted",
    },
    {
      id: "PRD-2023-003",
      date: "2023-05-20",
      produce: "Potatoes",
      quantity: "6 tons",
      quality: "Grade B",
      status: "Accepted",
    },
    {
      id: "PRD-2023-004",
      date: "2023-05-10",
      produce: "Potatoes",
      quantity: "3 tons",
      quality: "Grade A",
      status: "Accepted",
    },
    {
      id: "PRD-2023-005",
      date: "2023-04-25",
      produce: "Potatoes",
      quantity: "7 tons",
      quality: "Grade A",
      status: "Accepted",
    },
  ]

  const recentOrders: Order[] = [
    {
      id: "ORD-2023-001",
      date: "2023-06-15",
      produce: "Potatoes",
      quantity: "5 tons",
      amount: "KES 400,000",
      status: "Delivered",
      buyerId: "BUY-001",
      buyerName: "Nairobi Fresh Foods Ltd",
    },
    {
      id: "ORD-2023-002",
      date: "2023-06-01",
      produce: "Potatoes",
      quantity: "4 tons",
      amount: "KES 320,000",
      status: "Delivered",
      buyerId: "BUY-003",
      buyerName: "Kisumu Supermarkets Ltd",
    },
    {
      id: "ORD-2023-003",
      date: "2023-05-20",
      produce: "Potatoes",
      quantity: "6 tons",
      amount: "KES 480,000",
      status: "Delivered",
      buyerId: "BUY-001",
      buyerName: "Nairobi Fresh Foods Ltd",
    },
    {
      id: "ORD-2023-004",
      date: "2023-05-10",
      produce: "Potatoes",
      quantity: "3 tons",
      amount: "KES 240,000",
      status: "Delivered",
      buyerId: "BUY-002",
      buyerName: "Mombasa Grocers Association",
    },
    {
      id: "ORD-2023-005",
      date: "2023-04-25",
      produce: "Potatoes",
      quantity: "7 tons",
      amount: "KES 560,000",
      status: "Delivered",
      buyerId: "BUY-001",
      buyerName: "Nairobi Fresh Foods Ltd",
    },
  ]

  const farmerContributions: FarmerContribution[] = [
    {
      farmerId: "FRM-001",
      farmerName: "John Mwangi",
      produce: "Potatoes",
      quantity: "1.2 tons",
      percentage: 24,
      earnings: "KES 96,000",
      orderId: "ORD-2023-001",
    },
    {
      farmerId: "FRM-002",
      farmerName: "Jane Njeri",
      produce: "Potatoes",
      quantity: "0.8 tons",
      percentage: 16,
      earnings: "KES 64,000",
      orderId: "ORD-2023-001",
    },
    {
      farmerId: "FRM-003",
      farmerName: "Peter Kamau",
      produce: "Potatoes",
      quantity: "1.5 tons",
      percentage: 30,
      earnings: "KES 120,000",
      orderId: "ORD-2023-001",
    },
    {
      farmerId: "FRM-004",
      farmerName: "Grace Wambui",
      produce: "Potatoes",
      quantity: "1.0 tons",
      percentage: 20,
      earnings: "KES 80,000",
      orderId: "ORD-2023-001",
    },
    {
      farmerId: "FRM-005",
      farmerName: "David Kariuki",
      produce: "Potatoes",
      quantity: "0.5 tons",
      percentage: 10,
      earnings: "KES 40,000",
      orderId: "ORD-2023-001",
    },
  ]

  const savingsSummary: SavingsSummary = {
    totalSavings: "KES 240,000",
    interestEarned: "KES 12,000",
    projectedAnnualInterest: "KES 24,000",
    nextPayoutDate: "2023-12-31",
    savingsRate: "KES 2/kg",
  }

  const monthlyIncome: MonthlyIncome[] = [
    { month: "Jan", income: 320000 },
    { month: "Feb", income: 400000 },
    { month: "Mar", income: 480000 },
    { month: "Apr", income: 560000 },
    { month: "May", income: 640000 },
    { month: "Jun", income: 720000 },
  ]

  const produceDistribution: ProduceDistribution[] = [
    { name: "Grade A", value: 70 },
    { name: "Grade B", value: 25 },
    { name: "Grade C", value: 5 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Seller Profile</CardTitle>
            <CardDescription>Detailed information about {sellerProfile.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-2xl">
                    {sellerProfile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <div className="font-semibold text-lg">{sellerProfile.name}</div>
                  <div className="text-sm text-muted-foreground">Farmer Group</div>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-medium">{sellerProfile.trustScore}</span>
                  <span className="text-sm text-muted-foreground ml-1">Trust Score</span>
                </div>
                <Badge variant={sellerProfile.verificationStatus === "verified" ? "default" : "outline"}>
                  {sellerProfile.verificationStatus === "verified" ? "Verified Seller" : "Unverified"}
                </Badge>
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Group Name</div>
                      <div>{sellerProfile.name}</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Location</div>
                      <div>{sellerProfile.address}</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Phone</div>
                      <div>{sellerProfile.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Email</div>
                      <div>{sellerProfile.email}</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Registration Date</div>
                      <div>{new Date(sellerProfile.registrationDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <User className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Contact Person</div>
                      <div>{sellerProfile.contactPerson}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="text-sm font-medium mb-2">Group Statistics</div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-blue-50 rounded-md p-2">
                      <div className="text-blue-600 font-medium">{sellerProfile.memberCount}</div>
                      <div className="text-xs text-muted-foreground">Members</div>
                    </div>
                    <div className="bg-green-50 rounded-md p-2">
                      <div className="text-green-600 font-medium">{sellerProfile.totalVolume}</div>
                      <div className="text-xs text-muted-foreground">Total Volume</div>
                    </div>
                    <div className="bg-purple-50 rounded-md p-2">
                      <div className="text-purple-600 font-medium">{sellerProfile.totalIncome}</div>
                      <div className="text-xs text-muted-foreground">Total Income</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full lg:w-80">
          <CardHeader>
            <CardTitle>Savings Summary</CardTitle>
            <CardDescription>Group savings and projected payouts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Savings</span>
                <span className="font-medium">{savingsSummary.totalSavings}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Interest Earned</span>
                <span className="font-medium">{savingsSummary.interestEarned}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Projected Annual Interest</span>
                <span className="font-medium">{savingsSummary.projectedAnnualInterest}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Next Payout Date</span>
                <span className="font-medium">{new Date(savingsSummary.nextPayoutDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Savings Rate</span>
                <span className="font-medium">{savingsSummary.savingsRate}</span>
              </div>
            </div>

            <div className="pt-2">
              <Button className="w-full">View Detailed Savings Report</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="produce">Produce</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="farmers">Farmers</TabsTrigger>
          <TabsTrigger value="savings">Savings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sellerProfile.memberCount}</div>
                <p className="text-xs text-muted-foreground">+5 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sellerProfile.totalVolume}</div>
                <p className="text-xs text-muted-foreground">+8 tons from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sellerProfile.totalIncome}</div>
                <p className="text-xs text-muted-foreground">+KES 640,000 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">1 in transit, 1 processing</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Income</CardTitle>
                <CardDescription>Income trends over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      income: {
                        label: "Income (KES)",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyIncome}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="income"
                          stroke="var(--color-income)"
                          name="Income (KES)"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Produce Quality Distribution</CardTitle>
                <CardDescription>Distribution by quality grade</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={produceDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {produceDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="produce" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Produce Submissions</CardTitle>
              <CardDescription>History of produce submitted by this group</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Submission ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Produce</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Quality</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentProduceSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.id}</TableCell>
                      <TableCell>{new Date(submission.date).toLocaleDateString()}</TableCell>
                      <TableCell>{submission.produce}</TableCell>
                      <TableCell>{submission.quantity}</TableCell>
                      <TableCell>{submission.quality}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            submission.status === "Accepted"
                              ? "default"
                              : submission.status === "Pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {submission.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>Complete order history for this group</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Produce</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                      <TableCell>{order.produce}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>{order.amount}</TableCell>
                      <TableCell>{order.buyerName}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.status === "Delivered"
                              ? "default"
                              : order.status === "In Transit"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="farmers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Farmer Contributions</CardTitle>
              <CardDescription>Breakdown of farmer contributions for order ORD-2023-001</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Farmer ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Produce</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Earnings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {farmerContributions.map((contribution) => (
                    <TableRow key={contribution.farmerId}>
                      <TableCell className="font-medium">{contribution.farmerId}</TableCell>
                      <TableCell>{contribution.farmerName}</TableCell>
                      <TableCell>{contribution.produce}</TableCell>
                      <TableCell>{contribution.quantity}</TableCell>
                      <TableCell>{contribution.percentage}%</TableCell>
                      <TableCell>{contribution.earnings}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="savings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{savingsSummary.totalSavings}</div>
                <p className="text-xs text-muted-foreground">From all transactions</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Interest Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{savingsSummary.interestEarned}</div>
                <p className="text-xs text-muted-foreground">Year to date</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Projected Interest</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{savingsSummary.projectedAnnualInterest}</div>
                <p className="text-xs text-muted-foreground">Annual projection</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Next Payout</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{new Date(savingsSummary.nextPayoutDate).toLocaleDateString()}</div>
                <p className="text-xs text-muted-foreground">Annual distribution</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Savings Forecast</CardTitle>
              <CardDescription>Projected savings growth over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    savings: {
                      label: "Savings (KES)",
                      color: "hsl(var(--chart-1))",
                    },
                    interest: {
                      label: "Interest (KES)",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { year: "2023", savings: 240000, interest: 12000 },
                        { year: "2024", savings: 480000, interest: 36000 },
                        { year: "2025", savings: 720000, interest: 72000 },
                        { year: "2026", savings: 960000, interest: 120000 },
                        { year: "2027", savings: 1200000, interest: 180000 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="savings" fill="var(--color-savings)" name="Savings (KES)" />
                      <Bar dataKey="interest" fill="var(--color-interest)" name="Interest (KES)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
