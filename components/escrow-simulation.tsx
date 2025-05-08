"use client"

import { useState } from "react"
import { ArrowRight, DollarSign, Users, Truck, Building, Globe } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface EscrowSimulationProps {
  initialAmount?: number
  groupMemberCount?: number
}

export function EscrowSimulation({ initialAmount = 50000, groupMemberCount = 5 }: EscrowSimulationProps) {
  const [amount, setAmount] = useState(initialAmount)
  const [platformFee, setPlatformFee] = useState(5) // percentage
  const [transportFee, setTransportFee] = useState(3) // percentage
  const [financeFee, setFinanceFee] = useState(2) // percentage
  const [memberCount, setMemberCount] = useState(groupMemberCount)

  // Calculate fee amounts
  const platformAmount = (amount * platformFee) / 100
  const transportAmount = (amount * transportFee) / 100
  const financeAmount = (amount * financeFee) / 100
  const totalFees = platformAmount + transportAmount + financeAmount
  const groupAmount = amount - totalFees
  const memberAmount = groupAmount / memberCount

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Escrow Simulation</CardTitle>
        <CardDescription>See how funds would be distributed through the blockchain smart contract</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="amount">Order Amount (KES)</Label>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number.parseInt(e.target.value) || 0)}
              min={1000}
              step={1000}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="platform-fee">Platform Fee (%)</Label>
            <span className="text-sm font-medium">{platformFee}%</span>
          </div>
          <Slider
            id="platform-fee"
            min={1}
            max={10}
            step={0.5}
            value={[platformFee]}
            onValueChange={(value) => setPlatformFee(value[0])}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="transport-fee">Transport Fee (%)</Label>
            <span className="text-sm font-medium">{transportFee}%</span>
          </div>
          <Slider
            id="transport-fee"
            min={1}
            max={10}
            step={0.5}
            value={[transportFee]}
            onValueChange={(value) => setTransportFee(value[0])}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="finance-fee">Finance Partner Fee (%)</Label>
            <span className="text-sm font-medium">{financeFee}%</span>
          </div>
          <Slider
            id="finance-fee"
            min={0}
            max={5}
            step={0.5}
            value={[financeFee]}
            onValueChange={(value) => setFinanceFee(value[0])}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="member-count">Number of Group Members</Label>
            <span className="text-sm font-medium">{memberCount}</span>
          </div>
          <Slider
            id="member-count"
            min={1}
            max={20}
            step={1}
            value={[memberCount]}
            onValueChange={(value) => setMemberCount(value[0])}
          />
        </div>

        <div className="rounded-lg border p-4 space-y-4 bg-muted/30">
          <h3 className="text-sm font-medium">Escrow Distribution</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2 text-primary" />
                <span>Platform Fee</span>
              </div>
              <div className="flex items-center gap-2">
                <span>KES {platformAmount.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">({platformFee}%)</span>
              </div>
            </div>
            <Progress value={platformFee} className="h-2" />

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Truck className="h-4 w-4 mr-2 text-blue-500" />
                <span>Transport Fee</span>
              </div>
              <div className="flex items-center gap-2">
                <span>KES {transportAmount.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">({transportFee}%)</span>
              </div>
            </div>
            <Progress value={transportFee} className="h-2" />

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-2 text-purple-500" />
                <span>Finance Partner</span>
              </div>
              <div className="flex items-center gap-2">
                <span>KES {financeAmount.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">({financeFee}%)</span>
              </div>
            </div>
            <Progress value={financeFee} className="h-2" />

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-green-500" />
                <span>Group Members ({memberCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span>KES {groupAmount.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">
                  ({100 - platformFee - transportFee - financeFee}%)
                </span>
              </div>
            </div>
            <Progress value={100 - platformFee - transportFee - financeFee} className="h-2" />
          </div>

          <div className="pt-3 border-t mt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Per Member Amount:</span>
              <span className="text-lg font-bold">KES {memberAmount.toLocaleString()}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Each member receives an equal share in this simulation. In reality, distribution is based on individual
              contributions.
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <Button variant="outline" className="w-full">
            <ArrowRight className="mr-2 h-4 w-4" />
            View Detailed Breakdown
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
