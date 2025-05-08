"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, ChevronRight, Clock, Filter, Loader2, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"

// Mock grading transactions
const mockTransactions = [
  {
    id: "txn-001",
    produce: "Potatoes",
    quantity: "3 Ton Truck",
    group: {
      name: "Meru Farmers Cooperative",
      location: "Meru County, Imenti North",
    },
    buyer: {
      name: "Metro Supermarket",
    },
    scheduledDate: "2023-07-28",
    status: "pending", // pending, completed
    gradingReport: null,
  },
  {
    id: "txn-002",
    produce: "Tomatoes",
    quantity: "1 Ton (Pick-up)",
    group: {
      name: "Nyeri Tomato Growers",
      location: "Nyeri County, Tetu",
    },
    buyer: {
      name: "Fresh Grocers Ltd",
    },
    scheduledDate: "2023-07-29",
    status: "pending",
    gradingReport: null,
  },
  {
    id: "txn-003",
    produce: "Onions",
    quantity: "3 Ton Truck",
    group: {
      name: "Kajiado Farmers Association",
      location: "Kajiado County, Isinya",
    },
    buyer: {
      name: "Carrefour Supermarket",
    },
    scheduledDate: "2023-07-26",
    status: "completed",
    gradingReport: {
      submittedAt: "2023-07-26T14:30:00Z",
      grade: "Grade A",
      acceptedQuantity: 2850,
      rejectedQuantity: 150,
    },
  },
]

export default function GraderTransactionsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [transactions, setTransactions] = useState<any[]>([])

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Get mock data
        setTransactions(mockTransactions)
      } catch (error) {
        console.error("Error fetching transactions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  // Filter transactions based on search term and status filter
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.produce.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.buyer.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Handle transaction selection
  const handleSelectTransaction = (transactionId: string) => {
    router.push(`/grader/transactions/${transactionId}`)
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
        <h1 className="text-2xl font-bold">Grading Transactions</h1>
        <p className="text-sm text-muted-foreground">Manage quality assessment for produce transactions</p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
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
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredTransactions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-center text-muted-foreground">No transactions found matching your criteria.</p>
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
            {filteredTransactions.map((transaction) => (
              <Card key={transaction.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{transaction.produce}</CardTitle>
                      <CardDescription>{transaction.quantity}</CardDescription>
                    </div>
                    {transaction.status === "pending" ? (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                        <Clock className="mr-1 h-3 w-3" />
                        Pending
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Completed
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Group:</span>
                      <span className="text-sm">{transaction.group.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Buyer:</span>
                      <span className="text-sm">{transaction.buyer.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Scheduled Date:</span>
                      <span className="text-sm">{transaction.scheduledDate}</span>
                    </div>
                    {transaction.status === "completed" && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Grading Result:</span>
                        <span className="text-sm">
                          {transaction.gradingReport.grade} - {transaction.gradingReport.acceptedQuantity}kg accepted
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button
                    variant="ghost"
                    className="w-full justify-between"
                    onClick={() => handleSelectTransaction(transaction.id)}
                  >
                    {transaction.status === "pending" ? "Submit Grading Report" : "View Details"}
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
