"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, CheckCircle, Clock, Download, MapPin, Star, Tag, Truck, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  yearEstablished: number
  certifications: string[]
  averageResponseTime: string
  deliveryReliability: number
}

// Sample data - this would come from an API in a real app
const groupData: Group = {
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
    {
      id: "ord-007",
      orderCode: "ORD-789",
      produce: "Cabbages",
      quantity: "2 Tons",
      quality: "Grade B",
      deliveryDate: "2023-08-05",
      rating: 5,
    },
  ],
  image: "/placeholder.svg?height=300&width=400&query=farm in Nyeri",
  yearEstablished: 2018,
  certifications: ["Organic Certified", "Fair Trade", "GlobalG.A.P"],
  averageResponseTime: "Within 24 hours",
  deliveryReliability: 98,
}

export default function GroupProfilePage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  // In a real app, you would fetch the group data based on the ID
  const group = groupData

  return (
    <ProtectedRoute allowedRoles={["buyer"]}>
      <div className="space-y-6 pb-16">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
            <Link href="/trusted-groups">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Group Profile</h1>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader className="pb-2">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-2">
                  <AvatarFallback className="bg-green-100 text-green-800 text-xl">
                    {group.code.substring(4, 6)}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{group.code}</CardTitle>
                <CardDescription className="flex items-center justify-center gap-1 mt-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {group.location}
                </CardDescription>
                <div className="flex items-center justify-center text-amber-500 mt-2">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="ml-1 font-medium text-lg">{group.rating.toFixed(1)}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
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
                  <p className="text-sm text-muted-foreground mb-1">Certifications:</p>
                  <div className="flex flex-wrap gap-1">
                    {group.certifications.map((cert, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Members:</p>
                    <div className="flex items-center gap-1 font-medium">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{group.memberCount}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Established:</p>
                    <div className="flex items-center gap-1 font-medium">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{group.yearEstablished}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Response Time:</p>
                    <div className="flex items-center gap-1 font-medium">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{group.averageResponseTime}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Reliability:</p>
                    <div className="flex items-center gap-1 font-medium">
                      <Truck className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{group.deliveryReliability}%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <RatingSystem
                    entityId={group.id}
                    entityName={group.code}
                    entityType="group"
                    initialRating={5}
                    buttonText="Rate This Group"
                    buttonVariant="default"
                    buttonSize="default"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="orders">Order History</TabsTrigger>
                  <TabsTrigger value="produce">Produce</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <TabsContent value="overview" className="mt-0">
                <div className="space-y-4">
                  <div className="relative aspect-video rounded-md overflow-hidden border">
                    <Image
                      src={group.image || "/placeholder.svg?height=300&width=400&query=farm"}
                      alt={`${group.code} farm`}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Group Performance</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <p className="text-4xl font-bold text-green-600">{group.completedOrders.length}</p>
                          <p className="text-sm text-muted-foreground">Completed Orders</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <p className="text-4xl font-bold text-amber-500">{group.rating.toFixed(1)}</p>
                          <p className="text-sm text-muted-foreground">Average Rating</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <p className="text-4xl font-bold text-blue-600">{group.deliveryReliability}%</p>
                          <p className="text-sm text-muted-foreground">Delivery Reliability</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Recent Orders</h3>
                    <div className="space-y-2">
                      {group.completedOrders.slice(0, 3).map((order) => (
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
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="orders" className="mt-0">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Order History</h3>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {group.completedOrders.map((order) => (
                      <div key={order.id} className="rounded-lg border p-4">
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
                        <div className="flex justify-between items-center mt-3">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            <span>Delivered: {new Date(order.deliveryDate).toLocaleDateString()}</span>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/orders/${order.id}/details`}>View Details</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="produce" className="mt-0">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Available Produce</h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {group.specialties.map((specialty, index) => (
                      <Card key={index}>
                        <div className="relative aspect-video">
                          <Image
                            src={`/placeholder.svg?height=300&width=400&query=${specialty} farm produce`}
                            alt={specialty}
                            fill
                            className="object-cover rounded-t-lg"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-medium">{specialty}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            This group specializes in high-quality {specialty.toLowerCase()}.
                          </p>
                          <div className="flex justify-between items-center mt-3">
                            <Badge variant="outline" className="bg-green-50">
                              In Season
                            </Badge>
                            <Button variant="outline" size="sm" asChild>
                              <Link href="/post-request">Request Quote</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
