"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, ChevronRight, Clock, Filter, Loader2, MapPin, Search, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"

// Mock delivery data
const mockDeliveries = [
  {
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
  {
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
  {
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
]

export default function TransporterDeliveriesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [deliveries, setDeliveries] = useState<any[]>([])

  // Fetch deliveries
  useEffect(() => {
    const fetchDeliveries = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Get mock data
        setDeliveries(mockDeliveries)
      } catch (error) {
        console.error("Error fetching deliveries:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDeliveries()
  }, [])

  // Filter deliveries based on search term and status filter
  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      delivery.produce.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.pickup.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.delivery.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || delivery.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Handle delivery selection
  const handleSelectDelivery = (deliveryId: string) => {
    router.push(`/transporter/deliveries/${deliveryId}`)
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
        ;<Badge variant="outline" className="bg-blue-100 text-blue-800">
          <CheckCircle className="mr-1 h-3 w-3" />
          Accepted
        </Badge>
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
            <CheckCircle className="mr-1 h-3 w-3" />
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

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Deliveries</h1>
        <p className="text-sm text-muted-foreground">Manage your assigned produce deliveries</p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search deliveries..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <span>Status</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="in_transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredDeliveries.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-center text-muted-foreground">No deliveries found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredDeliveries.map((delivery) => (
              <Card key={delivery.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{delivery.produce}</CardTitle>
                      <CardDescription>
                        {delivery.quantity} - {delivery.weight}kg
                      </CardDescription>
                    </div>
                    {getStatusBadge(delivery.status)}
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Pickup:</p>
                        <p className="text-sm">{delivery.pickup.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Delivery:</p>
                        <p className="text-sm">{delivery.delivery.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Date:</span>
                      <span className="text-sm">{delivery.scheduledDate}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button
                    variant="ghost"
                    className="w-full justify-between"
                    onClick={() => handleSelectDelivery(delivery.id)}
                  >
                    {delivery.status === "assigned"
                      ? "Accept Delivery"
                      : delivery.status === "accepted"
                        ? "Start Journey"
                        : delivery.status === "in_transit"
                          ? "Complete Delivery"
                          : "View Details"}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
