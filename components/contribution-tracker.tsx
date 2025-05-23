"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Check, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"

export type Contribution = {
  id: string
  memberId: string
  memberName: string
  quantity: number
  qualityGrade: string
  status: "pending" | "accepted" | "partially_accepted" | "rejected"
  acceptedQuantity: number
  rejectionReason?: string
  timestamp: string
}

export type Member = {
  id: string
  name: string
  phone: string
}

interface ContributionTrackerProps {
  orderId: string
  orderTitle: string
  requiredQuantity: number
  unit: string
  members: Member[]
  contributions: Contribution[]
  onAddContribution: (contribution: Omit<Contribution, "id" | "timestamp">) => void
  onGradeContribution: (
    id: string,
    status: Contribution["status"],
    acceptedQuantity: number,
    rejectionReason?: string,
  ) => void
}

const contributionFormSchema = z.object({
  memberId: z.string({
    required_error: "Please select a member",
  }),
  quantity: z.coerce
    .number({
      required_error: "Please enter a quantity",
      invalid_type_error: "Quantity must be a number",
    })
    .positive({
      message: "Quantity must be positive",
    }),
  qualityGrade: z.string({
    required_error: "Please select a quality grade",
  }),
})

const gradingFormSchema = z.object({
  status: z.enum(["accepted", "partially_accepted", "rejected"], {
    required_error: "Please select a status",
  }),
  acceptedQuantity: z.coerce
    .number({
      required_error: "Please enter accepted quantity",
      invalid_type_error: "Quantity must be a number",
    })
    .min(0, {
      message: "Accepted quantity cannot be negative",
    }),
  rejectionReason: z.string().optional(),
})

export function ContributionTracker({
  orderId,
  orderTitle,
  requiredQuantity,
  unit,
  members,
  contributions,
  onAddContribution,
  onGradeContribution,
}: ContributionTrackerProps) {
  const [gradingId, setGradingId] = useState<string | null>(null)

  const contributionForm = useForm<z.infer<typeof contributionFormSchema>>({
    resolver: zodResolver(contributionFormSchema),
    defaultValues: {
      memberId: "",
      quantity: 0,
      qualityGrade: "",
    },
  })

  const gradingForm = useForm<z.infer<typeof gradingFormSchema>>({
    resolver: zodResolver(gradingFormSchema),
    defaultValues: {
      status: "accepted",
      acceptedQuantity: 0,
      rejectionReason: "",
    },
  })

  function onContributionSubmit(values: z.infer<typeof contributionFormSchema>) {
    onAddContribution({
      memberId: values.memberId,
      memberName: members.find((m) => m.id === values.memberId)?.name || "Unknown",
      quantity: values.quantity,
      qualityGrade: values.qualityGrade,
      status: "pending",
      acceptedQuantity: 0,
    })
    contributionForm.reset({
      memberId: "",
      quantity: 0,
      qualityGrade: "",
    })
  }

  function onGradingSubmit(values: z.infer<typeof gradingFormSchema>) {
    if (gradingId) {
      onGradeContribution(
        gradingId,
        values.status,
        values.status === "rejected" ? 0 : values.acceptedQuantity,
        values.rejectionReason,
      )
      setGradingId(null)
      gradingForm.reset({
        status: "accepted",
        acceptedQuantity: 0,
        rejectionReason: "",
      })
    }
  }

  function handleStartGrading(contribution: Contribution) {
    setGradingId(contribution.id)
    gradingForm.reset({
      status: contribution.status === "pending" ? "accepted" : contribution.status,
      acceptedQuantity: contribution.acceptedQuantity || contribution.quantity,
      rejectionReason: contribution.rejectionReason || "",
    })
  }

  function handleCancelGrading() {
    setGradingId(null)
    gradingForm.reset({
      status: "accepted",
      acceptedQuantity: 0,
      rejectionReason: "",
    })
  }

  // Calculate total accepted quantity
  const totalAccepted = contributions.reduce((sum, contribution) => {
    return sum + (contribution.status !== "rejected" ? contribution.acceptedQuantity : 0)
  }, 0)

  // Calculate progress percentage
  const progressPercentage = Math.min(Math.round((totalAccepted / requiredQuantity) * 100), 100)

  // Get status badge color
  const getStatusBadge = (status: Contribution["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "accepted":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Accepted</Badge>
      case "partially_accepted":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Partially Accepted</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Fulfillment Progress</CardTitle>
          <CardDescription>
            Order #{orderId} - {orderTitle}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium">Required Quantity</p>
                <p className="text-lg font-bold">
                  {requiredQuantity} {unit}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Collected</p>
                <p className="text-lg font-bold">
                  {totalAccepted} {unit}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Remaining</p>
                <p className="text-lg font-bold text-primary">
                  {Math.max(requiredQuantity - totalAccepted, 0)} {unit}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{progressPercentage}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: `${progressPercentage}%` }}
                  role="progressbar"
                  aria-valuenow={progressPercentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                ></div>
              </div>
            </div>

            {progressPercentage >= 100 && (
              <Alert className="bg-green-50 border-green-200">
                <Check className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Order Fulfilled</AlertTitle>
                <AlertDescription className="text-green-700">
                  The required quantity has been collected and graded.
                </AlertDescription>
              </Alert>
            )}

            {progressPercentage < 100 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Order In Progress</AlertTitle>
                <AlertDescription>
                  {Math.max(requiredQuantity - totalAccepted, 0)} {unit} still needed to complete this order.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Record Member Contribution</CardTitle>
            <CardDescription>Add produce brought by a group member</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...contributionForm}>
              <form onSubmit={contributionForm.handleSubmit(onContributionSubmit)} className="space-y-4">
                <FormField
                  control={contributionForm.control}
                  name="memberId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Member</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a member" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {members.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={contributionForm.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity ({unit})</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={contributionForm.control}
                  name="qualityGrade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quality Grade</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a grade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="A">Grade A</SelectItem>
                          <SelectItem value="B">Grade B</SelectItem>
                          <SelectItem value="C">Grade C</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Record Contribution
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {gradingId && (
          <Card>
            <CardHeader>
              <CardTitle>Grade Contribution</CardTitle>
              <CardDescription>
                Review and grade the produce brought by{" "}
                {contributions.find((c) => c.id === gradingId)?.memberName || "member"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...gradingForm}>
                <form onSubmit={gradingForm.handleSubmit(onGradingSubmit)} className="space-y-4">
                  <FormField
                    control={gradingForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grading Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="accepted">Accept All</SelectItem>
                            <SelectItem value="partially_accepted">Partially Accept</SelectItem>
                            <SelectItem value="rejected">Reject All</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {gradingForm.watch("status") !== "rejected" && (
                    <FormField
                      control={gradingForm.control}
                      name="acceptedQuantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Accepted Quantity ({unit})</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              {...field}
                              disabled={gradingForm.watch("status") === "accepted"}
                            />
                          </FormControl>
                          <FormDescription>
                            {gradingForm.watch("status") === "accepted" &&
                              "Full quantity will be accepted automatically."}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {(gradingForm.watch("status") === "partially_accepted" ||
                    gradingForm.watch("status") === "rejected") && (
                    <FormField
                      control={gradingForm.control}
                      name="rejectionReason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {gradingForm.watch("status") === "rejected"
                              ? "Rejection Reason"
                              : "Partial Acceptance Reason"}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={
                                gradingForm.watch("status") === "rejected"
                                  ? "Explain why the produce was rejected"
                                  : "Explain why only part of the produce was accepted"
                              }
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      Submit Grading
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCancelGrading}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Member Contributions</CardTitle>
          <CardDescription>All recorded contributions for this order</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Quantity ({unit})</TableHead>
                <TableHead>Quality Grade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Accepted</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contributions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-6">
                    No contributions recorded yet
                  </TableCell>
                </TableRow>
              ) : (
                contributions.map((contribution) => (
                  <TableRow key={contribution.id}>
                    <TableCell className="font-medium">{contribution.memberName}</TableCell>
                    <TableCell>{contribution.quantity}</TableCell>
                    <TableCell>Grade {contribution.qualityGrade}</TableCell>
                    <TableCell>{getStatusBadge(contribution.status)}</TableCell>
                    <TableCell>
                      {contribution.status === "rejected"
                        ? "0"
                        : contribution.status === "pending"
                          ? "-"
                          : contribution.acceptedQuantity}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(contribution.timestamp).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {contribution.status === "pending" ? (
                        <Button variant="outline" size="sm" onClick={() => handleStartGrading(contribution)}>
                          Grade
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => handleStartGrading(contribution)}>
                          Update
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            Total accepted: {totalAccepted} {unit} of {requiredQuantity} {unit} required ({progressPercentage}%)
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
