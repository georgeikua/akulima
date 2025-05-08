"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ProtectedRoute } from "@/components/protected-route"
import { GroupMemberFormWithVerification } from "@/components/group-member-form-with-verification"

export default function AddGroupMemberPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      console.log("Submitting member data:", data)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock successful submission
      setSubmitSuccess(true)

      // Reset form and redirect after a delay
      setTimeout(() => {
        router.push("/group-members")
      }, 2000)
    } catch (error) {
      console.error("Error adding member:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ProtectedRoute allowedRoles={["group", "admin"]}>
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-4 p-0 flex items-center text-muted-foreground"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold">Add Group Member</h1>
          <p className="text-sm text-muted-foreground">Register a new member to your Akulima Group</p>
        </div>

        {submitSuccess ? (
          <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-900/30 dark:text-green-400">
            <AlertTitle>Member Added Successfully</AlertTitle>
            <AlertDescription>
              The new member has been added to your group. They will receive an SMS notification with their details.
            </AlertDescription>
          </Alert>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Member Information</CardTitle>
              <CardDescription>Enter the details of the new group member</CardDescription>
            </CardHeader>
            <CardContent>
              <GroupMemberFormWithVerification onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  )
}
