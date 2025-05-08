"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FeeBreakdown } from "@/components/fee-breakdown"
import { getMinimumQuantity, type TruckSize } from "@/lib/fee-calculator"

const MIN_QUANTITY = getMinimumQuantity()

const formSchema = z.object({
  bidPrice: z.coerce.number().positive({
    message: "Bid price must be a positive number.",
  }),
  deliveryDate: z.string().min(1, {
    message: "Please select a delivery date.",
  }),
  notes: z.string().optional(),
})

interface GroupBidFormProps {
  requestId: string
  produceType: string
  quantity: number
  truckSize: TruckSize
  totalAmount: number
  deadline: string
  netAmount: number
}

export function GroupBidForm({
  requestId,
  produceType,
  quantity,
  truckSize,
  totalAmount,
  deadline,
  netAmount,
}: GroupBidFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bidPrice: undefined,
      deliveryDate: "",
      notes: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    // In a real application, this would be an API call
    console.log({
      requestId,
      ...values,
    })

    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Redirect to success page or show success message
    setIsSubmitting(false)
    window.location.href = "/market-requests"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Submit Bid for Request #{requestId}</CardTitle>
          <CardDescription>
            {produceType} - {quantity}kg - Deadline: {deadline}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {quantity < MIN_QUANTITY ? (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Minimum Quantity Not Met</AlertTitle>
              <AlertDescription>
                This request is for {quantity}kg, which is below the minimum requirement of {MIN_QUANTITY}kg (1 ton).
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="mb-6">
                <FeeBreakdown totalAmount={totalAmount} quantity={quantity} truckSize={truckSize} showNetOnly={true} />
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="bidPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Bid Price (KES)</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" placeholder="e.g., 180000" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter your total bid price for the entire order ({quantity}kg). The net amount available after
                          platform fees is KES {netAmount.toLocaleString()}.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deliveryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proposed Delivery Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>
                          When you can deliver the produce (must be before the deadline)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any additional information about your bid..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting || quantity < MIN_QUANTITY}>
                      {isSubmitting ? "Submitting..." : "Submit Bid"}
                    </Button>
                  </div>
                </form>
              </Form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
