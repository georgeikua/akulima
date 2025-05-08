"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowDown, ArrowUp, Check, Download, Eye, Filter, MoreHorizontal, Plus, Search, Users } from "lucide-react"

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

// Form schema for creating a payment distribution
const paymentDistributionSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  amount: z.coerce.number().positive({
    message: "Amount must be a positive number.",
  }),
  paymentDate: z.string(),
  description: z
    .string()
    .max(500, {
      message: "Description must not exceed 500 characters.",
    })
    .optional(),
  distributionMethod: z.enum(["equal", "custom", "percentage"]),
})

type PaymentDistributionValues = z.infer<typeof paymentDistributionSchema>

// Sample payments data
const initialPayments = [
  {
    id: "PAY-001",
    title: "Coffee Sales - July 2023",
    amount: 175000,
    paymentDate: "2023-07-30",
    status: "distributed",
    memberCount: 25,
    createdAt: "2023-07-28",
    source: "Nairobi Fresh Produce Ltd",
    description: "Payment for 500kg of Arabica SL28 coffee beans",
    distributionMethod: "equal",
  },
  {
    id: "PAY-002",
    title: "Tea Sales - July 2023",
    amount: 200000,
    paymentDate: "2023-07-25",
    status: "pending",
    memberCount: 25,
    createdAt: "2023-07-23",
    source: "Kenya Tea Exporters",
    description: "Payment for 1000kg of Green Tea",
    distributionMethod: "equal",
  },
  {
    id: "PAY-003",
    title: "Avocado Sales - July 2023",
    amount: 36000,
    paymentDate: "2023-07-20",
    status: "distributed",
    memberCount: 25,
    createdAt: "2023-07-18",
    source: "Fresh Avocados Inc",
    description: "Payment for 300kg of Hass Avocados",
    distributionMethod: "percentage",
  },
  {
    id: "PAY-004",
    title: "Avocado Sales - August 2023",
    amount: 25000,
    paymentDate: "2023-08-05",
    status: "pending",
    memberCount: 25,
    createdAt: "2023-08-03",
    source: "Organic Fruits Kenya",
    description: "Payment for 250kg of Fuerte Avocados",
    distributionMethod: "custom",
  },
]

// Sample payment transactions
const initialTransactions = [
  {
    id: "TRX-001",
    paymentId: "PAY-001",
    date: "2023-07-30",
    amount: 7000,
    type: "credit",
    description: "Member payment distribution",
    recipient: "John Kamau",
    method: "M-Pesa",
    reference: "MPESA123456",
  },
  {
    id: "TRX-002",
    paymentId: "PAY-001",
    date: "2023-07-30",
    amount: 7000,
    type: "credit",
    description: "Member payment distribution",
    recipient: "Mary Wanjiku",
    method: "M-Pesa",
    reference: "MPESA123457",
  },
  {
    id: "TRX-003",
    paymentId: "PAY-001",
    date: "2023-07-30",
    amount: 7000,
    type: "credit",
    description: "Member payment distribution",
    recipient: "Peter Omondi",
    method: "M-Pesa",
    reference: "MPESA123458",
  },
  {
    id: "TRX-004",
    paymentId: "PAY-003",
    date: "2023-07-20",
    amount: 1440,
    type: "credit",
    description: "Member payment distribution",
    recipient: "John Kamau",
    method: "M-Pesa",
    reference: "MPESA123459",
  },
  {
    id: "TRX-005",
    paymentId: "PAY-003",
    date: "2023-07-20",
    amount: 1440,
    type: "credit",
    description: "Member payment distribution",
    recipient: "Mary Wanjiku",
    method: "M-Pesa",
    reference: "MPESA123460",
  },
]

export default function PaymentsPage() {
  const { user } = useAuth()
  const [payments, setPayments] = useState(initialPayments)
  const [transactions, setTransactions] = useState(initialTransactions)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [currentPayment, setCurrentPayment] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("payments")

  // Initialize form
  const form = useForm<PaymentDistributionValues>({
    resolver: zodResolver(paymentDistributionSchema),
    defaultValues: {
      title: "",
      amount: 0,
      paymentDate: new Date().toISOString().split("T")[0],
      description: "",
      distributionMethod: "equal",
    },
  })

  // Handle form submission
  function onSubmit(data: PaymentDistributionValues) {
    // Create new payment
    const newPayment = {
      id: `PAY-${String(payments.length + 1).padStart(3, "0")}`,
      title: data.title,
      amount: data.amount,
      paymentDate: data.paymentDate,
      status: "pending",
      memberCount: 25, // This would be dynamic in a real app
      createdAt: new Date().toISOString().split("T")[0],
      source: "Manual Entry", // This would be dynamic in a real app
      description: data.description || "",
      distributionMethod: data.distributionMethod,
    }

    setPayments([newPayment, ...payments])

    // Reset form and close dialog
    form.reset()
    setIsDialogOpen(false)
  }

  // Handle viewing payment details
  function handleViewPayment(payment: any) {
    setCurrentPayment(payment)
    setIsViewDialogOpen(true)
  }

  // Handle distributing payment
  function handleDistributePayment(payment: any) {
    // In a real app, this would open a dialog to configure the distribution
    // For this demo, we'll just mark it as distributed
    setPayments(
      payments.map((p) =>
        p.id === payment.id
          ? {
              ...p,
              status: "distributed",
            }
          : p,
      ),
    )
  }

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.source.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || payment.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Get payment transactions
  const getPaymentTransactions = (paymentId: string) => {
    return transactions.filter((transaction) => transaction.paymentId === paymentId)
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <ProtectedRoute allowedRoles={["group", "admin"]}>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
            <p className="text-muted-foreground">Manage and distribute payments to group members</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Payment
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={activeTab === "payments" ? "Search payments..." : "Search transactions..."}
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {activeTab === "payments" && (
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Status</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="distributed">Distributed</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No payments found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.id}</TableCell>
                          <TableCell>{payment.title}</TableCell>
                          <TableCell>{formatCurrency(payment.amount)}</TableCell>
                          <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                          <TableCell>{payment.source}</TableCell>
                          <TableCell>
                            <Badge
                              variant={payment.status === "distributed" ? "default" : "secondary"}
                              className={
                                payment.status === "distributed"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
                                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400"
                              }
                            >
                              {payment.status === "distributed" ? <Check className="mr-1 h-3 w-3" /> : null}
                              <span className="capitalize">{payment.status}</span>
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
                                <DropdownMenuItem onClick={() => handleViewPayment(payment)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                {payment.status === "pending" && (
                                  <DropdownMenuItem onClick={() => handleDistributePayment(payment)}>
                                    <Users className="mr-2 h-4 w-4" />
                                    Distribute Payment
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
                  Showing {filteredPayments.length} of {payments.length} payments
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

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Reference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No transactions found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">{transaction.id}</TableCell>
                          <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                          <TableCell>{transaction.recipient}</TableCell>
                          <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                transaction.type === "credit"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
                                  : "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400"
                              }
                            >
                              {transaction.type === "credit" ? (
                                <ArrowDown className="mr-1 h-3 w-3" />
                              ) : (
                                <ArrowUp className="mr-1 h-3 w-3" />
                              )}
                              <span className="capitalize">{transaction.type}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>{transaction.method}</TableCell>
                          <TableCell>{transaction.reference}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between py-4">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredTransactions.length} of {transactions.length} transactions
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

        {/* New Payment Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Payment</DialogTitle>
              <DialogDescription>Add a new payment to distribute to group members</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Coffee Sales - August 2023" {...field} />
                      </FormControl>
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
                  name="paymentDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="distributionMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Distribution Method</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select distribution method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="equal">Equal Distribution</SelectItem>
                          <SelectItem value="percentage">Percentage-based</SelectItem>
                          <SelectItem value="custom">Custom Amounts</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>How the payment will be distributed among members</FormDescription>
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
                        <Textarea placeholder="Add details about this payment..." className="resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit">Create Payment</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* View Payment Details Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Payment Details</DialogTitle>
              <DialogDescription>Detailed information about the payment</DialogDescription>
            </DialogHeader>
            {currentPayment && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{currentPayment.title}</h3>
                    <p className="text-sm text-muted-foreground">ID: {currentPayment.id}</p>
                  </div>
                  <Badge
                    variant={currentPayment.status === "distributed" ? "default" : "secondary"}
                    className={
                      currentPayment.status === "distributed"
                        ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400"
                    }
                  >
                    {currentPayment.status === "distributed" ? <Check className="mr-1 h-3 w-3" /> : null}
                    <span className="capitalize">{currentPayment.status}</span>
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Amount</p>
                    <p className="text-xl font-bold">{formatCurrency(currentPayment.amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Payment Date</p>
                    <p>{new Date(currentPayment.paymentDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Source</p>
                    <p>{currentPayment.source}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Distribution Method</p>
                    <p className="capitalize">{currentPayment.distributionMethod.replace("_", " ")}</p>
                  </div>
                </div>

                {currentPayment.description && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Description</p>
                    <p>{currentPayment.description}</p>
                  </div>
                )}

                {currentPayment.status === "distributed" && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold">Distribution Details</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Member</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead>Reference</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getPaymentTransactions(currentPayment.id).map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>{transaction.recipient}</TableCell>
                            <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                            <TableCell>{transaction.method}</TableCell>
                            <TableCell>{transaction.reference}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                <DialogFooter>
                  {currentPayment.status === "pending" ? (
                    <Button onClick={() => handleDistributePayment(currentPayment)}>
                      <Users className="mr-2 h-4 w-4" />
                      Distribute Payment
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
