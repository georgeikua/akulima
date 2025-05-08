import Link from "next/link"
import { Clock, MapPin, Truck, User } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface OrderCardProps {
  id: string
  title: string
  buyer: string
  location: string
  quantity: string
  grade: string
  price: number
  orderDate: string
  deliveryDate: string
  status: "pending" | "confirmed" | "in_transit" | "delivered" | "completed" | "cancelled"
  progress: number
}

export function OrderCard({
  id,
  title,
  buyer,
  location,
  quantity,
  grade,
  price,
  orderDate,
  deliveryDate,
  status,
  progress,
}: OrderCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "in_transit":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "pending":
        return "Pending"
      case "confirmed":
        return "Confirmed"
      case "in_transit":
        return "In Transit"
      case "delivered":
        return "Delivered"
      case "completed":
        return "Completed"
      case "cancelled":
        return "Cancelled"
      default:
        return status
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{buyer}</CardDescription>
          </div>
          <Badge className={getStatusColor()}>{getStatusText()}</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Delivery: {deliveryDate}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium">Quantity</p>
            <p className="text-sm">{quantity}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Grade</p>
            <p className="text-sm">{grade}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Price (KES)</p>
            <p className="text-sm font-bold text-primary">{price}/kg</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Order Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button asChild variant="outline">
          <Link href={`/orders/${id}/details`}>View Details</Link>
        </Button>
        {status === "in_transit" && (
          <Button>
            <Truck className="mr-2 h-4 w-4" />
            Track Delivery
          </Button>
        )}
        {status === "delivered" && (
          <Button>
            <User className="mr-2 h-4 w-4" />
            Confirm Receipt
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
