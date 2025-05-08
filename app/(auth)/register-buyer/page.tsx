"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Building2, ChevronRight, Loader2, MapPin, ShoppingBag, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { MemberVerification } from "@/components/member-verification"
import { BusinessVerification } from "@/components/business-verification"
import { LocationSelector } from "@/components/location-selector"
import { ProduceSelector } from "@/components/produce-selector"

// Step 1: Select buyer type
const buyerTypeSchema = z.object({
  buyerType: z.enum(["individual", "company"], {
    required_error: "Please select a buyer type",
  }),
})

// Step 4: Location/Delivery Point
const locationSchema = z.object({
  county: z.string().min(1, "County is required"),
  subCounty: z.string().min(1, "Sub-county is required"),
  ward: z.string().min(1, "Ward is required"),
  specificLocation: z.string().min(1, "Specific location is required"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
})

// Step 5: Select produce
const produceSchema = z.object({
  interestedProduce: z.array(z.string()).min(1, "Please select at least one produce"),
})

type BuyerTypeValues = z.infer<typeof buyerTypeSchema>
type LocationValues = z.infer<typeof locationSchema>
type ProduceValues = z.infer<typeof produceSchema>

export default function RegisterBuyerPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [buyerCode, setBuyerCode] = useState("")
  const [buyerType, setBuyerType] = useState<"individual" | "company" | null>(null)
  const [verificationData, setVerificationData] = useState<any>(null)
  const [businessData, setBusinessData] = useState<any>(null)
  const [locationData, setLocationData] = useState<LocationValues | null>(null)
  const [produceData, setProduceData] = useState<string[]>([])

  // Initialize forms for different steps
  const buyerTypeForm = useForm<BuyerTypeValues>({
    resolver: zodResolver(buyerTypeSchema),
    defaultValues: {
      buyerType: undefined,
    },
  })

  // Generate buyer code
  const generateBuyerCode = (type: "individual" | "company") => {
    const prefix = type === "individual" ? "AKB-I" : "AKB-C"
    const timestamp = new Date().getTime().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `${prefix}-${timestamp}-${random}`
  }

  // Handle buyer type selection
  function onBuyerTypeSubmit(data: BuyerTypeValues) {
    setBuyerType(data.buyerType)
    const code = generateBuyerCode(data.buyerType)
    setBuyerCode(code)
    setStep(2)
  }

  // Handle individual verification completion
  function onVerificationComplete(data: any) {
    setVerificationData(data)
    setStep(4) // Skip to location after verification
  }

  // Handle business verification completion
  function onBusinessVerificationComplete(data: any) {
    setBusinessData(data)
    setStep(4) // Skip to location after verification
  }

  // Handle location selection
  function onLocationSubmit(data: LocationValues) {
    setLocationData(data)
    setStep(5)
  }

  // Handle produce selection
  function onProduceSubmit(data: ProduceValues) {
    setProduceData(data.interestedProduce)
    setStep(6) // Final step
  }

  // Handle final submission
  async function handleFinalSubmit() {
    setIsSubmitting(true)

    try {
      // Combine all data
      const finalData = {
        buyerCode,
        buyerType,
        ...(buyerType === "individual" ? { individualData: verificationData } : { businessData }),
        location: locationData,
        interestedProduce: produceData,
      }

      console.log("Final registration data:", finalData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirect to success page or dashboard
      router.push("/registration-success?type=buyer&code=" + buyerCode)
    } catch (error) {
      console.error("Registration failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">Buyer Registration</h1>
        <p className="text-sm text-muted-foreground">Step {step} of 6</p>
        <div className="w-full bg-muted h-2 mt-4 rounded-full overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-300 ease-in-out rounded-full"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Buyer Type</CardTitle>
            <CardDescription>Are you registering as an individual or a company?</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...buyerTypeForm}>
              <form onSubmit={buyerTypeForm.handleSubmit(onBuyerTypeSubmit)} className="space-y-6">
                <FormField
                  control={buyerTypeForm.control}
                  name="buyerType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-3"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="individual" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer flex items-center">
                              <User className="mr-2 h-5 w-5 text-primary" />
                              Individual Buyer
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="company" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer flex items-center">
                              <Building2 className="mr-2 h-5 w-5 text-primary" />
                              Company/Business
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Continue
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {step === 2 && buyerType === "individual" && (
        <Card>
          <CardHeader>
            <CardTitle>Verify Your Identity</CardTitle>
            <CardDescription>We need to verify your identity using your national ID</CardDescription>
          </CardHeader>
          <CardContent>
            <MemberVerification onVerificationComplete={onVerificationComplete} />
          </CardContent>
        </Card>
      )}

      {step === 2 && buyerType === "company" && (
        <Card>
          <CardHeader>
            <CardTitle>Business Verification</CardTitle>
            <CardDescription>Enter your business details for verification</CardDescription>
          </CardHeader>
          <CardContent>
            <BusinessVerification onVerificationComplete={onBusinessVerificationComplete} />
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Delivery Location</CardTitle>
            <CardDescription>Where would you like your produce to be delivered?</CardDescription>
          </CardHeader>
          <CardContent>
            <LocationSelector onSubmit={onLocationSubmit} />
          </CardContent>
        </Card>
      )}

      {step === 5 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Produce</CardTitle>
            <CardDescription>What types of produce are you interested in buying?</CardDescription>
          </CardHeader>
          <CardContent>
            <ProduceSelector onSubmit={onProduceSubmit} />
          </CardContent>
        </Card>
      )}

      {step === 6 && (
        <Card>
          <CardHeader>
            <CardTitle>Registration Summary</CardTitle>
            <CardDescription>Review your information before completing registration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-2">Buyer Code</h3>
              <p className="font-mono text-lg">{buyerCode}</p>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-2">Buyer Type</h3>
              <p className="flex items-center">
                {buyerType === "individual" ? (
                  <>
                    <User className="mr-2 h-4 w-4" />
                    Individual
                  </>
                ) : (
                  <>
                    <Building2 className="mr-2 h-4 w-4" />
                    Company/Business
                  </>
                )}
              </p>
            </div>

            {buyerType === "individual" && verificationData && (
              <>
                <Separator />
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">Personal Details</h3>
                  <p>
                    <span className="font-medium">Name:</span> {verificationData.fullName}
                  </p>
                  <p>
                    <span className="font-medium">ID Number:</span> {verificationData.idNumber}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {verificationData.phoneNumber}
                  </p>
                </div>
              </>
            )}

            {buyerType === "company" && businessData && (
              <>
                <Separator />
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">Business Details</h3>
                  <p>
                    <span className="font-medium">Company Name:</span> {businessData.companyName}
                  </p>
                  <p>
                    <span className="font-medium">Registration Number:</span> {businessData.registrationNumber}
                  </p>
                  <p>
                    <span className="font-medium">Contact Person:</span> {businessData.contactPerson}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {businessData.phoneNumber}
                  </p>
                </div>
              </>
            )}

            {locationData && (
              <>
                <Separator />
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">Delivery Location</h3>
                  <p className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-primary" />
                    {locationData.specificLocation}, {locationData.ward}, {locationData.subCounty},{" "}
                    {locationData.county}
                  </p>
                </div>
              </>
            )}

            {produceData.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">Interested Produce</h3>
                  <div className="flex flex-wrap gap-2">
                    {produceData.map((produce) => (
                      <div
                        key={produce}
                        className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs flex items-center"
                      >
                        <ShoppingBag className="mr-1 h-3 w-3" />
                        {produce}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleFinalSubmit} className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Completing Registration...
                </>
              ) : (
                "Complete Registration"
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {step > 1 && step < 6 && (
        <div className="mt-4 flex justify-between">
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={step === 2 && buyerType === "individual" && verificationData}
          >
            Back
          </Button>
          {step === 3 && (
            <Button onClick={() => setStep(4)}>
              Skip <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
