"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, Loader2, Send, InfoIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const bidRequestSchema = z.object({
  produce: z.string({
    required_error: "Please select a produce type",
  }),
  quantity: z.string({
    required_error: "Please select a quantity",
  }),
  grade: z.string({
    required_error: "Please select a grade",
  }),
  requiredDate: z.date({
    required_error: "Please select a required date",
  }),
  bidDeadline: z.date({
    required_error: "Please select a bid deadline",
  }),
  pricePerKg: z.string().refine(
    (val) => {
      const num = Number.parseFloat(val)
      return !isNaN(num) && num > 0
    },
    {
      message: "Please enter a valid price per kg",
    },
  ),
  additionalNotes: z.string().optional(),
})

type BidRequestValues = z.infer<typeof bidRequestSchema>

// Updated floor prices for fresh perishable produce (in KES per kg)
const FLOOR_PRICES = {
  tomatoes: 80,
  kale: 40,
  spinach: 50,
  cabbage: 35,
  onions: 60,
  carrots: 45,
  green_peppers: 90,
  cucumber: 55,
  green_beans: 70,
  peas: 85,
  bananas: 60,
  mangoes: 75,
  avocados: 150,
  passion_fruit: 120,
  oranges: 65,
  watermelon: 30,
  coriander: 100,
  mint: 120,
  ginger: 180,
  chillies: 150,
}

// Mock service costs (percentages)
const SERVICE_COSTS = {
  grader: 0.05, // 5%
  transport: 0.08, // 8%
  insurance: 0.02, // 2%
}

export default function CreateBidPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [floorPriceError, setFloorPriceError] = useState<string | null>(null)
  const [selectedProduce, setSelectedProduce] = useState<string | null>(null)
  const [priceBreakdown, setPriceBreakdown] = useState<{
    buyerPrice: number
    graderCost: number
    transportCost: number
    insuranceCost: number
    netPrice: number
  } | null>(null)

  const form = useForm<BidRequestValues>({
    resolver: zodResolver(bidRequestSchema),
    defaultValues: {
      additionalNotes: "",
      pricePerKg: "",
    },
  })

  // Watch for price and produce changes to calculate breakdown
  const watchPrice = form.watch("pricePerKg")
  const watchProduce = form.watch("produce")

  useEffect(() => {
    if (watchProduce && watchProduce !== selectedProduce) {
      setSelectedProduce(watchProduce)
      setFloorPriceError(null)
    }
  }, [watchProduce, selectedProduce])

  useEffect(() => {
    if (watchPrice && watchProduce) {
      const price = Number.parseFloat(watchPrice)
      if (!isNaN(price)) {
        calculatePriceBreakdown(price, watchProduce)
      } else {
        setPriceBreakdown(null)
      }
    }
  }, [watchPrice, watchProduce])

  const calculatePriceBreakdown = (price: number, produce: string) => {
    const graderCost = price * SERVICE_COSTS.grader
    const transportCost = price * SERVICE_COSTS.transport
    const insuranceCost = price * SERVICE_COSTS.insurance
    const totalDeductions = graderCost + transportCost + insuranceCost
    const netPrice = price - totalDeductions

    setPriceBreakdown({
      buyerPrice: price,
      graderCost,
      transportCost,
      insuranceCost,
      netPrice,
    })

    // Check if price is below floor price
    if (
      FLOOR_PRICES[produce as keyof typeof FLOOR_PRICES] &&
      price < FLOOR_PRICES[produce as keyof typeof FLOOR_PRICES]
    ) {
      setFloorPriceError(
        `The price is below the floor price of KES ${FLOOR_PRICES[produce as keyof typeof FLOOR_PRICES]} per kg for ${produce.replace("_", " ")}`,
      )
    } else {
      setFloorPriceError(null)
    }
  }

  async function onSubmit(data: BidRequestValues) {
    // Check floor price before submission
    const price = Number.parseFloat(data.pricePerKg)
    const floorPrice = FLOOR_PRICES[data.produce as keyof typeof FLOOR_PRICES] || 0

    if (price < floorPrice) {
      setFloorPriceError(
        `Cannot submit: The price is below the floor price of KES ${floorPrice} per kg for ${data.produce.replace("_", " ")}`,
      )
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      console.log("Submitting bid request:", data)
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
      console.error("Error submitting bid request:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Updated produce options focusing on fresh perishables
  const produceOptions = [
    // Vegetables
    { value: "tomatoes", label: "Tomatoes" },
    { value: "kale", label: "Kale (Sukuma Wiki)" },
    { value: "spinach", label: "Spinach" },
    { value: "cabbage", label: "Cabbage" },
    { value: "onions", label: "Onions" },
    { value: "carrots", label: "Carrots" },
    { value: "green_peppers", label: "Green Peppers" },
    { value: "cucumber", label: "Cucumber" },

    // Legumes
    { value: "green_beans", label: "Green Beans" },
    { value: "peas", label: "Peas" },

    // Fruits
    { value: "bananas", label: "Bananas" },
    { value: "mangoes", label: "Mangoes" },
    { value: "avocados", label: "Avocados" },
    { value: "passion_fruit", label: "Passion Fruit" },
    { value: "oranges", label: "Oranges" },
    { value: "watermelon", label: "Watermelon" },

    // Herbs and Spices
    { value: "coriander", label: "Coriander (Dhania)" },
    { value: "mint", label: "Mint" },
    { value: "ginger", label: "Ginger" },
    { value: "chillies", label: "Chillies" },
  ]

  // Quantity options
  const quantityOptions = [
    { value: "50kg", label: "50 kg (Small Batch)" },
    { value: "100kg", label: "100 kg (Quarter Ton)" },
    { value: "250kg", label: "250 kg (Half Ton)" },
    { value: "500kg", label: "500 kg (1 Ton)" },
    { value: "1000kg", label: "1000 kg (2 Tons)" },
    { value: "custom", label: "Custom Quantity" },
  ]

  // Grade options
  const gradeOptions = [
    { value: "grade_a", label: "Grade A (Premium)" },
    { value: "grade_b", label: "Grade B (Standard)" },
    { value: "grade_c", label: "Grade C (Economy)" },
  ]

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create Bid Request</h1>
        <p className="text-sm text-muted-foreground">Request bids from Akulima Groups</p>
      </div>

      {submitSuccess ? (
        <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-900/30 dark:text-green-400">
          <AlertTitle>Bid Request Submitted</AlertTitle>
          <AlertDescription>
            Your bid request has been submitted successfully. SMS notifications will be sent to all Akulima Groups in
            the region.
          </AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Bid Details</CardTitle>
            <CardDescription>Enter the details of the produce you want to buy</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="produce"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Produce Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select produce type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {produceOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select quantity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {quantityOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Select the quantity you need</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                          {gradeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pricePerKg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Price Per Kg (KES)
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <InfoIcon className="h-4 w-4 ml-1 inline-block text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                This is the price you are willing to pay per kg. The system will deduct costs for
                                grading, transport, and insurance before broadcasting to farmers.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0" placeholder="Enter price per kg" {...field} />
                      </FormControl>
                      {selectedProduce && FLOOR_PRICES[selectedProduce as keyof typeof FLOOR_PRICES] && (
                        <FormDescription>
                          Floor price: KES {FLOOR_PRICES[selectedProduce as keyof typeof FLOOR_PRICES]} per kg
                        </FormDescription>
                      )}
                      {floorPriceError && (
                        <div className="text-sm font-medium text-destructive mt-1">{floorPriceError}</div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {priceBreakdown && (
                  <div className="rounded-md border p-3 space-y-2">
                    <h4 className="text-sm font-medium">Price Breakdown</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Your Price:</span>
                        <span>KES {priceBreakdown.buyerPrice.toFixed(2)}/kg</span>
                      </div>
                      <Separator className="my-1" />
                      <div className="flex justify-between text-muted-foreground">
                        <span>Grader Fee (5%):</span>
                        <span>- KES {priceBreakdown.graderCost.toFixed(2)}/kg</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Transport (8%):</span>
                        <span>- KES {priceBreakdown.transportCost.toFixed(2)}/kg</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Insurance (2%):</span>
                        <span>- KES {priceBreakdown.insuranceCost.toFixed(2)}/kg</span>
                      </div>
                      <Separator className="my-1" />
                      <div className="flex justify-between font-medium">
                        <span>Net Price to Farmers:</span>
                        <span>KES {priceBreakdown.netPrice.toFixed(2)}/kg</span>
                      </div>
                    </div>
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="requiredDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Required Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>When do you need the produce delivered?</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bidDeadline"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Bid Deadline</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>When should groups submit their bids by?</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter any specific requirements or details..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Add any specific requirements or details about your request</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting || !!floorPriceError}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Bid Request
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col items-start px-6 pt-0">
            <p className="text-xs text-muted-foreground">
              Note: The system will automatically deduct costs for grading, transport, and insurance from your offered
              price. The resulting net price will be broadcast to Akulima Groups.
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
