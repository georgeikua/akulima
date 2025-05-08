"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Filter,
  MapPin,
  MoreHorizontal,
  Phone,
  Search,
  Truck,
  User,
} from "lucide-react"

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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/lib/auth-context"

// Form schema for updating transit status
const transitUpdateSchema = z.object({
  status: z.enum(["in_transit", "delayed", "delivered", "issue"]),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  notes: z
    .string()
    .max(500, {
      message: "Notes must not exceed 500 characters.",
    })
    .optional(),
})

type TransitUpdateValues = z.infer<typeof transitUpdateSchema>

// Sample transit data
const initialTransits = [
  {
    id: "TRN-001",
    orderNumber: "ORD-2023-001",
    buyerName: "Nairobi Fresh Produce Ltd",
    produce: "Coffee",
    quantity: "500 kg",
    pickupLocation: "Nyeri Highlands Cooperative",
    deliveryLocation: "Nairobi Industrial Area",
    transporterName: "Fast Logistics Ltd",
    transporterPhone: "+254712345678",
    vehicleDetails: "KBZ 123A",
    departureDate: "2023-08-10",
    estimatedArrival: "2023-08-11",
    status: "in_transit",
    lastUpdated: "2023-08-10T08:30:00Z",
    currentLocation: "Karatina",
  },
  {
    id: "TRN-002",
    orderNumber: "ORD-2023-002",
    buyerName: "Kenya Tea Exporters",
    produce: "Tea",
    quantity: "1000 kg",
    pickupLocation: "Nyeri Highlands Cooperative",
    deliveryLocation: "Mombasa Port",
    transporterName: "Reliable Transport Co.",
    transporterPhone: "+254723456789",
    vehicleDetails: "KCY 456B",
    departureDate: "2023-08-05",
    estimatedArrival: "2023-08-07",
    status: "delivered",
    lastUpdated: "2023-08-07T14:15:00Z",
    currentLocation: "Mombasa Port",
  },
  {
    id: "TRN-003",
    orderNumber: "ORD-2023-003",
    buyerName: "Fresh Avocados Inc",
    produce: "Avocado",
    quantity: "300 kg",
    pickupLocation: "Nyeri Highlands Cooperative",
    deliveryLocation: "JKIA Cargo Terminal",
    transporterName: "Fast Logistics Ltd",
    transporterPhone: "+254712345678",
    vehicleDetails: "KDG 789C",
    departureDate: "2023-08-08",
    estimatedArrival: "2023-08-09",
    status: "delayed",
    lastUpdated: "2023-08-08T16:45:00Z",
    currentLocation: "Thika Road",
  },
  {
    id: "TRN-004",
    orderNumber: "ORD-2023-004",
    buyerName: "Organic Fruits Kenya",
    produce: "Avocado",
    quantity: "250 kg",
    pickupLocation: "Nyeri Highlands Cooperative",
    deliveryLocation: "Nakuru Distribution Center",
    transporterName: "Reliable Transport Co.",
    transporterPhone: "+254723456789",
    vehicleDetails: "KBN 012D",
    departureDate: "2023-08-12",
    estimatedArrival: "2023-08-13",
    status: "issue",
    lastUpdated: "2023-08-12T11:20:00Z",
    currentLocation: "Naivasha",
  },
]

export default function TransitPage() {
  const { user } = useAuth()
  const [transits, setTransits] = useState(initialTransits)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [currentTransit, setCurrentTransit] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Initialize form
  const form = useForm<TransitUpdateValues>({
    resolver: zodResolver(transitUpdateSchema),
    defaultValues: {
      status: "in_transit",
      location: "",
      notes: "",
    },
  })

  // Handle form submission
  function onSubmit(data: TransitUpdateValues) {
    if (currentTransit) {
      // Update transit status
      setTransits(
        transits.map((transit) =>
          transit.id === currentTransit.id
            ? {
                ...transit,
                status: data.status,
                currentLocation: data.location,
                lastUpdated: new Date().toISOString(),
              }
            : transit,
        ),
      )
    }

    // Reset form and close dialog
    form.reset()
    setIsUpdateDialogOpen(false)
    setCurrentTransit(null)
  }

  // Handle viewing transit details
  function handleViewTransit(transit: any) {
    setCurrentTransit(transit)
    setIsDialogOpen(true)
  }

  // Handle updating transit status
  function handleUpdateTransit(transit: any) {
    setCurrentTransit(transit)
    form.reset({
      status: transit.status,
      location: transit.currentLocation,
      notes: "",
    })
    setIsUpdateDialogOpen(true)
  }

  // Filter transits
  const filteredTransits = transits.filter((transit) => {
    const matchesSearch =
      transit.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transit.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transit.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transit.produce.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || transit.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_transit":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400"
          >
            <Truck className="mr-1 h-3 w-3" />
            In Transit
          </Badge>
        )
      case "delivered":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
          >
            <CheckCircle className="mr-1 h-3 w-3" />
            Delivered
          </Badge>
        )
      case "delayed":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400"
          >
            <Clock className="mr-1 h-3 w-3" />
            Delayed
          </Badge>
        )
      case "issue":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400"
          >
            <AlertCircle className="mr-1 h-3 w-3" />
            Issue Reported
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <ProtectedRoute allowedRoles={["group", "admin", "transporter"]}>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transit Tracking</h1>
            <p className="text-muted-foreground">Track your produce in transit to buyers</p>
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
            <TabsTrigger value="all">All Shipments</TabsTrigger>
            <TabsTrigger value="in_transit">In Transit</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
          </TabsList>

          <Card>
            <CardHeader>
              <CardTitle>Shipments</CardTitle>
              <CardDescription>Track and monitor your produce shipments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search shipments..."
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
                        <SelectItem value="in_transit">In Transit</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="delayed">Delayed</SelectItem>
                        <SelectItem value="issue">Issues</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tracking ID</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead>Produce</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Departure</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransits.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="h-24 text-center">
                            No shipments found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTransits.map((transit) => (
                          <TableRow key={transit.id}>
                            <TableCell className="font-medium">{transit.id}</TableCell>
                            <TableCell>{transit.orderNumber}</TableCell>
                            <TableCell>
                              {transit.produce}
                              <span className="block text-xs text-muted-foreground">{transit.quantity}</span>
                            </TableCell>
                            <TableCell>{transit.deliveryLocation}</TableCell>
                            <TableCell>{new Date(transit.departureDate).toLocaleDateString()}</TableCell>
                            <TableCell>{getStatusBadge(transit.status)}</TableCell>
                            <TableCell>
                              {new Date(transit.lastUpdated).toLocaleString()}
                              <span className="block text-xs text-muted-foreground">{transit.currentLocation}</span>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleViewTransit(transit)}>
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleUpdateTransit(transit)}>
                                    Update Status
                                  </DropdownMenuItem>
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
                Showing {filteredTransits.length} of {transits.length} shipments
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

        {/* View Transit Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Shipment Details</DialogTitle>
              <DialogDescription>Detailed information about the shipment</DialogDescription>
            </DialogHeader>
            {currentTransit && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{currentTransit.id}</h3>
                    <p className="text-sm text-muted-foreground">Order: {currentTransit.orderNumber}</p>
                  </div>
                  <div>{getStatusBadge(currentTransit.status)}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Produce</p>
                    <p>{currentTransit.produce}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Quantity</p>
                    <p>{currentTransit.quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Buyer</p>
                    <p>{currentTransit.buyerName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Location</p>
                    <p>{currentTransit.currentLocation}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Pickup Location</p>
                      <p>{currentTransit.pickupLocation}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Delivery Location</p>
                      <p>{currentTransit.deliveryLocation}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Departure Date</p>
                      <p>{new Date(currentTransit.departureDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Estimated Arrival</p>
                      <p>{new Date(currentTransit.estimatedArrival).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Transporter Information</h4>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p>{currentTransit.transporterName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p>{currentTransit.transporterPhone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <p>Vehicle: {currentTransit.vehicleDetails}</p>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => handleUpdateTransit(currentTransit)}>
                    Update Status
                  </Button>
                  <Button asChild>
                    <a href={`tel:${currentTransit.transporterPhone}`}>
                      <Phone className="mr-2 h-4 w-4" />
                      Call Transporter
                    </a>
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Update Transit Status Dialog */}
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Update Shipment Status</DialogTitle>
              <DialogDescription>Update the current status and location of the shipment</DialogDescription>
            </DialogHeader>
            {currentTransit && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{currentTransit.id}</h3>
                      <p className="text-sm text-muted-foreground">Order: {currentTransit.orderNumber}</p>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="in_transit">In Transit</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="delayed">Delayed</SelectItem>
                            <SelectItem value="issue">Issue Reported</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Location</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
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
                          <Textarea
                            placeholder="Add any additional information about the current status..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button type="submit">Update Status</Button>
                  </DialogFooter>
                </form>
              </Form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
