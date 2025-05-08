import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Download, MapPin, Phone, Printer, User } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Navbar } from "@/components/navbar"
import { SidebarNav } from "@/components/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { WhatsappMessaging } from "@/components/whatsapp-messaging"
import { AIBidRanking } from "@/components/ai-bid-ranking"

export default function MarketRequestDetailsPage({ params }: { params: { id: string } }) {
  // In a real application, you would fetch the market request details based on the ID
  const request = {
    id: params.id,
    title: "Fresh Watermelons",
    buyer: "Metro Supermarket",
    buyerContact: "+254712345678",
    location: "Nairobi CBD, Store #12",
    quantity: "500 kg",
    grade: "Grade A",
    price: 400,
    totalAmount: 200000,
    postDate: "May 15, 2023",
    deadline: "May 18, 2023",
    status: "active",
    description:
      "We are looking for fresh, sweet watermelons for our premium produce section. The watermelons should be uniform in size (7-10 kg each) with bright red flesh and minimal seeds. We require consistent supply over the next 3 months.",
    requirements: [
      "Uniform size (7-10 kg each)",
      "Bright red flesh",
      "Minimal seeds",
      "Brix level of at least 10 (sweetness)",
      "No external damage or blemishes",
    ],
    interestedFarmers: 12,
    acceptedFarmers: 3,
    buyer_details: {
      name: "Metro Supermarket",
      contact: "+254712345678",
      address: "Nairobi CBD, Store #12",
      representative: "John Doe",
      representativeContact: "+254712345678",
    },
  }

  // Mock user data
  const user = {
    role: "buyer", // Can be "buyer" or "farmer"
  }

  // Mock bids data
  const bids = [
    {
      id: "bid1",
      groupCode: "FarmGroupA",
      quantity: "500 kg",
      price: 380,
      rating: 4.7,
    },
    {
      id: "bid2",
      groupCode: "FarmGroupB",
      quantity: "500 kg",
      price: 390,
      rating: 4.2,
    },
    {
      id: "bid3",
      groupCode: "FarmGroupC",
      quantity: "500 kg",
      price: 400,
      rating: 4.9,
    },
  ]

  // Add these properties to each bid in the bids array
  const bidsWithAIData = bids.map((bid) => ({
    ...bid,
    distance: Math.floor(Math.random() * 50) + 5, // 5-55 km
    reliability: Math.floor(Math.random() * 30) + 70, // 70-100%
    photoQuality: Math.floor(Math.random() * 20) + 80, // 80-100%
    trustTokens: bid.rating > 4.5 ? Math.floor(Math.random() * 10) + 5 : 0, // 5-15 tokens for high rated groups
  }))

  const handleAcceptBid = (bid) => {
    toast({
      title: "Bid Accepted",
      description: `You've accepted the bid from ${bid.groupCode}. They will be notified.`,
    })
  }

  const handleRejectBid = (bid) => {
    toast({
      title: "Bid Rejected",
      description: `You've rejected the bid from ${bid.groupCode}.`,
    })
  }

  const toast = (message) => {
    alert(message.title + ": " + message.description)
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1">
          <SidebarNav />
          <main className="flex-1 p-4 md:p-6">
            <div className="space-y-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="icon">
                    <Link href="/market-requests">
                      <ArrowLeft className="h-4 w-4" />
                      <span className="sr-only">Back</span>
                    </Link>
                  </Button>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">Market Request #{request.id}</h1>
                    <p className="text-muted-foreground">{request.title}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                  <WhatsappMessaging recipients={[request.buyerContact]} defaultTemplate="market_request" />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Request Details</CardTitle>
                      <Badge
                        className={
                          request.status === "active"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : request.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                              : "bg-red-100 text-red-800 border-red-200"
                        }
                      >
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                    </div>
                    <CardDescription>Posted on {request.postDate}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Buyer</p>
                        <p className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {request.buyer}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Contact</p>
                        <p className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {request.buyerContact}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Delivery Location</p>
                        <p className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {request.location}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Deadline</p>
                        <p className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {request.deadline}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Quantity</p>
                        <p className="text-sm">{request.quantity}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Grade</p>
                        <p className="text-sm">{request.grade}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Price</p>
                        <p className="text-sm font-bold text-primary">KES {request.price}/kg</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-medium">Description</h3>
                      <p className="text-sm">{request.description}</p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Requirements</h3>
                      <ul className="list-inside list-disc space-y-1 text-sm">
                        {request.requirements.map((requirement, index) => (
                          <li key={index}>{requirement}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-muted p-4">
                      <div>
                        <p className="font-medium">Interested Farmers</p>
                        <p className="text-2xl font-bold">{request.interestedFarmers}</p>
                      </div>
                      <div>
                        <p className="font-medium">Accepted Farmers</p>
                        <p className="text-2xl font-bold">{request.acceptedFarmers}</p>
                      </div>
                      <div>
                        <p className="font-medium">Remaining Capacity</p>
                        <p className="text-2xl font-bold text-primary">{Math.max(0, 10 - request.acceptedFarmers)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Buyer Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Company Name</p>
                        <p className="text-sm">{request.buyer_details.name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Address</p>
                        <p className="text-sm">{request.buyer_details.address}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Representative</p>
                        <p className="text-sm">{request.buyer_details.representative}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Contact</p>
                        <p className="text-sm">{request.buyer_details.representativeContact}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button className="w-full">Opt In to Request</Button>
                      <Button variant="outline" className="w-full">
                        Contact Buyer
                      </Button>
                      <Button variant="outline" className="w-full">
                        Share Request
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Timeline</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <div className="relative flex flex-col items-center">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                              <Clock className="h-3 w-3" />
                            </div>
                            <div className="h-full w-px bg-border" style={{ height: "calc(100% - 1.5rem)" }} />
                          </div>
                          <div className="space-y-1 pb-4">
                            <p className="text-sm font-medium">Request Posted</p>
                            <p className="text-xs text-muted-foreground">{request.postDate}</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="relative flex flex-col items-center">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                              <Clock className="h-3 w-3" />
                            </div>
                            <div className="h-full w-px bg-border" style={{ height: "calc(100% - 1.5rem)" }} />
                          </div>
                          <div className="space-y-1 pb-4">
                            <p className="text-sm font-medium">Farmer Selection</p>
                            <p className="text-xs text-muted-foreground">In Progress</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="relative flex flex-col items-center">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground">
                              <Clock className="h-3 w-3" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Delivery Deadline</p>
                            <p className="text-xs text-muted-foreground">{request.deadline}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Add AI Bid Ranking */}
              {user?.role === "buyer" && bidsWithAIData.length > 0 && (
                <div className="mt-6">
                  <AIBidRanking bids={bidsWithAIData} onAcceptBid={handleAcceptBid} onRejectBid={handleRejectBid} />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
