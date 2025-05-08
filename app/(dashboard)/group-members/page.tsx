"use client"

import { useState } from "react"
import { Search, Users, Trash2, MoreHorizontal, Filter, CheckCircle, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/lib/auth-context"
import { GroupMemberForm, type GroupMember } from "@/components/group-member-form"

// Sample members data
const initialMembers: GroupMember[] = [
  {
    id: "1",
    fullName: "Jane Wanjiku Muthoni",
    phoneNumber: "0712345678",
    idNumber: "F12345645",
    gender: "Female",
    age: 45,
    location: "Kiambu",
    joinDate: "2020-03-15",
    produce: ["tomatoes", "onions"],
    mpesaVerified: true,
  },
  {
    id: "2",
    fullName: "Mary Akinyi",
    phoneNumber: "0723456789",
    idNumber: "F23456732",
    gender: "Female",
    age: 38,
    location: "Kiambu",
    joinDate: "2020-03-15",
    produce: ["potatoes", "cabbage"],
    mpesaVerified: true,
  },
  {
    id: "3",
    fullName: "George Wanyika Ikua",
    phoneNumber: "0734567890",
    idNumber: "M34567825",
    gender: "Male",
    age: 32,
    location: "Nyeri",
    joinDate: "2020-03-15",
    produce: ["maize", "beans"],
    mpesaVerified: true,
  },
  {
    id: "4",
    fullName: "Sarah Muthoni",
    phoneNumber: "0745678901",
    idNumber: "F45678918",
    gender: "Female",
    age: 35,
    location: "Kiambu",
    joinDate: "2020-05-20",
    produce: ["kale"],
    mpesaVerified: true,
  },
  {
    id: "5",
    fullName: "David Kipchoge",
    phoneNumber: "0756789012",
    idNumber: "M56789028",
    gender: "Male",
    age: 29,
    location: "Kiambu",
    joinDate: "2020-06-10",
    produce: ["watermelon"],
    mpesaVerified: true,
  },
]

export default function GroupMembersPage() {
  const { user } = useAuth()
  const [members, setMembers] = useState<GroupMember[]>(initialMembers)
  const [searchTerm, setSearchTerm] = useState("")
  const [genderFilter, setGenderFilter] = useState<string>("all")
  const [viewMember, setViewMember] = useState<GroupMember | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Handle add new member
  function handleAddMember(member: Omit<GroupMember, "id" | "joinDate">) {
    const newMember: GroupMember = {
      id: (members.length + 1).toString(),
      joinDate: new Date().toISOString().split("T")[0],
      ...member,
    }
    setMembers([...members, newMember])
  }

  // Handle remove member
  function handleRemoveMember(id: string) {
    setMembers(members.filter((member) => member.id !== id))
  }

  // Handle view member details
  function handleViewMember(id: string) {
    const memberToView = members.find((member) => member.id === id)
    if (memberToView) {
      setViewMember(memberToView)
      setIsViewDialogOpen(true)
    }
  }

  // Filter members
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phoneNumber.includes(searchTerm) ||
      member.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.idNumber.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesGender = genderFilter === "all" || member.gender.toLowerCase() === genderFilter.toLowerCase()

    return matchesSearch && matchesGender
  })

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <ProtectedRoute allowedRoles={["group", "admin"]}>
      <div className="space-y-4 pb-16">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Group Members</h1>
            <p className="text-sm text-muted-foreground">Manage members of your Akulima Group</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={genderFilter} onValueChange={setGenderFilter}>
            <SelectTrigger className="w-full sm:w-[130px]">
              <Filter className="mr-2 h-4 w-4" />
              <span>Gender</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="male">Male</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4">
          {filteredMembers.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <p className="mb-4 text-center text-muted-foreground">No members found.</p>
              </CardContent>
            </Card>
          ) : (
            filteredMembers.map((member) => (
              <Card key={member.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={member.fullName} />
                        <AvatarFallback>{getInitials(member.fullName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.fullName}</div>
                        <div className="text-sm text-muted-foreground">{member.location}</div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewMember(member.id)}>
                          <Users className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRemoveMember(member.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">ID: </span>
                      {member.idNumber}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone: </span>
                      {member.phoneNumber}
                      {member.mpesaVerified && (
                        <span className="ml-1 inline-flex items-center text-xs text-green-600">
                          <CheckCircle className="mr-1 h-3 w-3" /> Verified
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-2">
                    <Badge variant="outline" className="capitalize">
                      {member.gender}, {member.age} yrs
                    </Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {member.produce.map((p) => (
                      <span key={p} className="rounded bg-muted px-1.5 py-0.5 text-xs">
                        {p}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Floating Action Button for adding members */}
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="fixed bottom-20 right-4 z-10 h-14 w-14 rounded-full shadow-lg md:bottom-4"
        >
          <Plus className="h-6 w-6" />
          <span className="sr-only">Add Member</span>
        </Button>

        {/* Add Member Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="w-[calc(100%-32px)] max-w-[600px] rounded-lg p-4 md:p-6">
            <DialogHeader>
              <DialogTitle>Add Group Member</DialogTitle>
              <DialogDescription>
                Add a new member to your Akulima Group. Only women and youth (males under 35) are eligible.
              </DialogDescription>
            </DialogHeader>
            <GroupMemberForm
              members={members}
              onAddMember={(member) => {
                handleAddMember(member)
                setIsAddDialogOpen(false)
              }}
              onRemoveMember={handleRemoveMember}
            />
          </DialogContent>
        </Dialog>

        {/* View Member Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="w-[calc(100%-32px)] max-w-[600px] rounded-lg p-4 md:p-6">
            <DialogHeader>
              <DialogTitle>Member Details</DialogTitle>
              <DialogDescription>Detailed information about the group member.</DialogDescription>
            </DialogHeader>
            {viewMember && (
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-4 sm:flex-row">
                  <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                    <AvatarImage src={`/placeholder.svg?height=80&width=80`} alt={viewMember.fullName} />
                    <AvatarFallback className="text-lg">{getInitials(viewMember.fullName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">{viewMember.fullName}</h3>
                    <p className="text-muted-foreground capitalize">
                      {viewMember.gender}, {viewMember.age} years old
                    </p>
                    <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      <span>Verified Member</span>
                    </Badge>
                  </div>
                </div>

                <Tabs defaultValue="info" className="w-full">
                  <TabsList className="w-full">
                    <TabsTrigger value="info" className="flex-1">
                      Personal Info
                    </TabsTrigger>
                    <TabsTrigger value="produce" className="flex-1">
                      Produce
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="info" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ID Number</p>
                        <p>{viewMember.idNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                        <p>{viewMember.phoneNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Location</p>
                        <p>{viewMember.location}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Join Date</p>
                        <p>{viewMember.joinDate}</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="produce" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {viewMember.produce.map((p) => (
                        <div key={p} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <p className="capitalize">{p}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
