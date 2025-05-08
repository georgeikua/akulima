"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  Calendar,
  Clock,
  Filter,
  Plus,
  Search,
  ShoppingCart,
  Star,
  Tag,
  CheckCircle,
  XCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

// Types
type BidStatus = "pending" | "accepted" | "rejected"

type Bid = {
  id: string
  groupCode: string
  price: number
  quantity: number
  quality: string
  rating: number
  images: string[]
  notes?: string
  status: BidStatus
  submittedAt: string
}

type Request = {
  id: string
  code: string
  title: string
  produce: string
  quantity: string
  grade: string
  requiredDate: string
  bidDeadline: string
  status: "open" | "closed" | "fulfilled" | "cancelled"
  createdAt: string
  bids: Bid[]
}

// Sample data
const sampleRequests: Request[] = [
  {
    id: "req-001",
    code: "AKL-REQ-001",
    title: "Premium Potatoes for Metro",
    produce: "Potatoes",
    quantity: "3 Ton Truck",
    grade: "Grade A (Premium)",
    requiredDate: "2023-08-15",
    bidDeadline: "2023-07-30",
    status: "open",
    createdAt: "2023-07-15",
    bids: [
      {
        id: "bid-001",
        groupCode: "GRP-123",
        price: 85,
        quantity: 3000,
        quality: "Grade A",
        rating: 4.8,
        images: ["/pile-of-potatoes.png", "/farm-potatoes.png"],
        notes: "Freshly harvested premium potatoes. Clean and well-sorted.",
        status: "pending",
        submittedAt: "2023-07-16",
      },
      {
        id: "bid-002",
        groupCode: "GRP-456",
        price: 82,
        quantity: 3000,
        quality: "Grade A",
        rating: 4.5,
        images: ["/premium-potatoes.png", "/potato-harvest.png"],
        notes: "Medium to large sized potatoes, ready for delivery.",
        status: "pending",
        submittedAt: "2023-07-17",
      },
    ],
  },
  {
    id: "req-002",
    code: "AKL-REQ-002",
    title: "Fresh Tomatoes for Local Market",
    produce: "Tomatoes",
    quantity: "1 Ton (Pick-up)",
    grade: "Grade B (Standard)",
    requiredDate: "2023-08-10",
    bidDeadline: "2023-07-28",
    status: "open",
    createdAt: "2023-07-18",
    bids: [
      {
        id: "bid-003",
        groupCode: "GRP-789",
        price: 120,
        quantity: 1000,
        quality: "Grade B",
        rating: 4.2,
        images: ["/ripe-tomatoes.png", "/fresh-tomatoes.png"],
        notes: "Ripe but firm tomatoes, ideal for market sales.",
        status: "pending",
        submittedAt: "2023-07-19",
      },
    ],
  },
  {
    id: "req-003",
    code: "AKL-REQ-003",
    title: "Organic Kale for Restaurant Chain",
    produce: "Kale",
    quantity: "500 kg",
    grade: "Grade A (Organic)",
    requiredDate: "2023-08-05",
    bidDeadline: "2023-07-25",
    status: "closed",
    createdAt: "2023-07-10",
    bids: [
      {
        id: "bid-004",
        groupCode: "GRP-234",
        price: 95,
        quantity: 500,
        quality: "Grade A (Organic)",
        rating: 4.9,
        images: ["/organic-kale.png", "/lush-kale-farm.png"],
        notes: "Certified organic kale, pesticide-free.",
        status: "accepted",
        submittedAt: "2023-07-12",
      },
      {
        id: "bid-005",
        groupCode: "GRP-567",
        price: 90,
        quantity: 500,
        quality: "Grade A",
        rating: 4.6,
        images: ["/fresh-kale.png", "/kale-harvest.png"],
        notes: "Freshly harvested kale, ready for delivery.",
        status: "rejected",
        submittedAt: "2023-07-13",
      },
    ],
  },
  {
    id: "req-004",
    code: "AKL-REQ-004",
    title: "Watermelons for Supermarket Chain",
    produce: "Watermelons",
    quantity: "2 Ton Truck",
    grade: "Grade A (Premium)",
    requiredDate: "2023-08-20",
    bidDeadline: "2023-08-05",
    status: "fulfilled",
    createdAt: "2023-07-05",
    bids: [
      {
        id: "bid-006",
        groupCode: "GRP-345",
        price: 75,
        quantity: 2000,
        quality: "Grade A",
        rating: 4.7,
        images: ["/vibrant-watermelons.png", "/watermelon-harvest.png"],
        notes: "Sweet and juicy watermelons, perfect size for retail.",
        status: "accepted",
        submittedAt: "2023-07-07",
      },
    ],
  },
]

// Get bid status badge
const getBidStatusBadge = (status: BidStatus) => {
  switch (status) {
    case "pending":
      return <Badge variant="outline">Pending</Badge>
    case "accepted":
      return <Badge className="bg-green-100 text-green-800">Accepted</Badge>
    case "rejected":
      return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

// Get status badge
const getStatusBadge = (status: Request["status"]) => {
  switch (status) {
    case "open":
      return <Badge className="bg-green-100 text-green-800">Open for Bids</Badge>
    case "closed":
      return <Badge className="bg-blue-100 text-blue-800">Closed</Badge>
    case "fulfilled":
      return <Badge className="bg-purple-100 text-purple-800">Fulfilled</Badge>
    case "cancelled":
      return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function MyRequestsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Filter requests based on search term and active tab
  const filteredRequests = sampleRequests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.produce.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.code.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "open") return matchesSearch && request.status === "open"
    if (activeTab === "closed") return matchesSearch && (request.status === "closed" || request.status === "fulfilled")

    return matchesSearch
  })

  return (
    <ProtectedRoute allowedRoles={["buyer"]}>
      <div className="space-y-6 pb-16">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Requests</h1>
            <p className="text-muted-foreground">Manage your market requests and review bids</p>
          </div>
          <Button asChild>
            <Link href="/post-request">
              <Plus className="mr-2 h-4 w-4" />
              Post New Request
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
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
            <TabsTrigger value="all">All Requests</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="closed">Closed/Fulfilled</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4 mt-6">
            {filteredRequests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <ShoppingCart className="mb-2 h-12 w-12 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No requests found</h3>
                  <p className="text-sm text-muted-foreground">Try adjusting your search or post a new request</p>
                  <Button asChild className="mt-4">
                    <Link href="/post-request">Post New Request</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredRequests.map((request) => <RequestCard key={request.id} request={request} />)
            )}
          </TabsContent>
          <TabsContent value="open" className="space-y-4 mt-6">
            {filteredRequests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <ShoppingCart className="mb-2 h-12 w-12 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No open requests</h3>
                  <p className="text-sm text-muted-foreground">Post a new request to start receiving bids</p>
                  <Button asChild className="mt-4">
                    <Link href="/post-request">Post New Request</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredRequests.map((request) => <RequestCard key={request.id} request={request} />)
            )}
          </TabsContent>
          <TabsContent value="closed" className="space-y-4 mt-6">
            {filteredRequests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <ShoppingCart className="mb-2 h-12 w-12 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No closed requests</h3>
                  <p className="text-sm text-muted-foreground">Your closed or fulfilled requests will appear here</p>
                </CardContent>
              </Card>
            ) : (
              filteredRequests.map((request) => <RequestCard key={request.id} request={request} />)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}

// Request Card Component
function RequestCard({ request }: { request: Request }) {
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null)
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [feedback, setFeedback] = useState("")

  const handleAcceptBid = (bid: Bid) => {
    toast({
      title: "Bid Accepted",
      description: `You've accepted the bid from ${bid.groupCode}. They will be notified.`,
    })
  }

  const handleRejectBid = (bid: Bid) => {
    toast({
      title: "Bid Rejected",
      description: `You've rejected the bid from ${bid.groupCode}.`,
    })
  }

  const handleSubmitRating = () => {
    if (selectedBid) {
      toast({
        title: "Rating Submitted",
        description: `You've rated ${selectedBid.groupCode} with ${rating} stars.`,
      })
      setRatingDialogOpen(false)
      setSelectedBid(null)
      setFeedback("")
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{request.title}</CardTitle>
          {getStatusBadge(request.status)}
        </div>
        <CardDescription className="flex items-center gap-1">Request Code: {request.code}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <div>
            <p className="text-muted-foreground">Produce:</p>
            <p className="font-medium">{request.produce}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Quantity:</p>
            <p className="font-medium">{request.quantity}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Grade:</p>
            <p className="font-medium">{request.grade}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Required by:</p>
            <div className="flex items-center gap-1 font-medium">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{request.requiredDate}</span>
            </div>
          </div>
          <div>
            <p className="text-muted-foreground">Bid Deadline:</p>
            <div className="flex items-center gap-1 font-medium">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{request.bidDeadline}</span>
            </div>
          </div>
          <div>
            <p className="text-muted-foreground">Bids Received:</p>
            <p className="font-medium">{request.bids.length}</p>
          </div>
        </div>

        {request.bids.length > 0 && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="bids">
              <AccordionTrigger className="text-sm font-medium">View {request.bids.length} Bids</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 mt-2">
                  {request.bids.map((bid) => (
                    <div key={bid.id} className="rounded-lg border p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-green-100 text-green-800">
                                {bid.groupCode.substring(4, 6)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">Group: {bid.groupCode}</h4>
                              <div className="flex items-center text-amber-500">
                                <Star className="h-3.5 w-3.5 fill-current" />
                                <span className="text-xs ml-1">{bid.rating.toFixed(1)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Tag className="h-3.5 w-3.5" />
                            <span>KES {bid.price}/kg</span>
                            <span>•</span>
                            <span>{bid.quantity} kg</span>
                            <span>•</span>
                            <span>{bid.quality}</span>
                          </div>
                        </div>
                        {getBidStatusBadge(bid.status)}
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {bid.images.map((image, index) => (
                          <div key={index} className="relative aspect-video rounded-md overflow-hidden border">
                            <Image
                              src={image || "/placeholder.svg"}
                              alt={`Produce image ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>

                      {bid.notes && (
                        <div className="text-sm mb-3">
                          <p className="text-muted-foreground mb-1">Notes:</p>
                          <p>{bid.notes}</p>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>Submitted: {new Date(bid.submittedAt).toLocaleDateString()}</span>
                        <div className="flex gap-2">
                          {bid.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-green-600"
                                onClick={() => handleAcceptBid(bid)}
                              >
                                <CheckCircle className="mr-1 h-3.5 w-3.5" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-red-600"
                                onClick={() => handleRejectBid(bid)}
                              >
                                <XCircle className="mr-1 h-3.5 w-3.5" />
                                Reject
                              </Button>
                            </>
                          )}
                          {bid.status === "accepted" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8"
                              onClick={() => {
                                setSelectedBid(bid)
                                setRatingDialogOpen(true)
                              }}
                            >
                              <Star className="mr-1 h-3.5 w-3.5" />
                              Rate Group
                            </Button>
                          )}
                          <Button size="sm" variant="outline" className="h-8" asChild>
                            <Link href={`/trusted-groups/${bid.groupCode}`}>View Profile</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
        <div className="text-xs text-muted-foreground">Posted: {new Date(request.createdAt).toLocaleDateString()}</div>
        <Button asChild size="sm">
          <Link href={`/my-requests/${request.id}`}>
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>

      {/* Rating Dialog */}
      <Dialog open={ratingDialogOpen} onOpenChange={setRatingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate Group {selectedBid?.groupCode}</DialogTitle>
            <DialogDescription>Please rate your experience with this group and provide feedback.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-8 w-8 cursor-pointer ${
                    star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                  }`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>
          <Textarea
            placeholder="Share your experience with this group..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRatingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitRating}>Submit Rating</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
