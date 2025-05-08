"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, Filter, MapPin, Search, Star, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ProtectedRoute } from "@/components/protected-route"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample groups data
const allGroups = [
  {
    id: "grp-001",
    name: "Wanake Group",
    location: "Nakuru",
    members: 48,
    rating: 4.8,
    ordersCompleted: 24,
    specialties: ["Tomatoes", "Watermelons", "Onions"],
    isTrusted: true,
    region: "Rift Valley",
  },
  {
    id: "grp-002",
    name: "Mkulima Youth Group",
    location: "Eldoret",
    members: 36,
    rating: 4.6,
    ordersCompleted: 18,
    specialties: ["Kale", "Spinach", "Cabbage"],
    isTrusted: true,
    region: "Rift Valley",
  },
  {
    id: "grp-003",
    name: "Kilimo Women Group",
    location: "Machakos",
    members: 52,
    rating: 4.9,
    ordersCompleted: 32,
    specialties: ["Potatoes", "Carrots", "Green Beans"],
    isTrusted: true,
    region: "Eastern",
  },
  {
    id: "grp-004",
    name: "Mazao Farmers Group",
    location: "Meru",
    members: 42,
    rating: 4.5,
    ordersCompleted: 15,
    specialties: ["Bananas", "Avocados", "Mangoes"],
    isTrusted: false,
    region: "Eastern",
  },
  {
    id: "grp-005",
    name: "Vijana Agricultural Group",
    location: "Kisumu",
    members: 38,
    rating: 4.3,
    ordersCompleted: 12,
    specialties: ["Sweet Potatoes", "Cassava", "Groundnuts"],
    isTrusted: false,
    region: "Nyanza",
  },
  {
    id: "grp-006",
    name: "Maendeleo Farmers",
    location: "Kakamega",
    members: 45,
    rating: 4.7,
    ordersCompleted: 22,
    specialties: ["Maize", "Beans", "Sorghum"],
    isTrusted: false,
    region: "Western",
  },
  {
    id: "grp-007",
    name: "Tujenge Women Group",
    location: "Nyeri",
    members: 40,
    rating: 4.4,
    ordersCompleted: 16,
    specialties: ["Coffee", "Tea", "Macadamia"],
    isTrusted: false,
    region: "Central",
  },
  {
    id: "grp-008",
    name: "Coastal Farmers Alliance",
    location: "Mombasa",
    members: 35,
    rating: 4.2,
    ordersCompleted: 10,
    specialties: ["Coconuts", "Cashew Nuts", "Cassava"],
    isTrusted: false,
    region: "Coast",
  },
]

export default function FindGroupsPage() {
  const [groups, setGroups] = useState(allGroups)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRegion, setFilterRegion] = useState("all")
  const [filterSpecialty, setFilterSpecialty] = useState("all")

  // Handle adding/removing from trusted groups
  const toggleTrusted = (groupId: string) => {
    setGroups(groups.map((group) => (group.id === groupId ? { ...group, isTrusted: !group.isTrusted } : group)))
  }

  // Get unique regions for filter
  const regions = Array.from(new Set(groups.map((group) => group.region)))

  // Get unique specialties for filter
  const specialties = Array.from(new Set(groups.flatMap((group) => group.specialties))).sort()

  // Filter groups
  const filteredGroups = groups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.specialties.some((specialty) => specialty.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesRegion = filterRegion === "all" || group.region === filterRegion

    const matchesSpecialty = filterSpecialty === "all" || group.specialties.includes(filterSpecialty)

    return matchesSearch && matchesRegion && matchesSpecialty
  })

  return (
    <ProtectedRoute allowedRoles={["buyer"]}>
      <div className="space-y-6 pb-16">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Find Groups</h1>
            <p className="text-muted-foreground">Discover and connect with farmer groups</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/trusted-groups">
              <Users className="mr-2 h-4 w-4" />
              My Trusted Groups
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search groups..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterRegion} onValueChange={setFilterRegion}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialties</SelectItem>
              {specialties.map((specialty) => (
                <SelectItem key={specialty} value={specialty}>
                  {specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Groups</TabsTrigger>
            <TabsTrigger value="top_rated">Top Rated</TabsTrigger>
            <TabsTrigger value="most_active">Most Active</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredGroups.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <Users className="mb-2 h-12 w-12 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No groups found</h3>
                  <p className="text-sm text-muted-foreground">Try adjusting your search filters</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredGroups.map((group) => (
                  <Card key={group.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        {group.isTrusted && (
                          <Badge variant="outline" className="bg-green-500/10 text-green-600">
                            Trusted
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {group.location}, {group.region}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Members:</p>
                          <div className="flex items-center gap-1 font-medium">
                            <Users className="h-3.5 w-3.5 text-primary" />
                            <span>{group.members}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Rating:</p>
                          <div className="flex items-center gap-1 font-medium">
                            <Star className="h-3.5 w-3.5 text-amber-500" />
                            <span>{group.rating}/5</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Orders:</p>
                          <p className="font-medium">{group.ordersCompleted} completed</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Specialties:</p>
                          <p className="font-medium truncate">{group.specialties.join(", ")}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className={group.isTrusted ? "text-red-600" : "text-green-600"}
                        onClick={() => toggleTrusted(group.id)}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        {group.isTrusted ? "Remove" : "Add to Trusted"}
                      </Button>
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/groups/${group.id}`}>
                          View Profile
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="top_rated" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredGroups
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 6)
                .map((group) => (
                  <Card key={group.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-600">
                          ⭐ {group.rating}
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {group.location}, {group.region}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Members:</p>
                          <div className="flex items-center gap-1 font-medium">
                            <Users className="h-3.5 w-3.5 text-primary" />
                            <span>{group.members}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Orders:</p>
                          <p className="font-medium">{group.ordersCompleted} completed</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-muted-foreground">Specialties:</p>
                          <p className="font-medium">{group.specialties.join(", ")}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className={group.isTrusted ? "text-red-600" : "text-green-600"}
                        onClick={() => toggleTrusted(group.id)}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        {group.isTrusted ? "Remove" : "Add to Trusted"}
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
          </TabsContent>

          <TabsContent value="most_active" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredGroups
                .sort((a, b) => b.ordersCompleted - a.ordersCompleted)
                .slice(0, 6)
                .map((group) => (
                  <Card key={group.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-600">
                          {group.ordersCompleted} Orders
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {group.location}, {group.region}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Members:</p>
                          <div className="flex items-center gap-1 font-medium">
                            <Users className="h-3.5 w-3.5 text-primary" />
                            <span>{group.members}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Rating:</p>
                          <div className="flex items-center gap-1 font-medium">
                            <Star className="h-3.5 w-3.5 text-amber-500" />
                            <span>{group.rating}/5</span>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <p className="text-muted-foreground">Specialties:</p>
                          <p className="font-medium">{group.specialties.join(", ")}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className={group.isTrusted ? "text-red-600" : "text-green-600"}
                        onClick={() => toggleTrusted(group.id)}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        {group.isTrusted ? "Remove" : "Add to Trusted"}
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
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
