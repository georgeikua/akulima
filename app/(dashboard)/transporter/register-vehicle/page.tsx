"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowLeft, Loader2, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/protected-route"

const vehicleSchema = z.object({
  vehicleType: z.string({
    required_error: "Please select a vehicle type",
  }),
  registrationNumber: z.string().min(5, {
    message: "Registration number must be at least 5 characters",
  }),
  capacity: z.string({
    required_error: "Please select vehicle capacity",
  }),
  make: z.string().min(2, {
    message: "Vehicle make is required",
  }),
  model: z.string().min(2, {
    message: "Vehicle model is required",
  }),
  year: z.string().regex(/^\d{4}$/, {
    message: "Please enter a valid year (e.g., 2020)",
  }),
  licenseImage: z.instanceof(File, { message: "License image is required" }).optional(),
  insuranceImage: z.instanceof(File, { message: "Insurance image is required" }).optional(),
  additionalInfo: z.string().optional(),
})

type VehicleFormValues = z.infer<typeof vehicleSchema>

export default function RegisterVehiclePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [licensePreview, setLicensePreview] = useState<string | null>(null)
  const [insurancePreview, setInsurancePreview] = useState<string | null>(null)

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      additionalInfo: "",
    },
  })

  // Handle image upload previews
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, imageType: "license" | "insurance") => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      if (imageType === "license") {
        setLicensePreview(reader.result as string)
        form.setValue("licenseImage", file)
      } else {
        setInsurancePreview(reader.result as string)
        form.setValue("insuranceImage", file)
      }
    }
    reader.readAsDataURL(file)
  }

  async function onSubmit(data: VehicleFormValues) {
    setIsSubmitting(true)

    try {
      // Simulate API call
      console.log("Registering vehicle:", data)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock successful submission
      setSubmitSuccess(true)

      // Reset form
      form.reset()

      // Redirect after a delay
      setTimeout(() => {
        router.push("/transporter/deliveries")
      }, 2000)
    } catch (error) {
      console.error("Error registering vehicle:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ProtectedRoute allowedRoles={["transporter", "admin"]}>
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
          <h1 className="text-2xl font-bold">Register Vehicle</h1>
          <p className="text-sm text-muted-foreground">Register your vehicle for produce transportation</p>
        </div>

        {submitSuccess ? (
          <Alert className="bg-green-50 border-green-200 text-green-800">
            <AlertTitle>Vehicle Registered Successfully</AlertTitle>
            <AlertDescription>
              Your vehicle has been registered successfully. You will be notified when there are delivery assignments.
            </AlertDescription>
          </Alert>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Details</CardTitle>
              <CardDescription>Enter your vehicle information for produce transportation</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="vehicleType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select vehicle type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pickup">Pickup Truck</SelectItem>
                            <SelectItem value="canter">Canter Truck</SelectItem>
                            <SelectItem value="lorry">Lorry</SelectItem>
                            <SelectItem value="van">Delivery Van</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Capacity</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select capacity" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1ton">1 Ton Truck</SelectItem>
                            <SelectItem value="3ton">3 Ton Truck</SelectItem>
                            <SelectItem value="5ton">5 Ton Truck</SelectItem>
                            <SelectItem value="7ton">7 Ton Truck</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Select the capacity that matches the buyer requirements</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="registrationNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registration Number</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., KBZ 123A" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 2020" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="make"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Make</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Toyota" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Model</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Hilux" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="licenseImage"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>Upload Vehicle License</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageChange(e, "license")}
                              {...fieldProps}
                            />
                            {licensePreview && (
                              <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                                <img
                                  src={licensePreview || "/placeholder.svg"}
                                  alt="License Preview"
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>Upload a clear photo of your vehicle license</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="insuranceImage"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>Upload Insurance Certificate</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageChange(e, "insurance")}
                              {...fieldProps}
                            />
                            {insurancePreview && (
                              <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                                <img
                                  src={insurancePreview || "/placeholder.svg"}
                                  alt="Insurance Preview"
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>Upload a clear photo of your insurance certificate</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="additionalInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Information (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter any additional information about your vehicle..."
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
                        Registering...
                      </>
                    ) : (
                      <>
                        <Truck className="mr-2 h-4 w-4" />
                        Register Vehicle
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  )
}
