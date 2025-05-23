"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Calendar, Check, Clock, Loader2, MapPin, Phone, Truck, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock transaction data
const mockTransaction = {
  id: "txn-001",
  bidId: "bid-response-001",
  produce: "Potatoes",
  quantity: "3 Ton Truck",
  price: 45, // per kg
  totalValue: 135000, // 3000kg * 45
  status: "in_progress", // in_progress, completed, cancelled
  requiresPreFinancing: true,
  preFinancingStatus: "pending", // pending, disbursed, completed
  group: {
    id: "group-123",
    name: "Meru Farmers Cooperative",
    location: "Meru County, Imenti North",
    contact: "0712345678",
    collectionPoint: {
      name: "Meru Central Collection Center",
      coordinates: "-0.0236, 37.6538",
    },
  },
  buyer: {
    id: "buyer-456",
    name: "Metro Supermarket",
    location: "Nairobi, Westlands",
    contact: "0723456789",
  },
  grader: {
    id: "grader-789",
    name: "John Kamau",
    contact: "0734567890",
    report: {
      status: "pending", // pending, completed
      submittedAt: null,
      grade: null,
      acceptedQuantity: null,
      rejectedQuantity: null,
      notes: null,
      images: [],
    },
  },
  transporter: {
    id: "transporter-101",
    name: "Fast Movers Ltd",
    contact: "0745678901",
    vehicle: "KBZ 123X",
    status: "assigned", // assigned, in_transit, delivered
    pickupTime: null,
    estimatedDeliveryTime: null,
    actualDeliveryTime: null,
  },
  timeline: [
    {
      id: "event-1",
      title: "Bid Accepted",
      description: "Buyer accepted the bid from Meru Farmers Cooperative",
      timestamp: "2023-07-27T10:30:00Z",
      completed: true,
    },
    {
      id: "event-2",
      title: "Grader Assigned",
      description: "John Kamau assigned as grader for quality assessment",
      timestamp: "2023-07-27T10:35:00Z",
      completed: true,
    },
    {
      id: "event-3",
      title: "Transporter Assigned",
      description: "Fast Movers Ltd assigned as transporter for delivery",
      timestamp: "2023-07-27T11:00:00Z",
      completed: true,
    },
    {
      id: "event-4",
      title: "Grading Scheduled",
      description: "Quality assessment scheduled at collection point",
      timestamp: "2023-07-28T09:00:00Z",
      completed: false,
    },
    {
      id: "event-5",
      title: "Pre-financing Disbursement",
      description: "Pre-financing amount to be disbursed after grading",
      timestamp: null,
      completed: false,
    },
    {
      id: "event-6",
      title: "Produce Transport",
      description: "Transport from collection point to buyer location",
      timestamp: null,
      completed: false,
    },
    {
      id: "event-7",
      title: "Delivery Confirmation",
      description: "Buyer confirms receipt of produce",
      timestamp: null,
      completed: false,
    },
    {
      id: "event-8",
      title: "Final Payment",
      description: "Final payment settlement to financier",
      timestamp: null,
      completed: false,
    },
  ],
  createdAt: "2023-07-27T10:30:00Z",
  updatedAt: "2023-07-27T11:00:00Z",
}

export default function TransactionDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [transaction, setTransaction] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overview")

  // Fetch transaction details
  useEffect(() => {
    const fetchTransactionDetails = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Get mock data
        setTransaction(mockTransaction)
      } catch (error) {
        console.error("Error fetching transaction details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactionDetails()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="container max-w-md mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="container max-w-md mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTitle>Transaction Not Found</AlertTitle>
          <AlertDescription>The transaction you're looking for doesn't exist or has been removed.</AlertDescription>
        </Alert>
        <Button className="mt-4 w-full" variant="outline" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-4 p-0 flex items-center text-muted-foreground"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back
      </Button>

      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Transaction Details</h1>
          {transaction.status === "in_progress" ? (
            <Badge variant="outline" className="bg-blue-100 text-blue-800">
              In Progress
            </Badge>
          ) : transaction.status === "completed" ? (
            <Badge variant="outline" className="bg-green-100 text-green-800">
              Completed
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-red-100 text-red-800">
              Cancelled
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">Transaction ID: {transaction.id}</p>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{transaction.produce}</CardTitle>
              <CardDescription>{transaction.quantity}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Price per kg:</span>
                  <span className="font-bold">KES {transaction.price}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total value:</span>
                  <span>KES {transaction.totalValue.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Created:</span>
                  <span className="text-muted-foreground">{new Date(transaction.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Current Status</h3>
                <div className="rounded-md bg-muted p-3">
                  {transaction.grader.report.status === "pending" ? (
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-blue-500" />
                      <div>
                        <p className="font-medium">Waiting for Grading</p>
                        <p className="text-sm text-muted-foreground">
                          The grader will assess the produce quality at the collection point
                        </p>
                      </div>
                    </div>
                  ) : transaction.transporter.status === "assigned" ? (
                    <div className="flex items-center">
                      <Truck className="h-5 w-5 mr-2 text-blue-500" />
                      <div>
                        <p className="font-medium">Waiting for Transport</p>
                        <p className="text-sm text-muted-foreground">
                          The transporter will pick up the produce after grading
                        </p>
                      </div>
                    </div>
                  ) : transaction.transporter.status === "in_transit" ? (
                    <div className="flex items-center">
                      <Truck className="h-5 w-5 mr-2 text-green-500" />
                      <div>
                        <p className="font-medium">In Transit</p>
                        <p className="text-sm text-muted-foreground">The produce is being transported to the buyer</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Check className="h-5 w-5 mr-2 text-green-500" />
                      <div>
                        <p className="font-medium">Delivered</p>
                        <p className="text-sm text-muted-foreground">The produce has been delivered to the buyer</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {transaction.requiresPreFinancing && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Pre-Financing</h3>
                    <div className="rounded-md bg-muted p-3">
                      {transaction.preFinancingStatus === "pending" ? (
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 mr-2 text-blue-500" />
                          <div>
                            <p className="font-medium">Pending Disbursement</p>
                            <p className="text-sm text-muted-foreground">
                              Will be disbursed after transporter confirmation
                            </p>
                          </div>
                        </div>
                      ) : transaction.preFinancingStatus === "disbursed" ? (
                        <div className="flex items-center">
                          <Check className="h-5 w-5 mr-2 text-green-500" />
                          <div>
                            <p className="font-medium">Disbursed</p>
                            <p className="text-sm text-muted-foreground">
                              Pre-financing has been disbursed to the group
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Check className="h-5 w-5 mr-2 text-green-500" />
                          <div>
                            <p className="font-medium">Completed</p>
                            <p className="text-sm text-muted-foreground">Final payment has been settled</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Group</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{transaction.group.name}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{transaction.group.location}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{transaction.group.contact}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Buyer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{transaction.buyer.name}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{transaction.buyer.location}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{transaction.buyer.contact}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Timeline</CardTitle>
              <CardDescription>Track the progress of your transaction</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="relative border-l border-muted">
                {transaction.timeline.map((event: any, index: number) => (
                  <li key={event.id} className="mb-6 ml-6">
                    <span
                      className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ${
                        event.completed ? "bg-green-100 ring-green-500/20 ring-4" : "bg-muted ring-muted/20 ring-4"
                      }`}
                    >
                      {event.completed ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <span className="w-3 h-3 bg-muted-foreground/30 rounded-full"></span>
                      )}
                    </span>
                    <h3
                      className={`flex items-center mb-1 text-base font-semibold ${
                        event.completed ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {event.title}
                    </h3>
                    <p className="mb-2 text-sm text-muted-foreground">{event.description}</p>
                    {event.timestamp && (
                      <time className="block text-xs font-normal text-muted-foreground">
                        {new Date(event.timestamp).toLocaleString()}
                      </time>
                    )}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Grading Details</CardTitle>
              <CardDescription>Quality assessment information</CardDescription>
            </CardHeader>
            <CardContent>
              {transaction.grader.report.status === "pending" ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <Clock className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-center text-muted-foreground">Grading has not been completed yet</p>
                  <p className="text-center text-sm text-muted-foreground mt-1">
                    The grader will assess the produce quality at the collection point
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Grader:</span>
                      <span>{transaction.grader.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Grade:</span>
                      <Badge variant="outline">{transaction.grader.report.grade}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Accepted Quantity:</span>
                      <span>{transaction.grader.report.acceptedQuantity} kg</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Rejected Quantity:</span>
                      <span>{transaction.grader.report.rejectedQuantity} kg</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Graded On:</span>
                      <span className="text-muted-foreground">
                        {new Date(transaction.grader.report.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {transaction.grader.report.notes && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-sm font-medium mb-1">Grader Notes:</h3>
                        <p className="text-sm text-muted-foreground">{transaction.grader.report.notes}</p>
                      </div>
                    </>
                  )}

                  {transaction.grader.report.images.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-sm font-medium mb-2">Grading Images:</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {transaction.grader.report.images.map((image: string, index: number) => (
                            <div key={index} className="relative aspect-video overflow-hidden rounded-md border">
                              <Image
                                src={image || "/placeholder.svg"}
                                alt={`Grading image ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transport Details</CardTitle>
              <CardDescription>Delivery information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Transporter:</span>
                    <span>{transaction.transporter.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Contact:</span>
                    <span>{transaction.transporter.contact}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Vehicle:</span>
                    <span>{transaction.transporter.vehicle}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge
                      variant="outline"
                      className={
                        transaction.transporter.status === "assigned"
                          ? "bg-yellow-100 text-yellow-800"
                          : transaction.transporter.status === "in_transit"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                      }
                    >
                      {transaction.transporter.status === "assigned"
                        ? "Assigned"
                        : transaction.transporter.status === "in_transit"
                          ? "In Transit"
                          : "Delivered"}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-sm font-medium mb-1">Collection Point:</h3>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{transaction.group.collectionPoint.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {transaction.transporter.pickupTime
                        ? new Date(transaction.transporter.pickupTime).toLocaleString()
                        : "Not picked up yet"}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-sm font-medium mb-1">Delivery:</h3>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{transaction.buyer.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {transaction.transporter.actualDeliveryTime
                        ? new Date(transaction.transporter.actualDeliveryTime).toLocaleString()
                        : transaction.transporter.estimatedDeliveryTime
                          ? `Estimated: ${new Date(transaction.transporter.estimatedDeliveryTime).toLocaleString()}`
                          : "Not scheduled yet"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {transaction.requiresPreFinancing && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>Pre-financing and final payment information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Pre-financing Status:</span>
                      <Badge
                        variant="outline"
                        className={
                          transaction.preFinancingStatus === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : transaction.preFinancingStatus === "disbursed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                        }
                      >
                        {transaction.preFinancingStatus === "pending"
                          ? "Pending"
                          : transaction.preFinancingStatus === "disbursed"
                            ? "Disbursed"
                            : "Completed"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Pre-financing Amount:</span>
                      <span>KES {(transaction.totalValue * 0.4).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Final Payment Amount:</span>
                      <span>KES {(transaction.totalValue * 0.6).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
