"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
import { Building, MapPin, Phone, Mail, Calendar, Package, Star, AlertTriangle, CheckCircle, Clock } from "lucide-react"

// Mock data for buyer profile
interface BuyerProfile {
  id: string
  name: string
  email: string
  phone: string
  location: string
  address: string
  registrationDate: string
  businessType: string
  contactPerson: string
  trustScore: number
  verificationStatus: string
  paymentHistory: {
    onTime: number
    late: number
    missed: number
  }
}

interface Order {
  id: string
  date: string
  produce: string
  quantity: string
  amount: string
  status: string
  groupId: string
  groupName: string
}

interface PaymentRecord {
  id: string
  date: string
  amount: string
  orderId: string
  method: string
  status: string
}

interface VolumeData {
  month: string
  volume: number
}

interface SpendingData {
  month: string
  amount: number
}

interface ProduceDistribution {
  name: string
  value: number
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

export function BuyerCRMProfile({ buyerId }: { buyerId: string }) {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data - in a real app, this would be fetched from an API
  const buyerProfile: BuyerProfile = {
    id: buyerId,
    name: "Nairobi Fresh Foods Ltd",
    email: "procurement@nairobifresh.co.ke",
    phone: "+254712345678",
    location: "Nairobi",
    address: "Industrial Area, Enterprise Road, Nairobi",
    registrationDate: "2022-01-15",
    businessType: "Food Processor",
    contactPerson: "John Kamau",
    trustScore: 4.8,
    verificationStatus: "verified",
    paymentHistory: {
      onTime: 22,
      late: 2,
      missed: 0,
    },
  }

  const recentOrders: Order[] = [
    {
      id: "ORD-2023-001",
      date: "2023-06-15",
      produce: "Potatoes",
      quantity: "5 tons",
      amount: "KES 400,000",
      status: "Delivered",
      groupId: "GRP-001",
      groupName: "Nyeri Farmers Cooperative",
    },
    {
      id: "ORD-2023-002",
      date: "2023-06-01",
      produce: "Tomatoes",
      quantity: "3 tons",
      amount: "KES 360,000",
      status: "In Transit",
      groupId: "GRP-003",
      groupName: "Meru Tomato Growers",
    },
    {
      id: "ORD-2023-003",
      date: "2023-05-20",
      produce: "Kale",
      quantity: "2 tons",
      amount: "KES 160,000",
      status: "Delivered",
      groupId: "GRP-002",
      groupName: "Kiambu Green Farmers",
    },
    {
      id: "ORD-2023-004",
      date: "2023-05-10",
      produce: "Onions",
      quantity: "4 tons",
      amount: "KES 320,000",
      status: "Delivered",
      groupId: "GRP-004",
      groupName: "Kajiado Farmers Association",
    },
    {
      id: "ORD-2023-005",
      date: "2023-04-25",
      produce: "Potatoes",
      quantity: "6 tons",
      amount: "KES 480,000",
      status: "Delivered",
      groupId: "GRP-001",
      groupName: "Nyeri Farmers Cooperative",
    },
  ]

  const recentPayments: PaymentRecord[] = [
    {
      id: "PAY-2023-001",
      date: "2023-06-15",
      amount: "KES 400,000",
      orderId: "ORD-2023-001",
      method: "Bank Transfer",
      status: "Completed",
    },
    {
      id: "PAY-2023-002",
      date: "2023-06-01",
      amount: "KES 180,000",
      orderId: "ORD-2023-002",
      method: "M-PESA",
      status: "Completed",
    },
    {
      id: "PAY-2023-003",
      date: "2023-05-20",
      amount: "KES 160,000",
      orderId: "ORD-2023-003",
      method: "Bank Transfer",
      status: "Completed",
    },
    {
      id: "PAY-2023-004",
      date: "2023-05-10",
      amount: "KES 320,000",
      orderId: "ORD-2023-004",
      method: "M-PESA",
      status: "Completed",
    },
    {
      id: "PAY-2023-005",
      date: "2023-04-25",
      amount: "KES 480,000",
      orderId: "ORD-2023-005",
      method: "Bank Transfer",
      status: "Completed",
    },
  ]

  const volumeData: VolumeData[] = [
    { month: "Jan", volume: 12 },
    { month: "Feb", volume: 15 },
    { month: "Mar", volume: 18 },
    { month: "Apr", volume: 20 },
    { month: "May", volume: 22 },
    { month: "Jun", volume: 25 },
  ]

  const spendingData: SpendingData[] = [
    { month: "Jan", amount: 960000 },
    { month: "Feb", amount: 1200000 },
    { month: "Mar", amount: 1440000 },
    { month: "Apr", amount: 1600000 },
    { month: "May", amount: 1760000 },
    { month: "Jun", amount: 2000000 },
  ]

  const produceDistribution: ProduceDistribution[] = [
    { name: "Potatoes", value: 45 },
    { name: "Tomatoes", value: 20 },
    { name: "Kale", value: 15 },
    { name: "Onions", value: 10 },
    { name: "Carrots", value: 5 },
    { name: "Others", value: 5 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Buyer Profile</CardTitle>
            <CardDescription>Detailed information about {buyerProfile.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-2xl">
                    {buyerProfile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <div className="font-semibold text-lg">{buyerProfile.name}</div>
                  <div className="text-sm text-muted-foreground">{buyerProfile.businessType}</div>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-medium">{buyerProfile.trustScore}</span>
                  <span className="text-sm text-muted-foreground ml-1">Trust Score</span>
                </div>
                <Badge variant={buyerProfile.verificationStatus === "verified" ? "default" : "outline"}>
                  {buyerProfile.verificationStatus === "verified" ? "Verified Buyer" : "Unverified"}
                </Badge>
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <Building className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Business Name</div>
                      <div>{buyerProfile.name}</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Location</div>
                      <div>{buyerProfile.address}</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Phone</div>
                      <div>{buyerProfile.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Email</div>
                      <div>{buyerProfile.email}</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Registration Date</div>
                      <div>{new Date(buyerProfile.registrationDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Package className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Contact Person</div>
                      <div>{buyerProfile.contactPerson}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="text-sm font-medium mb-2">Payment History</div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-green-50 rounded-md p-2">
                      <div className="text-green-600 font-medium">{buyerProfile.paymentHistory.onTime}</div>
                      <div className="text-xs text-muted-foreground">On Time</div>
                    </div>
                    <div className="bg-yellow-50 rounded-md p-2">
                      <div className="text-yellow-600 font-medium">{buyerProfile.paymentHistory.late}</div>
                      <div className="text-xs text-muted-foreground">Late</div>
                    </div>
                    <div className="bg-red-50 rounded-md p-2">
                      <div className="text-red-600 font-medium">{buyerProfile.paymentHistory.missed}</div>
                      <div className="text-xs text-muted-foreground">Missed</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full lg:w-80">
          <CardHeader>
            <CardTitle>Trust Score</CardTitle>
            <CardDescription>Based on order history and payment reliability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-muted stroke-current"
                    strokeWidth="10"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                  ></circle>
                  <circle
                    className="text-green-500 stroke-current"
                    strokeWidth="10"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    strokeDasharray={`${buyerProfile.trustScore * 25}, 250`}
                    transform="rotate(-90 50 50)"
                  ></circle>
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-bold">{buyerProfile.trustScore}</span>
                  <span className="text-xs text-muted-foreground">out of 5</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Order Reliability</span>
                <span>95%</span>
              </div>
              <Progress value={95} className="h-2" />

              <div className="flex justify-between text-sm">
                <span>Payment Timeliness</span>
                <span>92%</span>
              </div>
              <Progress value={92} className="h-2" />

              <div className="flex justify-between text-sm">
                <span>Communication</span>
                <span>98%</span>
              </div>
              <Progress value={98} className="h-2" />

              <div className="flex justify-between text-sm">
                <span>Dispute Resolution</span>
                <span>90%</span>
              </div>
              <Progress value={90} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+8% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">48 tons</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">KES 3.84M</div>
                <p className="text-xs text-muted-foreground">+10% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">2 in transit, 1 processing</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Last 5 orders placed by this buyer</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Produce</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.slice(0, 5).map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                        <TableCell>{order.produce}</TableCell>
                        <TableCell>{order.amount}</TableCell>
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

            <Card>
              <CardHeader>
                <CardTitle>Produce Distribution</CardTitle>
                <CardDescription>Types of produce purchased</CardDescription>
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

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>Complete order history for this buyer</CardDescription>
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
                    <TableHead>Group</TableHead>
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
                      <TableCell>{order.groupName}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {order.status === "Delivered" ? (
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                          ) : order.status === "In Transit" ? (
                            <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                          )}
                          <span>{order.status}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Complete payment history for this buyer</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                      <TableCell>{payment.amount}</TableCell>
                      <TableCell>{payment.orderId}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            payment.status === "Completed"
                              ? "default"
                              : payment.status === "Pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {payment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Volume Trends</CardTitle>
                <CardDescription>Monthly purchase volume in tons</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      volume: {
                        label: "Volume (tons)",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={volumeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="volume" fill="var(--color-volume)" name="Volume (tons)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Spending Trends</CardTitle>
                <CardDescription>Monthly spending in KES</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      amount: {
                        label: "Amount (KES)",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={spendingData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="amount"
                          stroke="var(--color-amount)"
                          name="Amount (KES)"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
