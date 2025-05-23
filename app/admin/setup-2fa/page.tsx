"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { AlertCircle, CheckCircle2, Copy, Loader2, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ProtectedRoute } from "@/components/protected-route"

// Form schema for 2FA verification
const twoFactorSchema = z.object({
  verificationCode: z.string().length(6, "Verification code must be 6 digits"),
})

type TwoFactorValues = z.infer<typeof twoFactorSchema>

export default function Setup2FAPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [setupError, setSetupError] = useState<string | null>(null)
  const [setupSuccess, setSetupSuccess] = useState(false)

  // Mock secret key for demo purposes
  const secretKey = "ABCDEF123456"

  // Initialize form
  const form = useForm<TwoFactorValues>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      verificationCode: "",
    },
  })

  // Handle copy secret key
  const copySecretKey = () => {
    navigator.clipboard
      .writeText(secretKey)
      .then(() => {
        alert("Secret key copied to clipboard")
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err)
      })
  }

  // Handle 2FA verification
  async function onSubmit(data: TwoFactorValues) {
    setIsLoading(true)
    setSetupError(null)

    try {
      // Simulate API call to verify 2FA code
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, we'll accept any 6-digit code
      console.log("2FA verification code submitted:", data.verificationCode)

      // Show success message
      setSetupSuccess(true)

      // Redirect after a delay
      setTimeout(() => {
        router.push("/admin")
      }, 2000)
    } catch (error) {
      console.error("2FA verification failed:", error)
      setSetupError(
        "Failed to verify the code. Please ensure you've entered the correct code from your authenticator app.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="container max-w-md mx-auto px-4 py-8">
        <Card className="border-2">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-2">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl text-center">Set Up Two-Factor Authentication</CardTitle>
            <CardDescription className="text-center">Enhance your admin account security</CardDescription>
          </CardHeader>
          <CardContent>
            {setupError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Verification Error</AlertTitle>
                <AlertDescription>{setupError}</AlertDescription>
              </Alert>
            )}

            {setupSuccess ? (
              <Alert className="mb-4 border-green-500">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertTitle>2FA Enabled Successfully</AlertTitle>
                <AlertDescription>
                  Two-factor authentication has been enabled for your account. You will now be required to enter a
                  verification code when logging in.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="mb-6 space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      1. Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                    </p>
                    <div className="flex justify-center">
                      {/* Placeholder QR code image */}
                      <div className="border p-4 bg-white">
                        <Image src="/qr-code-generic.png" alt="2FA QR Code" width={150} height={150} />
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      2. Or manually enter this secret key in your app:
                    </p>
                    <div className="flex items-center justify-center">
                      <code className="bg-muted px-2 py-1 rounded text-sm font-mono">{secretKey}</code>
                      <Button variant="ghost" size="icon" onClick={copySecretKey} className="ml-1">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      3. Enter the 6-digit verification code from your app:
                    </p>
                  </div>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="verificationCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Verification Code</FormLabel>
                          <FormControl>
                            <Input placeholder="6-digit code" maxLength={6} {...field} />
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
                          "Verify and Enable 2FA"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-muted-foreground">
              <p>Two-factor authentication adds an extra layer of security to your admin account.</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
