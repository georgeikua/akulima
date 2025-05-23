"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/navbar"
import { SidebarNav } from "@/components/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ContributionTracker, type Contribution, type Member } from "@/components/contribution-tracker"
import { PaymentStatement, type PaymentStatementMember } from "@/components/payment-statement"

export default function OrderFulfillmentPage({ params }: { params: { id: string } }) {
  // In a real application, you would fetch the order details and group members based on the ID
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
    status: "in_progress",
    platformFee: 2, // %
    transportFee: 5000, // KES
    gradingFee: 2000, // KES
  }

  const [members, setMembers] = useState<Member[]>([
    { id: "1", name: "Jane Wanjiku", phone: "+254712345678" },
    { id: "2", name: "John Kamau", phone: "+254723456789" },
    { id: "3", name: "Mary Njeri", phone: "+254734567890" },
    { id: "4", name: "Peter Omondi", phone: "+254745678901" },
    { id: "5", name: "Sarah Achieng", phone: "+254756789012" },
  ])

  const [contributions, setContributions] = useState<Contribution[]>([])
  const [paymentMembers, setPaymentMembers] = useState<PaymentStatementMember[]>([])

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
              phone: members.find((m) => m.id === curr.memberId)?.phone || "",
              contribution: 0,
              percentage: 0,
              amount: 0,
            }
          }
          acc[curr.memberId].contribution += curr.acceptedQuantity
          return acc
        },
        {} as Record<string, PaymentStatementMember>,
      )

      // Calculate percentages and amounts
      const platformFeeAmount = (orderDetails.totalAmount * orderDetails.platformFee) / 100
      const totalDeductions = platformFeeAmount + orderDetails.transportFee + orderDetails.gradingFee
      const netAmount = orderDetails.totalAmount - totalDeductions

      Object.values(memberContributions).forEach((member) => {
        member.percentage = (member.contribution / totalAccepted) * 100
        member.amount = Math.round((netAmount * member.percentage) / 100)
      })

      setPaymentMembers(Object.values(memberContributions))
    } else {
      setPaymentMembers([])
    }
  }, [contributions, members])

  const handleAddContribution = (newContribution: Omit<Contribution, "id" | "timestamp">) => {
    const contribution: Contribution = {
      ...newContribution,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    }

    setContributions((prev) => [...prev, contribution])
  }

  const handleGradeContribution = (
    id: string,
    status: Contribution["status"],
    acceptedQuantity: number,
    rejectionReason?: string,
  ) => {
    setContributions((prev) =>
      prev.map((contribution) => {
        if (contribution.id === id) {
          return {
            ...contribution,
            status,
            acceptedQuantity: status === "accepted" ? contribution.quantity : acceptedQuantity,
            rejectionReason,
          }
        }
        return contribution
      }),
    )
  }

  const handleSendSMS = async (memberIds: string[]) => {
    // In a real application, this would call an API to send SMS
    console.log("Sending SMS to members:", memberIds)

    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log("SMS sent successfully")
        resolve()
      }, 2000)
    })
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1">
          <SidebarNav />
          <main className="flex-1 p-4 md:p-6">
            <div className="space-y-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="icon">
                    <Link href={`/orders/${orderId}`}>
                      <ArrowLeft className="h-4 w-4" />
                      <span className="sr-only">Back</span>
                    </Link>
                  </Button>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">Order Fulfillment</h1>
                    <p className="text-muted-foreground">
                      Order #{orderId} - {orderDetails.title}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline">
                    <Link href={`/orders/${orderId}`}>
                      <Truck className="mr-2 h-4 w-4" />
                      Order Details
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href={`/orders/${orderId}/distribute`}>
                      <Check className="mr-2 h-4 w-4" />
                      Distribute Payment
                    </Link>
                  </Button>
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
                  <div className="grid gap-4 sm:grid-cols-4">
                    <div>
                      <p className="text-sm font-medium">Required Quantity</p>
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
                      <p className="text-sm font-medium">Delivery Date</p>
                      <p className="text-lg font-bold">{orderDetails.deliveryDate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="contributions">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="contributions">Contributions</TabsTrigger>
                  <TabsTrigger value="payment">Payment Statement</TabsTrigger>
                </TabsList>
                <TabsContent value="contributions" className="space-y-6">
                  <ContributionTracker
                    orderId={orderId}
                    orderTitle={orderDetails.title}
                    requiredQuantity={orderDetails.quantity}
                    unit={orderDetails.unit}
                    members={members}
                    contributions={contributions}
                    onAddContribution={handleAddContribution}
                    onGradeContribution={handleGradeContribution}
                  />
                </TabsContent>
                <TabsContent value="payment" className="space-y-6">
                  <PaymentStatement
                    orderId={orderId}
                    orderTitle={orderDetails.title}
                    buyerName={orderDetails.buyer}
                    orderDate={orderDetails.orderDate}
                    paymentDate={orderDetails.paymentDate}
                    orderTotal={orderDetails.totalAmount}
                    platformFee={orderDetails.platformFee}
                    transportFee={orderDetails.transportFee}
                    gradingFee={orderDetails.gradingFee}
                    members={paymentMembers}
                    onSendSMS={handleSendSMS}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
