"use client"

import { useState } from "react"
import { Plus, Filter, ArrowUpDown, Search, Edit, Trash2, MoreHorizontal } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ProtectedRoute } from "@/components/protected-route"

// Form schema for adding/editing produce
const produceFormSchema = z.object({
  name: z.string().min(2, {
    message: "Produce name must be at least 2 characters.",
  }),
  type: z.string({
    required_error: "Please select a produce type.",
  }),
  variety: z.string().min(2, {
    message: "Variety must be at least 2 characters.",
  }),
  quantity: z.coerce.number().positive({
    message: "Quantity must be a positive number.",
  }),
  unit: z.string({
    required_error: "Please select a unit.",
  }),
  grade: z.string({
    required_error: "Please select a quality grade.",
  }),
  price: z.coerce.number().positive({
    message: "Price must be a positive number.",
  }),
  description: z.string().optional(),
  harvestDate: z.string().optional(),
  availableUntil: z.string().optional(),
})

type ProduceFormValues = z.infer<typeof produceFormSchema>

// Sample produce data
const initialProduce = [
  {
    id: "1",
    name: "Watermelon",
    type: "Fruit",
    variety: "Sugar Baby",
    quantity: 500,
    unit: "kg",
    grade: "A",
    price: 40,
    description: "Sweet and juicy watermelons with bright red flesh",
    harvestDate: "2023-05-10",
    availableUntil: "2023-05-25",
    status: "available",
  },
  {
    id: "2",
    name: "Tomatoes",
    type: "Vegetable",
    variety: "Roma",
    quantity: 200,
    unit: "kg",
    grade: "A",
    price: 120,
    description: "Medium-sized tomatoes ideal for cooking",
    harvestDate: "2023-05-12",
    availableUntil: "2023-05-22",
    status: "available",
  },
  {
    id: "3",
    name: "Potatoes",
    type: "Vegetable",
    variety: "Shangi",
    quantity: 1000,
    unit: "kg",
    grade: "B",
    price: 80,
    description: "Medium-sized potatoes good for frying and boiling",
    harvestDate: "2023-05-08",
    availableUntil: "2023-06-08",
    status: "available",
  },
  {
    id: "4",
    name: "Maize",
    type: "Grain",
    variety: "H614",
    quantity: 2000,
    unit: "kg",
    grade: "A",
    price: 50,
    description: "Dry maize ready for milling or animal feed",
    harvestDate: "2023-04-20",
    availableUntil: "2023-07-20",
    status: "reserved",
  },
  {
    id: "5",
    name: "Onions",
    type: "Vegetable",
    variety: "Red Creole",
    quantity: 300,
    unit: "kg",
    grade: "A",
    price: 90,
    description: "Large red onions with strong flavor",
    harvestDate: "2023-05-05",
    availableUntil: "2023-06-05",
    status: "available",
  },
]

export default function MyProducePage() {
  const [produce, setProduce] = useState(initialProduce)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduceId, setEditingProduceId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterGrade, setFilterGrade] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Initialize form
  const form = useForm<ProduceFormValues>({
    resolver: zodResolver(produceFormSchema),
    defaultValues: {
      name: "",
      type: "",
      variety: "",
      quantity: 0,
      unit: "kg",
      grade: "A",
      price: 0,
      description: "",
      harvestDate: "",
      availableUntil: "",
    },
  })

  // Handle form submission
  function onSubmit(data: ProduceFormValues) {
    if (editingProduceId) {
      // Update existing produce
      setProduce(
        produce.map((item) =>
          item.id === editingProduceId
            ? {
                ...item,
                ...data,
              }
            : item,
        ),
      )
    } else {
      // Add new produce
      const newProduce = {
        id: (produce.length + 1).toString(),
        ...data,
        status: "available",
      }
      setProduce([...produce, newProduce])
    }

    // Reset form and close dialog
    form.reset()
    setIsDialogOpen(false)
    setEditingProduceId(null)
  }

  // Handle edit produce
  function handleEditProduce(id: string) {
    const produceToEdit = produce.find((item) => item.id === id)
    if (produceToEdit) {
      form.reset(produceToEdit)
      setEditingProduceId(id)
      setIsDialogOpen(true)
    }
  }

  // Handle delete produce
  function handleDeleteProduce(id: string) {
    setProduce(produce.filter((item) => item.id !== id))
  }

  // Handle add new produce
  function handleAddProduce() {
    form.reset({
      name: "",
      type: "",
      variety: "",
      quantity: 0,
      unit: "kg",
      grade: "A",
      price: 0,
      description: "",
      harvestDate: "",
      availableUntil: "",
    })
    setEditingProduceId(null)
    setIsDialogOpen(true)
  }

  // Handle sort
  function handleSort(field: string) {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Filter and sort produce
  const filteredProduce = produce
    .filter((item) => {
      // Search filter
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())

      // Type filter
      const matchesType = filterType === "all" || item.type === filterType

      // Grade filter
      const matchesGrade = filterGrade === "all" || item.grade === filterGrade

      // Status filter
      const matchesStatus = filterStatus === "all" || item.status === filterStatus

      return matchesSearch && matchesType && matchesGrade && matchesStatus
    })
    .sort((a, b) => {
      if (!sortField) return 0

      const fieldA = a[sortField as keyof typeof a]
      const fieldB = b[sortField as keyof typeof b]

      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return sortDirection === "asc" ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA)
      }

      if (typeof fieldA === "number" && typeof fieldB === "number") {
        return sortDirection === "asc" ? fieldA - fieldB : fieldB - fieldA
      }

      return 0
    })

  // Get unique produce types for filter
  const produceTypes = Array.from(new Set(produce.map((item) => item.type)))

  return (
    <ProtectedRoute allowedRoles={["group", "admin"]}>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Produce</h1>
            <p className="text-muted-foreground">Manage your produce inventory and listings</p>
          </div>
          <Button onClick={handleAddProduce}>
            <Plus className="mr-2 h-4 w-4" />
            Add Produce
          </Button>
        </div>

        <Tabs defaultValue="inventory" className="space-y-4">
          <TabsList>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="listings">Market Listings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search produce..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {produceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterGrade} onValueChange={setFilterGrade}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  <SelectItem value="A">Grade A</SelectItem>
                  <SelectItem value="B">Grade B</SelectItem>
                  <SelectItem value="C">Grade C</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
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
                      <TableHead className="w-[180px] cursor-pointer" onClick={() => handleSort("name")}>
                        <div className="flex items-center">
                          Produce
                          {sortField === "name" && (
                            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("type")}>
                        <div className="flex items-center">
                          Type
                          {sortField === "type" && (
                            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("variety")}>
                        Variety
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("quantity")}>
                        <div className="flex items-center">
                          Quantity
                          {sortField === "quantity" && (
                            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("grade")}>
                        Grade
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("price")}>
                        <div className="flex items-center">
                          Price (KES)
                          {sortField === "price" && (
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
                    {filteredProduce.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No produce found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProduce.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell>{item.variety}</TableCell>
                          <TableCell>
                            {item.quantity} {item.unit}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.grade}</Badge>
                          </TableCell>
                          <TableCell>{item.price}/kg</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                item.status === "available"
                                  ? "success"
                                  : item.status === "reserved"
                                    ? "warning"
                                    : "secondary"
                              }
                            >
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </Badge>
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
                                <DropdownMenuItem onClick={() => handleEditProduce(item.id)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteProduce(item.id)}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listings" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium">Market Listings</h3>
                  <p className="text-sm text-muted-foreground">
                    Create listings to sell your produce on the marketplace
                  </p>
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Listing
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium">Produce Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    View analytics and insights about your produce inventory
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add/Edit Produce Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingProduceId ? "Edit Produce" : "Add New Produce"}</DialogTitle>
              <DialogDescription>
                {editingProduceId ? "Update the details of your produce." : "Add a new produce to your inventory."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Produce Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Tomatoes" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Vegetable">Vegetable</SelectItem>
                            <SelectItem value="Fruit">Fruit</SelectItem>
                            <SelectItem value="Grain">Grain</SelectItem>
                            <SelectItem value="Legume">Legume</SelectItem>
                            <SelectItem value="Root">Root</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="variety"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Variety</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Roma" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="unit"
                      render={({ field }) => (
                        <FormItem className="w-24">
                          <FormLabel>Unit</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Unit" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="kg">kg</SelectItem>
                              <SelectItem value="g">g</SelectItem>
                              <SelectItem value="ton">ton</SelectItem>
                              <SelectItem value="piece">piece</SelectItem>
                              <SelectItem value="crate">crate</SelectItem>
                              <SelectItem value="bag">bag</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quality Grade</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select grade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="A">Grade A (Premium)</SelectItem>
                            <SelectItem value="B">Grade B (Standard)</SelectItem>
                            <SelectItem value="C">Grade C (Economy)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price per kg (KES)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="harvestDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Harvest Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="availableUntil"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Available Until</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe your produce, including quality, size, etc." {...field} />
                      </FormControl>
                      <FormDescription>
                        Provide details that will help buyers understand your produce better.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">{editingProduceId ? "Update" : "Add"} Produce</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
