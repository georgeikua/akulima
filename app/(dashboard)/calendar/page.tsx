"use client"

import { useState } from "react"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import {
  addDays,
  format,
  startOfToday,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isSameMonth,
  add,
  parse,
} from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/lib/auth-context"

// Types
type EventType = "delivery" | "payment" | "inspection" | "bid" | "request"

interface CalendarEvent {
  id: string
  title: string
  date: Date
  type: EventType
  orderCode?: string
  groupCode?: string
  status?: string
  description?: string
}

// Sample events for buyer
const buyerEvents: CalendarEvent[] = [
  {
    id: "evt-001",
    title: "Potato Delivery",
    date: addDays(startOfToday(), 2),
    type: "delivery",
    orderCode: "ORD-123",
    groupCode: "GRP-456",
    status: "scheduled",
    description: "3 tons of Grade A potatoes to be delivered to your warehouse",
  },
  {
    id: "evt-002",
    title: "Quality Inspection",
    date: addDays(startOfToday(), 2),
    type: "inspection",
    orderCode: "ORD-123",
    groupCode: "GRP-456",
    status: "scheduled",
    description: "Quality inspection of potato delivery",
  },
  {
    id: "evt-003",
    title: "Payment Due",
    date: addDays(startOfToday(), 3),
    type: "payment",
    orderCode: "ORD-123",
    groupCode: "GRP-456",
    status: "pending",
    description: "Payment due for potato delivery",
  },
  {
    id: "evt-004",
    title: "Tomato Bid Deadline",
    date: addDays(startOfToday(), 5),
    type: "bid",
    orderCode: "REQ-789",
    status: "active",
    description: "Last day to receive bids for tomato request",
  },
  {
    id: "evt-005",
    title: "Kale Delivery",
    date: addDays(startOfToday(), 7),
    type: "delivery",
    orderCode: "ORD-456",
    groupCode: "GRP-789",
    status: "scheduled",
    description: "500kg of organic kale to be delivered to your restaurant",
  },
  {
    id: "evt-006",
    title: "Watermelon Request Deadline",
    date: addDays(startOfToday(), 10),
    type: "request",
    orderCode: "REQ-101",
    status: "active",
    description: "Deadline for watermelon market request",
  },
]

// Sample events for farmer
const farmerEvents: CalendarEvent[] = [
  {
    id: "evt-101",
    title: "Potato Delivery",
    date: addDays(startOfToday(), 2),
    type: "delivery",
    orderCode: "ORD-123",
    status: "scheduled",
    description: "Deliver 3 tons of Grade A potatoes",
  },
  {
    id: "evt-102",
    title: "Payment Expected",
    date: addDays(startOfToday(), 3),
    type: "payment",
    orderCode: "ORD-123",
    status: "pending",
    description: "Expected payment for potato delivery",
  },
  {
    id: "evt-103",
    title: "Group Meeting",
    date: addDays(startOfToday(), 4),
    type: "request",
    description: "Monthly group meeting to discuss production plans",
  },
]

// Get event badge color based on type
const getEventBadge = (type: EventType) => {
  switch (type) {
    case "delivery":
      return <Badge className="bg-blue-100 text-blue-800">Delivery</Badge>
    case "payment":
      return <Badge className="bg-green-100 text-green-800">Payment</Badge>
    case "inspection":
      return <Badge className="bg-purple-100 text-purple-800">Inspection</Badge>
    case "bid":
      return <Badge className="bg-amber-100 text-amber-800">Bid</Badge>
    case "request":
      return <Badge className="bg-red-100 text-red-800">Request</Badge>
    default:
      return <Badge variant="outline">{type}</Badge>
  }
}

export default function CalendarPage() {
  const { user } = useAuth()
  const today = startOfToday()
  const [selectedDay, setSelectedDay] = useState(today)
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"))

  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date())

  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth, { weekStartsOn: 1 }),
    end: endOfWeek(add(firstDayCurrentMonth, { months: 1, days: -1 }), { weekStartsOn: 1 }),
  })

  function previousMonth() {
    const firstDayPreviousMonth = add(firstDayCurrentMonth, { months: -1 })
    setCurrentMonth(format(firstDayPreviousMonth, "MMM-yyyy"))
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"))
  }

  // Get events based on user role
  const events = user?.role === "buyer" ? buyerEvents : farmerEvents

  // Get events for selected day
  const selectedDayEvents = events.filter((event) => isSameDay(event.date, selectedDay))

  return (
    <ProtectedRoute>
      <div className="space-y-6 pb-16">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            {user?.role === "buyer"
              ? "View your order activities and upcoming events"
              : "View your delivery schedule and group activities"}
          </p>
        </div>

        <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
          <Card className="flex-1">
            <CardHeader className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                  <CardTitle>{format(firstDayCurrentMonth, "MMMM yyyy")}</CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" onClick={previousMonth} className="h-7 w-7">
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous month</span>
                  </Button>
                  <Button variant="outline" size="icon" onClick={nextMonth} className="h-7 w-7">
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next month</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-7 border-b text-center text-xs leading-6 text-muted-foreground">
                <div className="py-2">Mon</div>
                <div className="py-2">Tue</div>
                <div className="py-2">Wed</div>
                <div className="py-2">Thu</div>
                <div className="py-2">Fri</div>
                <div className="py-2">Sat</div>
                <div className="py-2">Sun</div>
              </div>
              <div className="grid grid-cols-7 text-sm">
                {days.map((day, dayIdx) => (
                  <div
                    key={day.toString()}
                    className={cn("py-2", dayIdx === 0 && `pl-[${((day.getDay() + 6) % 7) * 1}]`, "relative")}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      className={cn(
                        "mx-auto flex h-8 w-8 items-center justify-center rounded-full",
                        !isSameMonth(day, firstDayCurrentMonth) && "text-muted-foreground",
                        isSameDay(day, selectedDay) && "bg-primary text-primary-foreground",
                        isToday(day) && !isSameDay(day, selectedDay) && "border border-primary",
                        !isSameDay(day, selectedDay) && "hover:bg-muted",
                      )}
                    >
                      <time dateTime={format(day, "yyyy-MM-dd")}>{format(day, "d")}</time>
                    </button>
                    {events.some((event) => isSameDay(event.date, day)) && (
                      <div className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary"></div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Events for {format(selectedDay, "MMMM d, yyyy")}</CardTitle>
              <CardDescription>
                {isToday(selectedDay) ? "Today's" : ""} scheduled activities and deadlines
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDayEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CalendarIcon className="mb-2 h-12 w-12 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No events scheduled</h3>
                  <p className="text-sm text-muted-foreground">There are no events scheduled for this day.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDayEvents.map((event) => (
                    <div key={event.id} className="rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <div className="mt-1 flex items-center gap-2">
                            {getEventBadge(event.type)}
                            {event.orderCode && (
                              <span className="text-xs text-muted-foreground">
                                {event.type === "bid" || event.type === "request" ? "Request" : "Order"}:{" "}
                                {event.orderCode}
                              </span>
                            )}
                            {event.groupCode && (
                              <span className="text-xs text-muted-foreground">Group: {event.groupCode}</span>
                            )}
                          </div>
                        </div>
                        {event.status && (
                          <Badge variant="outline" className="capitalize">
                            {event.status}
                          </Badge>
                        )}
                      </div>
                      {event.description && <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
