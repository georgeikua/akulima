"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  Calendar,
  Clock,
  Package,
  Plus,
  RefreshCw,
  Search,
  ShoppingCart,
  Truck,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/lib/auth-context"
import { OverviewCard } from "@/components/overview-card"

// Sample data for active requests
const activeRequests = [
  {
    id: "req-001",
    title: "Fresh Watermelons",
    buyer: "Metro Supermarket",
    location: "Nairobi",
    quantity: "3 ton truck",
    grade: "Grade A",
    price: 400,
    deadline: "3 days",
    status: "active",
    responses: 4,
  },
  {
    id: "req-002",
    title: "Grade A Tomatoes",
    buyer: "Fresh Foods Hotel",
    location: "Nakuru",
    quantity: "1 ton truck",
    grade: "Grade A",
    price: 120,
    deadline: "5 days",
    status: "active",
    responses: 2,
  },
]

// Sample data for upcoming deliveries
const upcomingDeliveries = [
  {
    id: "del-001",
    product: "Watermelons",
    group: "Wanake Group",
    quantity: "3 ton truck",
    date: "2023-05-18",
    status: "confirmed",
    location: "Nairobi Warehouse",
  },
  {
    id: "del-002",
    product: "Tomatoes",
    group: "Mkulima Youth Group",
    quantity: "1 ton truck",
    date: "2023-05-20",
    status: "in transit",
    location: "Nakuru Distribution Center",
  },
]

// Sample data for trusted groups
const trustedGroups = [
  {
    id: "grp-001",
    name: "Wanake Group",
    location: "Nakuru",
    members: 48,
    rating: 4.8,
    ordersCompleted: 24,
  },
  {
    id: "grp-002",
    name: "Mkulima Youth Group",
    location: "Eldoret",
    members: 36,
    rating: 4.6,
    ordersCompleted: 18,
  },
  {
    id: "grp-003",
    name: "Kilimo Women Group",
    location: "Machakos",
    members: 52,
    rating: 4.9,
    ordersCompleted: 32,
  },
]

export default function BuyerDashboardPage() {
  const { user } = useAuth()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1500)
  }

  return (
    <ProtectedRoute allowedRoles={["buyer"]}>
      <div className="space-y-6 pb-16">
        {/* Header with quick action buttons */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Buyer Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user?.name || "Buyer"}</p>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/post-request">
                  <Plus className="mr-2 h-4 w-4" />
                  Post Request
                </Link>
              </Button>
              <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
                {isRefreshing ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Refresh
              </Button>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Link href="/post-request">
              <Card className="h-full transition-all hover:bg-muted/50">
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <ShoppingCart className="mb-2 h-6 w-6 text-primary" />
                  <p className="text-center text-sm font-medium">Post New Request</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/market-prices">
              <Card className="h-full transition-all hover:bg-muted/50">
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <BarChart3 className="mb-2 h-6 w-6 text-primary" />
                  <p className="text-center text-sm font-medium">Market Prices</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/buyer-orders">
              <Card className="h-full transition-all hover:bg-muted/50">
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <Package className="mb-2 h-6 w-6 text-primary" />
                  <p className="text-center text-sm font-medium">Track Orders</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/trusted-groups">
              <Card className="h-full transition-all hover:bg-muted/50">
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <Users className="mb-2 h-6 w-6 text-primary" />
                  <p className="text-center text-sm font-medium">Trusted Groups</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <OverviewCard
            title="Active Requests"
            value={activeRequests.length.toString()}
            description="Open market requests"
            icon={ShoppingCart}
            trend="neutral"
            trendValue="Last updated today"
          />
          <OverviewCard
            title="Pending Deliveries"
            value={upcomingDeliveries.length.toString()}
            description="Scheduled deliveries"
            icon={Truck}
            trend="up"
            trendValue="2 new this week"
          />
          <OverviewCard
            title="Trusted Groups"
            value={trustedGroups.length.toString()}
            description="Preferred supplier groups"
            icon={Users}
            trend="up"
            trendValue="1 new this month"
          />
          <OverviewCard
            title="Total Spend"
            value="KES 245,800"
            description="Last 30 days"
            icon={BarChart3}
            trend="up"
            trendValue="12% from last month"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="active_requests" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active_requests">Active Requests</TabsTrigger>
            <TabsTrigger value="upcoming_deliveries">Upcoming Deliveries</TabsTrigger>
            <TabsTrigger value="trusted_groups">Trusted Groups</TabsTrigger>
          </TabsList>

          {/* Active Requests Tab */}
          <TabsContent value="active_requests" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search requests..." className="pl-8" />
              </div>
              <Button asChild>
                <Link href="/post-request">
                  <Plus className="mr-2 h-4 w-4" />
                  New Request
                </Link>
              </Button>
            </div>

            {activeRequests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <ShoppingCart className="mb-2 h-12 w-12 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No active requests</h3>
                  <p className="text-sm text-muted-foreground">Post a new request to start sourcing produce</p>
                  <Button asChild className="mt-4">
                    <Link href="/post-request">Post New Request</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activeRequests.map((request) => (
                  <Card key={request.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{request.title}</CardTitle>
                        <Badge>{request.status}</Badge>
                      </div>
                      <CardDescription>{request.location}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Quantity:</p>
                          <p className="font-medium">{request.quantity}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Grade:</p>
                          <p className="font-medium">{request.grade}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Price:</p>
                          <p className="font-medium">KES {request.price}/kg</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Deadline:</p>
                          <p className="font-medium">{request.deadline}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-1 text-sm text-primary">
                        <Users className="h-4 w-4" />
                        <span>{request.responses} group responses</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/market-requests/${request.id}`}>View Details</Link>
                      </Button>
                      <Button asChild size="sm">
                        <Link href={`/market-requests/${request.id}/responses`}>
                          View Responses
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Upcoming Deliveries Tab */}
          <TabsContent value="upcoming_deliveries" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search deliveries..." className="pl-8" />
              </div>
              <Button asChild variant="outline">
                <Link href="/calendar">
                  <Calendar className="mr-2 h-4 w-4" />
                  View Calendar
                </Link>
              </Button>
            </div>

            {upcomingDeliveries.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <Truck className="mb-2 h-12 w-12 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No upcoming deliveries</h3>
                  <p className="text-sm text-muted-foreground">Post a request to schedule deliveries</p>
                  <Button asChild className="mt-4">
                    <Link href="/post-request">Post New Request</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcomingDeliveries.map((delivery) => (
                  <Card key={delivery.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{delivery.product}</CardTitle>
                        <Badge
                          variant={
                            delivery.status === "confirmed"
                              ? "outline"
                              : delivery.status === "in transit"
                                ? "secondary"
                                : "default"
                          }
                        >
                          {delivery.status}
                        </Badge>
                      </div>
                      <CardDescription>{delivery.group}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Quantity:</p>
                          <p className="font-medium">{delivery.quantity}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Location:</p>
                          <p className="font-medium">{delivery.location}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-muted-foreground">Delivery Date:</p>
                          <div className="flex items-center gap-1 font-medium">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>{new Date(delivery.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/buyer-orders/${delivery.id}`}>View Details</Link>
                      </Button>
                      <Button asChild size="sm">
                        <Link href={`/buyer-orders/${delivery.id}/track`}>
                          Track Delivery
                          <Truck className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Trusted Groups Tab */}
          <TabsContent value="trusted_groups" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search groups..." className="pl-8" />
              </div>
              <Button asChild variant="outline">
                <Link href="/find-groups">
                  <Users className="mr-2 h-4 w-4" />
                  Find New Groups
                </Link>
              </Button>
            </div>

            {trustedGroups.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <Users className="mb-2 h-12 w-12 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No trusted groups yet</h3>
                  <p className="text-sm text-muted-foreground">Add groups to your trusted list</p>
                  <Button asChild className="mt-4">
                    <Link href="/find-groups">Find Groups</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {trustedGroups.map((group) => (
                  <Card key={group.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <CardDescription>{group.location}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Members:</p>
                          <p className="font-medium">{group.members}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Rating:</p>
                          <p className="font-medium">⭐ {group.rating}/5</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-muted-foreground">Orders Completed:</p>
                          <p className="font-medium">{group.ordersCompleted}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/groups/${group.id}`}>View Profile</Link>
                      </Button>
                      <Button asChild size="sm">
                        <Link href={`/post-request?group=${group.id}`}>
                          Request Produce
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Recent Activity */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Recent Activity</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/activity">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                <div className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <ShoppingCart className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">New request posted</p>
                    <p className="text-sm text-muted-foreground">You posted a request for Fresh Watermelons</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>2 hours ago</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Group response received</p>
                    <p className="text-sm text-muted-foreground">Wanake Group responded to your tomato request</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Yesterday</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Delivery confirmed</p>
                    <p className="text-sm text-muted-foreground">Delivery of Kale from Mkulima Youth Group confirmed</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>2 days ago</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
