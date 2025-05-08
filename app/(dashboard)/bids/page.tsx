"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Check, Clock, Download, Filter, MoreHorizontal, Search, SlidersHorizontal, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/lib/auth-context"

// Form schema for responding to bids
const bidResponseSchema = z.object({
  status: z.enum(["accepted", "rejected", "counter"]),
  counterPrice: z.coerce.number().optional(),
  deliveryDate: z.string().optional(),
  notes: z
    .string()
    .max(500, {
      message: "Notes must not exceed 500 characters.",
    })
    .optional(),
})

type BidResponseValues = z.infer<typeof bidResponseSchema>

// Sample bids data
const initialBids = [
  {
    id: "BID-001",
    buyerName: "Nairobi Fresh Produce Ltd",
    produce: "Coffee",
    variety: "Arabica SL28",
    quantity: "500 kg",
    pricePerUnit: "KES 350",
    totalValue: "KES 175,000",
    deliveryDate: "2023-08-15",
    status: "pending",
    createdAt: "2023-07-25",
  },
  {
    id: "BID-002",
    buyerName: "Kenya Tea Exporters",
    produce: "Tea",
    variety: "Green Tea",
    quantity: "1000 kg",
    pricePerUnit: "KES 200",
    totalValue: "KES 200,000",
    deliveryDate: "2023-09-01",
    status: "accepted",
    createdAt: "2023-07-20",
  },
  {
    id: "BID-003",
    buyerName: "Fresh Avocados Inc",
    produce: "Avocado",
    variety: "Hass",
    quantity: "300 kg",
    pricePerUnit: "KES 120",
    totalValue: "KES 36,000",
    deliveryDate: "2023-08-10",
    status: "rejected",
    createdAt: "2023-07-18",
  },
  {
    id: "BID-004",
    buyerName: "Organic Fruits Kenya",
    produce: "Avocado",
    variety: "Fuerte",
    quantity: "250 kg",
    pricePerUnit: "KES 100",
    totalValue: "KES 25,000",
    deliveryDate: "2023-08-20",
    status: "counter",
    createdAt: "2023-07-22",
  },
  {
    id: "BID-005",
    buyerName: "Nairobi Fresh Produce Ltd",
    produce: "Coffee",
    variety: "Arabica SL34",
    quantity: "300 kg",
    pricePerUnit: "KES 370",
    totalValue: "KES 111,000",
    deliveryDate: "2023-09-05",
    status: "pending",
    createdAt: "2023-07-26",
  },
]

export default function BidsPage() {
  const { user } = useAuth()
  const [bids, setBids] = useState(initialBids)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentBid, setCurrentBid] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [produceFilter, setProduceFilter] = useState<string>("all")

  // Initialize form
  const form = useForm<BidResponseValues>({
    resolver: zodResolver(bidResponseSchema),
    defaultValues: {
      status: "accepted",
      counterPrice: undefined,
      deliveryDate: "",
      notes: "",
    },
  })

  // Handle form submission
  function onSubmit(data: BidResponseValues) {
    if (currentBid) {
      // Update bid status
      setBids(
        bids.map((bid) =>
          bid.id === currentBid.id
            ? {
                ...bid,
                status: data.status,
              }
            : bid,
        ),
      )
    }

    // Reset form and close dialog
    form.reset()
    setIsDialogOpen(false)
    setCurrentBid(null)
  }

  // Handle responding to a bid
  function handleRespondToBid(bid: any) {
    setCurrentBid(bid)
    form.reset({
      status: "accepted",
      counterPrice: undefined,
      deliveryDate: bid.deliveryDate,
      notes: "",
    })
    setIsDialogOpen(true)
  }

  // Filter bids
  const filteredBids = bids.filter((bid) => {
    const matchesSearch =
      bid.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bid.produce.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bid.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || bid.status === statusFilter
    const matchesProduce = produceFilter === "all" || bid.produce === produceFilter

    return matchesSearch && matchesStatus && matchesProduce
  })

  // Get unique produce types for filter
  const produceTypes = Array.from(new Set(bids.map((bid) => bid.produce)))

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400"
          >
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case "accepted":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
          >
            <Check className="mr-1 h-3 w-3" />
            Accepted
          </Badge>
        )
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400"
          >
            <X className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        )
      case "counter":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400"
          >
            <SlidersHorizontal className="mr-1 h-3 w-3" />
            Counter
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <ProtectedRoute allowedRoles={["group", "admin"]}>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bids Management</h1>
            <p className="text-muted-foreground">Manage and respond to buyer bids for your produce</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Bids</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <Card>
            <CardHeader>
              <CardTitle>Bids</CardTitle>
              <CardDescription>View and respond to bids from buyers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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
                  <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[130px]">
                        <Filter className="mr-2 h-4 w-4" />
                        <span>Status</span>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="counter">Counter</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={produceFilter} onValueChange={setProduceFilter}>
                      <SelectTrigger className="w-[130px]">
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
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bid ID</TableHead>
                        <TableHead>Buyer</TableHead>
                        <TableHead>Produce</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Delivery Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBids.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="h-24 text-center">
                            No bids found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredBids.map((bid) => (
                          <TableRow key={bid.id}>
                            <TableCell className="font-medium">{bid.id}</TableCell>
                            <TableCell>{bid.buyerName}</TableCell>
                            <TableCell>
                              {bid.produce}
                              <span className="block text-xs text-muted-foreground">{bid.variety}</span>
                            </TableCell>
                            <TableCell>{bid.quantity}</TableCell>
                            <TableCell>
                              {bid.pricePerUnit}
                              <span className="block text-xs text-muted-foreground">Total: {bid.totalValue}</span>
                            </TableCell>
                            <TableCell>{new Date(bid.deliveryDate).toLocaleDateString()}</TableCell>
                            <TableCell>{getStatusBadge(bid.status)}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleRespondToBid(bid)}>
                                    Respond to Bid
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredBids.length} of {bids.length} bids
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </Tabs>

        {/* Respond to Bid Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Respond to Bid</DialogTitle>
              <DialogDescription>Review and respond to the bid from {currentBid?.buyerName}</DialogDescription>
            </DialogHeader>
            {currentBid && (
              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bid ID</p>
                  <p className="font-medium">{currentBid.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Buyer</p>
                  <p>{currentBid.buyerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Produce</p>
                  <p>
                    {currentBid.produce} ({currentBid.variety})
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Quantity</p>
                  <p>{currentBid.quantity}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Price Per Unit</p>
                  <p>{currentBid.pricePerUnit}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                  <p>{currentBid.totalValue}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Delivery Date</p>
                  <p>{new Date(currentBid.deliveryDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created At</p>
                  <p>{new Date(currentBid.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Response</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select response" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="accepted">Accept Bid</SelectItem>
                          <SelectItem value="rejected">Reject Bid</SelectItem>
                          <SelectItem value="counter">Counter Offer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("status") === "counter" && (
                  <FormField
                    control={form.control}
                    name="counterPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Counter Price (KES per unit)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="deliveryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>
                        {form.watch("status") === "counter" ? "Proposed delivery date" : "Confirm delivery date"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Additional notes or comments for the buyer</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit">Submit Response</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
