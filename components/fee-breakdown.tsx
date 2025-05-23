"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { calculateDeductions, type TruckSize } from "@/lib/fee-calculator"
import { useAuth } from "@/lib/auth-context"

interface FeeBreakdownProps {
  totalAmount: number
  quantity: number
  truckSize: TruckSize
  showNetOnly?: boolean
}

export function FeeBreakdown({ totalAmount, quantity, truckSize, showNetOnly = false }: FeeBreakdownProps) {
  const { user } = useAuth()
  const isAdmin = user?.role === "admin"

  const {
    platformFee,
    transportFee,
    gradingFee,
    financeFacilitationFee,
    compulsorySavings,
    totalDeductions,
    netAmount,
  } = calculateDeductions(totalAmount, quantity, truckSize)

  // Calculate price per kg
  const pricePerKg = totalAmount / quantity
  const netPricePerKg = netAmount / quantity

  // If showNetOnly is true or user is not an admin, only show the net amount
  if (showNetOnly || !isAdmin) {
    return (
      <Card className="bg-muted/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Net Amount Available</CardTitle>
          <CardDescription>After all platform fees and deductions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Net Amount:</span>
              <span className="font-bold text-primary">KES {netAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium">Net Price Per Kg:</span>
              <span className="font-bold text-primary">KES {netPricePerKg.toFixed(2)}/kg</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-muted/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Fee Breakdown</CardTitle>
        <CardDescription>Estimated fees and deductions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Total Amount:</span>
            <span className="font-medium">KES {totalAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Price Per Kg:</span>
            <span className="font-medium">KES {pricePerKg.toFixed(2)}/kg</span>
          </div>
          <Separator className="my-1" />
          <div className="flex justify-between text-sm">
            <span>Platform Fee ({getFeePercentage(truckSize)}%):</span>
            <span className="text-muted-foreground">- KES {platformFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Transport Fee (KES 5/kg):</span>
            <span className="text-muted-foreground">- KES {transportFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Grading/Quality Control (KES 2.5/kg):</span>
            <span className="text-muted-foreground">- KES {gradingFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Finance Facilitation (1%):</span>
            <span className="text-muted-foreground">- KES {financeFacilitationFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Compulsory Savings (KES 2/kg):</span>
            <span className="text-muted-foreground">- KES {compulsorySavings.toLocaleString()}</span>
          </div>
          <Separator className="my-1" />
          <div className="flex justify-between text-sm">
            <span className="font-medium">Total Deductions:</span>
            <span className="font-medium text-muted-foreground">KES {totalDeductions.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-medium">Net Amount:</span>
            <span className="font-bold text-primary">KES {netAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-medium">Net Price Per Kg:</span>
            <span className="font-bold text-primary">KES {netPricePerKg.toFixed(2)}/kg</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to get fee percentage based on truck size
function getFeePercentage(truckSize: TruckSize): number {
  if (truckSize === "1ton" || truckSize === "2ton") {
    return 10
  } else if (truckSize === "3ton" || truckSize === "4ton") {
    return 8
  } else if (truckSize === "5ton" || truckSize === "6ton") {
    return 6
  } else {
    return 5
  }
}
