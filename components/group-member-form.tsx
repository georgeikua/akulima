"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Plus, Trash, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MemberVerification } from "@/components/member-verification"

const memberFormSchema = z.object({
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  produce: z.array(z.string()).min(1, {
    message: "Please select at least one produce type.",
  }),
})

type MemberFormValues = z.infer<typeof memberFormSchema>

export type GroupMember = {
  id: string
  fullName: string
  phoneNumber: string
  idNumber: string
  location: string
  gender: string
  age: number
  joinDate: string
  produce: string[]
  mpesaVerified: boolean
}

interface GroupMemberFormProps {
  members: GroupMember[]
  onAddMember: (member: Omit<GroupMember, "id" | "joinDate">) => void
  onRemoveMember: (id: string) => void
}

// Sample produce types
const produceTypes = [
  { value: "tomatoes", label: "Tomatoes" },
  { value: "potatoes", label: "Potatoes" },
  { value: "onions", label: "Onions" },
  { value: "maize", label: "Maize" },
  { value: "beans", label: "Beans" },
  { value: "cabbage", label: "Cabbage" },
  { value: "kale", label: "Kale" },
  { value: "watermelon", label: "Watermelon" },
]

export function GroupMemberForm({ members, onAddMember, onRemoveMember }: GroupMemberFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [verifiedMemberData, setVerifiedMemberData] = useState<any>(null)

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      location: "",
      produce: [],
    },
  })

  // Handle verification completion
  function handleVerificationComplete(data: any) {
    setVerifiedMemberData(data)
  }

  function onSubmit(data: MemberFormValues) {
    if (!verifiedMemberData) {
      return
    }

    onAddMember({
      fullName: verifiedMemberData.fullName,
      phoneNumber: verifiedMemberData.phoneNumber,
      idNumber: verifiedMemberData.idNumber,
      gender: verifiedMemberData.gender,
      age: verifiedMemberData.age,
      location: data.location,
      produce: data.produce,
      mpesaVerified: true,
    })

    form.reset()
    setIsDialogOpen(false)
    setVerifiedMemberData(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Group Members</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[calc(100%-32px)] max-w-[600px] rounded-lg p-4 md:p-6">
            <DialogHeader>
              <DialogTitle>Add Group Member</DialogTitle>
              <DialogDescription>
                Add a new member to your Akulima Group. Only women and youth (males under 35) are eligible.
              </DialogDescription>
            </DialogHeader>

            {!verifiedMemberData ? (
              <MemberVerification onVerificationComplete={handleVerificationComplete} />
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Machakos" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="produce"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Select Produce</FormLabel>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {produceTypes.map((item) => (
                            <FormField
                              key={item.value}
                              control={form.control}
                              name="produce"
                              render={({ field }) => {
                                return (
                                  <FormItem key={item.value} className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.value)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, item.value])
                                            : field.onChange(field.value?.filter((value) => value !== item.value))
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">{item.label}</FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter className="flex-col gap-2 sm:flex-row">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setVerifiedMemberData(null)
                      }}
                      className="w-full sm:w-auto"
                    >
                      Back to Verification
                    </Button>
                    <Button type="submit" className="w-full sm:w-auto">
                      Add Member
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {members.length > 0 ? (
        <div className="overflow-auto">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.fullName}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {member.phoneNumber}
                            {member.mpesaVerified && <CheckCircle className="ml-1 h-3 w-3 text-green-500" />}
                          </div>
                        </TableCell>
                        <TableCell>{member.idNumber}</TableCell>
                        <TableCell className="capitalize">{member.gender}</TableCell>
                        <TableCell>{member.age}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => onRemoveMember(member.id)}>
                            <Trash className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="mb-4 text-center text-muted-foreground">No members added yet.</p>
            <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Member
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
