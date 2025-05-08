"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Calendar, Clock, Loader2, MapPin, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"

// Mock bids data (same as in my-bids page)
const mockBids = {
  "bid-response-001": {
    id: "bid-response-001",
    bidRequestId: "bid-001",
    produce: "Potatoes",
    quantity: "3 Ton Truck",
    price: 45, // per kg
    totalValue: 135000, // 3000kg * 45
    submittedDate: "2023-07-25",
    status: "accepted", // pending, accepted, rejected
    buyer: {
      name: "Metro Supermarket",
      location: "Nairobi, Westlands",
    },
    bidRequest: {
      produce: "Potatoes",
      quantity: "3 Ton Truck",
      grade: "Grade A (Premium)",
      requiredDate: "2023-08-15",
      bidDeadline: "2023-07-30",
      additionalNotes: "Looking for clean, well-sorted potatoes. Size should be medium to large.",
    },
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    notes: "Our potatoes are freshly harvested and well sorted. We can deliver on the requested date.",
    transaction: {
      id: "txn-001",
      status: "in_progress", // in_progress, completed, cancelled
    },
  },
  "bid-response-002": {
    id: "bid-response-002",
    bidRequestId: "bid-002",
    produce: "Tomatoes",
    quantity: "1 Ton (Pick-up)",
    price: 80, // per kg
    totalValue: 80000, // 1000kg * 80
    submittedDate: "2023-07-24",
    status: "pending",
    buyer: {
      name: "Fresh Grocers Ltd",
      location: "Nakuru Town",
    },
    bidRequest: {
      produce: "Tomatoes",
      quantity: "1 Ton (Pick-up)",
      grade: "Grade B (Standard)",
      requiredDate: "2023-08-10",
      bidDeadline: "2023-07-28",
      additionalNotes: "Tomatoes should be ripe but firm.",
    },
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    notes: "Our tomatoes are grown in greenhouses and harvested at peak ripeness.",
    transaction: null,
  },
  "bid-response-003": {
    id: "bid-response-003",
    bidRequestId: "bid-003",
    produce: "Onions",
    quantity: "3 Ton Truck",
    price: 60, // per kg
    totalValue: 180000, // 3000kg * 60
    submittedDate: "2023-07-20",
    status: "rejected",
    buyer: {
      name: "Carrefour Supermarket",
      location: "Nairobi, Two Rivers",
    },
    bidRequest: {
      produce: "Onions",
      quantity: "3 Ton Truck",
      grade: "Grade A (Premium)",
      requiredDate: "2023-08-05",
      bidDeadline: "2023-07-25",
      additionalNotes: "Looking for large, dry onions with good shelf life.",
    },
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    notes: "Our onions are well-cured and have excellent storage properties.",
    transaction: null,
  },
}

export default function BidDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [bid, setBid] = useState<any>(null)

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
          router.push("/my-bids")
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

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case "accepted":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            <Clock className="mr-1 h-3 w-3" />
            Accepted
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            <Clock className="mr-1 h-3 w-3" />
            Rejected
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

  if (!bid) {
    return (
      <div className="container max-w-md mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTitle>Bid Not Found</AlertTitle>
          <AlertDescription>The bid you're looking for doesn't exist or has been removed.</AlertDescription>
        </Alert>
        <Button className="mt-4 w-full" variant="outline" onClick={() => router.push("/my-bids")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Bids
        </Button>
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-4 p-0 flex items-center text-muted-foreground"
        onClick={() => router.push("/my-bids")}
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to My Bids
      </Button>

      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Bid Details</h1>
          {getStatusBadge(bid.status)}
        </div>
        <p className="text-sm text-muted-foreground">
          Bid for {bid.produce} submitted to {bid.buyer.name}
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>{bid.produce}</CardTitle>
          <CardDescription>{bid.quantity}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Price per kg:</span>
              <span className="text-lg font-bold">KES {bid.price}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total value:</span>
              <span>KES {bid.totalValue.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Submitted:</span>
              <span className="text-muted-foreground">{bid.submittedDate}</span>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium mb-2">Buyer Information</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{bid.buyer.name}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{bid.buyer.location}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium mb-2">Bid Request Details</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Grade:</span>
                <span>{bid.bidRequest.grade}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Required by:</span>
                <span className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                  {bid.bidRequest.requiredDate}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Bid deadline:</span>
                <span className="flex items-center">
                  <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                  {bid.bidRequest.bidDeadline}
                </span>
              </div>
            </div>
          </div>

          {bid.bidRequest.additionalNotes && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium mb-1">Buyer's Notes:</h3>
                <p className="text-sm text-muted-foreground">{bid.bidRequest.additionalNotes}</p>
              </div>
            </>
          )}

          {bid.notes && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium mb-1">Your Notes:</h3>
                <p className="text-sm text-muted-foreground">{bid.notes}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Your Submitted Images</h2>
        <div className="grid grid-cols-2 gap-2">
          {bid.images.map((image: string, index: number) => (
            <div key={index} className="relative aspect-video overflow-hidden rounded-md border">
              <Image
                src={image || "/placeholder.svg"}
                alt={`Produce image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {bid.status === "accepted" && bid.transaction && (
        <Button className="w-full" onClick={() => router.push(`/transaction-details/${bid.transaction.id}`)}>
          View Transaction Details
        </Button>
      )}

      {bid.status === "pending" && (
        <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800">
          <Clock className="h-4 w-4" />
          <AlertTitle>Bid Under Review</AlertTitle>
          <AlertDescription>
            Your bid is currently under review by the buyer. You will be notified when there is an update.
          </AlertDescription>
        </Alert>
      )}

      {bid.status === "rejected" && (
        <Alert className="bg-red-50 border-red-200 text-red-800">
          <AlertTitle>Bid Rejected</AlertTitle>
          <AlertDescription>
            Unfortunately, your bid was not selected for this request. Keep an eye out for new bid opportunities.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
