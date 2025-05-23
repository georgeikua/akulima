"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Truck, FileText, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Navbar } from "@/components/navbar"
import { SidebarNav } from "@/components/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useAuth } from "@/lib/auth-context"
import { BlockchainContractInterface } from "@/components/blockchain-contract-interface"
import { VerifiedTraceModal } from "@/components/verified-trace-modal"

// Types for contributions and payments
type Contribution = {
  id: string
  memberId: string
  memberName: string
  quantity: number
  qualityGrade: string
  status: "pending" | "accepted" | "partially_accepted" | "rejected"
  acceptedQuantity: number
  rejectionReason?: string
  timestamp: string
}

type PaymentMember = {
  id: string
  name: string
  phone: string
  contribution: number
  percentage: number
  amount: number
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const orderId = params.id

  // Mock data for demonstration
  const orderDetails = {
    id: orderId,
    title: "Fresh Watermelons",
    buyer: "Metro Supermarket",
    buyerContact: "+254712345678",
    location: "Nairobi CBD, Store #12",
    quantity: 500, // kg
    unit: "kg",
    grade: "Grade A",
    price: 400, // per kg
    totalAmount: 200000, // KES
    orderDate: "May 15, 2023",
    paymentDate: "May 25, 2023",
    deliveryDate: "May 18, 2023",
    status: "completed",
    platformFee: 2, // %
    transportFee: 5000, // KES
    gradingFee: 2000, // KES
    groupId: "group-123",
    groupName: "Meru Farmers Cooperative",
  }

  // Mock contributions data
  const [contributions, setContributions] = useState<Contribution[]>([
    {
      id: "c1",
      memberId: "m1",
      memberName: "Jane Wanjiku",
      quantity: 120,
      qualityGrade: "A",
      status: "accepted",
      acceptedQuantity: 120,
      timestamp: "2023-05-16T08:30:00Z",
    },
    {
      id: "c2",
      memberId: "m2",
      memberName: "John Kamau",
      quantity: 150,
      qualityGrade: "A",
      status: "accepted",
      acceptedQuantity: 150,
      timestamp: "2023-05-16T09:15:00Z",
    },
    {
      id: "c3",
      memberId: "m3",
      memberName: "Mary Njeri",
      quantity: 100,
      qualityGrade: "B",
      status: "partially_accepted",
      acceptedQuantity: 80,
      rejectionReason: "20kg had quality issues",
      timestamp: "2023-05-16T10:00:00Z",
    },
    {
      id: "c4",
      memberId: "m4",
      memberName: "Peter Omondi",
      quantity: 180,
      qualityGrade: "A",
      status: "accepted",
      acceptedQuantity: 180,
      timestamp: "2023-05-16T11:30:00Z",
    },
    {
      id: "c5",
      memberId: "m5",
      memberName: "Sarah Achieng",
      quantity: 50,
      qualityGrade: "C",
      status: "rejected",
      acceptedQuantity: 0,
      rejectionReason: "Quality below acceptable standards",
      timestamp: "2023-05-16T13:00:00Z",
    },
  ])

  // Mock payment data
  const [payments, setPayments] = useState<PaymentMember[]>([])

  // Calculate payment distribution when contributions change
  useEffect(() => {
    // Only include accepted contributions
    const acceptedContributions = contributions.filter(
      (c) => c.status === "accepted" || c.status === "partially_accepted",
    )

    // Calculate total accepted quantity
    const totalAccepted = acceptedContributions.reduce((sum, c) => sum + c.acceptedQuantity, 0)

    if (totalAccepted > 0) {
      // Group by member and sum their contributions
      const memberContributions = acceptedContributions.reduce(
        (acc, curr) => {
          if (!acc[curr.memberId]) {
            acc[curr.memberId] = {
              id: curr.memberId,
              name: curr.memberName,
              phone: "+254" + Math.floor(Math.random() * 900000000 + 100000000), // Mock phone number
              contribution: 0,
              percentage: 0,
              amount: 0,
            }
          }
          acc[curr.memberId].contribution += curr.acceptedQuantity
          return acc
        },
        {} as Record<string, PaymentMember>,
      )

      // Calculate percentages and amounts
      const platformFeeAmount = (orderDetails.totalAmount * orderDetails.platformFee) / 100
      const totalDeductions = platformFeeAmount + orderDetails.transportFee + orderDetails.gradingFee
      const netAmount = orderDetails.totalAmount - totalDeductions

      Object.values(memberContributions).forEach((member) => {
        member.percentage = (member.contribution / totalAccepted) * 100
        member.amount = Math.round((netAmount * member.percentage) / 100)
      })

      setPayments(Object.values(memberContributions))
    } else {
      setPayments([])
    }
  }, [contributions])

  // Get status badge color
  const getStatusBadge = (status: Contribution["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "accepted":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Accepted</Badge>
      case "partially_accepted":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Partially Accepted</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Check if the user is an admin or the group that owns this order
  const canViewDetails = user?.role === "admin" || (user?.role === "group" && user?.groupId === orderDetails.groupId)

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1">
          <SidebarNav userRole={user?.role} />
          <main className="flex-1 p-4 md:p-6">
            <div className="space-y-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="icon">
                    <Link href="/orders">
                      <ArrowLeft className="h-4 w-4" />
                      <span className="sr-only">Back</span>
                    </Link>
                  </Button>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
                    <p className="text-muted-foreground">
                      Order #{orderId} - {orderDetails.title}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {canViewDetails && (
                    <Button asChild variant="outline">
                      <Link href={`/orders/${orderId}/fulfill`}>
                        <Truck className="mr-2 h-4 w-4" />
                        Manage Fulfillment
                      </Link>
                    </Button>
                  )}
                  {canViewDetails && (
                    <Button asChild>
                      <Link href={`/orders/${orderId}/distribute`}>
                        <Check className="mr-2 h-4 w-4" />
                        Distribute Payment
                      </Link>
                    </Button>
                  )}
                  <VerifiedTraceModal orderId={orderId} userRole={user?.role || "buyer"}>
                    <Button variant="outline">
                      <FileText className="mr-2 h-4 w-4" />
                      Verified Trace
                    </Button>
                  </VerifiedTraceModal>
                </div>
              </div>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>
                    {orderDetails.buyer} - {orderDetails.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                    <div>
                      <p className="text-sm font-medium">Quantity</p>
                      <p className="text-lg font-bold">
                        {orderDetails.quantity} {orderDetails.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Price per {orderDetails.unit}</p>
                      <p className="text-lg font-bold">KES {orderDetails.price}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Total Amount</p>
                      <p className="text-lg font-bold text-primary">KES {orderDetails.totalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        {orderDetails.status.charAt(0).toUpperCase() + orderDetails.status.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Order Date</p>
                      <p className="text-lg font-bold">{orderDetails.orderDate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Delivery Date</p>
                      <p className="text-lg font-bold">{orderDetails.deliveryDate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Payment Date</p>
                      <p className="text-lg font-bold">{orderDetails.paymentDate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Group</p>
                      <p className="text-lg font-bold">{orderDetails.groupName}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {canViewDetails && (
                <Tabs defaultValue="contributions">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="contributions">
                      <Users className="mr-2 h-4 w-4" />
                      Member Contributions
                    </TabsTrigger>
                    <TabsTrigger value="payments">
                      <FileText className="mr-2 h-4 w-4" />
                      Payment Distribution
                    </TabsTrigger>
                    <TabsTrigger value="blockchain">
                      <FileText className="mr-2 h-4 w-4" />
                      Blockchain Record
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="contributions" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Member Contributions</CardTitle>
                        <CardDescription>Breakdown of produce contributed by each member</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Member</TableHead>
                              <TableHead>Quantity ({orderDetails.unit})</TableHead>
                              <TableHead>Quality Grade</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Accepted</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Notes</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {contributions.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={7} className="text-center text-muted-foreground py-6">
                                  No contributions recorded yet
                                </TableCell>
                              </TableRow>
                            ) : (
                              contributions.map((contribution) => (
                                <TableRow key={contribution.id}>
                                  <TableCell className="font-medium">{contribution.memberName}</TableCell>
                                  <TableCell>{contribution.quantity}</TableCell>
                                  <TableCell>Grade {contribution.qualityGrade}</TableCell>
                                  <TableCell>{getStatusBadge(contribution.status)}</TableCell>
                                  <TableCell>
                                    {contribution.status === "rejected"
                                      ? "0"
                                      : contribution.status === "pending"
                                        ? "-"
                                        : contribution.acceptedQuantity}
                                  </TableCell>
                                  <TableCell className="text-muted-foreground">
                                    {new Date(contribution.timestamp).toLocaleDateString()}
                                  </TableCell>
                                  <TableCell className="max-w-[200px] truncate">
                                    {contribution.rejectionReason || "-"}
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </CardContent>
                      <CardFooter>
                        <div className="text-sm text-muted-foreground">
                          Total accepted:{" "}
                          {contributions.reduce(
                            (sum, contribution) =>
                              sum +
                              (contribution.status !== "rejected" && contribution.status !== "pending"
                                ? contribution.acceptedQuantity
                                : 0),
                            0,
                          )}{" "}
                          {orderDetails.unit} of {orderDetails.quantity} {orderDetails.unit} required
                        </div>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                  <TabsContent value="payments" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Payment Distribution</CardTitle>
                        <CardDescription>How payment was distributed among members</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                            <div>
                              <p className="text-sm font-medium">Total Amount</p>
                              <p className="text-lg font-bold">KES {orderDetails.totalAmount.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Platform Fee ({orderDetails.platformFee}%)</p>
                              <p className="text-lg font-bold">
                                KES {((orderDetails.totalAmount * orderDetails.platformFee) / 100).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Transport Fee</p>
                              <p className="text-lg font-bold">KES {orderDetails.transportFee.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Grading Fee</p>
                              <p className="text-lg font-bold">KES {orderDetails.gradingFee.toLocaleString()}</p>
                            </div>
                          </div>

                          <div className="rounded-md border bg-muted/50 p-4">
                            <p className="text-sm font-medium">Net Amount for Distribution</p>
                            <p className="text-xl font-bold text-primary">
                              KES{" "}
                              {(
                                orderDetails.totalAmount -
                                (orderDetails.totalAmount * orderDetails.platformFee) / 100 -
                                orderDetails.transportFee -
                                orderDetails.gradingFee
                              ).toLocaleString()}
                            </p>
                          </div>

                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Member</TableHead>
                                <TableHead>Contribution ({orderDetails.unit})</TableHead>
                                <TableHead>Percentage</TableHead>
                                <TableHead className="text-right">Amount (KES)</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {payments.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                                    No payment distribution available
                                  </TableCell>
                                </TableRow>
                              ) : (
                                payments.map((payment) => (
                                  <TableRow key={payment.id}>
                                    <TableCell className="font-medium">{payment.name}</TableCell>
                                    <TableCell>{payment.contribution}</TableCell>
                                    <TableCell>{payment.percentage.toFixed(2)}%</TableCell>
                                    <TableCell className="text-right">{payment.amount.toLocaleString()}</TableCell>
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                            <TableRow className="bg-muted/50 font-medium">
                              <TableCell>Total</TableCell>
                              <TableCell>
                                {payments.reduce((sum, payment) => sum + payment.contribution, 0)} {orderDetails.unit}
                              </TableCell>
                              <TableCell>100%</TableCell>
                              <TableCell className="text-right">
                                {payments.reduce((sum, payment) => sum + payment.amount, 0).toLocaleString()}
                              </TableCell>
                            </TableRow>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="blockchain" className="space-y-6">
                    <BlockchainContractInterface orderId={orderId} userRole={user?.role || "buyer"} />
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
