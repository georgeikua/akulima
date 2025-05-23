"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Clock, Download, Gavel, Truck, Users, Wallet, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ProtectedRoute } from "@/components/protected-route"
import { GroupAnalytics } from "@/components/group-analytics"

// Sample recent bids data
const recentBids = [
  {
    id: "BID-001",
    buyer: "Nairobi Fresh Produce Ltd",
    produce: "Tomatoes",
    quantity: "500 kg",
    value: "KES 60,000",
    status: "pending",
    date: "2023-12-15",
  },
  {
    id: "BID-002",
    buyer: "Kenya Grocers Association",
    produce: "Kale (Sukuma Wiki)",
    quantity: "1000 bundles",
    value: "KES 25,000",
    status: "accepted",
    date: "2023-12-10",
  },
  {
    id: "BID-003",
    buyer: "Fresh Avocados Inc",
    produce: "Avocado",
    quantity: "300 kg",
    value: "KES 45,000",
    status: "rejected",
    date: "2023-12-05",
  },
]

// Sample recent payments data
const recentPayments = [
  {
    id: "PAY-001",
    title: "Tomatoes Sales - December 2023",
    amount: "KES 60,000",
    status: "pending",
    date: "2023-12-15",
  },
  {
    id: "PAY-002",
    title: "Kale Sales - December 2023",
    amount: "KES 25,000",
    status: "distributed",
    date: "2023-12-10",
  },
  {
    id: "PAY-003",
    title: "Avocado Sales - November 2023",
    amount: "KES 45,000",
    status: "distributed",
    date: "2023-11-25",
  },
]

// Sample transit data
const transitItems = [
  {
    id: "TRN-001",
    buyer: "Nairobi Fresh Produce Ltd",
    produce: "Tomatoes",
    quantity: "500 kg",
    status: "in_transit",
    location: "Karatina",
    estimatedDelivery: "2023-12-17",
  },
  {
    id: "TRN-002",
    buyer: "Kenya Grocers Association",
    produce: "Kale (Sukuma Wiki)",
    quantity: "1000 bundles",
    status: "delivered",
    location: "Nairobi CBD",
    estimatedDelivery: "2023-12-12",
  },
]

// Sample upcoming events
const upcomingEvents = [
  {
    id: "EVT-001",
    title: "Tomatoes Delivery",
    date: "2023-12-17",
    type: "delivery",
  },
  {
    id: "EVT-002",
    title: "Payment Distribution",
    date: "2023-12-20",
    type: "payment",
  },
  {
    id: "EVT-003",
    title: "Member Meeting",
    date: "2023-12-22",
    type: "meeting",
  },
]

// Sample open bids
const openBids = [
  {
    id: "WM-2025-001",
    buyer: "Nairobi Fresh Markets Ltd",
    produce: "Watermelons (Premium)",
    quantity: "3,000 kg",
    deadline: "2025-05-15",
    price: 74,
    total: 222000,
  },
  {
    id: "BID-002",
    buyer: "Fresh Market Kenya",
    produce: "Kale (Sukuma Wiki)",
    quantity: "1000 bundles",
    deadline: "2023-12-22",
    price: 40,
    total: 40000,
  },
  {
    id: "BID-003",
    buyer: "Carrefour Supermarket",
    produce: "Avocados",
    quantity: "800 kg",
    deadline: "2023-12-25",
    price: 150,
    total: 120000,
  },
]

export default function GroupDashboardPage() {
  const [timeframe, setTimeframe] = useState("week")

  // Get status badge variant
  const getBidStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400"
          >
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case "accepted":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
          >
            <Users className="mr-1 h-3 w-3" />
            Accepted
          </Badge>
        )
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400"
          >
            <Clock className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Get payment status badge variant
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400"
          >
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case "distributed":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
          >
            <Users className="mr-1 h-3 w-3" />
            Distributed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Get transit status badge variant
  const getTransitStatusBadge = (status: string) => {
    switch (status) {
      case "in_transit":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400"
          >
            <Truck className="mr-1 h-3 w-3" />
            In Transit
          </Badge>
        )
      case "delivered":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
          >
            <Users className="mr-1 h-3 w-3" />
            Delivered
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Get event type badge variant
  const getEventTypeBadge = (type: string) => {
    switch (type) {
      case "delivery":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400"
          >
            <Truck className="mr-1 h-3 w-3" />
            Delivery
          </Badge>
        )
      case "payment":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
          >
            <Wallet className="mr-1 h-3 w-3" />
            Payment
          </Badge>
        )
      case "meeting":
        return (
          <Badge
            variant="outline"
            className="bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400"
          >
            <Users className="mr-1 h-3 w-3" />
            Meeting
          </Badge>
        )
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  return (
    <ProtectedRoute allowedRoles={["group", "admin"]}>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Group Dashboard</h1>
            <p className="text-muted-foreground">Welcome to your Akulima Group dashboard</p>
          </div>
          <div className="flex gap-2">
            <Tabs value={timeframe} onValueChange={setTimeframe} className="w-full sm:w-[400px]">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="icon" className="hidden sm:flex">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Quick Actions - Made more prominent */}
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for group management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <Button asChild variant="default" className="h-24 flex-col">
                <Link href="/group-members/add">
                  <Users className="mb-2 h-5 w-5" />
                  <span>Add Member</span>
                </Link>
              </Button>
              <Button asChild variant="default" className="h-24 flex-col">
                <Link href="/orders">
                  <Gavel className="mb-2 h-5 w-5" />
                  <span>Submit Bid</span>
                </Link>
              </Button>
              <Button asChild variant="default" className="h-24 flex-col">
                <Link href="/payments">
                  <Wallet className="mb-2 h-5 w-5" />
                  <span>Disburse Payment</span>
                </Link>
              </Button>
              <Button asChild variant="default" className="h-24 flex-col">
                <Link href="/calendar">
                  <Calendar className="mb-2 h-5 w-5" />
                  <span>Schedule Meeting</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Open Bids Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Open Bids</CardTitle>
              <CardDescription>Available opportunities to bid on</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/orders">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {openBids.map((bid) => (
                <div
                  key={bid.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-3"
                >
                  <div>
                    <p className="font-medium">{bid.produce}</p>
                    <p className="text-sm text-muted-foreground">
                      {bid.buyer} • {bid.quantity} •{" "}
                      <span className="text-primary font-medium">KES {bid.price}/kg</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <span className="text-xs text-muted-foreground">Deadline: {bid.deadline}</span>
                    <Button asChild size="sm">
                      <Link href={`/orders/${bid.id}/bid`}>Bid Now</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/orders">
                <Gavel className="mr-2 h-4 w-4" />
                View All Open Bids
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Upcoming Calendar Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Upcoming Calendar</h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/calendar">View Full Calendar</Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <Calendar className="h-10 w-10 text-primary" />
              <div>
                <h3 className="font-medium">Tomatoes Delivery</h3>
                <p className="text-sm text-muted-foreground">Tomorrow, 10:00 AM</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <Truck className="h-10 w-10 text-primary" />
              <div>
                <h3 className="font-medium">Produce Pickup - Nairobi Grocers</h3>
                <p className="text-sm text-muted-foreground">Wednesday, 8:00 AM</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <Users className="h-10 w-10 text-primary" />
              <div>
                <h3 className="font-medium">Member Meeting</h3>
                <p className="text-sm text-muted-foreground">Friday, 2:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92</div>
              <p className="text-xs text-muted-foreground">+15% from last year</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bids</CardTitle>
              <Gavel className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Transit</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">1 delivery pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KES 60,000</div>
              <p className="text-xs text-muted-foreground">1 pending disbursement</p>
            </CardContent>
          </Card>
        </div>

        <GroupAnalytics />

        {/* Mobile Analytics Section - Text-based for smaller screens */}
        <div className="md:hidden">
          <Card>
            <CardHeader>
              <CardTitle>Group Analytics</CardTitle>
              <CardDescription>View detailed analytics on a larger screen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Total Sales (2023)</span>
                  <span className="font-bold">KES 535,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Top Produce</span>
                  <span className="font-bold">Coffee</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Member Growth</span>
                  <span className="font-bold">+15%</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard">View Full Analytics</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Recent Bids</CardTitle>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bid</TableHead>
                    <TableHead>Produce</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentBids.map((bid) => (
                    <TableRow key={bid.id}>
                      <TableCell className="font-medium">
                        {bid.id}
                        <div className="text-xs text-muted-foreground">{bid.buyer}</div>
                      </TableCell>
                      <TableCell>
                        {bid.produce}
                        <div className="text-xs text-muted-foreground">{bid.quantity}</div>
                      </TableCell>
                      <TableCell>{getBidStatusBadge(bid.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/bids">
                  <Gavel className="mr-2 h-4 w-4" />
                  Manage Bids
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Recent Payments</CardTitle>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        {payment.id}
                        <div className="text-xs text-muted-foreground">{payment.title}</div>
                      </TableCell>
                      <TableCell>{payment.amount}</TableCell>
                      <TableCell>{getPaymentStatusBadge(payment.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/payments">
                  <Wallet className="mr-2 h-4 w-4" />
                  Manage Payments
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Your schedule for the next few days</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                <Calendar className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border">
                      <span className="text-sm font-medium">{new Date(event.date).getDate()}</span>
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.date).toLocaleDateString(undefined, {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="ml-auto">{getEventTypeBadge(event.type)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/calendar">
                  <Calendar className="mr-2 h-4 w-4" />
                  View Calendar
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Transit Tracking</CardTitle>
              <CardDescription>Track your produce in transit</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Produce</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transitItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.id}
                        <div className="text-xs text-muted-foreground">{item.buyer}</div>
                      </TableCell>
                      <TableCell>
                        {item.produce}
                        <div className="text-xs text-muted-foreground">{item.quantity}</div>
                      </TableCell>
                      <TableCell>
                        {item.location}
                        <div className="text-xs text-muted-foreground">
                          Est. Delivery: {new Date(item.estimatedDelivery).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>{getTransitStatusBadge(item.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/transit">
                  <Truck className="mr-2 h-4 w-4" />
                  View All Shipments
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
