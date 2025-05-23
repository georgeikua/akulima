"use client"

import Link from "next/link"
import { Filter, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MarketRequestCard } from "@/components/market-request-card"
import { useAuth } from "@/lib/auth-context"

const allMarketRequests = [
  {
    id: "req-001",
    title: "Fresh Watermelons",
    buyer: "Metro Supermarket",
    location: "Nairobi",
    quantity: "500 kg",
    grade: "Grade A",
    price: 400,
    deadline: "3 days",
    status: "active",
  },
  {
    id: "req-002",
    title: "Grade A Tomatoes",
    buyer: "Fresh Foods Hotel",
    location: "Nakuru",
    quantity: "200 kg",
    grade: "Grade A",
    price: 120,
    deadline: "5 days",
    status: "active",
  },
  {
    id: "req-003",
    title: "Fresh Potatoes",
    buyer: "Naivas Supermarket",
    location: "Eldoret",
    quantity: "1000 kg",
    grade: "Grade B",
    price: 80,
    deadline: "2 days",
    status: "active",
  },
  {
    id: "req-004",
    title: "Organic Carrots",
    buyer: "Green Earth Restaurant",
    location: "Mombasa",
    quantity: "100 kg",
    grade: "Grade A",
    price: 90,
    deadline: "4 days",
    status: "active",
  },
  {
    id: "req-005",
    title: "Fresh Onions",
    buyer: "Quick Mart",
    location: "Kisumu",
    quantity: "300 kg",
    grade: "Grade B",
    price: 70,
    deadline: "7 days",
    status: "active",
  },
  {
    id: "req-006",
    title: "Sweet Pineapples",
    buyer: "Hilton Hotel",
    location: "Nairobi",
    quantity: "150 kg",
    grade: "Grade A",
    price: 140,
    deadline: "3 days",
    status: "active",
  },
  {
    id: "req-007",
    title: "Watermelons - Second Batch",
    buyer: "Carrefour",
    location: "Nairobi",
    quantity: "400 kg",
    grade: "Grade A",
    price: 380,
    deadline: "5 days",
    status: "pending",
  },
  {
    id: "req-008",
    title: "Ripe Bananas",
    buyer: "Fruity Fresh Ltd",
    location: "Thika",
    quantity: "250 kg",
    grade: "Grade A",
    price: 110,
    deadline: "2 days",
    status: "pending",
  },
  {
    id: "req-009",
    title: "Grade B Tomatoes",
    buyer: "Kwa Mathe Restaurant",
    location: "Machakos",
    quantity: "100 kg",
    grade: "Grade B",
    price: 90,
    deadline: "4 days",
    status: "completed",
  },
] as const

export default function MarketRequestsPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Market Requests</h1>
          <p className="text-muted-foreground">Browse and respond to available market requests from buyers.</p>
        </div>
        {user?.role === "buyer" && (
          <Link href="/post-request">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Post New Request
            </Button>
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-end">
        <div className="grid flex-1 gap-2">
          <label htmlFor="search" className="text-sm font-medium">
            Search
          </label>
          <Input id="search" placeholder="Search by produce, buyer, location..." className="h-9" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="produce-type" className="text-sm font-medium">
            Produce Type
          </label>
          <Select defaultValue="all">
            <SelectTrigger id="produce-type" className="h-9 w-[160px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="watermelon">Watermelon</SelectItem>
              <SelectItem value="tomatoes">Tomatoes</SelectItem>
              <SelectItem value="potatoes">Potatoes</SelectItem>
              <SelectItem value="onions">Onions</SelectItem>
              <SelectItem value="maize">Maize</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <label htmlFor="location" className="text-sm font-medium">
            Location
          </label>
          <Select defaultValue="all">
            <SelectTrigger id="location" className="h-9 w-[160px]">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="nairobi">Nairobi</SelectItem>
              <SelectItem value="mombasa">Mombasa</SelectItem>
              <SelectItem value="kisumu">Kisumu</SelectItem>
              <SelectItem value="nakuru">Nakuru</SelectItem>
              <SelectItem value="eldoret">Eldoret</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <label htmlFor="status" className="text-sm font-medium">
            Status
          </label>
          <Select defaultValue="active">
            <SelectTrigger id="status" className="h-9 w-[160px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
          <Filter className="h-4 w-4" />
          <span className="sr-only">Filter</span>
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {allMarketRequests.map((request) => (
          <MarketRequestCard key={request.id} {...request} />
        ))}
      </div>

      <div className="flex items-center justify-center">
        <Button variant="outline">Load More</Button>
      </div>
    </div>
  )
}
