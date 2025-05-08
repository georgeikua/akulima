"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Clock, Loader2, MapPin, Phone, Truck, User, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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

// Mock bid data (same as in manage-bids page)
const mockBids = {
  "bid-response-001": {
    id: "bid-response-001",
    bidRequestId: "bid-001",
    groupId: "group-123",
    groupName: "Meru Farmers Cooperative",
    produce: "Potatoes",
    quantity: "3 Ton Truck",
    price: 45, // per kg
    totalValue: 135000, // 3000kg * 45
    submittedDate: "2023-07-25",
    status: "pending",
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    notes: "Our potatoes are freshly harvested and well sorted. We can deliver on the requested date.",
    transporterId: "trans-001",
    transporterName: "Nairobi Express Logistics",
    vehicleType: "3 Ton Truck",
    vehicleRegistration: "KBZ 123A",
    transporterContact: "0712345678",
    groupContact: "0723456789",
    groupLocation: "Meru, Kenya",
    deliveryDate: "2023-08-15",
    marketPrice: 42, // current market price per kg
  },
  "bid-response-002": {
    id: "bid-response-002",
    bidRequestId: "bid-001",
    groupId: "group-456",
    groupName: "Nakuru Agricultural Group",
    produce: "Potatoes",
    quantity: "3 Ton Truck",
    price: 42, // per kg
    totalValue: 126000, // 3000kg * 42
    submittedDate: "2023-07-26",
    status: "pending",
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    notes: "Premium quality potatoes from Nakuru highlands. Clean and sorted by size.",
    transporterId: "trans-002",
    transporterName: "Rift Valley Transport",
    vehicleType: "3 Ton Truck",
    vehicleRegistration: "KCY 456B",
    transporterContact: "0734567890",
    groupContact: "0745678901",
    groupLocation: "Nakuru, Kenya",
    deliveryDate: "2023-08-15",
    marketPrice: 42, // current market price per kg
  },
}

export default function BidDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [bid, setBid] = useState<any>(null)
  const [showAcceptDialog, setShowAcceptDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Fetch bid details
  useEffect(() => {
    const fetchBidDetails = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Get mock data
        const bidData = mockBids[params.id]
        if (!bidData) {
          router.push("/manage-bids")
          return
        }

        setBid(bidData)
      } catch (error) {
        console.error("Error fetching bid details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBidDetails()
  }, [params.id, router])

  // Handle accept bid
  const handleAcceptBid = async () => {
    setIsProcessing(true)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update bid status
      setBid({ ...bid, status: "accepted" })
      setShowAcceptDialog(false)

      // Redirect after a delay
      setTimeout(() => {
        router.push("/manage-bids")
      }, 1500)
    } catch (error) {
      console.error("Error accepting bid:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle reject bid
  const handleRejectBid = async () => {
    setIsProcessing(true)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update bid status
      setBid({ ...bid, status: "rejected" })
      setShowRejectDialog(false)

      // Redirect after a delay
      setTimeout(() => {
        router.push("/manage-bids")
      }, 1500)
    } catch (error) {
      console.error("Error rejecting bid:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container max-w-md mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!bid) {
    return (
      <div className="container max-w-md mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTitle>Bid Not Found</AlertTitle>
          <AlertDescription>The bid you're looking for doesn't exist or has been removed.</AlertDescription>
        </Alert>
        <Button className="mt-4 w-full" variant="outline" onClick={() => router.push("/manage-bids")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bids
        </Button>
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-4 p-0 flex items-center text-muted-foreground"
        onClick={() => router.push("/manage-bids")}
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Bids
      </Button>

      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Bid Details</h1>
          {bid.status === "pending" ? (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
              <Clock className="mr-1 h-3 w-3" />
              Pending
            </Badge>
          ) : bid.status === "accepted" ? (
            <Badge variant="outline" className="bg-green-100 text-green-800">
              <Check className="mr-1 h-3 w-3" />
              Accepted
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-red-100 text-red-800">
              <X className="mr-1 h-3 w-3" />
              Rejected
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">Bid ID: {bid.id}</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>{bid.produce}</CardTitle>
            <CardDescription>{bid.quantity}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Price per kg</p>
                <p className="text-lg font-bold">KES {bid.price}</p>
                {bid.price !== bid.marketPrice && (
                  <p className="text-xs text-muted-foreground">
                    {bid.price > bid.marketPrice ? "Above" : "Below"} market price by{" "}
                    {Math.abs(bid.price - bid.marketPrice)} KES
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium">Total Value</p>
                <p className="text-lg font-bold">KES {bid.totalValue.toLocaleString()}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-2">Group Information</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{bid.groupName}</p>
                    <p className="text-xs text-muted-foreground">{bid.groupLocation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{bid.groupContact}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-2">Transporter Information</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{bid.transporterName}</p>
                    <p className="text-xs text-muted-foreground">
                      {bid.vehicleRegistration} ({bid.vehicleType})
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{bid.transporterContact}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-2">Delivery Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">Delivery Date: {bid.deliveryDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">Pickup Location: {bid.groupLocation}</p>
                </div>
              </div>
            </div>

            {bid.notes && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium mb-2">Additional Notes</h3>
                  <p className="text-sm">{bid.notes}</p>
                </div>
              </>
            )}
          </CardContent>
          {bid.status === "pending" && (
            <CardFooter className="flex justify-between">
              <Button variant="outline" className="text-red-600" onClick={() => setShowRejectDialog(true)}>
                <X className="mr-2 h-4 w-4" />
                Reject
              </Button>
              <Button onClick={() => setShowAcceptDialog(true)}>
                <Check className="mr-2 h-4 w-4" />
                Accept Bid
              </Button>
            </CardFooter>
          )}
        </Card>

        <div className="grid grid-cols-2 gap-4">
          {bid.images.map((image: string, index: number) => (
            <div key={index} className="aspect-video overflow-hidden rounded-md border">
              <img
                src={image || "/placeholder.svg"}
                alt={`Produce image ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Accept Dialog */}
      <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accept Bid</DialogTitle>
            <DialogDescription>
              You are about to accept this bid from {bid.groupName}. This group will fulfill your entire order.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Alert className="bg-blue-50 border-blue-200 text-blue-800">
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                By accepting this bid, you are entering into a binding agreement with {bid.groupName} to purchase{" "}
                {bid.produce} at KES {bid.price} per kg. All other bids will be automatically rejected.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAcceptDialog(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleAcceptBid} disabled={isProcessing}>
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

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Bid</DialogTitle>
            <DialogDescription>
              You are about to reject this bid from {bid.groupName}. Are you sure you want to continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectBid} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Reject Bid"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
