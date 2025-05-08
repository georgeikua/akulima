"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { Loader2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Initialize Supabase client (client-side)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface FarmerData {
  id: string
  name: string
  phone_number: string
  group_name: string
  total_earnings: number
  last_payout_amount: number
  last_payout_date: string
  savings_balance: number
  loan_balance: number
  credit_limit: number
  recent_orders: {
    id: string
    date: string
    produce: string
    quantity: number
    amount: number
    status: string
  }[]
}

export default function FarmerProfileView() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [farmerData, setFarmerData] = useState<FarmerData | null>(null)
  const [tokenExpired, setTokenExpired] = useState(false)

  useEffect(() => {
    async function verifyTokenAndFetchData() {
      if (!token) {
        setError("No access token provided")
        setLoading(false)
        return
      }

      try {
        // Verify token through API
        const verifyResponse = await fetch(`/api/verify-token?token=${token}`)
        const verifyData = await verifyResponse.json()

        if (!verifyResponse.ok || !verifyData.farmerId) {
          setTokenExpired(true)
          setLoading(false)
          return
        }

        // Fetch farmer data
        const farmerId = verifyData.farmerId
        const { data, error: fetchError } = await supabase.rpc("get_farmer_dashboard_data", { farmer_id: farmerId })

        if (fetchError || !data) {
          setError("Failed to load your data. Please try again.")
          console.error("Data fetch error:", fetchError)
          setLoading(false)
          return
        }

        setFarmerData(data)
      } catch (err) {
        console.error("Profile view error:", err)
        setError("An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    verifyTokenAndFetchData()
  }, [token])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-center text-muted-foreground">Loading your dashboard...</p>
      </div>
    )
  }

  if (tokenExpired) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
          <h1 className="text-xl font-bold text-destructive">Link Expired</h1>
          <p className="mt-2 text-muted-foreground">This dashboard link has expired or already been used.</p>
          <p className="mt-4">
            Please send <strong>PROFILE</strong> to the Akulima WhatsApp number to get a new link.
          </p>
        </div>
      </div>
    )
  }

  if (error || !farmerData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg border p-6 text-center">
          <h1 className="text-xl font-bold">Error Loading Dashboard</h1>
          <p className="mt-2 text-muted-foreground">{error || "Failed to load your data"}</p>
          <p className="mt-4">Please try again or contact support if the problem persists.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">Farmer Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome, {farmerData.name} | Group: {farmerData.group_name}
        </p>
        <p className="text-xs text-muted-foreground">This secure view will expire in 30 minutes</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">KES {farmerData.total_earnings.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">
              Last payout: KES {farmerData.last_payout_amount.toLocaleString()} on{" "}
              {new Date(farmerData.last_payout_date).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Savings Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">KES {farmerData.savings_balance.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">
              {farmerData.savings_balance > 0 ? "Available for withdrawal or rollover" : "No savings available"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Loan Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">KES {farmerData.loan_balance.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">
              Credit limit: KES {farmerData.credit_limit.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your most recent produce orders</CardDescription>
            </CardHeader>
            <CardContent>
              {farmerData.recent_orders.length > 0 ? (
                <div className="space-y-4">
                  {farmerData.recent_orders.map((order) => (
                    <div key={order.id} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{order.produce}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.date).toLocaleDateString()} • {order.quantity} kg
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">KES {order.amount.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">{order.status}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No recent orders found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Your recent payments and transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                Send <strong>PAYMENTS</strong> to the Akulima WhatsApp number to receive your detailed payment history.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          For more information, send <strong>HELP</strong> to the Akulima WhatsApp number.
        </p>
      </div>
    </div>
  )
}
