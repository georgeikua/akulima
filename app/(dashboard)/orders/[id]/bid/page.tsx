"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowLeft, Calendar, Clock, Loader2, Upload, User, Info, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/protected-route"

const bidSubmissionSchema = z.object({
  price: z.coerce.number().positive("Price must be a positive number"),
  image1: z.instanceof(File, { message: "First image is required" }),
  image2: z.instanceof(File, { message: "Second image is required" }),
  image3: z.instanceof(File, { message: "Third image is required" }).optional(),
  notes: z.string().optional(),
})

type BidSubmissionValues = z.infer<typeof bidSubmissionSchema>

// Mock bid request data
const mockBidRequests: Record<string, any> = {
  "order-001": {
    id: "order-001",
    code: "AKL-REQ-001",
    produce: "Potatoes",
    quantity: "3 Ton Truck",
    grade: "Grade A (Premium)",
    requiredDate: "2023-08-15",
    bidDeadline: "2023-07-30",
    buyer: {
      code: "BUY-123",
      location: "Nairobi, Westlands",
    },
    additionalNotes: "Looking for clean, well-sorted potatoes. Size should be medium to large.",
  },
  "order-002": {
    id: "order-002",
    code: "AKL-REQ-002",
    produce: "Tomatoes",
    quantity: "1 Ton (Pick-up)",
    grade: "Grade B (Standard)",
    requiredDate: "2023-08-10",
    bidDeadline: "2023-07-28",
    buyer: {
      code: "BUY-456",
      location: "Nakuru Town",
    },
    additionalNotes: "Tomatoes should be ripe but firm.",
  },
}

export default function BidSubmissionPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [bidRequest, setBidRequest] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [image1Preview, setImage1Preview] = useState<string | null>(null)
  const [image2Preview, setImage2Preview] = useState<string | null>(null)
  const [image3Preview, setImage3Preview] = useState<string | null>(null)

  const form = useForm<BidSubmissionValues>({
    resolver: zodResolver(bidSubmissionSchema),
    defaultValues: {
      price: undefined,
      notes: "",
    },
  })

  // Fetch bid request data
  useEffect(() => {
    const fetchBidRequest = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Get mock data
        const data = mockBidRequests[params.id]
        if (!data) {
          router.push("/dashboard")
          return
        }

        setBidRequest(data)
      } catch (error) {
        console.error("Error fetching bid request:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBidRequest()
  }, [params.id, router])

  // Handle image upload previews
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, imageNumber: 1 | 2 | 3) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      if (imageNumber === 1) {
        setImage1Preview(reader.result as string)
        form.setValue("image1", file)
      } else if (imageNumber === 2) {
        setImage2Preview(reader.result as string)
        form.setValue("image2", file)
      } else {
        setImage3Preview(reader.result as string)
        form.setValue("image3", file)
      }
    }
    reader.readAsDataURL(file)
  }

  async function onSubmit(data: BidSubmissionValues) {
    setIsSubmitting(true)

    try {
      // Simulate API call
      console.log("Submitting bid:", {
        bidRequestId: params.id,
        groupId: user?.groupId,
        ...data,
      })
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock successful submission
      setSubmitSuccess(true)

      // Reset form
      form.reset()

      // Redirect after a delay
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error) {
      console.error("Error submitting bid:", error)
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

  if (!bidRequest) {
    return (
      <div className="container max-w-md mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTitle>Bid Request Not Found</AlertTitle>
          <AlertDescription>The bid request you're looking for doesn't exist or has been removed.</AlertDescription>
        </Alert>
        <Button className="mt-4 w-full" variant="outline" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["group"]}>
      <div className="container max-w-md mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-4 p-0 flex items-center text-muted-foreground"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold">Submit Bid</h1>
          <p className="text-sm text-muted-foreground">Respond to the bid request from Buyer {bidRequest.buyer.code}</p>
        </div>

        {submitSuccess ? (
          <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-900/30 dark:text-green-400">
            <AlertTitle>Bid Submitted Successfully</AlertTitle>
            <AlertDescription>
              Your bid has been submitted successfully. You will be notified if your bid is accepted.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle>{bidRequest.produce}</CardTitle>
                <CardDescription>Request Code: {bidRequest.code}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Quantity:</span>
                  <span className="text-sm">{bidRequest.quantity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Quality:</span>
                  <Badge variant="outline">{bidRequest.grade}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Required by:</span>
                  <span className="flex items-center text-sm">
                    <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                    {bidRequest.requiredDate}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Bid deadline:</span>
                  <span className="flex items-center text-sm">
                    <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                    {bidRequest.bidDeadline}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Buyer:</span>
                  <span className="flex items-center text-sm">
                    <User className="mr-1 h-3 w-3 text-muted-foreground" />
                    {bidRequest.buyer.code} ({bidRequest.buyer.location})
                  </span>
                </div>

                {bidRequest.additionalNotes && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium mb-1">Additional Notes:</h3>
                      <p className="text-sm text-muted-foreground">{bidRequest.additionalNotes}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Alert className="mb-6">
              <Info className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                All bids require at least 2 clear photos of your produce. This helps buyers verify quality before
                accepting.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Your Bid</CardTitle>
                <CardDescription>Submit your price and produce photos</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price per Kg (KES)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="e.g., 120" {...field} />
                          </FormControl>
                          <FormDescription>Enter your price per kilogram in Kenyan Shillings</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="image1"
                      render={({ field: { value, onChange, ...fieldProps } }) => (
                        <FormItem>
                          <FormLabel>Upload First Image (Required)</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, 1)}
                                {...fieldProps}
                              />
                              {image1Preview && (
                                <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                                  <Image
                                    src={image1Preview || "/placeholder.svg"}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormDescription>
                            Upload a clear photo showing overall quality of your produce
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="image2"
                      render={({ field: { value, onChange, ...fieldProps } }) => (
                        <FormItem>
                          <FormLabel>Upload Second Image (Required)</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, 2)}
                                {...fieldProps}
                              />
                              {image2Preview && (
                                <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                                  <Image
                                    src={image2Preview || "/placeholder.svg"}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormDescription>Upload a close-up photo showing the details of your produce</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="image3"
                      render={({ field: { value, onChange, ...fieldProps } }) => (
                        <FormItem>
                          <FormLabel>Upload Third Image (Optional)</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, 3)}
                                {...fieldProps}
                              />
                              {image3Preview && (
                                <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                                  <Image
                                    src={image3Preview || "/placeholder.svg"}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormDescription>Upload an additional photo if needed</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter any additional information about your produce..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Add any details about your produce quality, delivery options, etc.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Alert variant="outline" className="mt-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        By submitting this bid, you confirm that the photos accurately represent the produce you will
                        deliver if selected.
                      </AlertDescription>
                    </Alert>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Submit Bid
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </ProtectedRoute>
  )
}
