"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Check, Clock, MapPin, Phone, Truck, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProtectedRoute } from "@/components/protected-route"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

// Sample delivery data
const deliveryData = {
  id: "ORD-004",
  product: "Onions",
  group: "Wanake Group",
  date: "2023-05-22",
  quantity: "3 ton truck",
  total: 36000,
  status: "in transit",
  paymentStatus: "paid",
  location: "Nairobi Warehouse",
  estimatedArrival: "2023-05-23T14:30:00",
  transporter: {
    name: "John Kamau",
    phone: "+254 712 345 678",
    vehicle: "Isuzu FRR",
    licensePlate: "KBZ 123A",
  },
  trackingSteps: [
    {
      id: 1,
      title: "Order Confirmed",
      description: "Order has been confirmed by the group",
      time: "2023-05-22T08:15:00",
      completed: true,
    },
    {
      id: 2,
      title: "Produce Harvested",
      description: "Produce has been harvested and prepared",
      time: "2023-05-22T10:30:00",
      completed: true,
    },
    {
      id: 3,
      title: "Quality Checked",
      description: "Produce has passed quality inspection",
      time: "2023-05-22T11:45:00",
      completed: true,
    },
    {
      id: 4,
      title: "Loaded for Transport",
      description: "Produce has been loaded onto the transport vehicle",
      time: "2023-05-22T13:20:00",
      completed: true,
    },
    {
      id: 5,
      title: "In Transit",
      description: "Produce is on the way to the destination",
      time: "2023-05-22T14:00:00",
      completed: true,
      current: true,
    },
    {
      id: 6,
      title: "Arrived at Destination",
      description: "Transport has arrived at the destination",
      time: null,
      completed: false,
    },
    {
      id: 7,
      title: "Delivery Confirmed",
      description: "Delivery has been confirmed by the buyer",
      time: null,
      completed: false,
    },
  ],
  currentLocation: {
    latitude: -1.2864,
    longitude: 36.8172,
    lastUpdated: "2023-05-22T16:45:00",
    description: "Mombasa Road, 30km from Nairobi",
  },
}

export default function TrackDeliveryPage({ params }: { params: { id: string } }) {
  const [delivery] = useState(deliveryData)

  // Calculate progress percentage
  const completedSteps = delivery.trackingSteps.filter((step) => step.completed).length
  const totalSteps = delivery.trackingSteps.length
  const progressPercentage = (completedSteps / totalSteps) * 100

  // Format date and time
  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return "Pending"
    const date = new Date(dateTimeString)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  // Calculate estimated time remaining
  const calculateTimeRemaining = () => {
    const now = new Date()
    const estimatedArrival = new Date(delivery.estimatedArrival)

    if (now > estimatedArrival) return "Arriving soon"

    const diffMs = estimatedArrival.getTime() - now.getTime()
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    return `${diffHrs}h ${diffMins}m remaining`
  }

  return (
    <ProtectedRoute allowedRoles={["buyer"]}>
      <div className="space-y-6 pb-16">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Button asChild variant="ghost" className="mb-2 -ml-4 p-0">
              <Link href={`/buyer-orders/${params.id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Order Details
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Track Delivery</h1>
            <p className="text-muted-foreground">Order ID: {delivery.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={
                delivery.status === "delivered" ? "success" : delivery.status === "in transit" ? "secondary" : "outline"
              }
              className="px-3 py-1 text-sm"
            >
              {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Delivery Progress */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Delivery Progress</CardTitle>
            <CardDescription>Estimated arrival: {formatDateTime(delivery.estimatedArrival)}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  <span className="font-medium">In Transit</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{calculateTimeRemaining()}</span>
                </div>
              </div>

              <Progress value={progressPercentage} className="h-2" />

              <div className="flex justify-between text-sm">
                <span>Order Confirmed</span>
                <span>Delivery Complete</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transporter Information */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Transporter Information</CardTitle>
            <CardDescription>Contact details for your delivery</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="font-medium">Driver:</span>
                  <span>{delivery.transporter.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="font-medium">Phone:</span>
                  <span>{delivery.transporter.phone}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary" />
                  <span className="font-medium">Vehicle:</span>
                  <span>{delivery.transporter.vehicle}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">
                    {delivery.transporter.licensePlate}
                  </Badge>
                </div>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-medium">Current Location:</span>
                <span>{delivery.currentLocation.description}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>Last updated: {formatDateTime(delivery.currentLocation.lastUpdated)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tracking Timeline */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Tracking Timeline</CardTitle>
            <CardDescription>Step by step delivery progress</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="relative border-l border-muted">
              {delivery.trackingSteps.map((step) => (
                <li key={step.id} className="mb-6 ml-6">
                  <span
                    className={`absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full ${
                      step.completed
                        ? step.current
                          ? "bg-primary text-primary-foreground"
                          : "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.completed ? <Check className="h-3.5 w-3.5" /> : step.id}
                  </span>
                  <div className="flex flex-col gap-1">
                    <h3 className="flex items-center text-base font-semibold">
                      {step.title}
                      {step.current && (
                        <Badge variant="secondary" className="ml-2">
                          Current
                        </Badge>
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{step.time ? formatDateTime(step.time) : "Pending"}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Details of your order</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Product:</span>
                  <span className="font-medium">{delivery.product}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Quantity:</span>
                  <span className="font-medium">{delivery.quantity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Supplier:</span>
                  <span className="font-medium">{delivery.group}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Delivery Location:</span>
                  <span className="font-medium">{delivery.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span className="font-medium">KES {delivery.total.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Payment Status:</span>
                  <Badge
                    variant={
                      delivery.paymentStatus === "paid"
                        ? "success"
                        : delivery.paymentStatus === "pending"
                          ? "outline"
                          : "destructive"
                    }
                  >
                    {delivery.paymentStatus.charAt(0).toUpperCase() + delivery.paymentStatus.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <Button asChild variant="outline">
            <Link href={`/buyer-orders/${params.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Order Details
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">
              <Phone className="mr-2 h-4 w-4" />
              Contact Driver
            </Button>
            <Button>
              <Truck className="mr-2 h-4 w-4" />
              Confirm Delivery
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
