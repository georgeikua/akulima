"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { AlertCircle, CheckCircle2, Loader2, Mail, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Form schema for admin password reset
const resetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  employeeId: z.string().min(5, "Employee ID must be at least 5 characters"),
})

type ResetValues = z.infer<typeof resetSchema>

export default function AdminForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [resetError, setResetError] = useState<string | null>(null)
  const [resetSuccess, setResetSuccess] = useState(false)

  // Initialize form
  const form = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
      employeeId: "",
    },
  })

  // Handle password reset request
  async function onSubmit(data: ResetValues) {
    setIsLoading(true)
    setResetError(null)
    setResetSuccess(false)

    try {
      // Simulate API call to request password reset
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // For demo purposes, we'll just log the request and show success
      console.log("Admin password reset requested for:", data.email)

      // Show success message
      setResetSuccess(true)
    } catch (error) {
      console.error("Password reset request failed:", error)
      setResetError("Failed to process your request. Please try again or contact IT support.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <Card className="border-2">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <Shield className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">Admin Password Reset</CardTitle>
          <CardDescription className="text-center">Reset your admin account password</CardDescription>
        </CardHeader>
        <CardContent>
          {resetError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{resetError}</AlertDescription>
            </Alert>
          )}

          {resetSuccess ? (
            <Alert className="mb-4 border-green-500">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertTitle>Request Submitted</AlertTitle>
              <AlertDescription>
                If your email and employee ID match our records, you will receive password reset instructions shortly.
                For security reasons, the link will expire in 30 minutes.
              </AlertDescription>
            </Alert>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Email</FormLabel>
                      <FormControl>
                        <Input placeholder="admin@akulima.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Your employee ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-2">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Reset Instructions
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">
            <Link href="/admin-login" className="text-primary hover:underline">
              Return to admin login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
