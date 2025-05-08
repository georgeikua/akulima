"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, ChevronRight, Clock, Filter, Loader2, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"

// Mock bids data
const mockBids = [
  {
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
    transaction: {
      id: "txn-001",
      status: "in_progress", // in_progress, completed, cancelled
    },
  },
  {
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
    transaction: null,
  },
  {
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
    transaction: null,
  },
  {
    id: "bid-response-004",
    bidRequestId: "bid-004",
    produce: "Cabbage",
    quantity: "1 Ton (Pick-up)",
    price: 35, // per kg
    totalValue: 35000, // 1000kg * 35
    submittedDate: "2023-07-18",
    status: "accepted",
    buyer: {
      name: "Tuskys Supermarket",
      location: "Nairobi, CBD",
    },
    transaction: {
      id: "txn-002",
      status: "completed",
    },
  },
]

export default function MyBidsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [bids, setBids] = useState<any[]>([])

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

  // Filter bids based on search term and status filter
  const filteredBids = bids.filter((bid) => {
    const matchesSearch =
      bid.produce.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bid.buyer.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || bid.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Handle bid selection
  const handleSelectBid = (bid: any) => {
    if (bid.transaction) {
      router.push(`/transaction-details/${bid.transaction.id}`)
    } else {
      router.push(`/my-bids/${bid.id}`)
    }
  }

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
            <CheckCircle className="mr-1 h-3 w-3" />
            Accepted
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            <X className="mr-1 h-3 w-3" />
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

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Bids</h1>
        <p className="text-sm text-muted-foreground">Track the status of your submitted bids</p>
      </div>

      <div className="space-y-4">
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <span>Status</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
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
                  setStatusFilter("all")
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
                    {getStatusBadge(bid.status)}
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Buyer:</span>
                      <span className="text-sm">{bid.buyer.name}</span>
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
                      <span className="text-sm font-medium">Submitted:</span>
                      <span className="text-sm text-muted-foreground">{bid.submittedDate}</span>
                    </div>
                    {bid.transaction && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Transaction:</span>
                        <Badge
                          variant="outline"
                          className={
                            bid.transaction.status === "in_progress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }
                        >
                          {bid.transaction.status === "in_progress" ? "In Progress" : "Completed"}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="ghost" className="w-full justify-between" onClick={() => handleSelectBid(bid)}>
                    {bid.transaction ? "View Transaction" : "View Details"}
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
