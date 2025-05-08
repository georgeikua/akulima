"use client"

import { useState } from "react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, Star, Filter } from "lucide-react"

// Mock data for buyers
const mockBuyers = [
  {
    id: "BUY001",
    name: "Nairobi Fresh Foods Ltd",
    email: "procurement@nairobifresh.co.ke",
    phone: "+254712345678",
    location: "Nairobi",
    ordersCount: 24,
    totalVolume: "48 tons",
    totalSpent: "KES 3,840,000",
    trustScore: 4.8,
    status: "active",
    lastOrder: "2023-06-15",
  },
  {
    id: "BUY002",
    name: "Mombasa Grocers Association",
    email: "orders@mombasagrocers.co.ke",
    phone: "+254723456789",
    location: "Mombasa",
    ordersCount: 18,
    totalVolume: "36 tons",
    totalSpent: "KES 2,880,000",
    trustScore: 4.5,
    status: "active",
    lastOrder: "2023-06-10",
  },
  {
    id: "BUY003",
    name: "Kisumu Supermarkets Ltd",
    email: "supply@kisumumarkets.co.ke",
    phone: "+254734567890",
    location: "Kisumu",
    ordersCount: 12,
    totalVolume: "24 tons",
    totalSpent: "KES 1,920,000",
    trustScore: 4.2,
    status: "active",
    lastOrder: "2023-06-05",
  },
  {
    id: "BUY004",
    name: "Nakuru Food Processors",
    email: "buying@nakurufood.co.ke",
    phone: "+254745678901",
    location: "Nakuru",
    ordersCount: 8,
    totalVolume: "16 tons",
    totalSpent: "KES 1,280,000",
    trustScore: 4.0,
    status: "inactive",
    lastOrder: "2023-05-20",
  },
  {
    id: "BUY005",
    name: "Eldoret Wholesale Markets",
    email: "procurement@eldoretwholesale.co.ke",
    phone: "+254756789012",
    location: "Eldoret",
    ordersCount: 6,
    totalVolume: "12 tons",
    totalSpent: "KES 960,000",
    trustScore: 3.8,
    status: "active",
    lastOrder: "2023-06-01",
  },
]

export default function AdminBuyersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  // Filter buyers based on search query and status filter
  const filteredBuyers = mockBuyers.filter((buyer) => {
    const matchesSearch =
      buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buyer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buyer.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === null || buyer.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Buyer Management</h1>
            <p className="text-muted-foreground">Manage and monitor all buyers in the Akulima platform</p>
          </div>
          <Button>Add New Buyer</Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Buyers Overview</CardTitle>
            <CardDescription>Total of {mockBuyers.length} buyers registered on the platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search buyers..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilter(null)}>All</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("active")}>Active</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>Inactive</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Buyer ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Trust Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBuyers.map((buyer) => (
                    <TableRow key={buyer.id}>
                      <TableCell className="font-medium">{buyer.id}</TableCell>
                      <TableCell>{buyer.name}</TableCell>
                      <TableCell>{buyer.location}</TableCell>
                      <TableCell>{buyer.ordersCount}</TableCell>
                      <TableCell>{buyer.totalVolume}</TableCell>
                      <TableCell>{buyer.totalSpent}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>{buyer.trustScore}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={buyer.status === "active" ? "default" : "secondary"}>
                          {buyer.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/buyers/${buyer.id}`}>View Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit Details</DropdownMenuItem>
                            <DropdownMenuItem>View Orders</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
