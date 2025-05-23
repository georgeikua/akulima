"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Store, User, Truck, Award, ArrowLeft, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"

// Define the user types
type UserType = "group" | "buyer" | "transporter" | "grader"

// User type information with icons and descriptions
const userTypes = [
  {
    id: "group",
    title: "Akulima Group",
    icon: User,
    description: "Register as a farmer group to collectively sell produce at better prices",
    color: "bg-emerald-100 dark:bg-emerald-900/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    borderColor: "border-emerald-200 dark:border-emerald-800",
  },
  {
    id: "buyer",
    title: "Buyer",
    icon: Store,
    description: "Register as a buyer to source fresh produce directly from farmers",
    color: "bg-blue-100 dark:bg-blue-900/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  {
    id: "transporter",
    title: "Transporter",
    icon: Truck,
    description: "Register as a transporter to provide logistics services for produce delivery",
    color: "bg-amber-100 dark:bg-amber-900/20",
    iconColor: "text-amber-600 dark:text-amber-400",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
  {
    id: "grader",
    title: "Grader",
    icon: Award,
    description: "Register as a grader to provide quality assessment services for produce",
    color: "bg-purple-100 dark:bg-purple-900/20",
    iconColor: "text-purple-600 dark:text-purple-400",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
]

// Form schema with conditional fields based on user type
const formSchema = z
  .object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    phone: z.string().min(10, {
      message: "Phone number must be at least 10 characters.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
    userType: z.enum(["group", "buyer", "transporter", "grader"]),
    // Fields specific to different user types
    registrationNumber: z.string().optional(),
    businessType: z.string().optional(),
    vehicleType: z.string().optional(),
    vehicleCapacity: z.string().optional(),
    certificationNumber: z.string().optional(),
    specialization: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type FormValues = z.infer<typeof formSchema>

// Function to generate a unique group code
function generateGroupCode() {
  const prefix = "AKG"
  const year = new Date().getFullYear()
  const randomNum = Math.floor(1000 + Math.random() * 9000) // 4-digit random number
  return `${prefix}-${year}-${randomNum}`
}

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [generatedGroupCode, setGeneratedGroupCode] = useState("")
  const router = useRouter()
  const { login } = useAuth()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      userType: "group",
    },
  })

  // When a user type is selected, update the form
  const handleUserTypeSelect = (type: UserType) => {
    setSelectedUserType(type)
    form.setValue("userType", type)

    // Generate group code if type is group
    if (type === "group") {
      const newGroupCode = generateGroupCode()
      setGeneratedGroupCode(newGroupCode)
      form.setValue("registrationNumber", newGroupCode)
    }
  }

  // Go back to user type selection
  const handleBackToSelection = () => {
    setSelectedUserType(null)
  }

  async function onSubmit(data: FormValues) {
    setIsLoading(true)
    setError(null)

    try {
      // In a real application, you would register the user with an API
      console.log("Registration data:", data)

      // For demo purposes, we'll simulate a successful registration
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Log the user in with the newly created account
      await login(data.email, data.password, data.userType)

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err) {
      setError("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="mb-8 flex flex-col items-center">
        <Image src="/akulima-logo.png" alt="Akulima Logo" width={180} height={50} className="h-12 w-auto" />
        <h1 className="mt-4 text-2xl font-bold">Create an Account</h1>
        <p className="text-center text-muted-foreground">Sign up to join the Akulima platform</p>
      </div>

      {selectedUserType === null ? (
        // User type selection screen
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <CardTitle className="text-center">Choose Account Type</CardTitle>
            <CardDescription className="text-center">Select the type of account you want to create</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {userTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleUserTypeSelect(type.id as UserType)}
                  className={`flex h-full flex-col items-center rounded-lg border p-6 text-center transition-all hover:border-primary hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${type.borderColor} ${type.color}`}
                >
                  <div className={`mb-4 rounded-full p-3 ${type.color}`}>
                    <type.icon className={`h-8 w-8 ${type.iconColor}`} />
                  </div>
                  <h3 className="mb-2 font-medium">{type.title}</h3>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </button>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      ) : (
        // Registration form for selected user type
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 h-8 w-8"
                onClick={handleBackToSelection}
                title="Back to selection"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle>Sign Up as {userTypes.find((t) => t.id === selectedUserType)?.title}</CardTitle>
                <CardDescription>Enter your details to create an account</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Kamau" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+254712345678" {...field} />
                      </FormControl>
                      <FormDescription>This will be used for WhatsApp notifications.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* User type specific fields */}
                {selectedUserType === "group" && (
                  <FormField
                    control={form.control}
                    name="registrationNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Group Registration Number</FormLabel>
                        <FormControl>
                          <Input value={generatedGroupCode} disabled {...field} />
                        </FormControl>
                        <FormDescription>Your auto-generated group code.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {selectedUserType === "buyer" && (
                  <FormField
                    control={form.control}
                    name="businessType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Type</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Supermarket, Restaurant, Hotel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {selectedUserType === "transporter" && (
                  <>
                    <FormField
                      control={form.control}
                      name="vehicleType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vehicle Type</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Pickup, Truck, Van" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="vehicleCapacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vehicle Capacity</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 2 tons, 5000 kg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {selectedUserType === "grader" && (
                  <>
                    <FormField
                      control={form.control}
                      name="certificationNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Certification Number</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., GRD-2023-001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="specialization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specialization</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Fruits, Vegetables, Grains" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input type={showPassword ? "text" : "password"} placeholder="********" {...field} />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-10 w-10"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input type={showConfirmPassword ? "text" : "password"} placeholder="********" {...field} />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-10 w-10"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
