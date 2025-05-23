"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { ArrowUpDown, Download, Eye, Filter, Search, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ProtectedRoute } from "@/components/protected-route"

// Sample orders data
const initialOrders = [
  {
    id: "ORD-001",
    product: "Tomatoes",
    group: "Wanake Group",
    date: "2023-05-15",
    quantity: "3 ton truck",
    total: 45000,
    status: "delivered",
    paymentStatus: "paid",
    location: "Nairobi Warehouse",
  },
  {
    id: "ORD-002",
    product: "Kale (Sukuma Wiki)",
    group: "Mkulima Youth Group",
    date: "2023-05-18",
    quantity: "1 ton truck",
    total: 16000,
    status: "processing",
    paymentStatus: "pending",
    location: "Nakuru Distribution Center",
  },
  {
    id: "ORD-003",
    product: "Watermelon",
    group: "Kilimo Women Group",
    date: "2023-05-20",
    quantity: "5 ton truck",
    total: 120000,
    status: "confirmed",
    paymentStatus: "paid",
    location: "Mombasa Depot",
  },
  {
    id: "ORD-004",
    product: "Onions",
    group: "Wanake Group",
    date: "2023-05-22",
    quantity: "3 ton truck",
    total: 36000,
    status: "in transit",
    paymentStatus: "paid",
    location: "Nairobi Warehouse",
  },
  {
    id: "ORD-005",
    product: "Potatoes",
    group: "Mkulima Youth Group",
    date: "2023-05-25",
    quantity: "7 ton truck",
    total: 84000,
    status: "pending",
    paymentStatus: "pending",
    location: "Eldoret Distribution Center",
  },
]

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState(initialOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPayment, setFilterPayment] = useState("all")
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Handle sort
  function handleSort(field: string) {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
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
        order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.group.toLowerCase().includes(searchTerm.toLowerCase())

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

  return (
    <ProtectedRoute allowedRoles={["buyer"]}>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
            <p className="text-muted-foreground">Track and manage your produce orders</p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Orders
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="text-2xl font-bold">{orders.length}</div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="text-2xl font-bold">{ordersByStatus["in transit"] || 0}</div>
              <p className="text-sm text-muted-foreground">In Transit</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="text-2xl font-bold">{ordersByStatus["delivered"] || 0}</div>
              <p className="text-sm text-muted-foreground">Delivered</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="text-2xl font-bold">KES {totalAmount.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Total Value</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all_orders" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all_orders">All Orders</TabsTrigger>
            <TabsTrigger value="active_orders">Active</TabsTrigger>
            <TabsTrigger value="completed_orders">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all_orders" className="space-y-4">
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
                      <TableHead className="cursor-pointer" onClick={() => handleSort("product")}>
                        <div className="flex items-center">
                          Product
                          {sortField === "product" && (
                            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("group")}>
                        <div className="flex items-center">
                          Group
                          {sortField === "group" && (
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
                        <TableCell colSpan={7} className="h-24 text-center">
                          No orders found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.product}</TableCell>
                          <TableCell>{order.group}</TableCell>
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
                            <div className="flex justify-end gap-2">
                              <Button asChild variant="ghost" size="sm">
                                <Link href={`/buyer-orders/${order.id}`}>
                                  <Eye className="mr-1 h-4 w-4" />
                                  View
                                </Link>
                              </Button>
                              {order.status === "in transit" && (
                                <Button asChild size="sm">
                                  <Link href={`/buyer-orders/${order.id}/track`}>
                                    <Truck className="mr-1 h-4 w-4" />
                                    Track
                                  </Link>
                                </Button>
                              )}
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

          <TabsContent value="active_orders" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Order ID</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Group</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders
                      .filter((order) => ["pending", "confirmed", "processing", "in transit"].includes(order.status))
                      .map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.product}</TableCell>
                          <TableCell>{order.group}</TableCell>
                          <TableCell>{order.quantity}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                order.status === "in transit"
                                  ? "secondary"
                                  : order.status === "pending"
                                    ? "outline"
                                    : "default"
                              }
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{order.location}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button asChild variant="ghost" size="sm">
                                <Link href={`/buyer-orders/${order.id}`}>
                                  <Eye className="mr-1 h-4 w-4" />
                                  View
                                </Link>
                              </Button>
                              {order.status === "in transit" && (
                                <Button asChild size="sm">
                                  <Link href={`/buyer-orders/${order.id}/track`}>
                                    <Truck className="mr-1 h-4 w-4" />
                                    Track
                                  </Link>
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed_orders" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Order ID</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Group</TableHead>
                      <TableHead>Date Completed</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders
                      .filter((order) => order.status === "delivered")
                      .map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.product}</TableCell>
                          <TableCell>{order.group}</TableCell>
                          <TableCell>{format(new Date(order.date), "MMM d, yyyy")}</TableCell>
                          <TableCell>KES {order.total.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                order.paymentStatus === "paid"
                                  ? "success"
                                  : order.paymentStatus === "pending"
                                    ? "outline"
                                    : "destructive"
                              }
                            >
                              {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button asChild variant="ghost" size="sm">
                              <Link href={`/buyer-orders/${order.id}`}>
                                <Eye className="mr-1 h-4 w-4" />
                                View
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
