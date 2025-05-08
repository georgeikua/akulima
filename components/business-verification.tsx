"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Building2, Loader2, Mail, Phone, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const businessVerificationSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  registrationNumber: z.string().min(5, "Registration number must be at least 5 characters"),
  boxNumber: z.string().min(1, "Box number is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  contactPerson: z.string().min(2, "Contact person name is required"),
  idNumber: z.string().min(5, "ID number must be at least 5 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
  email: z.string().email("Please enter a valid email address").optional(),
})

type BusinessVerificationValues = z.infer<typeof businessVerificationSchema>

interface BusinessVerificationProps {
  onVerificationComplete: (data: any) => void
}

export function BusinessVerification({ onVerificationComplete }: BusinessVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)

  const form = useForm<BusinessVerificationValues>({
    resolver: zodResolver(businessVerificationSchema),
    defaultValues: {
      companyName: "",
      registrationNumber: "",
      boxNumber: "",
      postalCode: "",
      contactPerson: "",
      idNumber: "",
      phoneNumber: "",
      email: "",
    },
  })

  async function onSubmit(data: BusinessVerificationValues) {
    setIsVerifying(true)
    setVerificationError(null)

    try {
      // Simulate API call to verify business details
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, you would verify the business registration number
      // with the appropriate government API

      // Mock verification success
      onVerificationComplete({
        ...data,
        verified: true,
      })
    } catch (error) {
      setVerificationError("Failed to verify business details. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <Building2 className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-8" placeholder="Enter company name" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="registrationNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Registration Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g., BN12345678" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="boxNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>P.O. Box Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 12345" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 00100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="contactPerson"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Person</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-8" placeholder="Enter contact person's name" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="idNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Person's ID Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter ID number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Phone Number</FormLabel>
              <FormControl>
                <div className="relative">
                  <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-8" placeholder="e.g., 0712345678" {...field} />
                </div>
              </FormControl>
              <FormDescription>This will be used for login and notifications</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Email (Optional)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-8" placeholder="company@example.com" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {verificationError && (
          <Alert variant="destructive">
            <AlertTitle>Verification Failed</AlertTitle>
            <AlertDescription>{verificationError}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={isVerifying}>
          {isVerifying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify Business Details"
          )}
        </Button>
      </form>
    </Form>
  )
}
