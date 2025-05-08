"use client"

import { useState } from "react"
import { Plus, Search, UserPlus, Users, Trash2, Edit, MoreHorizontal, Download } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ProtectedRoute } from "@/components/protected-route"

// Form schema for adding/editing members
const memberFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
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
  joinDate: z.string().optional(),
})

type MemberFormValues = z.infer<typeof memberFormSchema>

// Form schema for group details
const groupFormSchema = z.object({
  name: z.string().min(2, {
    message: "Group name must be at least 2 characters.",
  }),
  registrationNumber: z.string().min(2, {
    message: "Registration number must be at least 2 characters.",
  }),
  county: z.string().min(2, {
    message: "County must be at least 2 characters.",
  }),
  subCounty: z.string().min(2, {
    message: "Sub-county must be at least 2 characters.",
  }),
  ward: z.string().min(2, {
    message: "Ward must be at least 2 characters.",
  }),
  contactPerson: z.string().min(2, {
    message: "Contact person must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  description: z.string().optional(),
})

type GroupFormValues = z.infer<typeof groupFormSchema>

// Sample group data
const groupData = {
  name: "Mwangaza Farmers Group",
  location: "Kiambu County",
  registrationNumber: "KFG-2023-1234",
  registrationDate: "2020-03-15",
  memberCount: 25,
  activeMembers: 22,
  chairperson: "John Kamau",
  secretary: "Mary Wanjiku",
  treasurer: "Peter Omondi",
}

// Sample members data
const initialMembers = [
  {
    id: "1",
    name: "John Kamau",
    phone: "0712345678",
    role: "chairperson",
    gender: "male",
    age: 45,
    location: "Kiambu",
    joinDate: "2020-03-15",
    status: "active",
  },
  {
    id: "2",
    name: "Mary Wanjiku",
    phone: "0723456789",
    role: "secretary",
    gender: "female",
    age: 38,
    location: "Kiambu",
    joinDate: "2020-03-15",
    status: "active",
  },
  {
    id: "3",
    name: "Peter Omondi",
    phone: "0734567890",
    role: "treasurer",
    gender: "male",
    age: 42,
    location: "Kiambu",
    joinDate: "2020-03-15",
    status: "active",
  },
  {
    id: "4",
    name: "Jane Muthoni",
    phone: "0745678901",
    role: "member",
    gender: "female",
    age: 35,
    location: "Kiambu",
    joinDate: "2020-05-20",
    status: "active",
  },
  {
    id: "5",
    name: "David Kipchoge",
    phone: "0756789012",
    role: "member",
    gender: "male",
    age: 50,
    location: "Kiambu",
    joinDate: "2020-06-10",
    status: "active",
  },
  {
    id: "6",
    name: "Sarah Akinyi",
    phone: "0767890123",
    role: "member",
    gender: "female",
    age: 29,
    location: "Kiambu",
    joinDate: "2020-08-05",
    status: "inactive",
  },
  {
    id: "7",
    name: "Michael Njoroge",
    phone: "0778901234",
    role: "member",
    gender: "male",
    age: 33,
    location: "Kiambu",
    joinDate: "2021-01-15",
    status: "active",
  },
]

export default function GroupManagementPage() {
  const [members, setMembers] = useState(initialMembers)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  // Initialize form
  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      role: "member",
      gender: "",
      age: undefined,
      location: "",
      joinDate: "",
    },
  })

  const groupForm = useForm<GroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      name: "Wanake Group",
      registrationNumber: "WG-2023-001",
      county: "Machakos",
      subCounty: "Machakos",
      ward: "Machakos Central",
      contactPerson: "Jane Wanjiku",
      phone: "+254712345678",
      email: "wanakegroup@example.com",
      description:
        "A women-led agricultural group focused on growing and selling high-quality produce to local and regional markets.",
    },
  })

  // Handle form submission
  function onSubmit(data: MemberFormValues) {
    if (editingMemberId) {
      // Update existing member
      setMembers(
        members.map((member) =>
          member.id === editingMemberId
            ? {
                ...member,
                ...data,
              }
            : member,
        ),
      )
    } else {
      // Add new member
      const newMember = {
        id: (members.length + 1).toString(),
        ...data,
        status: "active",
      }
      setMembers([...members, newMember])
    }

    // Reset form and close dialog
    form.reset()
    setIsDialogOpen(false)
    setEditingMemberId(null)
  }

  // Handle form submission
  function onGroupFormSubmit(data: GroupFormValues) {
    console.log(data)
    setIsEditing(false)
  }

  // Handle edit member
  function handleEditMember(id: string) {
    const memberToEdit = members.find((member) => member.id === id)
    if (memberToEdit) {
      form.reset(memberToEdit)
      setEditingMemberId(id)
      setIsDialogOpen(true)
    }
  }

  // Handle delete member
  function handleDeleteMember(id: string) {
    setMembers(members.filter((member) => member.id !== id))
  }

  // Handle add new member
  function handleAddMember() {
    form.reset({
      name: "",
      phone: "",
      role: "member",
      gender: "",
      age: undefined,
      location: "",
      joinDate: "",
    })
    setEditingMemberId(null)
    setIsDialogOpen(true)
  }

  // Filter members
  const filteredMembers = members.filter((member) => {
    return (
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm) ||
      member.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Calculate gender distribution
  const genderDistribution = members.reduce(
    (acc, member) => {
      if (member.gender === "male") {
        acc.male += 1
      } else if (member.gender === "female") {
        acc.female += 1
      }
      return acc
    },
    { male: 0, female: 0 },
  )

  // Calculate active vs inactive members
  const statusDistribution = members.reduce(
    (acc, member) => {
      if (member.status === "active") {
        acc.active += 1
      } else if (member.status === "inactive") {
        acc.inactive += 1
      }
      return acc
    },
    { active: 0, inactive: 0 },
  )

  // Calculate group statistics
  const totalMembers = members.length
  const femaleMembers = members.filter((member) => member.gender === "female").length
  const maleMembers = members.filter((member) => member.gender === "male").length
  const femalePercentage = Math.round((femaleMembers / totalMembers) * 100)
  const malePercentage = Math.round((maleMembers / totalMembers) * 100)
  const averageAge = Math.round(members.reduce((sum, member) => sum + member.age, 0) / totalMembers)
  const youthMembers = members.filter((member) => member.age < 35).length
  const youthPercentage = Math.round((youthMembers / totalMembers) * 100)

  return (
    <ProtectedRoute allowedRoles={["group", "admin"]}>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Group Management</h1>
            <p className="text-muted-foreground">Manage your farmer group and members</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddMember}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{members.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {statusDistribution.active} active, {statusDistribution.inactive} inactive
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Gender Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {genderDistribution.male} / {genderDistribution.female}
                  </div>
                  <p className="text-xs text-muted-foreground">Male / Female</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Group Age</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Date().getFullYear() - new Date(groupData.registrationDate).getFullYear()} years
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Established {new Date(groupData.registrationDate).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Group Information</CardTitle>
                  <CardDescription>Details about your farmer group</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Group Name</p>
                        <p>{groupData.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Location</p>
                        <p>{groupData.location}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Registration Number</p>
                        <p>{groupData.registrationNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Registration Date</p>
                        <p>{new Date(groupData.registrationDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Information
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Leadership</CardTitle>
                  <CardDescription>Current group officials</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Chairperson</p>
                        <p>{groupData.chairperson}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Secretary</p>
                        <p>{groupData.secretary}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Treasurer</p>
                        <p>{groupData.treasurer}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm">
                    <Users className="mr-2 h-4 w-4" />
                    Change Leadership
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="members" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={handleAddMember}>
                <Plus className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No members found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">{member.name}</TableCell>
                          <TableCell>{member.phone}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{member.gender.charAt(0).toUpperCase() + member.gender.slice(1)}</TableCell>
                          <TableCell>{member.age}</TableCell>
                          <TableCell>{member.location}</TableCell>
                          <TableCell>
                            <Badge variant={member.status === "active" ? "success" : "secondary"}>
                              {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditMember(member.id)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteMember(member.id)}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium">Payment Distribution</h3>
                  <p className="text-sm text-muted-foreground">Manage payment distributions to group members</p>
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    New Distribution
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium">Group Settings</h3>
                  <p className="text-sm text-muted-foreground">Manage your group settings and preferences</p>
                  <Button className="mt-4">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add/Edit Member Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingMemberId ? "Edit Member" : "Add New Member"}</DialogTitle>
              <DialogDescription>
                {editingMemberId ? "Update the details of the group member." : "Add a new member to your farmer group."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                </div>
                <DialogFooter>
                  <Button type="submit">{editingMemberId ? "Update" : "Add"} Member</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
