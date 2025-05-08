"use client"

import { useState, useEffect } from "react"
import { FileText, CheckCircle, Clock, AlertTriangle, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ContributionRecord {
  id: string
  farmerId: string
  farmerName: string
  quantity: number
  grade: string
  timestamp: string
  transactionHash: string
  verified: boolean
}

interface OrderRecord {
  id: string
  buyerId: string
  buyerName: string
  groupId: string
  groupName: string
  produceType: string
  quantity: number
  price: number
  totalAmount: number
  status: "pending" | "confirmed" | "in_transit" | "delivered" | "completed" | "cancelled"
  deliveryDate: string
  paymentDate?: string
  paymentTransactionHash?: string
  contributions: ContributionRecord[]
  transactionHash: string
}

interface BlockchainContractInterfaceProps {
  orderId: string
  userRole: "buyer" | "group" | "admin" | "farmer"
}

export function BlockchainContractInterface({ orderId, userRole }: BlockchainContractInterfaceProps) {
  const [loading, setLoading] = useState(true)
  const [orderRecord, setOrderRecord] = useState<OrderRecord | null>(null)
  const [activeTab, setActiveTab] = useState<"order" | "contributions" | "payment">("order")

  useEffect(() => {
    const fetchBlockchainData = async () => {
      setLoading(true)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock blockchain data
      const mockOrderRecord: OrderRecord = {
        id: orderId,
        buyerId: "buyer-123",
        buyerName: "Metro Supermarket",
        groupId: "group-456",
        groupName: "Meru Farmers Cooperative",
        produceType: "Watermelons",
        quantity: 500,
        price: 40,
        totalAmount: 20000,
        status: "completed",
        deliveryDate: "2023-05-18",
        paymentDate: "2023-05-20",
        paymentTransactionHash: "0x8f2e3c5d7b6a9f0e1d2c4b5a6f3e2d1c0b9a8f7e6d5c4b3a2f1e0d",
        contributions: [
          {
            id: "contrib-1",
            farmerId: "farmer-001",
            farmerName: "Jane Wanjiku",
            quantity: 120,
            grade: "A",
            timestamp: "2023-05-16T08:30:00Z",
            transactionHash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
            verified: true,
          },
          {
            id: "contrib-2",
            farmerId: "farmer-002",
            farmerName: "John Kamau",
            quantity: 150,
            grade: "A",
            timestamp: "2023-05-16T09:15:00Z",
            transactionHash: "0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a",
            verified: true,
          },
          {
            id: "contrib-3",
            farmerId: "farmer-003",
            farmerName: "Mary Njeri",
            quantity: 80,
            grade: "B",
            timestamp: "2023-05-16T10:00:00Z",
            transactionHash: "0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b",
            verified: true,
          },
          {
            id: "contrib-4",
            farmerId: "farmer-004",
            farmerName: "Peter Omondi",
            quantity: 150,
            grade: "A",
            timestamp: "2023-05-16T11:30:00Z",
            transactionHash: "0x4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c",
            verified: true,
          },
        ],
        transactionHash: "0x7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f",
      }

      setOrderRecord(mockOrderRecord)
      setLoading(false)
    }

    fetchBlockchainData()
  }, [orderId])

  const getStatusBadge = (status: OrderRecord["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        )
      case "confirmed":
        return (
          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Confirmed
          </Badge>
        )
      case "in_transit":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            In Transit
          </Badge>
        )
      case "delivered":
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Delivered
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Completed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const truncateHash = (hash: string) => {
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!orderRecord) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-muted-foreground">No blockchain record found for this order</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              Blockchain Record
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>
                      This data is securely stored on the blockchain and cannot be altered. It provides a transparent
                      and verifiable record of this transaction.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <CardDescription>
              Order #{orderRecord.id} - {orderRecord.produceType}
            </CardDescription>
          </div>
          {getStatusBadge(orderRecord.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2 border-b pb-2">
            <Button
              variant={activeTab === "order" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("order")}
            >
              Order Details
            </Button>
            <Button
              variant={activeTab === "contributions" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("contributions")}
            >
              Contributions
            </Button>
            <Button
              variant={activeTab === "payment" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("payment")}
            >
              Payment
            </Button>
          </div>

          {activeTab === "order" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Buyer:</p>
                  <p className="font-medium">{orderRecord.buyerName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Group:</p>
                  <p className="font-medium">{orderRecord.groupName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Produce:</p>
                  <p className="font-medium">{orderRecord.produceType}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Quantity:</p>
                  <p className="font-medium">{orderRecord.quantity} kg</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Price:</p>
                  <p className="font-medium">KES {orderRecord.price}/kg</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Amount:</p>
                  <p className="font-medium">KES {orderRecord.totalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Delivery Date:</p>
                  <p className="font-medium">{new Date(orderRecord.deliveryDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Payment Date:</p>
                  <p className="font-medium">
                    {orderRecord.paymentDate ? new Date(orderRecord.paymentDate).toLocaleDateString() : "Pending"}
                  </p>
                </div>
              </div>

              <div className="rounded-md border p-3 bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Transaction Hash:</p>
                <div className="flex items-center">
                  <code className="text-xs font-mono bg-muted p-1 rounded">{orderRecord.transactionHash}</code>
                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                    <FileText className="h-3 w-3" />
                    <span className="sr-only">Copy</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Recorded on: {new Date().toLocaleString()}</p>
              </div>
            </div>
          )}

          {activeTab === "contributions" && (
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Farmer</TableHead>
                    <TableHead>Quantity (kg)</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Verification</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderRecord.contributions.map((contribution) => (
                    <TableRow key={contribution.id}>
                      <TableCell className="font-medium">{contribution.farmerName}</TableCell>
                      <TableCell>{contribution.quantity}</TableCell>
                      <TableCell>Grade {contribution.grade}</TableCell>
                      <TableCell>{new Date(contribution.timestamp).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {contribution.verified ? (
                          <Badge className="bg-green-100 text-green-800">Verified</Badge>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 text-xs text-muted-foreground">
                <p>Total Contributions: {orderRecord.contributions.reduce((sum, c) => sum + c.quantity, 0)} kg</p>
                <p>All contributions are recorded on the blockchain with individual transaction hashes.</p>
              </div>
            </div>
          )}

          {activeTab === "payment" && (
            <div className="space-y-4">
              <div className="rounded-md border p-4 bg-muted/30">
                <h4 className="text-sm font-medium mb-2">Payment Status</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Status:</p>
                    <p className="font-medium">{orderRecord.paymentDate ? "Completed" : "Pending"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Amount:</p>
                    <p className="font-medium">KES {orderRecord.totalAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date:</p>
                    <p className="font-medium">
                      {orderRecord.paymentDate ? new Date(orderRecord.paymentDate).toLocaleDateString() : "Pending"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Method:</p>
                    <p className="font-medium">M-Pesa</p>
                  </div>
                </div>

                {orderRecord.paymentTransactionHash && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-muted-foreground mb-1">Payment Transaction Hash:</p>
                    <div className="flex items-center">
                      <code className="text-xs font-mono bg-muted p-1 rounded">
                        {orderRecord.paymentTransactionHash}
                      </code>
                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                        <FileText className="h-3 w-3" />
                        <span className="sr-only">Copy</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Payment Distribution</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Amount (KES)</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderRecord.contributions.map((contribution) => {
                      const percentage = (contribution.quantity / orderRecord.quantity) * 100
                      const amount = Math.round((orderRecord.totalAmount * percentage) / 100)

                      return (
                        <TableRow key={`payment-${contribution.id}`}>
                          <TableCell className="font-medium">{contribution.farmerName}</TableCell>
                          <TableCell>{amount.toLocaleString()}</TableCell>
                          <TableCell>{percentage.toFixed(1)}%</TableCell>
                          <TableCell>
                            {orderRecord.paymentDate ? (
                              <Badge className="bg-green-100 text-green-800">Paid</Badge>
                            ) : (
                              <Badge variant="outline">Pending</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    <TableRow>
                      <TableCell className="font-medium">Platform Fee</TableCell>
                      <TableCell>{Math.round(orderRecord.totalAmount * 0.05).toLocaleString()}</TableCell>
                      <TableCell>5.0%</TableCell>
                      <TableCell>
                        {orderRecord.paymentDate ? (
                          <Badge className="bg-green-100 text-green-800">Paid</Badge>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Transport Fee</TableCell>
                      <TableCell>{Math.round(orderRecord.totalAmount * 0.03).toLocaleString()}</TableCell>
                      <TableCell>3.0%</TableCell>
                      <TableCell>
                        {orderRecord.paymentDate ? (
                          <Badge className="bg-green-100 text-green-800">Paid</Badge>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/30 px-6 py-3">
        <div className="flex items-center justify-between w-full">
          <p className="text-xs text-muted-foreground">
            <CheckCircle className="h-3 w-3 inline mr-1 text-green-600" />
            Blockchain Verified
          </p>
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Export Record
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
