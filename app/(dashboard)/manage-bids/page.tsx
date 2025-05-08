"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronRight, Clock, Filter, Loader2, Search, User, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Mock bid data
const mockBids = [
  {
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
  },
  {
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
  },
  {
    id: "bid-response-003",
    bidRequestId: "bid-002",
    groupId: "group-789",
    groupName: "Nyeri Tomato Growers",
    produce: "Tomatoes",
    quantity: "1 Ton (Pick-up)",
    price: 80, // per kg
    totalValue: 80000, // 1000kg * 80
    submittedDate: "2023-07-24",
    status: "accepted",
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    notes: "Ripe but firm tomatoes, ideal for your requirements.",
    transporterId: "trans-003",
    transporterName: "Central Kenya Movers",
    vehicleType: "1 Ton Truck",
    vehicleRegistration: "KDG 789C",
  },
  {
    id: "bid-response-004",
    bidRequestId: "bid-002",
    groupId: "group-101",
    groupName: "Kiambu Fresh Produce",
    produce: "Tomatoes",
    quantity: "1 Ton (Pick-up)",
    price: 85, // per kg
    totalValue: 85000, // 1000kg * 85
    submittedDate: "2023-07-23",
    status: "rejected",
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    notes: "Premium tomatoes from our greenhouse production.",
    transporterId: "trans-004",
    transporterName: "Kiambu Logistics",
    vehicleType: "1 Ton Truck",
    vehicleRegistration: "KBN 101D",
  },
]

export default function ManageBidsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [produceFilter, setProduceFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [bids, setBids] = useState<any[]>([])
  const [selectedBidId, setSelectedBidId] = useState<string | null>(null)
  const [showAcceptConfirmation, setShowAcceptConfirmation] = useState(false)

  // Fetch bids
  useEffect(() => {
    const fetchBids = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Get mock data
        setBids(mockBids)
      } catch (error) {
        console.error("Error fetching bids:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBids()
  }, [])

  // Filter bids based on active tab, search term, and produce filter
  const filteredBids = bids.filter((bid) => {
    const matchesTab = activeTab === "all" || bid.status === activeTab
    const matchesSearch =
      bid.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bid.notes.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesProduce = produceFilter === "all" || bid.produce === produceFilter

    return matchesTab && matchesSearch && matchesProduce
  })

  // Get unique produce types for filter
  const produceTypes = Array.from(new Set(bids.map((bid) => bid.produce)))

  // Handle bid selection
  const handleSelectBid = (bidId: string) => {
    router.push(`/bid-details/${bidId}`)
  }

  // Handle accept bid
  const handleAcceptBid = (bidId: string) => {
    setSelectedBidId(bidId)
    setShowAcceptConfirmation(true)
  }

  // Confirm accept bid
  const confirmAcceptBid = async () => {
    if (!selectedBidId) return

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update the selected bid status to accepted
      const updatedBids = bids.map((bid) => {
        if (bid.id === selectedBidId) {
          return { ...bid, status: "accepted" }
        }
        // Reject all other bids for the same request
        if (bid.bidRequestId === bids.find((b) => b.id === selectedBidId)?.bidRequestId && bid.id !== selectedBidId) {
          return { ...bid, status: "rejected" }
        }
        return bid
      })

      setBids(updatedBids)
      setShowAcceptConfirmation(false)
      setSelectedBidId(null)
    } catch (error) {
      console.error("Error accepting bid:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="container max-w-md mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Manage Bids</h1>
        <p className="text-sm text-muted-foreground">Review and select one group to fulfill your entire order</p>
      </div>

      {showAcceptConfirmation && (
        <Alert className="mb-6 bg-blue-50 border-blue-200 text-blue-800">
          <AlertTitle>Confirm Selection</AlertTitle>
          <AlertDescription className="space-y-4">
            <p>
              You are about to select <strong>{bids.find((bid) => bid.id === selectedBidId)?.groupName}</strong> to
              fulfill your entire order. All other bids will be automatically rejected.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowAcceptConfirmation(false)}>
                Cancel
              </Button>
              <Button onClick={confirmAcceptBid}>Confirm Selection</Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bids..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={produceFilter} onValueChange={setProduceFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <span>Produce</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Produce</SelectItem>
              {produceTypes.map((produce) => (
                <SelectItem key={produce} value={produce}>
                  {produce}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredBids.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-center text-muted-foreground">No bids found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("")
                  setProduceFilter("all")
                  setActiveTab("all")
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBids.map((bid) => (
              <Card key={bid.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{bid.produce}</CardTitle>
                      <CardDescription>{bid.quantity}</CardDescription>
                    </div>
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
                        Rejected
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Group:</span>
                      <span className="flex items-center text-sm">
                        <User className="mr-1 h-3 w-3 text-muted-foreground" />
                        {bid.groupName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Price per kg:</span>
                      <span className="text-sm font-bold">KES {bid.price}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total value:</span>
                      <span className="text-sm">KES {bid.totalValue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Transporter:</span>
                      <span className="flex items-center text-sm">
                        <Truck className="mr-1 h-3 w-3 text-muted-foreground" />
                        {bid.transporterName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Vehicle:</span>
                      <span className="text-sm">{bid.vehicleRegistration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Submitted:</span>
                      <span className="text-sm text-muted-foreground">{bid.submittedDate}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button variant="ghost" onClick={() => handleSelectBid(bid.id)}>
                    View Details
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                  {bid.status === "pending" && (
                    <Button variant="default" onClick={() => handleAcceptBid(bid.id)}>
                      <Check className="mr-1 h-4 w-4" />
                      Select Group
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
