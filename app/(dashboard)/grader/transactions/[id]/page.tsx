"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowLeft, Camera, Check, Loader2, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"

// Form schema for grading report
const gradingReportSchema = z.object({
  grade: z.string({
    required_error: "Please select a grade",
  }),
  totalQuantity: z.coerce.number().positive("Total quantity must be a positive number"),
  acceptedQuantity: z.coerce.number().positive("Accepted quantity must be a positive number"),
  rejectedQuantity: z.coerce.number().min(0, "Rejected quantity cannot be negative"),
  image1: z.instanceof(File, { message: "First image is required" }),
  image2: z.instanceof(File, { message: "Second image is required" }).optional(),
  notes: z.string().optional(),
})

type GradingReportValues = z.infer<typeof gradingReportSchema>

// Mock transaction data
const mockTransactions: Record<string, any> = {
  "txn-001": {
    id: "txn-001",
    produce: "Potatoes",
    quantity: "3 Ton Truck",
    estimatedWeight: 3000, // kg
    group: {
      name: "Meru Farmers Cooperative",
      location: "Meru County, Imenti North",
      contact: "0712345678",
      collectionPoint: {
        name: "Meru Central Collection Center",
        coordinates: "-0.0236, 37.6538",
      },
    },
    buyer: {
      name: "Metro Supermarket",
      location: "Nairobi, Westlands",
      contact: "0723456789",
    },
    scheduledDate: "2023-07-28",
    status: "pending", // pending, completed
    gradingReport: null,
  },
  "txn-002": {
    id: "txn-002",
    produce: "Tomatoes",
    quantity: "1 Ton (Pick-up)",
    estimatedWeight: 1000, // kg
    group: {
      name: "Nyeri Tomato Growers",
      location: "Nyeri County, Tetu",
      contact: "0734567890",
      collectionPoint: {
        name: "Nyeri Farmers Hub",
        coordinates: "-0.4167, 36.9500",
      },
    },
    buyer: {
      name: "Fresh Grocers Ltd",
      location: "Nakuru Town",
      contact: "0745678901",
    },
    scheduledDate: "2023-07-29",
    status: "pending",
    gradingReport: null,
  },
}

export default function GradingReportPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [transaction, setTransaction] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [image1Preview, setImage1Preview] = useState<string | null>(null)
  const [image2Preview, setImage2Preview] = useState<string | null>(null)
  const [useCamera, setUseCamera] = useState(false)

  // Initialize form
  const form = useForm<GradingReportValues>({
    resolver: zodResolver(gradingReportSchema),
    defaultValues: {
      totalQuantity: 0,
      acceptedQuantity: 0,
      rejectedQuantity: 0,
      notes: "",
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
        const txnData = mockTransactions[params.id]
        if (!txnData) {
          router.push("/grader/transactions")
          return
        }

        setTransaction(txnData)

        // Pre-fill the form with estimated weight
        form.setValue("totalQuantity", txnData.estimatedWeight)
        form.setValue("acceptedQuantity", txnData.estimatedWeight)
        form.setValue("rejectedQuantity", 0)
      } catch (error) {
        console.error("Error fetching transaction details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactionDetails()
  }, [params.id, router, form])

  // Handle image upload previews
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, imageNumber: 1 | 2) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      if (imageNumber === 1) {
        setImage1Preview(reader.result as string)
        form.setValue("image1", file)
      } else {
        setImage2Preview(reader.result as string)
        form.setValue("image2", file)
      }
    }
    reader.readAsDataURL(file)
  }

  // Handle form submission
  async function onSubmit(data: GradingReportValues) {
    setIsSubmitting(true)

    try {
      // Validate that accepted + rejected = total
      if (data.acceptedQuantity + data.rejectedQuantity !== data.totalQuantity) {
        form.setError("rejectedQuantity", {
          type: "manual",
          message: "Accepted and rejected quantities must sum to total quantity",
        })
        setIsSubmitting(false)
        return
      }

      // Simulate API call
      console.log("Submitting grading report:", {
        transactionId: transaction.id,
        ...data,
      })
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock successful submission
      setSubmitSuccess(true)

      // Reset form
      form.reset()

      // Redirect after a delay
      setTimeout(() => {
        router.push("/grader/transactions")
      }, 2000)
    } catch (error) {
      console.error("Error submitting grading report:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Update rejected quantity when total or accepted changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "totalQuantity" || name === "acceptedQuantity") {
        const total = (value.totalQuantity as number) || 0
        const accepted = (value.acceptedQuantity as number) || 0
        form.setValue("rejectedQuantity", Math.max(0, total - accepted))
      }
    })

    return () => subscription.unsubscribe()
  }, [form])

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
        <Button className="mt-4 w-full" variant="outline" onClick={() => router.push("/grader/transactions")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Transactions
        </Button>
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-4 p-0 flex items-center text-muted-foreground"
        onClick={() => router.push("/grader/transactions")}
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Transactions
      </Button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Submit Grading Report</h1>
        <p className="text-sm text-muted-foreground">
          Quality assessment for {transaction.produce} from {transaction.group.name}
        </p>
      </div>

      {submitSuccess ? (
        <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
          <Check className="h-4 w-4" />
          <AlertTitle>Grading Report Submitted</AlertTitle>
          <AlertDescription>
            Your grading report has been submitted successfully. The transporter has been notified to pick up the
            accepted produce.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle>{transaction.produce}</CardTitle>
              <CardDescription>{transaction.quantity}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Group:</span>
                  <span>{transaction.group.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Buyer:</span>
                  <span>{transaction.buyer.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Scheduled Date:</span>
                  <span>{transaction.scheduledDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Collection Point:</span>
                  <span>{transaction.group.collectionPoint.name}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Grading Report</CardTitle>
              <CardDescription>Assess the quality and quantity of the produce</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quality Grade</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select grade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="grade_a">Grade A (Premium)</SelectItem>
                            <SelectItem value="grade_b">Grade B (Standard)</SelectItem>
                            <SelectItem value="grade_c">Grade C (Economy)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="totalQuantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total (kg)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="acceptedQuantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Accepted</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rejectedQuantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rejected</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} readOnly />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <FormLabel>Upload Images</FormLabel>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant={useCamera ? "default" : "outline"}
                        size="sm"
                        onClick={() => setUseCamera(true)}
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Use Camera
                      </Button>
                      <Button
                        type="button"
                        variant={useCamera ? "outline" : "default"}
                        size="sm"
                        onClick={() => setUseCamera(false)}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Files
                      </Button>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="image1"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>First Image</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Input
                              type={useCamera ? "file" : "file"}
                              accept="image/*"
                              capture={useCamera ? "environment" : undefined}
                              onChange={(e) => handleImageChange(e, 1)}
                              {...fieldProps}
                            />
                            {image1Preview && (
                              <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                                <img
                                  src={image1Preview || "/placeholder.svg"}
                                  alt="Preview"
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>Take or upload a clear photo of the produce</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="image2"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>Second Image (Optional)</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Input
                              type={useCamera ? "file" : "file"}
                              accept="image/*"
                              capture={useCamera ? "environment" : undefined}
                              onChange={(e) => handleImageChange(e, 2)}
                              {...fieldProps}
                            />
                            {image2Preview && (
                              <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                                <img
                                  src={image2Preview || "/placeholder.svg"}
                                  alt="Preview"
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>Take or upload an additional photo if needed</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter any additional notes about the quality assessment..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Add any details about quality issues, sorting requirements, etc.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Grading Report"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
