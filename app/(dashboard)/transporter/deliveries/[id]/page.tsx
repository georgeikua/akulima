"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Clock, Loader2, MapPin, Phone, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

// Mock delivery data (same as in transporter/deliveries page)
const mockDeliveries = {
  "del-001": {
    id: "del-001",
    transactionId: "txn-001",
    produce: "Potatoes",
    quantity: "3 Ton Truck",
    weight: 2850, // kg (after grading)
    pickup: {
      location: "Meru Central Collection Center",
      coordinates: "-0.0236, 37.6538",
      contact: "0712345678",
    },
    delivery: {
      location: "Metro Supermarket, Nairobi, Westlands",
      coordinates: "-1.2671, 36.8219",
      contact: "0723456789",
    },
    status: "assigned", // assigned, accepted, in_transit, delivered
    scheduledDate: "2023-07-28",
  },
  "del-002": {
    id: "del-002",
    transactionId: "txn-002",
    produce: "Tomatoes",
    quantity: "1 Ton (Pick-up)",
    weight: 950, // kg (after grading)
    pickup: {
      location: "Nyeri Farmers Hub",
      coordinates: "-0.4167, 36.9500",
      contact: "0734567890",
    },
    delivery: {
      location: "Fresh Grocers Ltd, Nakuru Town",
      coordinates: "-0.3031, 36.0800",
      contact: "0745678901",
    },
    status: "in_transit",
    scheduledDate: "2023-07-29",
    acceptedAt: "2023-07-29T08:30:00Z",
    pickupAt: "2023-07-29T09:15:00Z",
    estimatedDeliveryAt: "2023-07-29T14:30:00Z",
  },
  "del-003": {
    id: "del-003",
    transactionId: "txn-003",
    produce: "Onions",
    quantity: "3 Ton Truck",
    weight: 2950, // kg (after grading)
    pickup: {
      location: "Kajiado Collection Center",
      coordinates: "-1.8500, 36.7833",
      contact: "0756789012",
    },
    delivery: {
      location: "Carrefour Supermarket, Nairobi, Two Rivers",
      coordinates: "-1.2250, 36.8042",
      contact: "0767890123",
    },
    status: "delivered",
    scheduledDate: "2023-07-26",
    acceptedAt: "2023-07-26T07:45:00Z",
    pickupAt: "2023-07-26T09:30:00Z",
    estimatedDeliveryAt: "2023-07-26T13:00:00Z",
    deliveredAt: "2023-07-26T12:45:00Z",
  },
}

export default function DeliveryDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [delivery, setDelivery] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [actionSuccess, setActionSuccess] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [actionType, setActionType] = useState<"accept" | "pickup" | "deliver" | null>(null)
  const [notes, setNotes] = useState("")

  // Fetch delivery details
  useEffect(() => {
    const fetchDeliveryDetails = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Get mock data
        const deliveryData = mockDeliveries[params.id]
        if (!deliveryData) {
          router.push("/transporter/deliveries")
          return
        }

        setDelivery(deliveryData)
      } catch (error) {
        console.error("Error fetching delivery details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDeliveryDetails()
  }, [params.id, router])

  // Handle action button click
  const handleActionClick = (type: "accept" | "pickup" | "deliver") => {
    setActionType(type)
    setShowConfirmDialog(true)
  }

  // Handle action confirmation
  const handleConfirmAction = async () => {
    setIsProcessing(true)

    try {
      // Simulate API call
      console.log("Processing action:", {
        deliveryId: delivery.id,
        actionType,
        notes,
      })
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update delivery status based on action type
      const updatedDelivery = { ...delivery }
      if (actionType === "accept") {
        updatedDelivery.status = "accepted"
        updatedDelivery.acceptedAt = new Date().toISOString()
      } else if (actionType === "pickup") {
        updatedDelivery.status = "in_transit"
        updatedDelivery.pickupAt = new Date().toISOString()
        updatedDelivery.estimatedDeliveryAt = new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString() // 5 hours later
      } else if (actionType === "deliver") {
        updatedDelivery.status = "delivered"
        updatedDelivery.deliveredAt = new Date().toISOString()
      }

      // Update state
      setDelivery(updatedDelivery)
      setActionSuccess(true)
      setShowConfirmDialog(false)

      // Reset after a delay
      setTimeout(() => {
        setActionSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Error processing action:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  // Get action button based on delivery status
  const getActionButton = () => {
    switch (delivery.status) {
      case "assigned":
        return (
          <Button className="w-full" onClick={() => handleActionClick("accept")}>
            <Check className="mr-2 h-4 w-4" />
            Accept Delivery
          </Button>
        )
      case "accepted":
        return (
          <Button className="w-full" onClick={() => handleActionClick("pickup")}>
            <Truck className="mr-2 h-4 w-4" />
            Start Journey (Confirm Pickup)
          </Button>
        )
      case "in_transit":
        return (
          <Button className="w-full" onClick={() => handleActionClick("deliver")}>
            <Check className="mr-2 h-4 w-4" />
            Complete Delivery
          </Button>
        )
      default:
        return null
    }
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "assigned":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            <Clock className="mr-1 h-3 w-3" />
            Assigned
          </Badge>
        )
      case "accepted":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            <Check className="mr-1 h-3 w-3" />
            Accepted
          </Badge>
        )
      case "in_transit":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            <Truck className="mr-1 h-3 w-3" />
            In Transit
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            <Check className="mr-1 h-3 w-3" />
            Delivered
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="container max-w-md mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!delivery) {
    return (
      <div className="container max-w-md mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTitle>Delivery Not Found</AlertTitle>
          <AlertDescription>The delivery you're looking for doesn't exist or has been removed.</AlertDescription>
        </Alert>
        <Button className="mt-4 w-full" variant="outline" onClick={() => router.push("/transporter/deliveries")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Deliveries
        </Button>
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-4 p-0 flex items-center text-muted-foreground"
        onClick={() => router.push("/transporter/deliveries")}
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Deliveries
      </Button>

      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Delivery Details</h1>
          {getStatusBadge(delivery.status)}
        </div>
        <p className="text-sm text-muted-foreground">Delivery ID: {delivery.id}</p>
      </div>

      {actionSuccess && (
        <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
          <Check className="h-4 w-4" />
          <AlertTitle>Action Completed</AlertTitle>
          <AlertDescription>
            {actionType === "accept"
              ? "You have successfully accepted this delivery."
              : actionType === "pickup"
                ? "Pickup confirmed. Journey started."
                : "Delivery completed successfully."}
          </AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>{delivery.produce}</CardTitle>
          <CardDescription>
            {delivery.quantity} - {delivery.weight}kg
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Scheduled Date:</span>
              <span>{delivery.scheduledDate}</span>
            </div>
            {delivery.acceptedAt && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Accepted At:</span>
                <span className="text-muted-foreground">{new Date(delivery.acceptedAt).toLocaleString()}</span>
              </div>
            )}
            {delivery.pickupAt && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Picked Up At:</span>
                <span className="text-muted-foreground">{new Date(delivery.pickupAt).toLocaleString()}</span>
              </div>
            )}
            {delivery.estimatedDeliveryAt && delivery.status === "in_transit" && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Estimated Delivery:</span>
                <span className="text-muted-foreground">{new Date(delivery.estimatedDeliveryAt).toLocaleString()}</span>
              </div>
            )}
            {delivery.deliveredAt && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Delivered At:</span>
                <span className="text-muted-foreground">{new Date(delivery.deliveredAt).toLocaleString()}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pickup Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <span>{delivery.pickup.location}</span>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <span>{delivery.pickup.contact}</span>
            </div>
            <Button variant="outline" className="w-full" size="sm">
              Open in Maps
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Delivery Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <span>{delivery.delivery.location}</span>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <span>{delivery.delivery.contact}</span>
            </div>
            <Button variant="outline" className="w-full" size="sm">
              Open in Maps
            </Button>
          </CardContent>
        </Card>

        {delivery.status !== "delivered" && <div className="pt-2">{getActionButton()}</div>}
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "accept"
                ? "Accept Delivery"
                : actionType === "pickup"
                  ? "Confirm Pickup"
                  : "Complete Delivery"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "accept"
                ? "Are you sure you want to accept this delivery assignment?"
                : actionType === "pickup"
                  ? "Confirm that you have picked up the produce and are starting the journey."
                  : "Confirm that you have delivered the produce to the destination."}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Textarea
              placeholder="Add any notes or comments (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmAction} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
