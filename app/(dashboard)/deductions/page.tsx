"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowDown, Check, Download, Eye, Filter, MoreHorizontal, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/lib/auth-context"

// Form schema for creating a deduction
const deductionSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  amount: z.coerce.number().positive({
    message: "Amount must be a positive number.",
  }),
  deductionDate: z.string(),
  description: z
    .string()
    .max(500, {
      message: "Description must not exceed 500 characters.",
    })
    .optional(),
  deductionType: z.enum(["loan_repayment", "input_advance", "membership_fee", "other"]),
  applyTo: z.enum(["all_members", "specific_members"]),
})

type DeductionValues = z.infer<typeof deductionSchema>

// Sample deductions data
const initialDeductions = [
  {
    id: "DED-001",
    title: "Fertilizer Advance - July 2023",
    amount: 50000,
    perMember: 2000,
    deductionDate: "2023-07-15",
    status: "applied",
    memberCount: 25,
    createdAt: "2023-07-10",
    description: "Advance payment for fertilizer distribution to members",
    deductionType: "input_advance",
    applyTo: "all_members",
  },
  {
    id: "DED-002",
    title: "Annual Membership Fee - 2023",
    amount: 25000,
    perMember: 1000,
    deductionDate: "2023-01-15",
    status: "applied",
    memberCount: 25,
    createdAt: "2023-01-10",
    description: "Annual membership fee for 2023",
    deductionType: "membership_fee",
    applyTo: "all_members",
  },
  {
    id: "DED-003",
    title: "Loan Repayment - John Kamau",
    amount: 10000,
    perMember: 10000,
    deductionDate: "2023-08-01",
    status: "pending",
    memberCount: 1,
    createdAt: "2023-07-25",
    description: "Loan repayment for farm equipment",
    deductionType: "loan_repayment",
    applyTo: "specific_members",
  },
  {
    id: "DED-004",
    title: "Pesticide Advance - August 2023",
    amount: 30000,
    perMember: 1200,
    deductionDate: "2023-08-10",
    status: "pending",
    memberCount: 25,
    createdAt: "2023-08-05",
    description: "Advance payment for pesticide distribution to members",
    deductionType: "input_advance",
    applyTo: "all_members",
  },
]

// Sample member deductions
const initialMemberDeductions = [
  {
    id: "MD-001",
    deductionId: "DED-001",
    memberId: "1",
    memberName: "John Kamau",
    amount: 2000,
    status: "applied",
    date: "2023-07-15",
  },
  {
    id: "MD-002",
    deductionId: "DED-001",
    memberId: "2",
    memberName: "Mary Wanjiku",
    amount: 2000,
    status: "applied",
    date: "2023-07-15",
  },
  {
    id: "MD-003",
    deductionId: "DED-001",
    memberId: "3",
    memberName: "Peter Omondi",
    amount: 2000,
    status: "applied",
    date: "2023-07-15",
  },
  {
    id: "MD-004",
    deductionId: "DED-002",
    memberId: "1",
    memberName: "John Kamau",
    amount: 1000,
    status: "applied",
    date: "2023-01-15",
  },
  {
    id: "MD-005",
    deductionId: "DED-002",
    memberId: "2",
    memberName: "Mary Wanjiku",
    amount: 1000,
    status: "applied",
    date: "2023-01-15",
  },
  {
    id: "MD-006",
    deductionId: "DED-003",
    memberId: "1",
    memberName: "John Kamau",
    amount: 10000,
    status: "pending",
    date: "2023-08-01",
  },
]

export default function DeductionsPage() {
  const { user } = useAuth()
  const [deductions, setDeductions] = useState(initialDeductions)
  const [memberDeductions, setMemberDeductions] = useState(initialMemberDeductions)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [currentDeduction, setCurrentDeduction] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("deductions")

  // Initialize form
  const form = useForm<DeductionValues>({
    resolver: zodResolver(deductionSchema),
    defaultValues: {
      title: "",
      amount: 0,
      deductionDate: new Date().toISOString().split("T")[0],
      description: "",
      deductionType: "input_advance",
      applyTo: "all_members",
    },
  })

  // Handle form submission
  function onSubmit(data: DeductionValues) {
    // Create new deduction
    const memberCount = data.applyTo === "all_members" ? 25 : 1 // This would be dynamic in a real app
    const perMember = data.applyTo === "all_members" ? data.amount / memberCount : data.amount

    const newDeduction = {
      id: `DED-${String(deductions.length + 1).padStart(3, "0")}`,
      title: data.title,
      amount: data.amount,
      perMember,
      deductionDate: data.deductionDate,
      status: "pending",
      memberCount,
      createdAt: new Date().toISOString().split("T")[0],
      description: data.description || "",
      deductionType: data.deductionType,
      applyTo: data.applyTo,
    }

    setDeductions([newDeduction, ...deductions])

    // Reset form and close dialog
    form.reset()
    setIsDialogOpen(false)
  }

  // Handle viewing deduction details
  function handleViewDeduction(deduction: any) {
    setCurrentDeduction(deduction)
    setIsViewDialogOpen(true)
  }

  // Handle applying deduction
  function handleApplyDeduction(deduction: any) {
    // In a real app, this would open a dialog to configure the application
    // For this demo, we'll just mark it as applied
    setDeductions(
      deductions.map((d) =>
        d.id === deduction.id
          ? {
              ...d,
              status: "applied",
            }
          : d,
      ),
    )

    // Update member deductions
    const deductionMembers = memberDeductions.filter((md) => md.deductionId === deduction.id)
    if (deductionMembers.length > 0) {
      setMemberDeductions(
        memberDeductions.map((md) =>
          md.deductionId === deduction.id
            ? {
                ...md,
                status: "applied",
                date: new Date().toISOString().split("T")[0],
              }
            : md,
        ),
      )
    }
  }

  // Filter deductions
  const filteredDeductions = deductions.filter((deduction) => {
    const matchesSearch =
      deduction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deduction.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || deduction.status === statusFilter
    const matchesType = typeFilter === "all" || deduction.deductionType === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  // Filter member deductions based on search term
  const filteredMemberDeductions = memberDeductions.filter(
    (memberDeduction) =>
      memberDeduction.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memberDeduction.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Get deduction member deductions
  const getDeductionMembers = (deductionId: string) => {
    return memberDeductions.filter((memberDeduction) => memberDeduction.deductionId === deductionId)
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Get deduction type display name
  const getDeductionTypeDisplay = (type: string) => {
    switch (type) {
      case "loan_repayment":
        return "Loan Repayment"
      case "input_advance":
        return "Input Advance"
      case "membership_fee":
        return "Membership Fee"
      case "other":
        return "Other"
      default:
        return type
    }
  }

  return (
    <ProtectedRoute allowedRoles={["group", "admin"]}>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Deductions</h1>
            <p className="text-muted-foreground">Manage deductions from member payments</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Deduction
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="deductions">Deductions</TabsTrigger>
            <TabsTrigger value="member_deductions">Member Deductions</TabsTrigger>
          </TabsList>

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={activeTab === "deductions" ? "Search deductions..." : "Search member deductions..."}
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {activeTab === "deductions" && (
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <span>Status</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="applied">Applied</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[150px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <span>Type</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="loan_repayment">Loan Repayment</SelectItem>
                    <SelectItem value="input_advance">Input Advance</SelectItem>
                    <SelectItem value="membership_fee">Membership Fee</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <TabsContent value="deductions" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Deduction ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Per Member</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDeductions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No deductions found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDeductions.map((deduction) => (
                        <TableRow key={deduction.id}>
                          <TableCell className="font-medium">{deduction.id}</TableCell>
                          <TableCell>{deduction.title}</TableCell>
                          <TableCell>{getDeductionTypeDisplay(deduction.deductionType)}</TableCell>
                          <TableCell>{formatCurrency(deduction.amount)}</TableCell>
                          <TableCell>{formatCurrency(deduction.perMember)}</TableCell>
                          <TableCell>{new Date(deduction.deductionDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge
                              variant={deduction.status === "applied" ? "default" : "secondary"}
                              className={
                                deduction.status === "applied"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
                                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400"
                              }
                            >
                              {deduction.status === "applied" ? <Check className="mr-1 h-3 w-3" /> : null}
                              <span className="capitalize">{deduction.status}</span>
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
                                <DropdownMenuItem onClick={() => handleViewDeduction(deduction)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                {deduction.status === "pending" && (
                                  <DropdownMenuItem onClick={() => handleApplyDeduction(deduction)}>
                                    <ArrowDown className="mr-2 h-4 w-4" />
                                    Apply Deduction
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between py-4">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredDeductions.length} of {deductions.length} deductions
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
          </TabsContent>

          <TabsContent value="member_deductions" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Member</TableHead>
                      <TableHead>Deduction</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMemberDeductions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No member deductions found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMemberDeductions.map((memberDeduction) => {
                        const deduction = deductions.find((d) => d.id === memberDeduction.deductionId)
                        return (
                          <TableRow key={memberDeduction.id}>
                            <TableCell className="font-medium">{memberDeduction.id}</TableCell>
                            <TableCell>{memberDeduction.memberName}</TableCell>
                            <TableCell>{deduction?.title || memberDeduction.deductionId}</TableCell>
                            <TableCell>{formatCurrency(memberDeduction.amount)}</TableCell>
                            <TableCell>{new Date(memberDeduction.date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge
                                variant={memberDeduction.status === "applied" ? "default" : "secondary"}
                                className={
                                  memberDeduction.status === "applied"
                                    ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
                                    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400"
                                }
                              >
                                {memberDeduction.status === "applied" ? <Check className="mr-1 h-3 w-3" /> : null}
                                <span className="capitalize">{memberDeduction.status}</span>
                              </Badge>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between py-4">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredMemberDeductions.length} of {memberDeductions.length} member deductions
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
          </TabsContent>
        </Tabs>

        {/* New Deduction Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Deduction</DialogTitle>
              <DialogDescription>Add a new deduction to apply to member payments</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deduction Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Fertilizer Advance - August 2023" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deductionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deduction Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select deduction type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="input_advance">Input Advance</SelectItem>
                          <SelectItem value="loan_repayment">Loan Repayment</SelectItem>
                          <SelectItem value="membership_fee">Membership Fee</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>The type of deduction being applied</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (KES)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deductionDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deduction Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="applyTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apply To</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select who to apply to" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all_members">All Members</SelectItem>
                          <SelectItem value="specific_members">Specific Members</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Who this deduction will apply to</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add details about this deduction..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit">Create Deduction</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* View Deduction Details Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Deduction Details</DialogTitle>
              <DialogDescription>Detailed information about the deduction</DialogDescription>
            </DialogHeader>
            {currentDeduction && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{currentDeduction.title}</h3>
                    <p className="text-sm text-muted-foreground">ID: {currentDeduction.id}</p>
                  </div>
                  <Badge
                    variant={currentDeduction.status === "applied" ? "default" : "secondary"}
                    className={
                      currentDeduction.status === "applied"
                        ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400"
                    }
                  >
                    {currentDeduction.status === "applied" ? <Check className="mr-1 h-3 w-3" /> : null}
                    <span className="capitalize">{currentDeduction.status}</span>
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                    <p className="text-xl font-bold">{formatCurrency(currentDeduction.amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Per Member</p>
                    <p>{formatCurrency(currentDeduction.perMember)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Deduction Date</p>
                    <p>{new Date(currentDeduction.deductionDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Type</p>
                    <p>{getDeductionTypeDisplay(currentDeduction.deductionType)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Applied To</p>
                    <p>{currentDeduction.applyTo === "all_members" ? "All Members" : "Specific Members"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Member Count</p>
                    <p>{currentDeduction.memberCount}</p>
                  </div>
                </div>

                {currentDeduction.description && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Description</p>
                    <p>{currentDeduction.description}</p>
                  </div>
                )}

                {currentDeduction.status === "applied" && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold">Applied to Members</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Member</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getDeductionMembers(currentDeduction.id).length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                              No member deductions found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          getDeductionMembers(currentDeduction.id).map((memberDeduction) => (
                            <TableRow key={memberDeduction.id}>
                              <TableCell>{memberDeduction.memberName}</TableCell>
                              <TableCell>{formatCurrency(memberDeduction.amount)}</TableCell>
                              <TableCell>{new Date(memberDeduction.date).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={memberDeduction.status === "applied" ? "default" : "secondary"}
                                  className={
                                    memberDeduction.status === "applied"
                                      ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
                                      : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400"
                                  }
                                >
                                  <span className="capitalize">{memberDeduction.status}</span>
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}

                <DialogFooter>
                  {currentDeduction.status === "pending" ? (
                    <Button onClick={() => handleApplyDeduction(currentDeduction)}>
                      <ArrowDown className="mr-2 h-4 w-4" />
                      Apply Deduction
                    </Button>
                  ) : (
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Export Details
                    </Button>
                  )}
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
