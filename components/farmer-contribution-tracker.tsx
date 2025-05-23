"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Download } from "lucide-react"

// Mock data for farmer contributions
interface FarmerContribution {
  farmerId: string
  farmerName: string
  produce: string
  quantity: string
  percentage: number
  earnings: string
  orderId: string
  orderDate: string
  paymentStatus: string
}

const mockContributions: FarmerContribution[] = [
  {
    farmerId: "FRM-001",
    farmerName: "John Mwangi",
    produce: "Potatoes",
    quantity: "1.2 tons",
    percentage: 24,
    earnings: "KES 96,000",
    orderId: "ORD-2023-001",
    orderDate: "2023-06-15",
    paymentStatus: "Paid",
  },
  {
    farmerId: "FRM-002",
    farmerName: "Jane Njeri",
    produce: "Potatoes",
    quantity: "0.8 tons",
    percentage: 16,
    earnings: "KES 64,000",
    orderId: "ORD-2023-001",
    orderDate: "2023-06-15",
    paymentStatus: "Paid",
  },
  {
    farmerId: "FRM-003",
    farmerName: "Peter Kamau",
    produce: "Potatoes",
    quantity: "1.5 tons",
    percentage: 30,
    earnings: "KES 120,000",
    orderId: "ORD-2023-001",
    orderDate: "2023-06-15",
    paymentStatus: "Paid",
  },
  {
    farmerId: "FRM-001",
    farmerName: "John Mwangi",
    produce: "Potatoes",
    quantity: "1.0 tons",
    percentage: 25,
    earnings: "KES 80,000",
    orderId: "ORD-2023-002",
    orderDate: "2023-06-01",
    paymentStatus: "Paid",
  },
  {
    farmerId: "FRM-004",
    farmerName: "Grace Wambui",
    produce: "Potatoes",
    quantity: "1.0 tons",
    percentage: 25,
    earnings: "KES 80,000",
    orderId: "ORD-2023-002",
    orderDate: "2023-06-01",
    paymentStatus: "Paid",
  },
  {
    farmerId: "FRM-005",
    farmerName: "David Kariuki",
    produce: "Potatoes",
    quantity: "2.0 tons",
    percentage: 50,
    earnings: "KES 160,000",
    orderId: "ORD-2023-002",
    orderDate: "2023-06-01",
    paymentStatus: "Paid",
  },
  {
    farmerId: "FRM-001",
    farmerName: "John Mwangi",
    produce: "Potatoes",
    quantity: "2.0 tons",
    percentage: 33.3,
    earnings: "KES 160,000",
    orderId: "ORD-2023-003",
    orderDate: "2023-05-20",
    paymentStatus: "Paid",
  },
  {
    farmerId: "FRM-003",
    farmerName: "Peter Kamau",
    produce: "Potatoes",
    quantity: "2.0 tons",
    percentage: 33.3,
    earnings: "KES 160,000",
    orderId: "ORD-2023-003",
    orderDate: "2023-05-20",
    paymentStatus: "Paid",
  },
  {
    farmerId: "FRM-004",
    farmerName: "Grace Wambui",
    produce: "Potatoes",
    quantity: "2.0 tons",
    percentage: 33.3,
    earnings: "KES 160,000",
    orderId: "ORD-2023-003",
    orderDate: "2023-05-20",
    paymentStatus: "Paid",
  },
]

export function FarmerContributionTracker() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [selectedFarmer, setSelectedFarmer] = useState<string | null>(null)

  // Get unique orders
  const uniqueOrders = Array.from(new Set(mockContributions.map((c) => c.orderId)))

  // Get unique farmers
  const uniqueFarmers = Array.from(new Set(mockContributions.map((c) => c.farmerId))).map((id) => {
    const farmer = mockContributions.find((c) => c.farmerId === id)
    return {
      id,
      name: farmer?.farmerName || "",
    }
  })

  // Filter contributions based on search query and selected filters
  const filteredContributions = mockContributions.filter((contribution) => {
    const matchesSearch =
      contribution.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contribution.farmerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contribution.orderId.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesOrder = selectedOrder === null || contribution.orderId === selectedOrder
    const matchesFarmer = selectedFarmer === null || contribution.farmerId === selectedFarmer

    return matchesSearch && matchesOrder && matchesFarmer
  })

  // Calculate total earnings per farmer
  const farmerEarnings = uniqueFarmers.map((farmer) => {
    const contributions = mockContributions.filter((c) => c.farmerId === farmer.id)
    const totalEarnings = contributions.reduce((sum, c) => {
      return sum + Number.parseInt(c.earnings.replace(/[^0-9]/g, ""))
    }, 0)

    const totalQuantity = contributions.reduce((sum, c) => {
      return sum + Number.parseFloat(c.quantity.split(" ")[0])
    }, 0)

    return {
      ...farmer,
      totalEarnings: `KES ${totalEarnings.toLocaleString()}`,
      totalQuantity: `${totalQuantity.toFixed(1)} tons`,
      contributionCount: contributions.length,
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Farmer Contributions</h2>
          <p className="text-muted-foreground">Track individual farmer contributions and earnings per order</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by farmer name or ID..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={selectedOrder || ""} onValueChange={(value) => setSelectedOrder(value || null)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Orders</SelectItem>
              {uniqueOrders.map((order) => (
                <SelectItem key={order} value={order}>
                  {order}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedFarmer || ""} onValueChange={(value) => setSelectedFarmer(value || null)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by farmer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Farmers</SelectItem>
              {uniqueFarmers.map((farmer) => (
                <SelectItem key={farmer.id} value={farmer.id}>
                  {farmer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {farmerEarnings.slice(0, 3).map((farmer) => (
          <Card key={farmer.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {farmer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{farmer.name}</CardTitle>
                  <CardDescription>{farmer.id}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-sm text-muted-foreground">Total Earnings</div>
                  <div className="font-medium">{farmer.totalEarnings}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total Quantity</div>
                  <div className="font-medium">{farmer.totalQuantity}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Orders</div>
                  <div className="font-medium">{farmer.contributionCount}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contribution History</CardTitle>
          <CardDescription>Detailed breakdown of farmer contributions and earnings per order</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Farmer</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Produce</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Contribution %</TableHead>
                <TableHead>Earnings</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContributions.map((contribution, index) => (
                <TableRow key={`${contribution.farmerId}-${contribution.orderId}-${index}`}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {contribution.farmerName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{contribution.farmerName}</div>
                        <div className="text-xs text-muted-foreground">{contribution.farmerId}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{contribution.orderId}</TableCell>
                  <TableCell>{new Date(contribution.orderDate).toLocaleDateString()}</TableCell>
                  <TableCell>{contribution.produce}</TableCell>
                  <TableCell>{contribution.quantity}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={contribution.percentage} className="h-2 w-16" />
                      <span>{contribution.percentage.toFixed(1)}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{contribution.earnings}</TableCell>
                  <TableCell>
                    <Badge variant={contribution.paymentStatus === "Paid" ? "default" : "outline"}>
                      {contribution.paymentStatus}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
