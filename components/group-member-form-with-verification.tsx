"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { MemberVerification } from "@/components/member-verification"

// Form schema for adding/editing members
const memberFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  email: z
    .string()
    .email({
      message: "Please enter a valid email address.",
    })
    .optional()
    .or(z.literal("")),
  role: z.string({
    required_error: "Please select a role.",
  }),
  gender: z.string({
    required_error: "Please select a gender.",
  }),
  age: z.coerce.number().int().positive().optional(),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  idNumber: z.string().min(5, {
    message: "ID number must be at least 5 characters.",
  }),
  joinDate: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
})

type MemberFormValues = z.infer<typeof memberFormSchema>

interface GroupMemberFormProps {
  onSubmit: (data: MemberFormValues) => void
  defaultValues?: Partial<MemberFormValues>
  isEditing?: boolean
}

export function GroupMemberFormWithVerification({ onSubmit, defaultValues, isEditing = false }: GroupMemberFormProps) {
  const [verificationStep, setVerificationStep] = useState<"verification" | "details">(
    isEditing ? "details" : "verification",
  )
  const [verificationData, setVerificationData] = useState<any>(null)

  // Initialize form
  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: defaultValues || {
      name: "",
      phone: "",
      email: "",
      role: "member",
      gender: "",
      age: undefined,
      location: "",
      idNumber: "",
      joinDate: new Date().toISOString().split("T")[0],
      status: "active",
    },
  })

  // Handle verification completion
  function handleVerificationComplete(data: any) {
    setVerificationData(data)

    // If OTP verification, update the phone number
    if (data.method === "otp") {
      form.setValue("phone", data.phoneNumber)
    }

    // If ID verification, update the ID number and name
    if (data.method === "id") {
      form.setValue("idNumber", data.idNumber)
      form.setValue("name", data.fullName)
    }

    // Move to the details step
    setVerificationStep("details")
  }

  // Handle form submission
  function handleFormSubmit(data: MemberFormValues) {
    onSubmit({
      ...data,
      verified: true,
      verificationMethod: verificationData?.method || "manual",
    })
  }

  return (
    <div className="space-y-6">
      <Tabs value={verificationStep} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="verification" disabled={verificationStep === "details"}>
            1. Verification
          </TabsTrigger>
          <TabsTrigger value="details" disabled={verificationStep === "verification" && !isEditing}>
            2. Member Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="verification" className="space-y-4 pt-4">
          <MemberVerification onVerificationComplete={handleVerificationComplete} />
        </TabsContent>

        <TabsContent value="details" className="space-y-4 pt-4">
          {verificationData && !isEditing && (
            <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-900/30 dark:text-green-400">
              <Check className="h-4 w-4" />
              <AlertTitle>Verification Successful</AlertTitle>
              <AlertDescription>
                {verificationData.method === "otp"
                  ? `Phone number ${verificationData.phoneNumber} verified successfully.`
                  : `ID verification completed successfully for ${verificationData.fullName}.`}
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., John Kamau" {...field} />
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
                      <FormLabel>ID Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., KE12345678" {...field} />
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
                        <Input placeholder="e.g., 0712345678" {...field} />
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
                      <FormLabel>Email (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="chairperson">Chairperson</SelectItem>
                          <SelectItem value="secretary">Secretary</SelectItem>
                          <SelectItem value="treasurer">Treasurer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Kiambu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="joinDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Join Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit">{isEditing ? "Update" : "Add"} Member</Button>
              </div>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  )
}
