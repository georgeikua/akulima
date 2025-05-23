"use client"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Navbar } from "@/components/navbar"
import { SidebarNav } from "@/components/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useAuth } from "@/lib/auth-context"
import { GroupBidForm } from "@/components/group-bid-form"
import type { TruckSize } from "@/lib/fee-calculator"

export default function SubmitBidPage({ params }: { params: { requestId: string } }) {
  const { user } = useAuth()
  const requestId = params.requestId

  // Mock data for the market request
  const request = {
    id: requestId,
    title: "Fresh Watermelons",
    produceType: "watermelon",
    buyer: "BUY-789", // Anonymized buyer code
    location: "Nairobi CBD",
    quantity: 500, // kg
    grade: "Grade A",
    price: 400, // per kg
    totalAmount: 200000, // KES
    truckSize: "5ton" as TruckSize,
    deadline: "May 18, 2023",
    description:
      "We are looking for fresh, sweet watermelons for our premium produce section. The watermelons should be uniform in size (7-10 kg each) with bright red flesh and minimal seeds. We require consistent supply over the next 3 months.",
    requirements: [
      "Uniform size (7-10 kg each)",
      "Bright red flesh",
      "Minimal seeds",
      "Brix level of at least 10 (sweetness)",
      "No external damage or blemishes",
    ],
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1">
          <SidebarNav userRole={user?.role} />
          <main className="flex-1 p-4 md:p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="icon">
                  <Link href="/market-requests">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                  </Link>
                </Button>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Submit Bid</h1>
                  <p className="text-muted-foreground">
                    Request #{requestId} - {request.title}
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-6 md:col-span-2">
                  <GroupBidForm
                    requestId={requestId}
                    produceType={request.produceType}
                    quantity={request.quantity}
                    truckSize={request.truckSize}
                    totalAmount={request.totalAmount}
                    deadline={request.deadline}
                  />
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Request Details</CardTitle>
                      <CardDescription>Information about the market request</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Buyer Code</p>
                        <p className="text-sm">{request.buyer}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Produce Type</p>
                        <p className="text-sm">
                          {request.produceType.charAt(0).toUpperCase() + request.produceType.slice(1)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Quantity</p>
                        <p className="text-sm">{request.quantity} kg</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Grade</p>
                        <p className="text-sm">{request.grade}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Delivery Location</p>
                        <p className="text-sm">{request.location}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Deadline</p>
                        <p className="text-sm">{request.deadline}</p>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Requirements</p>
                        <ul className="list-inside list-disc space-y-1 text-sm">
                          {request.requirements.map((requirement, index) => (
                            <li key={index}>{requirement}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
