"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { CalendarIcon, InfoIcon, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AIPriceSuggestion } from "@/components/ai-price-suggestion"
import { FeeBreakdown } from "@/components/fee-breakdown"
import { type TruckSize, getMinimumQuantity } from "@/lib/fee-calculator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Sample market price data
const MARKET_PRICES = {
  watermelon: { min: 25, max: 35, avg: 30 },
  tomatoes: { min: 70, max: 90, avg: 80 },
  potatoes: { min: 30, max: 45, avg: 35 },
  onions: { min: 50, max: 70, avg: 60 },
  maize: { min: 40, max: 50, avg: 45 },
  beans: { min: 100, max: 140, avg: 120 },
  cabbage: { min: 20, max: 30, avg: 25 },
  kale: { min: 35, max: 45, avg: 40 },
  spinach: { min: 45, max: 55, avg: 50 },
  carrots: { min: 40, max: 50, avg: 45 },
  green_peppers: { min: 80, max: 100, avg: 90 },
  avocados: { min: 140, max: 160, avg: 150 },
}

const MIN_QUANTITY = getMinimumQuantity()

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  produceType: z.string({
    required_error: "Please select a produce type.",
  }),
  truckSize: z.string({
    required_error: "Please select a truck size.",
  }),
  grade: z.string({
    required_error: "Please select a quality grade.",
  }),
  price: z.coerce.number().positive({
    message: "Price must be a positive number.",
  }),
  quantity: z.coerce
    .number()
    .positive({
      message: "Quantity must be a positive number.",
    })
    .min(MIN_QUANTITY, {
      message: `Minimum quantity is ${MIN_QUANTITY} kg (1 ton).`,
    }),
  description: z.string().optional(),
  location: z.string().min(3, {
    message: "Location must be at least 3 characters.",
  }),
  deadline: z.date({
    required_error: "Please select a deadline date.",
  }),
  notifyGroups: z.boolean().default(true),
})

export default function PostRequestPage() {
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedProduce, setSelectedProduce] = useState<string | null>(null)
  const [marketPriceInfo, setMarketPriceInfo] = useState<{ min: number; max: number; avg: number } | null>(null)
  const [suggestedPrice, setSuggestedPrice] = useState<number | null>(null)
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [showFeeBreakdown, setShowFeeBreakdown] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      price: undefined,
      quantity: MIN_QUANTITY,
      notifyGroups: true,
    },
  })

  // Watch for produce type changes to update market price info
  const watchProduceType = form.watch("produceType")
  const watchPrice = form.watch("price")
  const watchQuantity = form.watch("quantity")
  const watchTruckSize = form.watch("truckSize")

  useEffect(() => {
    if (watchProduceType && watchProduceType !== selectedProduce) {
      setSelectedProduce(watchProduceType)
      setMarketPriceInfo(MARKET_PRICES[watchProduceType as keyof typeof MARKET_PRICES] || null)
    }
  }, [watchProduceType, selectedProduce])

  // Calculate total amount when price or quantity changes
  useEffect(() => {
    if (watchPrice && watchQuantity) {
      setTotalAmount(watchPrice * watchQuantity)
      setShowFeeBreakdown(true)
    } else {
      setShowFeeBreakdown(false)
    }
  }, [watchPrice, watchQuantity])

  const handleSuggestedPrice = (price: number) => {
    setSuggestedPrice(price)
    form.setValue("price", price)
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    // In a real application, this would be an API call
    console.log(values)

    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // If notifyGroups is true, send notifications to relevant groups
    if (values.notifyGroups) {
      console.log("Sending notifications to groups that supply", values.produceType)
      // In a real application, this would call an API to send SMS/WhatsApp notifications
    }

    // Redirect to success page or show success message
    setIsSubmitting(false)
    window.location.href = "/market-requests"
  }

  return (
    <ProtectedRoute allowedRoles={["buyer", "admin"]}>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Post Market Request</h1>
          <p className="text-muted-foreground">
            Post a new market request for produce. One farmer group will fulfill your entire order.
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Minimum Order Quantity</AlertTitle>
          <AlertDescription>The minimum order quantity is {MIN_QUANTITY.toLocaleString()} kg (1 ton).</AlertDescription>
        </Alert>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Request Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Fresh Watermelons Needed" {...field} />
                    </FormControl>
                    <FormDescription>A clear title helps farmers understand your request.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="produceType"
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
                        <SelectItem value="watermelon">Watermelon</SelectItem>
                        <SelectItem value="tomatoes">Tomatoes</SelectItem>
                        <SelectItem value="potatoes">Potatoes</SelectItem>
                        <SelectItem value="onions">Onions</SelectItem>
                        <SelectItem value="maize">Maize</SelectItem>
                        <SelectItem value="beans">Beans</SelectItem>
                        <SelectItem value="cabbage">Cabbage</SelectItem>
                        <SelectItem value="kale">Kale (Sukuma Wiki)</SelectItem>
                        <SelectItem value="spinach">Spinach</SelectItem>
                        <SelectItem value="carrots">Carrots</SelectItem>
                        <SelectItem value="green_peppers">Green Peppers</SelectItem>
                        <SelectItem value="avocados">Avocados</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <FormField
                control={form.control}
                name="truckSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Truck Size</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select truck size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1ton">1 Ton Truck (10% fee)</SelectItem>
                        <SelectItem value="2ton">2 Ton Truck (10% fee)</SelectItem>
                        <SelectItem value="3ton">3 Ton Truck (8% fee)</SelectItem>
                        <SelectItem value="4ton">4 Ton Truck (8% fee)</SelectItem>
                        <SelectItem value="5ton">5 Ton Truck (6% fee)</SelectItem>
                        <SelectItem value="6ton">6 Ton Truck (6% fee)</SelectItem>
                        <SelectItem value="7ton">7 Ton Truck (5% fee)</SelectItem>
                        <SelectItem value="8ton">8 Ton Truck (5% fee)</SelectItem>
                        <SelectItem value="10ton">10 Ton Truck (5% fee)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Select the truck size for delivery</FormDescription>
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
                        <SelectItem value="A">Grade A (Premium)</SelectItem>
                        <SelectItem value="B">Grade B (Standard)</SelectItem>
                        <SelectItem value="C">Grade C (Economy)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Price (KES/kg)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="ml-1 h-4 w-4 inline-block text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">This is the price you are offering to pay per kilogram.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" min="1" placeholder="e.g., 120" {...field} />
                    </FormControl>
                    {marketPriceInfo && (
                      <FormDescription>
                        Market price range: KES {marketPriceInfo.min}-{marketPriceInfo.max}/kg (Avg: KES{" "}
                        {marketPriceInfo.avg}/kg)
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" min={MIN_QUANTITY} placeholder={`Min: ${MIN_QUANTITY} kg`} {...field} />
                    </FormControl>
                    <FormDescription>Minimum quantity is {MIN_QUANTITY.toLocaleString()} kg (1 ton)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Add AI Price Suggestion */}
              {watchProduceType && watchProduceType !== "" && (
                <div className="md:col-span-1">
                  <AIPriceSuggestion
                    produceType={watchProduceType}
                    grade={form.watch("grade") || ""}
                    onSuggestedPrice={handleSuggestedPrice}
                  />
                </div>
              )}
            </div>

            {showFeeBreakdown && watchTruckSize && watchQuantity && (
              <FeeBreakdown
                totalAmount={totalAmount}
                quantity={watchQuantity}
                truckSize={watchTruckSize as TruckSize}
              />
            )}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any specific requirements or details about your request..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Include any special requirements or specifications for the produce.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Nairobi CBD" {...field} />
                    </FormControl>
                    <FormDescription>Where the produce should be delivered.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Delivery Deadline</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
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
                    <FormDescription>When you need the produce delivered by.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notifyGroups"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Notify Eligible Groups</FormLabel>
                    <FormDescription>
                      Send SMS/WhatsApp notifications to all groups that supply this produce
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button asChild variant="outline">
                <Link href="/dashboard">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Post Request"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </ProtectedRoute>
  )
}
