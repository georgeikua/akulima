"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { SidebarNav } from "@/components/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { PaymentDistribution, type GroupMemberContribution } from "@/components/payment-distribution"
import { EscrowSimulation } from "@/components/escrow-simulation"

export default function DistributePaymentPage({ params }: { params: { id: string } }) {
  // In a real application, you would fetch the order details and group members based on the ID
  const orderId = params.id
  const orderTotal = 200000 // KES
  const platformFee = 2 // %
  const transportFee = 5000 // KES

  const [members, setMembers] = useState<GroupMemberContribution[]>([
    {
      id: "1",
      name: "Jane Wanjiku",
      phone: "+254712345678",
      contribution: 200, // kg
      percentage: 40,
      amount: 77600, // KES
    },
    {
      id: "2",
      name: "John Kamau",
      phone: "+254723456789",
      contribution: 150, // kg
      percentage: 30,
      amount: 58200, // KES
    },
    {
      id: "3",
      name: "Mary Njeri",
      phone: "+254734567890",
      contribution: 150, // kg
      percentage: 30,
      amount: 58200, // KES
    },
  ])

  function handleDistribute(updatedMembers: GroupMemberContribution[]) {
    setMembers(updatedMembers)
  }

  // Mock order details for EscrowSimulation
  const orderDetails = {
    totalAmount: orderTotal,
  }

  // Mock payments data for EscrowSimulation
  const payments = members

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
                    <h1 className="text-3xl font-bold tracking-tight">Distribute Payment</h1>
                    <p className="text-muted-foreground">Order #{orderId}</p>
                  </div>
                </div>
              </div>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                  <CardDescription>Fresh Watermelons - Metro Supermarket</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-sm font-medium">Total Quantity</p>
                      <p className="text-lg font-bold">500 kg</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Price per kg</p>
                      <p className="text-lg font-bold">KES 400</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Total Amount</p>
                      <p className="text-lg font-bold text-primary">KES {orderTotal.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <PaymentDistribution
                orderId={orderId}
                orderTotal={orderTotal}
                platformFee={platformFee}
                transportFee={transportFee}
                members={members}
                onDistribute={handleDistribute}
              />

              {/* Add Escrow Simulation */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Blockchain Escrow Simulation</h2>
                <EscrowSimulation initialAmount={orderDetails.totalAmount} groupMemberCount={payments.length} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
