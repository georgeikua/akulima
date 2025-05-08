"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CheckCircle, Loader2, Phone, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Form schema for ID verification
const idVerificationSchema = z.object({
  idNumber: z.string().min(6, {
    message: "ID number must be at least 6 characters.",
  }),
})

// Form schema for phone verification
const phoneVerificationSchema = z.object({
  phoneNumber: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
})

type IdVerificationValues = z.infer<typeof idVerificationSchema>
type PhoneVerificationValues = z.infer<typeof phoneVerificationSchema>

interface MemberVerificationProps {
  onVerificationComplete: (data: any) => void
}

export function MemberVerification({ onVerificationComplete }: MemberVerificationProps) {
  const [step, setStep] = useState<"id" | "phone" | "complete">("id")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)
  const [idData, setIdData] = useState<any>(null)

  // Initialize ID verification form
  const idForm = useForm<IdVerificationValues>({
    resolver: zodResolver(idVerificationSchema),
    defaultValues: {
      idNumber: "",
    },
  })

  // Initialize phone verification form
  const phoneForm = useForm<PhoneVerificationValues>({
    resolver: zodResolver(phoneVerificationSchema),
    defaultValues: {
      phoneNumber: "",
    },
  })

  // Handle ID verification submission
  async function onIdSubmit(data: IdVerificationValues) {
    setIsVerifying(true)
    setVerificationError(null)

    try {
      // Simulate API call to SmileID
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock response from SmileID API
      const mockResponse = {
        fullName: "George Wanyika Ikua",
        country: "Kenya",
        idType: "NATIONAL_ID",
        idNumber: data.idNumber,
        secondaryIdNumber: "253749297",
        expiryDate: "Not Available",
        isAlive: "Not Available",
        nationality: "Not Available",
        issuanceDate: "2022-05-20",
        dateOfBirth: "1976-08-20",
        phoneNumber: "Not Available",
        gender: "Male",
        address: "12111 NYERI KING'ONG'O MAJENGO LOCATION - MUKARO DIVISION - MUNICIPALITY DISTRICT - NYERI EAST.",
      }

      // Calculate age from date of birth
      const birthDate = new Date(mockResponse.dateOfBirth)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }

      // Check eligibility
      const isFemale = mockResponse.gender === "Female"
      const isYouth = age < 35

      if (!isFemale && !isYouth) {
        setVerificationError("Only women and youth (males under 35) are eligible to join the group.")
        setIsVerifying(false)
        return
      }

      // Store ID data with calculated age
      setIdData({
        ...mockResponse,
        age,
      })

      // Move to phone verification step
      setStep("phone")
    } catch (error) {
      setVerificationError("Failed to verify ID. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  // Handle phone verification submission
  async function onPhoneSubmit(data: PhoneVerificationValues) {
    setIsVerifying(true)
    setVerificationError(null)

    try {
      // Simulate API call to verify phone
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock phone verification (in a real app, this would check if the name matches)
      const mockPhoneResponse = {
        verified: true,
        registeredName: "George Wanyika Ikua",
      }

      // Check if the name on the phone matches the ID
      if (mockPhoneResponse.registeredName !== idData.fullName) {
        setVerificationError("The name registered with this phone number does not match your ID.")
        setIsVerifying(false)
        return
      }

      // Complete verification with all data
      onVerificationComplete({
        ...idData,
        phoneNumber: data.phoneNumber,
        mpesaVerified: true,
      })

      // Move to complete step
      setStep("complete")
    } catch (error) {
      setVerificationError("Failed to verify phone number. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="space-y-4">
      {step === "id" && (
        <Form {...idForm}>
          <form onSubmit={idForm.handleSubmit(onIdSubmit)} className="space-y-4">
            <FormField
              control={idForm.control}
              name="idNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input className="pl-8" placeholder="Enter your ID number" {...field} />
                    </div>
                  </FormControl>
                  <FormDescription>Enter your national ID number for verification.</FormDescription>
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
                "Verify ID"
              )}
            </Button>
          </form>
        </Form>
      )}

      {step === "phone" && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">ID Verification Successful</CardTitle>
              <CardDescription>Your ID has been verified successfully.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Name:</span>
                  <span>{idData.fullName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">ID Number:</span>
                  <span>{idData.idNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Gender:</span>
                  <span>{idData.gender}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Age:</span>
                  <span>{idData.age} years</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="ml-1 text-sm text-green-500">Verified</span>
            </CardFooter>
          </Card>

          <Form {...phoneForm}>
            <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
              <FormField
                control={phoneForm.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>M-PESA Phone Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-8" placeholder="Enter your M-PESA number" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>Enter the phone number registered with M-PESA.</FormDescription>
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
                  "Verify Phone"
                )}
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  )
}
