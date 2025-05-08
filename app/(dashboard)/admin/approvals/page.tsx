"use client"

import { useState } from "react"
import { Check, Eye, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ProtectedRoute } from "@/components/protected-route"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Sample data for pending approvals
const PENDING_GROUPS = [
  {
    id: "group1",
    name: "Nyeri Farmers Cooperative",
    location: "Nyeri County",
    memberCount: 45,
    primaryProduce: ["Potatoes", "Cabbage"],
    contactPerson: "John Kamau",
    phone: "+254712345678",
    registrationDate: "2023-05-15",
    status: "pending",
    documents: [
      { name: "Registration Certificate", url: "#" },
      { name: "Member List", url: "#" },
    ],
  },
  {
    id: "group2",
    name: "Meru Vegetable Growers",
    location: "Meru County",
    memberCount: 32,
    primaryProduce: ["Tomatoes", "Onions"],
    contactPerson: "Jane Muthoni",
    phone: "+254723456789",
    registrationDate: "2023-05-20",
    status: "pending",
    documents: [
      { name: "Registration Certificate", url: "#" },
      { name: "Member List", url: "#" },
    ],
  },
]

const PENDING_TRANSPORTERS = [
  {
    id: "trans1",
    name: "Quick Movers Ltd",
    owner: "David Ochieng",
    phone: "+254734567890",
    vehicleCount: 5,
    vehicleTypes: ["1 Ton", "3 Ton", "7 Ton"],
    operatingRegions: ["Nairobi", "Central", "Eastern"],
    registrationDate: "2023-05-18",
    status: "pending",
    documents: [
      { name: "Business Registration", url: "#" },
      { name: "Vehicle Insurance", url: "#" },
      { name: "Driver Licenses", url: "#" },
    ],
  },
  {
    id: "trans2",
    name: "Safeway Transport",
    owner: "Sarah Wanjiku",
    phone: "+254745678901",
    vehicleCount: 3,
    vehicleTypes: ["3 Ton", "5 Ton"],
    operatingRegions: ["Nairobi", "Central"],
    registrationDate: "2023-05-22",
    status: "pending",
    documents: [
      { name: "Business Registration", url: "#" },
      { name: "Vehicle Insurance", url: "#" },
      { name: "Driver Licenses", url: "#" },
    ],
  },
]

const PENDING_GRADERS = [
  {
    id: "grader1",
    name: "Quality Assurance Experts",
    owner: "Michael Otieno",
    phone: "+254756789012",
    specialization: ["Vegetables", "Fruits"],
    certifications: ["ISO 9001", "KEBS Certified"],
    experience: "5 years",
    registrationDate: "2023-05-16",
    status: "pending",
    documents: [
      { name: "Business Registration", url: "#" },
      { name: "Certification Documents", url: "#" },
      { name: "Staff Qualifications", url: "#" },
    ],
  },
  {
    id: "grader2",
    name: "Fresh Produce Inspectors",
    owner: "Elizabeth Akinyi",
    phone: "+254767890123",
    specialization: ["Root Vegetables", "Herbs"],
    certifications: ["KEBS Certified"],
    experience: "3 years",
    registrationDate: "2023-05-23",
    status: "pending",
    documents: [
      { name: "Business Registration", url: "#" },
      { name: "Certification Documents", url: "#" },
      { name: "Staff Qualifications", url: "#" },
    ],
  },
]

export default function ApprovalsPage() {
  const [groups, setGroups] = useState(PENDING_GROUPS)
  const [transporters, setTransporters] = useState(PENDING_TRANSPORTERS)
  const [graders, setGraders] = useState(PENDING_GRADERS)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // View details
  const viewDetails = (item: any) => {
    setSelectedItem(item)
    setDetailsOpen(true)
  }

  // Approve item
  const approveItem = async (type: string, id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (type === "group") {
      setGroups(groups.filter((group) => group.id !== id))
      setSuccessMessage(`Group ${id} has been approved successfully.`)
    } else if (type === "transporter") {
      setTransporters(transporters.filter((transporter) => transporter.id !== id))
      setSuccessMessage(`Transporter ${id} has been approved successfully.`)
    } else if (type === "grader") {
      setGraders(graders.filter((grader) => grader.id !== id))
      setSuccessMessage(`Grader ${id} has been approved successfully.`)
    }

    // Close details dialog if open
    if (detailsOpen && selectedItem?.id === id) {
      setDetailsOpen(false)
    }

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("")
    }, 3000)
  }

  // Reject item
  const rejectItem = async (type: string, id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (type === "group") {
      setGroups(groups.filter((group) => group.id !== id))
      setSuccessMessage(`Group ${id} has been rejected.`)
    } else if (type === "transporter") {
      setTransporters(transporters.filter((transporter) => transporter.id !== id))
      setSuccessMessage(`Transporter ${id} has been rejected.`)
    } else if (type === "grader") {
      setGraders(graders.filter((grader) => grader.id !== id))
      setSuccessMessage(`Grader ${id} has been rejected.`)
    }

    // Close details dialog if open
    if (detailsOpen && selectedItem?.id === id) {
      setDetailsOpen(false)
    }

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("")
    }, 3000)
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pending Approvals</h1>
          <p className="text-muted-foreground">
            Review and approve registration requests from groups, transporters, and graders.
          </p>
        </div>

        {successMessage && (
          <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-900/30 dark:text-green-400">
            <Check className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="groups" className="space-y-4">
          <TabsList>
            <TabsTrigger value="groups">
              Groups <Badge className="ml-2">{groups.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="transporters">
              Transporters <Badge className="ml-2">{transporters.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="graders">
              Graders <Badge className="ml-2">{graders.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* Groups Tab */}
          <TabsContent value="groups">
            <Card>
              <CardHeader>
                <CardTitle>Pending Group Approvals</CardTitle>
                <CardDescription>
                  Review and approve farmer group registration requests. Verify documentation and member information
                  before approval.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {groups.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">No pending group approvals at this time.</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Group Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Members</TableHead>
                        <TableHead>Primary Produce</TableHead>
                        <TableHead>Registration Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groups.map((group) => (
                        <TableRow key={group.id}>
                          <TableCell className="font-medium">{group.name}</TableCell>
                          <TableCell>{group.location}</TableCell>
                          <TableCell>{group.memberCount}</TableCell>
                          <TableCell>{group.primaryProduce.join(", ")}</TableCell>
                          <TableCell>{group.registrationDate}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => viewDetails(group)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="default" size="sm" onClick={() => approveItem("group", group.id)}>
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => rejectItem("group", group.id)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transporters Tab */}
          <TabsContent value="transporters">
            <Card>
              <CardHeader>
                <CardTitle>Pending Transporter Approvals</CardTitle>
                <CardDescription>
                  Review and approve transporter registration requests. Verify vehicle documentation and insurance
                  before approval.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {transporters.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No pending transporter approvals at this time.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Vehicles</TableHead>
                        <TableHead>Vehicle Types</TableHead>
                        <TableHead>Operating Regions</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transporters.map((transporter) => (
                        <TableRow key={transporter.id}>
                          <TableCell className="font-medium">{transporter.name}</TableCell>
                          <TableCell>{transporter.owner}</TableCell>
                          <TableCell>{transporter.vehicleCount}</TableCell>
                          <TableCell>{transporter.vehicleTypes.join(", ")}</TableCell>
                          <TableCell>{transporter.operatingRegions.join(", ")}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => viewDetails(transporter)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => approveItem("transporter", transporter.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => rejectItem("transporter", transporter.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Graders Tab */}
          <TabsContent value="graders">
            <Card>
              <CardHeader>
                <CardTitle>Pending Grader Approvals</CardTitle>
                <CardDescription>
                  Review and approve quality control grader registration requests. Verify certifications and
                  qualifications before approval.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {graders.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No pending grader approvals at this time.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Specialization</TableHead>
                        <TableHead>Certifications</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {graders.map((grader) => (
                        <TableRow key={grader.id}>
                          <TableCell className="font-medium">{grader.name}</TableCell>
                          <TableCell>{grader.owner}</TableCell>
                          <TableCell>{grader.specialization.join(", ")}</TableCell>
                          <TableCell>{grader.certifications.join(", ")}</TableCell>
                          <TableCell>{grader.experience}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => viewDetails(grader)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="default" size="sm" onClick={() => approveItem("grader", grader.id)}>
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => rejectItem("grader", grader.id)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Approval Details</DialogTitle>
              <DialogDescription>
                Review detailed information and documentation before making a decision.
              </DialogDescription>
            </DialogHeader>

            {selectedItem && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={`/abstract-geometric-shapes.png?height=64&width=64&query=${selectedItem.name}`} />
                    <AvatarFallback>{selectedItem.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedItem.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedItem.location ||
                        selectedItem.operatingRegions?.join(", ") ||
                        selectedItem.specialization?.join(", ")}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {"contactPerson" in selectedItem && (
                    <>
                      <div>
                        <p className="text-sm font-medium">Contact Person</p>
                        <p>{selectedItem.contactPerson}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <p>{selectedItem.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Member Count</p>
                        <p>{selectedItem.memberCount}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Primary Produce</p>
                        <p>{selectedItem.primaryProduce.join(", ")}</p>
                      </div>
                    </>
                  )}

                  {"owner" in selectedItem && "vehicleCount" in selectedItem && (
                    <>
                      <div>
                        <p className="text-sm font-medium">Owner</p>
                        <p>{selectedItem.owner}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <p>{selectedItem.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Vehicle Count</p>
                        <p>{selectedItem.vehicleCount}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Vehicle Types</p>
                        <p>{selectedItem.vehicleTypes.join(", ")}</p>
                      </div>
                    </>
                  )}

                  {"owner" in selectedItem && "experience" in selectedItem && (
                    <>
                      <div>
                        <p className="text-sm font-medium">Owner</p>
                        <p>{selectedItem.owner}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <p>{selectedItem.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Experience</p>
                        <p>{selectedItem.experience}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Certifications</p>
                        <p>{selectedItem.certifications.join(", ")}</p>
                      </div>
                    </>
                  )}

                  <div className="col-span-2">
                    <p className="text-sm font-medium">Registration Date</p>
                    <p>{selectedItem.registrationDate}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Documents</p>
                  <div className="space-y-2">
                    {selectedItem.documents.map((doc: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                        <span>{doc.name}</span>
                        <Button variant="outline" size="sm" asChild>
                          <a href={doc.url} target="_blank" rel="noopener noreferrer">
                            View
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="default"
                    onClick={() => {
                      const type =
                        "memberCount" in selectedItem
                          ? "group"
                          : "vehicleCount" in selectedItem
                            ? "transporter"
                            : "grader"
                      approveItem(type, selectedItem.id)
                    }}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      const type =
                        "memberCount" in selectedItem
                          ? "group"
                          : "vehicleCount" in selectedItem
                            ? "transporter"
                            : "grader"
                      rejectItem(type, selectedItem.id)
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
