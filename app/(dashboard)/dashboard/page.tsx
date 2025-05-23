"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Calendar, Package, ShoppingBasket, TrendingUp, Truck, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { OverviewCard } from "@/components/overview-card"
import { PriceTrendChart } from "@/components/price-trend-chart"
import { MarketRequestCard } from "@/components/market-request-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FarmerAnalyticsChart } from "@/components/farmer-analytics-chart"
import { useAuth } from "@/lib/auth-context"

const marketRequests = [
  {
    id: "req-001",
    title: "Fresh Watermelons",
    buyer: "Metro Supermarket",
    location: "Nairobi",
    quantity: "500 kg",
    grade: "Grade A",
    price: 400,
    deadline: "3 days",
    status: "active",
  },
  {
    id: "req-002",
    title: "Grade A Tomatoes",
    buyer: "Fresh Foods Hotel",
    location: "Nakuru",
    quantity: "200 kg",
    grade: "Grade A",
    price: 120,
    deadline: "5 days",
    status: "active",
  },
  {
    id: "req-003",
    title: "Fresh Potatoes",
    buyer: "Naivas Supermarket",
    location: "Eldoret",
    quantity: "1000 kg",
    grade: "Grade B",
    price: 80,
    deadline: "2 days",
    status: "active",
  },
] as const

export default function DashboardPage() {
  const { user } = useAuth()
  const [groupName, setGroupName] = useState("Wanake Group")
  const [groupCode, setGroupCode] = useState("WG-2023-001")

  // For a real app, you would fetch the group details from an API
  useEffect(() => {
    // Simulate fetching group details
    if (user?.role === "group") {
      // In a real app, this would be an API call using the user's groupId
      setGroupName("Wanake Group")
      setGroupCode("WG-2023-001")
    }
  }, [user])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          {user?.role === "group" ? (
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{groupName} Statistics</h1>
              <p className="text-sm text-muted-foreground">Group Code: {groupCode}</p>
            </div>
          ) : (
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          )}
          <div className="flex gap-2">
            {(user?.role === "group" || user?.role === "farmer") && (
              <Button asChild variant="outline">
                <Link href="/my-produce">Add Produce</Link>
              </Button>
            )}
            {user?.role === "buyer" && (
              <Button asChild>
                <Link href="/post-request">Post Request</Link>
              </Button>
            )}
            {user?.role === "admin" && (
              <Button asChild variant="outline">
                <Link href="/admin">Admin Dashboard</Link>
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <OverviewCard
            title="Total Revenue"
            value="KES 145,320"
            description="Total earnings this month"
            icon={TrendingUp}
            trend="up"
            trendValue="12.5% from last month"
          />
          <OverviewCard
            title="Active Orders"
            value="12"
            description="Orders in progress"
            icon={Package}
            trend="up"
            trendValue="4 new this week"
          />
          <OverviewCard
            title="Market Requests"
            value="24"
            description="Open requests available"
            icon={ShoppingBasket}
            trend="up"
            trendValue="8 new today"
          />
          <OverviewCard
            title="Scheduled Pickups"
            value="5"
            description="Upcoming collections"
            icon={Truck}
            trend="neutral"
            trendValue="Next: Tomorrow"
          />
        </div>
      </div>

      {/* Latest Market Requests Section - Moved up */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Latest Market Requests</h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/market-requests">View All</Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {marketRequests.map((request) => (
            <MarketRequestCard key={request.id} {...request} />
          ))}
        </div>
      </div>

      {/* Upcoming Calendar Section - Moved up */}
      {user?.role !== "group" && (
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
                <h3 className="font-medium">Grade A Watermelon Inspection</h3>
                <p className="text-sm text-muted-foreground">Tomorrow, 10:00 AM</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <Truck className="h-10 w-10 text-primary" />
              <div>
                <h3 className="font-medium">Produce Pickup - Metro Order</h3>
                <p className="text-sm text-muted-foreground">Wednesday, 8:00 AM</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <User className="h-10 w-10 text-primary" />
              <div>
                <h3 className="font-medium">Farmer Training Session</h3>
                <p className="text-sm text-muted-foreground">Friday, 2:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Price Trends Section - Moved down */}
      <Tabs defaultValue="market">
        <TabsList className="mb-4">
          <TabsTrigger value="market">Market Overview</TabsTrigger>
          {(user?.role === "group" || user?.role === "farmer" || user?.role === "admin") && (
            <TabsTrigger value="impact">Impact Analytics</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="market">
          <PriceTrendChart className="w-full" />
        </TabsContent>

        {(user?.role === "group" || user?.role === "farmer" || user?.role === "admin") && (
          <TabsContent value="impact">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Average Earnings</CardTitle>
                  <CardDescription>Average earnings per farmer</CardDescription>
                </CardHeader>
                <CardContent>
                  <FarmerAnalyticsChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gender Distribution</CardTitle>
                  <CardDescription>Farmer gender breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] w-full bg-muted/20"></div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Age Distribution</CardTitle>
                  <CardDescription>Farmer age demographics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] w-full bg-muted/20"></div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
