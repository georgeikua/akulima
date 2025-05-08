"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Filter, Search, Star, Tag, MapPin, Calendar, CheckCircle, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/lib/auth-context"
import { RatingSystem } from "@/components/rating-system"

// Types
type CompletedOrder = {
  id: string
  orderCode: string
  produce: string
  quantity: string
  quality: string
  deliveryDate: string
  rating?: number
}

type Group = {
  id: string
  code: string
  name: string
  location: string
  rating: number
  memberCount: number
  specialties: string[]
  completedOrders: CompletedOrder[]
  image?: string
}

// Sample data
const sampleGroups: Group[] = [
  {
    id: "grp-001",
    code: "GRP-123",
    name: "Nyeri Highlands Farmers",
    location: "Nyeri County",
    rating: 4.8,
    memberCount: 45,
    specialties: ["Potatoes", "Carrots", "Cabbages"],
    completedOrders: [
      {
        id: "ord-001",
        orderCode: "ORD-123",
        produce: "Potatoes",
        quantity: "3 Tons",
        quality: "Grade A",
        deliveryDate: "2023-06-15",
        rating: 5,
      },
      {
        id: "ord-002",
        orderCode: "ORD-456",
        produce: "Carrots",
        quantity: "1.5 Tons",
        quality: "Grade A",
        deliveryDate: "2023-07-10",
        rating: 4,
      },
    ],
    image: "/placeholder.svg?height=300&width=400&query=farm in Nyeri",
  },
  {
    id: "grp-002",
    code: "GRP-456",
    name: "Meru Greens Cooperative",
    location: "Meru County",
    rating: 4.5,
    memberCount: 78,
    specialties: ["Tomatoes", "Onions", "Green Beans"],
    completedOrders: [
      {
        id: "ord-003",
        orderCode: "ORD-789",
        produce: "Tomatoes",
        quantity: "2 Tons",
        quality: "Grade B",
        deliveryDate: "2023-05-20",
        rating: 4,
      },
      {
        id: "ord-004",
        orderCode: "ORD-101",
        produce: "Green Beans",
        quantity: "800 kg",
        quality: "Grade A",
        deliveryDate: "2023-07-05",
        rating: 5,
      },
      {
        id: "ord-005",
        orderCode: "ORD-102",
        produce: "Onions",
        quantity: "1 Ton",
        quality: "Grade A",
        deliveryDate: "2023-08-01",
        rating: 4,
      },
    ],
    image: "/placeholder.svg?height=300&width=400&query=farm in Meru",
  },
  {
    id: "grp-003",
    code: "GRP-789",
    name: "Nakuru Fresh Produce",
    location: "Nakuru County",
    rating: 4.2,
    memberCount: 32,
    specialties: ["Kale", "Spinach", "Lettuce"],
    completedOrders: [
      {
        id: "ord-006",
        orderCode: "ORD-103",
        produce: "Kale",
        quantity: "500 kg",
        quality: "Grade A",
        deliveryDate: "2023-07-25",
        rating: 4,
      },
    ],
    image: "/placeholder.svg?height=300&width=400&query=farm in Nakuru",
  },
]

export default function TrustedGroupsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Filter groups based on search term and active tab
  const filteredGroups = sampleGroups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.specialties.some((specialty) => specialty.toLowerCase().includes(searchTerm.toLowerCase()))

    if (activeTab === "all") return matchesSearch
    if (activeTab === "top-rated") return matchesSearch && group.rating >= 4.5
    if (activeTab === "recent") {
      // Groups with orders in the last 30 days
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      return matchesSearch && group.completedOrders.some((order) => new Date(order.deliveryDate) >= thirtyDaysAgo)
    }

    return matchesSearch
  })

  return (
    <ProtectedRoute allowedRoles={["buyer"]}>
      <div className="space-y-6 pb-16">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trusted Groups</h1>
          <p className="text-muted-foreground">View and manage your trusted farmer groups</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search groups by name, location, or produce..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Groups</TabsTrigger>
            <TabsTrigger value="top-rated">Top Rated</TabsTrigger>
            <TabsTrigger value="recent">Recent Orders</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4 mt-6">
            {filteredGroups.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <ShoppingCart className="mb-2 h-12 w-12 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No groups found</h3>
                  <p className="text-sm text-muted-foreground">Try adjusting your search criteria</p>
                </CardContent>
              </Card>
            ) : (
              filteredGroups.map((group) => <GroupCard key={group.id} group={group} />)
            )}
          </TabsContent>
          <TabsContent value="top-rated" className="space-y-4 mt-6">
            {filteredGroups.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <ShoppingCart className="mb-2 h-12 w-12 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No top-rated groups found</h3>
                  <p className="text-sm text-muted-foreground">Try adjusting your search criteria</p>
                </CardContent>
              </Card>
            ) : (
              filteredGroups.map((group) => <GroupCard key={group.id} group={group} />)
            )}
          </TabsContent>
          <TabsContent value="recent" className="space-y-4 mt-6">
            {filteredGroups.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <ShoppingCart className="mb-2 h-12 w-12 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No recent orders found</h3>
                  <p className="text-sm text-muted-foreground">You haven't ordered from any groups recently</p>
                </CardContent>
              </Card>
            ) : (
              filteredGroups.map((group) => <GroupCard key={group.id} group={group} />)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}

// Group Card Component
function GroupCard({ group }: { group: Group }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-green-100 text-green-800">{group.code.substring(4, 6)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{group.code}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {group.location}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center text-amber-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="ml-1 font-medium">{group.rating.toFixed(1)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <div className="mb-3">
              <p className="text-sm text-muted-foreground mb-1">Specialties:</p>
              <div className="flex flex-wrap gap-1">
                {group.specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Group Stats:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Members:</p>
                  <p className="font-medium">{group.memberCount}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Completed Orders:</p>
                  <p className="font-medium">{group.completedOrders.length}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative aspect-video rounded-md overflow-hidden border">
            <Image
              src={group.image || "/placeholder.svg?height=300&width=400&query=farm"}
              alt={`${group.code} farm`}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {group.completedOrders.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Previous Orders:</p>
            <div className="space-y-2">
              {group.completedOrders.slice(0, 2).map((order) => (
                <div key={order.id} className="rounded-lg border p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <h4 className="font-medium">{order.orderCode}</h4>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Tag className="h-3.5 w-3.5" />
                        <span>{order.produce}</span>
                        <span>•</span>
                        <span>{order.quantity}</span>
                        <span>•</span>
                        <span>{order.quality}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-amber-500">
                      {order.rating && (
                        <>
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <span className="text-xs ml-1">{order.rating}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-2">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>Delivered: {new Date(order.deliveryDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              {group.completedOrders.length > 2 && (
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  View all {group.completedOrders.length} orders
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
        <RatingSystem
          entityId={group.id}
          entityName={group.code}
          entityType="group"
          initialRating={5}
          buttonText="Rate Group"
        />
        <Button asChild size="sm">
          <Link href={`/trusted-groups/${group.id}`}>
            View Profile
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
