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

      // Mock response from SmileID API based on ID number
      let mockResponse

      // Test ID for successful female verification: 29384756
      // Test ID for failed verification (male): 12345678
      if (data.idNumber === "29384756") {
        mockResponse = {
          fullName: "Mary Wanjiku Kamau",
          country: "Kenya",
          idType: "NATIONAL_ID",
          idNumber: data.idNumber,
          secondaryIdNumber: "253749297",
          expiryDate: "Not Available",
          isAlive: "Not Available",
          nationality: "Not Available",
          issuanceDate: "2022-05-20",
          dateOfBirth: "1986-08-20",
          phoneNumber: "Not Available",
          gender: "Female",
          address: "12111 NYERI KING'ONG'O MAJENGO LOCATION - MUKARO DIVISION - MUNICIPALITY DISTRICT - NYERI EAST.",
        }
      } else if (data.idNumber === "12345678") {
        mockResponse = {
          fullName: "John Kamau Wanyika",
          country: "Kenya",
          idType: "NATIONAL_ID",
          idNumber: data.idNumber,
          secondaryIdNumber: "253749297",
          expiryDate: "Not Available",
          isAlive: "Not Available",
          nationality: "Not Available",
          issuanceDate: "2022-05-20",
          dateOfBirth: "1986-08-20",
          phoneNumber: "Not Available",
          gender: "Male",
          address: "12111 NYERI KING'ONG'O MAJENGO LOCATION - MUKARO DIVISION - MUNICIPALITY DISTRICT - NYERI EAST.",
        }
      } else {
        // Random gender for other IDs
        const genders = ["Female", "Male"]
        const randomGender = genders[Math.floor(Math.random() * genders.length)]
        const randomName =
          randomGender === "Female"
            ? ["Sarah Njeri", "Jane Muthoni", "Elizabeth Wambui"][Math.floor(Math.random() * 3)]
            : ["David Kamau", "Peter Mwangi", "James Kariuki"][Math.floor(Math.random() * 3)]

        mockResponse = {
          fullName: `${randomName} Kimani`,
          country: "Kenya",
          idType: "NATIONAL_ID",
          idNumber: data.idNumber,
          secondaryIdNumber: "253749297",
          expiryDate: "Not Available",
          isAlive: "Not Available",
          nationality: "Not Available",
          issuanceDate: "2022-05-20",
          dateOfBirth: "1986-08-20",
          phoneNumber: "Not Available",
          gender: randomGender,
          address: "12111 NYERI KING'ONG'O MAJENGO LOCATION - MUKARO DIVISION - MUNICIPALITY DISTRICT - NYERI EAST.",
        }
      }

      // Calculate age from date of birth
      const birthDate = new Date(mockResponse.dateOfBirth)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }

      // Check eligibility - only females are eligible now
      const isFemale = mockResponse.gender === "Female"

      if (!isFemale) {
        setVerificationError("Only women are eligible to join the group at this time.")
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

      // Test phone for successful verification: 0712345678
      // Test phone for failed verification: 0787654321
      let mockPhoneResponse

      if (data.phoneNumber === "0712345678") {
        // Phone matches ID
        mockPhoneResponse = {
          verified: true,
          registeredName: idData.fullName,
        }
      } else if (data.phoneNumber === "0787654321") {
        // Phone doesn't match ID
        mockPhoneResponse = {
          verified: true,
          registeredName: "Different Name",
        }
      } else {
        // Random match/mismatch for other numbers
        const matches = Math.random() > 0.5
        mockPhoneResponse = {
          verified: true,
          registeredName: matches ? idData.fullName : "Different Name",
        }
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
        method: "id",
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
                  <FormDescription className="text-sm">
                    Enter your national ID number for verification.
                    <div className="mt-2 text-xs text-muted-foreground">
                      <strong>Test IDs:</strong>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          <span className="font-mono bg-muted px-1 rounded">29384756</span> - Female ID (verification
                          will succeed)
                        </li>
                        <li>
                          <span className="font-mono bg-muted px-1 rounded">12345678</span> - Male ID (verification will
                          fail)
                        </li>
                      </ul>
                    </div>
                  </FormDescription>
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
                  <span className="text-green-600 font-medium">{idData.gender}</span>
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
                    <FormDescription className="text-sm">
                      Enter the phone number registered with M-PESA.
                      <div className="mt-2 text-xs text-muted-foreground">
                        <strong>Test Phone Numbers:</strong>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            <span className="font-mono bg-muted px-1 rounded">0712345678</span> - Matches ID name
                            (verification will succeed)
                          </li>
                          <li>
                            <span className="font-mono bg-muted px-1 rounded">0787654321</span> - Different name
                            (verification will fail)
                          </li>
                        </ul>
                      </div>
                    </FormDescription>
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
