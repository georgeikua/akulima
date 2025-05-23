"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { AlertCircle, Loader2, LockKeyhole, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"

// Form schema for admin login
const adminLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  securityCode: z.string().length(6, "Security code must be 6 digits"),
})

type AdminLoginValues = z.infer<typeof adminLoginSchema>

export default function AdminLoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [loginAttempts, setLoginAttempts] = useState(0)

  // Initialize form
  const form = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
      securityCode: "",
    },
  })

  // Handle admin login
  async function onSubmit(data: AdminLoginValues) {
    setIsLoading(true)
    setLoginError(null)

    try {
      // Simulate security code verification
      if (data.securityCode !== "123456") {
        throw new Error("Invalid security code. Please try again.")
      }

      // Proceed with login if security code is valid
      await login(data.email, data.password, "admin")

      // Log successful login attempt
      console.log("Admin login successful:", data.email)

      // Redirect to admin dashboard
      router.push("/admin")
    } catch (error) {
      console.error("Admin login failed:", error)
      setLoginAttempts((prev) => prev + 1)

      if (loginAttempts >= 2) {
        setLoginError(
          "Multiple failed login attempts detected. Please wait 15 minutes before trying again or contact system administrator.",
        )
      } else {
        setLoginError(
          error instanceof Error ? error.message : "Login failed. Please check your credentials and try again.",
        )
      }
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
          <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">Secure access to Akulima administration</CardDescription>
        </CardHeader>
        <CardContent>
          {loginError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Authentication Error</AlertTitle>
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@akulima.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="securityCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Security Code</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="6-digit code" maxLength={6} {...field} />
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
                      Verifying...
                    </>
                  ) : (
                    <>
                      <LockKeyhole className="mr-2 h-4 w-4" />
                      Secure Login
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">
            <Link href="/admin-forgot-password" className="text-primary hover:underline">
              Forgot admin password?
            </Link>
          </div>
          <div className="text-sm text-center text-muted-foreground">
            <Link href="/login" className="text-primary hover:underline">
              Return to standard login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
