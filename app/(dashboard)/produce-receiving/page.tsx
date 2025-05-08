"use client"

import type React from "react"

import { useState } from "react"
import { Check, Filter, Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Navbar } from "@/components/navbar"
import { SidebarNav } from "@/components/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useAuth } from "@/lib/auth-context"

// Types
type ProduceEntry = {
  id: string
  memberId: string
  memberName: string
  produceType: string
  quantity: number
  unit: string
  qualityGrade: string
  notes: string
  status: "pending" | "accepted" | "partially_accepted" | "rejected"
  acceptedQuantity: number
  rejectionReason?: string
  timestamp: string
}

export default function ProduceReceivingPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("all")
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState("")

  // Form state
  const [formData, setFormData] = useState({
    memberName: "",
    produceType: "",
    quantity: "",
    unit: "kg",
    qualityGrade: "",
    notes: "",
  })

  // Mock data for demonstration
  const [produceEntries, setProduceEntries] = useState<ProduceEntry[]>([
    {
      id: "p1",
      memberId: "m1",
      memberName: "Jane Wanjiku",
      produceType: "Watermelon",
      quantity: 120,
      unit: "kg",
      qualityGrade: "A",
      notes: "Good quality, fresh harvest",
      status: "accepted",
      acceptedQuantity: 120,
      timestamp: "2023-05-16T08:30:00Z",
    },
    {
      id: "p2",
      memberId: "m2",
      memberName: "John Kamau",
      produceType: "Tomatoes",
      quantity: 80,
      unit: "kg",
      qualityGrade: "B",
      notes: "Some tomatoes are overripe",
      status: "partially_accepted",
      acceptedQuantity: 65,
      rejectionReason: "15kg were overripe",
      timestamp: "2023-05-16T09:15:00Z",
    },
    {
      id: "p3",
      memberId: "m3",
      memberName: "Mary Njeri",
      produceType: "Onions",
      quantity: 100,
      unit: "kg",
      qualityGrade: "A",
      notes: "Fresh harvest",
      status: "pending",
      acceptedQuantity: 0,
      timestamp: "2023-05-16T10:00:00Z",
    },
    {
      id: "p4",
      memberId: "m4",
      memberName: "Peter Omondi",
      produceType: "Potatoes",
      quantity: 200,
      unit: "kg",
      qualityGrade: "C",
      notes: "Some potatoes have blight",
      status: "rejected",
      acceptedQuantity: 0,
      rejectionReason: "Poor quality, significant blight damage",
      timestamp: "2023-05-16T11:30:00Z",
    },
  ])

  // Mock group members for demonstration
  const groupMembers = [
    { id: "m1", name: "Jane Wanjiku" },
    { id: "m2", name: "John Kamau" },
    { id: "m3", name: "Mary Njeri" },
    { id: "m4", name: "Peter Omondi" },
    { id: "m5", name: "Sarah Achieng" },
  ]

  // Mock produce types for demonstration
  const produceTypes = ["Watermelon", "Tomatoes", "Onions", "Potatoes", "Cabbage", "Carrots", "Maize"]

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.memberName || !formData.produceType || !formData.quantity || !formData.qualityGrade) {
      alert("Please fill in all required fields")
      return
    }

    // Create new produce entry
    const newEntry: ProduceEntry = {
      id: `p${Date.now()}`,
      memberId: groupMembers.find((m) => m.name === formData.memberName)?.id || "unknown",
      memberName: formData.memberName,
      produceType: formData.produceType,
      quantity: Number(formData.quantity),
      unit: formData.unit,
      qualityGrade: formData.qualityGrade,
      notes: formData.notes,
      status: "pending",
      acceptedQuantity: 0,
      timestamp: new Date().toISOString(),
    }

    // Add to list
    setProduceEntries((prev) => [newEntry, ...prev])

    // Reset form
    setFormData({
      memberName: "",
      produceType: "",
      quantity: "",
      unit: "kg",
      qualityGrade: "",
      notes: "",
    })

    // Hide form
    setShowForm(false)
  }

  // Handle accepting produce
  const handleAcceptProduce = (id: string, acceptedQuantity: number, rejectionReason?: string) => {
    setProduceEntries((prev) =>
      prev.map((entry) => {
        if (entry.id === id) {
          const status =
            acceptedQuantity === 0 ? "rejected" : acceptedQuantity < entry.quantity ? "partially_accepted" : "accepted"

          return {
            ...entry,
            status,
            acceptedQuantity,
            rejectionReason: rejectionReason || undefined,
          }
        }
        return entry
      }),
    )
  }

  // Filter entries based on active tab and search filter
  const filteredEntries = produceEntries.filter((entry) => {
    const matchesTab = activeTab === "all" || entry.status === activeTab
    const matchesFilter =
      filter === "" ||
      entry.memberName.toLowerCase().includes(filter.toLowerCase()) ||
      entry.produceType.toLowerCase().includes(filter.toLowerCase())
    return matchesTab && matchesFilter
  })

  // Get status badge color
  const getStatusBadge = (status: ProduceEntry["status"]) => {
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

  // Check if user is a group or admin
  const canReceiveProduce = user?.role === "group" || user?.role === "admin"
  // Check if user is a grader or admin
  const canGradeProduce = user?.role === "grader" || user?.role === "admin"

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1">
          <SidebarNav userRole={user?.role} />
          <main className="flex-1 p-4 md:p-6">
            <div className="space-y-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Produce Receiving</h1>
                  <p className="text-muted-foreground">Manage produce received from group members</p>
                </div>
                <div className="flex gap-2">
                  {canReceiveProduce && (
                    <Button onClick={() => setShowForm(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Record New Produce
                    </Button>
                  )}
                </div>
              </div>

              {showForm && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Record Produce from Member</CardTitle>
                      <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>Enter details of the produce received from a group member</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form id="produce-form" onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="memberName">Member Name *</Label>
                          <Select
                            name="memberName"
                            value={formData.memberName}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, memberName: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select member" />
                            </SelectTrigger>
                            <SelectContent>
                              {groupMembers.map((member) => (
                                <SelectItem key={member.id} value={member.name}>
                                  {member.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="produceType">Produce Type *</Label>
                          <Select
                            name="produceType"
                            value={formData.produceType}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, produceType: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select produce type" />
                            </SelectTrigger>
                            <SelectContent>
                              {produceTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="quantity">Quantity *</Label>
                          <div className="flex">
                            <Input
                              type="number"
                              id="quantity"
                              name="quantity"
                              value={formData.quantity}
                              onChange={handleInputChange}
                              className="rounded-r-none"
                              min="0"
                              required
                            />
                            <Select
                              name="unit"
                              value={formData.unit}
                              onValueChange={(value) => setFormData((prev) => ({ ...prev, unit: value }))}
                            >
                              <SelectTrigger className="w-[100px] rounded-l-none">
                                <SelectValue placeholder="Unit" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="kg">kg</SelectItem>
                                <SelectItem value="crates">crates</SelectItem>
                                <SelectItem value="bags">bags</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="qualityGrade">Quality Grade *</Label>
                          <Select
                            name="qualityGrade"
                            value={formData.qualityGrade}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, qualityGrade: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select grade" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A">Grade A (Premium)</SelectItem>
                              <SelectItem value="B">Grade B (Standard)</SelectItem>
                              <SelectItem value="C">Grade C (Basic)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          placeholder="Additional details about the produce"
                          rows={3}
                        />
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" form="produce-form">
                      Save Record
                    </Button>
                  </CardFooter>
                </Card>
              )}

              <div className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="pending">Pending</TabsTrigger>
                      <TabsTrigger value="accepted">Accepted</TabsTrigger>
                      <TabsTrigger value="rejected">Rejected</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Filter by member or produce..."
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="w-full sm:w-[250px]"
                    />
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Produce Records</CardTitle>
                    <CardDescription>
                      {activeTab === "all"
                        ? "All produce received from members"
                        : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} produce records`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Member</TableHead>
                          <TableHead>Produce</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Grade</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          {canGradeProduce && <TableHead>Actions</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEntries.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={canGradeProduce ? 7 : 6}
                              className="text-center text-muted-foreground py-6"
                            >
                              No produce records found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredEntries.map((entry) => (
                            <TableRow key={entry.id}>
                              <TableCell className="font-medium">{entry.memberName}</TableCell>
                              <TableCell>{entry.produceType}</TableCell>
                              <TableCell>
                                {entry.quantity} {entry.unit}
                              </TableCell>
                              <TableCell>Grade {entry.qualityGrade}</TableCell>
                              <TableCell>{getStatusBadge(entry.status)}</TableCell>
                              <TableCell className="text-muted-foreground">
                                {new Date(entry.timestamp).toLocaleDateString()}
                              </TableCell>
                              {canGradeProduce && (
                                <TableCell>
                                  {entry.status === "pending" && (
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 text-green-600 hover:text-green-700"
                                        onClick={() => handleAcceptProduce(entry.id, entry.quantity)}
                                      >
                                        <Check className="mr-1 h-3 w-3" />
                                        Accept
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 text-red-600 hover:text-red-700"
                                        onClick={() => {
                                          const reason = prompt("Reason for rejection:")
                                          if (reason !== null) {
                                            handleAcceptProduce(entry.id, 0, reason)
                                          }
                                        }}
                                      >
                                        <X className="mr-1 h-3 w-3" />
                                        Reject
                                      </Button>
                                    </div>
                                  )}
                                </TableCell>
                              )}
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
