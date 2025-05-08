"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowLeft, Check, Loader2, Star, ThumbsDown, ThumbsUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"

// Form schema for receipt confirmation
const receiptConfirmationSchema = z.object({
  quality: z.enum(["excellent", "good", "fair", "poor"], {
    required_error: "Please rate the quality of the produce",
  }),
  rating: z.enum(["5", "4", "3", "2", "1"], {
    required_error: "Please provide a rating",
  }),
  feedback: z.string().optional(),
})

type ReceiptConfirmationValues = z.infer<typeof receiptConfirmationSchema>

// Mock transaction data
const mockTransaction = {
  id: "txn-001",
  bidId: "bid-response-001",
  produce: "Potatoes",
  quantity: "3 Ton Truck",
  weight: 2850, // kg (after grading)
  price: 45, // per kg
  totalValue: 128250, // 2850kg * 45
  status: "delivered", // in_progress, completed, cancelled
  requiresPreFinancing: true,
  preFinancingStatus: "disbursed", // pending, disbursed, completed
  group: {
    id: "group-123",
    name: "Meru Farmers Cooperative",
  },
  buyer: {
    id: "buyer-456",
    name: "Metro Supermarket",
  },
  delivery: {
    status: "delivered",
    deliveredAt: "2023-07-28T14:30:00Z",
  },
  receiptConfirmation: null,
}

export default function ConfirmReceiptPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [transaction, setTransaction] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Initialize form
  const form = useForm<ReceiptConfirmationValues>({
    resolver: zodResolver(receiptConfirmationSchema),
    defaultValues: {
      quality: undefined,
      rating: undefined,
      feedback: "",
    },
  })

  // Fetch transaction details
  useEffect(() => {
    const fetchTransactionDetails = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Get mock data
        setTransaction(mockTransaction)
      } catch (error) {
        console.error("Error fetching transaction details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactionDetails()
  }, [params.id])

  // Handle form submission
  async function onSubmit(data: ReceiptConfirmationValues) {
    setIsSubmitting(true)

    try {
      // Simulate API call
      console.log("Submitting receipt confirmation:", {
        transactionId: transaction.id,
        ...data,
      })
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock successful submission
      setSubmitSuccess(true)

      // Update transaction
      setTransaction({
        ...transaction,
        status: "completed",
        preFinancingStatus: "completed",
        receiptConfirmation: {
          quality: data.quality,
          rating: Number.parseInt(data.rating),
          feedback: data.feedback,
          confirmedAt: new Date().toISOString(),
        },
      })

      // Reset form
      form.reset()
    } catch (error) {
      console.error("Error submitting receipt confirmation:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container max-w-md mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="container max-w-md mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTitle>Transaction Not Found</AlertTitle>
          <AlertDescription>The transaction you're looking for doesn't exist or has been removed.</AlertDescription>
        </Alert>
        <Button className="mt-4 w-full" variant="outline" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-4 p-0 flex items-center text-muted-foreground"
        onClick={() => router.push("/transaction-details/" + transaction.id)}
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Transaction
      </Button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Confirm Receipt</h1>
        <p className="text-sm text-muted-foreground">
          Confirm receipt of {transaction.produce} from {transaction.group.name}
        </p>
      </div>

      {submitSuccess ? (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <Check className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl">Receipt Confirmed</CardTitle>
            <CardDescription className="text-center">
              You have successfully confirmed receipt of the produce.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-muted p-4">
              <p className="text-sm font-medium mb-1">Transaction Summary:</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Produce:</span>
                  <span className="text-sm font-medium">{transaction.produce}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Quantity:</span>
                  <span className="text-sm font-medium">{transaction.weight} kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Value:</span>
                  <span className="text-sm font-medium">KES {transaction.totalValue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <Alert className="bg-green-50 border-green-200 text-green-800">
              <AlertTitle>Final Payment Processed</AlertTitle>
              <AlertDescription>
                The final payment has been settled to the financier. Thank you for using Akulima!
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => router.push("/dashboard")}>
              Return to Dashboard
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Delivery Confirmation</CardTitle>
            <CardDescription>Please confirm receipt of the produce and provide feedback on the quality</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="rounded-md bg-muted p-4 mb-4">
                  <p className="text-sm font-medium mb-1">Transaction Summary:</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Produce:</span>
                      <span className="text-sm font-medium">{transaction.produce}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Quantity:</span>
                      <span className="text-sm font-medium">{transaction.weight} kg</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Value:</span>
                      <span className="text-sm font-medium">KES {transaction.totalValue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Delivered On:</span>
                      <span className="text-sm font-medium">
                        {new Date(transaction.delivery.deliveredAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="quality"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>How was the quality of the produce?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="excellent" />
                            </FormControl>
                            <FormLabel className="font-normal flex items-center">
                              <ThumbsUp className="mr-2 h-4 w-4 text-green-600" />
                              Excellent
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="good" />
                            </FormControl>
                            <FormLabel className="font-normal flex items-center">
                              <ThumbsUp className="mr-2 h-4 w-4 text-green-500" />
                              Good
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="fair" />
                            </FormControl>
                            <FormLabel className="font-normal">Fair</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="poor" />
                            </FormControl>
                            <FormLabel className="font-normal flex items-center">
                              <ThumbsDown className="mr-2 h-4 w-4 text-red-500" />
                              Poor
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Rate your overall experience</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex justify-between"
                        >
                          {["5", "4", "3", "2", "1"].map((rating) => (
                            <FormItem key={rating} className="space-y-0">
                              <FormControl>
                                <RadioGroupItem value={rating} className="sr-only" />
                              </FormControl>
                              <FormLabel
                                className={`cursor-pointer flex flex-col items-center space-y-1 ${
                                  field.value === rating ? "text-primary" : "text-muted-foreground"
                                }`}
                              >
                                <Star
                                  className={`h-8 w-8 ${
                                    field.value === rating ? "fill-primary text-primary" : "fill-muted text-muted"
                                  }`}
                                />
                                <span className="text-xs">{rating}</span>
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormDescription>1 = Poor, 5 = Excellent</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="feedback"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Feedback (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share your thoughts about the produce quality, delivery, etc."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Receipt & Complete Transaction"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
