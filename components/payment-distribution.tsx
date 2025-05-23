"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"

export type GroupMemberContribution = {
  id: string
  name: string
  phone: string
  contribution: number
  percentage: number
  amount: number
}

interface PaymentDistributionProps {
  orderId: string
  orderTotal: number
  platformFee: number
  transportFee: number
  members: GroupMemberContribution[]
  onDistribute: (members: GroupMemberContribution[]) => void
}

export function PaymentDistribution({
  orderId,
  orderTotal,
  platformFee,
  transportFee,
  members,
  onDistribute,
}: PaymentDistributionProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null)

  const platformFeeAmount = (orderTotal * platformFee) / 100
  const totalDeductions = platformFeeAmount + transportFee
  const netAmount = orderTotal - totalDeductions

  const contributionFormSchema = z.object({
    contribution: z.coerce
      .number()
      .min(0, { message: "Contribution must be a positive number." })
      .max(100, { message: "Contribution cannot exceed 100%." }),
  })

  type ContributionFormValues = z.infer<typeof contributionFormSchema>

  const form = useForm<ContributionFormValues>({
    resolver: zodResolver(contributionFormSchema),
    defaultValues: {
      contribution: 0,
    },
  })

  function handleEditContribution(member: GroupMemberContribution) {
    setEditingMemberId(member.id)
    form.setValue("contribution", member.percentage)
  }

  function handleSaveContribution(memberId: string) {
    const contribution = form.getValues("contribution")

    // Update the member's contribution
    const updatedMembers = members.map((member) => {
      if (member.id === memberId) {
        return {
          ...member,
          percentage: contribution,
          amount: (netAmount * contribution) / 100,
        }
      }
      return member
    })

    onDistribute(updatedMembers)
    setEditingMemberId(null)
  }

  function handleDistributePayments() {
    setIsProcessing(true)
    // In a real application, you would call an API to distribute payments
    setTimeout(() => {
      setIsProcessing(false)
      // Show success message or redirect
    }, 2000)
  }

  const totalPercentage = members.reduce((sum, member) => sum + member.percentage, 0)
  const totalDistributed = members.reduce((sum, member) => sum + member.amount, 0)
  const remaining = netAmount - totalDistributed

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
          <CardDescription>Order #{orderId} payment breakdown</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm">Order Total</span>
            <span className="text-sm font-medium">KES {orderTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Platform Fee ({platformFee}%)</span>
            <span className="text-sm font-medium">KES {platformFeeAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Transport Fee</span>
            <span className="text-sm font-medium">KES {transportFee.toLocaleString()}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-medium">
            <span>Net Amount for Distribution</span>
            <span className="text-primary">KES {netAmount.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Member Contributions</CardTitle>
          <CardDescription>Distribute payment based on member contributions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Contribution (%)</TableHead>
                <TableHead>Amount (KES)</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.phone}</TableCell>
                  <TableCell>
                    {editingMemberId === member.id ? (
                      <Form {...form}>
                        <div className="flex items-center gap-2">
                          <FormField
                            control={form.control}
                            name="contribution"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input {...field} type="number" min="0" max="100" step="0.1" className="h-8 w-20" />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8"
                            onClick={() => handleSaveContribution(member.id)}
                          >
                            Save
                          </Button>
                        </div>
                      </Form>
                    ) : (
                      `${member.percentage.toFixed(1)}%`
                    )}
                  </TableCell>
                  <TableCell>KES {member.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    {editingMemberId === member.id ? (
                      <Button variant="ghost" size="sm" onClick={() => setEditingMemberId(null)}>
                        Cancel
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => handleEditContribution(member)}>
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 flex justify-between rounded-lg bg-muted p-3">
            <div>
              <p className="text-sm font-medium">Total Allocated</p>
              <p className="text-lg font-bold">{totalPercentage.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-sm font-medium">Total Distributed</p>
              <p className="text-lg font-bold">KES {totalDistributed.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Remaining</p>
              <p className="text-lg font-bold text-primary">KES {remaining.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            {totalPercentage < 100 ? (
              <span className="text-amber-600">
                Warning: Only {totalPercentage.toFixed(1)}% of the payment has been allocated.
              </span>
            ) : totalPercentage > 100 ? (
              <span className="text-destructive">
                Error: Allocation exceeds 100% by {(totalPercentage - 100).toFixed(1)}%.
              </span>
            ) : (
              <span className="text-green-600">All funds have been allocated successfully.</span>
            )}
          </div>
          <Button onClick={handleDistributePayments} disabled={isProcessing || totalPercentage !== 100}>
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isProcessing ? "Processing..." : "Distribute Payments"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
