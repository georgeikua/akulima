"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Filter, ArrowUpDown, Eye, Download, CheckCircle, XCircle } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ProtectedRoute } from "@/components/protected-route"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"

// Sample open bids data
const initialOpenBids = [
  {
    id: "BID-001",
    buyer: "Nairobi Grocers Ltd",
    date: "2023-05-15",
    items: [
      { name: "Tomatoes", quantity: 500, unit: "kg", price: 120 },
      { name: "Onions", quantity: 200, unit: "kg", price: 90 },
    ],
    total: 78000,
    status: "open",
    deadline: "2023-05-20",
    location: "Nairobi, Westlands",
  },
  {
    id: "BID-002",
    buyer: "Fresh Market Kenya",
    date: "2023-05-18",
    items: [{ name: "Kale (Sukuma Wiki)", quantity: 1000, unit: "bundles", price: 25 }],
    total: 25000,
    status: "open",
    deadline: "2023-05-22",
    location: "Nakuru Town",
  },
  {
    id: "BID-003",
    buyer: "Carrefour Supermarket",
    date: "2023-05-20",
    items: [{ name: "Avocados", quantity: 800, unit: "kg", price: 150 }],
    total: 120000,
    status: "open",
    deadline: "2023-05-25",
    location: "Nairobi, Karen",
  },
  {
    id: "BID-004",
    buyer: "Tuskys Supermarket",
    date: "2023-05-22",
    items: [{ name: "Green Peppers", quantity: 300, unit: "kg", price: 180 }],
    total: 54000,
    status: "open",
    deadline: "2023-05-27",
    location: "Kisumu CBD",
  },
  {
    id: "BID-005",
    buyer: "Naivas Supermarket",
    date: "2023-05-25",
    items: [
      { name: "Tomatoes", quantity: 600, unit: "kg", price: 120 },
      { name: "Cabbage", quantity: 400, unit: "heads", price: 80 },
    ],
    total: 104000,
    status: "open",
    deadline: "2023-05-30",
    location: "Mombasa Road",
  },
]

// Sample orders data (bids you've already placed)
const initialOrders = [
  {
    id: "ORD-001",
    buyer: "Nairobi Grocers Ltd",
    date: "2023-05-15",
    items: [
      { name: "Tomatoes", quantity: 100, unit: "kg", price: 120 },
      { name: "Spinach", quantity: 50, unit: "bundles", price: 30 },
    ],
    total: 13500,
    status: "delivered",
    paymentStatus: "paid",
  },
  {
    id: "ORD-002",
    buyer: "Fresh Market Kenya",
    date: "2023-05-18",
    items: [{ name: "Carrots", quantity: 200, unit: "kg", price: 80 }],
    total: 16000,
    status: "processing",
    paymentStatus: "pending",
  },
  {
    id: "ORD-003",
    buyer: "Carrefour Supermarket",
    date: "2023-05-20",
    items: [{ name: "Watermelon", quantity: 300, unit: "kg", price: 40 }],
    total: 12000,
    status: "confirmed",
    paymentStatus: "paid",
  },
]

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState(initialOrders)
  const [openBids, setOpenBids] = useState(initialOpenBids)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPayment, setFilterPayment] = useState("all")
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [showIgnoreDialog, setShowIgnoreDialog] = useState(false)
  const [selectedBidId, setSelectedBidId] = useState<string | null>(null)

  // Handle sort
  function handleSort(field: string) {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Handle bid action
  function handleBid(bidId: string) {
    router.push(`/orders/${bidId}/bid`)
  }

  // Handle ignore action
  function handleIgnore(bidId: string) {
    setSelectedBidId(bidId)
    setShowIgnoreDialog(true)
  }

  // Confirm ignore action
  function confirmIgnore() {
    if (selectedBidId) {
      // Remove the bid from the list
      setOpenBids(openBids.filter((bid) => bid.id !== selectedBidId))
      setSelectedBidId(null)
    }
    setShowIgnoreDialog(false)
  }

  // Calculate total amount for all orders
  const totalAmount = orders.reduce((sum, order) => sum + order.total, 0)

  // Calculate total number of orders by status
  const ordersByStatus = orders.reduce(
    (acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Filter and sort orders
  const filteredOrders = orders
    .filter((order) => {
      // Search filter
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

      // Status filter
      const matchesStatus = filterStatus === "all" || order.status === filterStatus

      // Payment status filter
      const matchesPayment = filterPayment === "all" || order.paymentStatus === filterPayment

      return matchesSearch && matchesStatus && matchesPayment
    })
    .sort((a, b) => {
      if (!sortField) return 0

      if (sortField === "date") {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA
      }

      if (sortField === "total") {
        return sortDirection === "asc" ? a.total - b.total : b.total - a.total
      }

      const fieldA = a[sortField as keyof typeof a]
      const fieldB = b[sortField as keyof typeof b]

      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return sortDirection === "asc" ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA)
      }

      return 0
    })

  // Filter and sort open bids
  const filteredOpenBids = openBids
    .filter((bid) => {
      // Search filter
      const matchesSearch =
        bid.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bid.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bid.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

      return matchesSearch
    })
    .sort((a, b) => {
      if (sortField === "date") {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA
      }

      if (sortField === "total") {
        return sortDirection === "asc" ? a.total - b.total : b.total - a.total
      }

      if (sortField === "deadline") {
        const dateA = new Date(a.deadline).getTime()
        const dateB = new Date(b.deadline).getTime()
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA
      }

      return 0
    })

  return (
    <ProtectedRoute allowedRoles={["group", "admin"]}>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Orders & Bids</h1>
            <p className="text-muted-foreground">Manage open bids and track your produce orders</p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Orders
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="text-2xl font-bold">{openBids.length}</div>
              <p className="text-sm text-muted-foreground">Open Bids</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="text-2xl font-bold">{orders.length}</div>
              <p className="text-sm text-muted-foreground">Your Orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="text-2xl font-bold">KES {totalAmount.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="open_bids" className="space-y-4">
          <TabsList>
            <TabsTrigger value="open_bids">Open Bids</TabsTrigger>
            <TabsTrigger value="your_orders">Your Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="open_bids" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bids..."
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

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Bid ID</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Produce</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("deadline")}>
                        <div className="flex items-center">
                          Deadline
                          {sortField === "deadline" && (
                            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("total")}>
                        <div className="flex items-center">
                          Value (KES)
                          {sortField === "total" && (
                            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOpenBids.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No open bids found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOpenBids.map((bid) => (
                        <TableRow key={bid.id}>
                          <TableCell className="font-medium">{bid.id}</TableCell>
                          <TableCell>
                            {bid.buyer}
                            <div className="text-xs text-muted-foreground">{bid.location}</div>
                          </TableCell>
                          <TableCell>
                            {bid.items.map((item, index) => (
                              <div key={index}>
                                {item.name} ({item.quantity} {item.unit})
                              </div>
                            ))}
                          </TableCell>
                          <TableCell>{format(new Date(bid.deadline), "MMM d, yyyy")}</TableCell>
                          <TableCell>{bid.total.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2 text-green-600"
                                onClick={() => handleBid(bid.id)}
                              >
                                <CheckCircle className="mr-1 h-4 w-4" />
                                Bid
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2 text-red-600"
                                onClick={() => handleIgnore(bid.id)}
                              >
                                <XCircle className="mr-1 h-4 w-4" />
                                Ignore
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="your_orders" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPayment} onValueChange={setFilterPayment}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Order ID</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("buyer")}>
                        <div className="flex items-center">
                          Buyer
                          {sortField === "buyer" && (
                            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                        <div className="flex items-center">
                          Date
                          {sortField === "date" && (
                            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("total")}>
                        <div className="flex items-center">
                          Amount
                          {sortField === "total" && (
                            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                        Status
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No orders found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.buyer}</TableCell>
                          <TableCell>{format(new Date(order.date), "MMM d, yyyy")}</TableCell>
                          <TableCell>KES {order.total.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                order.status === "delivered"
                                  ? "success"
                                  : order.status === "pending"
                                    ? "outline"
                                    : order.status === "cancelled"
                                      ? "destructive"
                                      : "secondary"
                              }
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button asChild variant="ghost" size="sm">
                              <Link href={`/orders/${order.id}/details`}>
                                <Eye className="mr-1 h-4 w-4" />
                                View
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Ignore Confirmation Dialog */}
      <AlertDialog open={showIgnoreDialog} onOpenChange={setShowIgnoreDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ignore this bid?</AlertDialogTitle>
            <AlertDialogDescription>
              This bid will be removed from your list. Other groups will still be able to bid on it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmIgnore}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ProtectedRoute>
  )
}
