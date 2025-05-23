"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { SidebarNav } from "@/components/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { OrderPaymentFlow } from "@/components/order-payment-flow"

// Mock bid data
const mockBids = {
  "bid-001": {
    id: "bid-001",
    buyerId: "buyer-123",
    buyerName: "Metro Supermarket",
    groupId: "group-456",
    groupName: "Meru Farmers Cooperative",
    produceType: "Watermelons",
    quantity: 5000, // 5 tons in kg
    pricePerKg: 40,
    totalAmount: 200000, // KES
    status: "pending",
    deadline: "2023-05-25",
    location: "Nairobi, Karen",
    contributions: [
      {
        farmerId: "farmer-001",
        farmerName: "Jane Wanjiku",
        quantity: 1200,
        percentage: 24,
      },
      {
        farmerId: "farmer-002",
        farmerName: "John Kamau",
        quantity: 1500,
        percentage: 30,
      },
      {
        farmerId: "farmer-003",
        farmerName: "Mary Njeri",
        quantity: 800,
        percentage: 16,
      },
      {
        farmerId: "farmer-004",
        farmerName: "Peter Omondi",
        quantity: 1500,
        percentage: 30,
      },
    ],
  },
  "bid-002": {
    id: "bid-002",
    buyerId: "buyer-456",
    buyerName: "Fresh Market Kenya",
    groupId: "group-789",
    groupName: "Nakuru Farmers Association",
    produceType: "Tomatoes",
    quantity: 3000, // 3 tons in kg
    pricePerKg: 120,
    totalAmount: 360000, // KES
    status: "pending",
    deadline: "2023-05-28",
    location: "Nakuru Town",
    contributions: [
      {
        farmerId: "farmer-101",
        farmerName: "James Mwangi",
        quantity: 1000,
        percentage: 33.33,
      },
      {
        farmerId: "farmer-102",
        farmerName: "Sarah Achieng",
        quantity: 1000,
        percentage: 33.33,
      },
      {
        farmerId: "farmer-103",
        farmerName: "David Otieno",
        quantity: 1000,
        percentage: 33.33,
      },
    ],
  },
}

export default function AcceptBidPage({ params }: { params: { bidId: string } }) {
  const router = useRouter()
  const bidId = params.bidId
  const [isCompleted, setIsCompleted] = useState(false)

  // Get bid data
  const bid = mockBids[bidId as keyof typeof mockBids]

  if (!bid) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <div className="flex flex-1">
            <SidebarNav userRole="buyer" />
            <main className="flex-1 p-4 md:p-6">
              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="icon">
                  <Link href="/buyer-orders">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                  </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Bid Not Found</h1>
              </div>
              <p className="mt-4">The bid you are looking for does not exist or has been removed.</p>
            </main>
          </div>
        </div>
      </SidebarProvider>
    )
  }

  function handleComplete(orderId: string) {
    setIsCompleted(true)
    // In a real app, you would redirect to the order details page
    setTimeout(() => {
      router.push(`/buyer-orders/${orderId}`)
    }, 2000)
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1">
          <SidebarNav userRole="buyer" />
          <main className="flex-1 p-4 md:p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="icon">
                  <Link href="/buyer-orders">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                  </Link>
                </Button>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Accept Bid</h1>
                  <p className="text-muted-foreground">
                    {bid.produceType} from {bid.groupName}
                  </p>
                </div>
              </div>

              {isCompleted ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <div className="rounded-full bg-green-100 p-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="mt-4 text-xl font-semibold">Order Created Successfully</h2>
                    <p className="mt-2 text-center text-muted-foreground">
                      Redirecting you to the order details page...
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <OrderPaymentFlow
                  bidId={bid.id}
                  buyerId={bid.buyerId}
                  buyerName={bid.buyerName}
                  groupId={bid.groupId}
                  groupName={bid.groupName}
                  produceType={bid.produceType}
                  quantity={bid.quantity}
                  pricePerKg={bid.pricePerKg}
                  totalAmount={bid.totalAmount}
                  contributions={bid.contributions}
                  onComplete={handleComplete}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
