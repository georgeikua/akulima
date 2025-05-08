import Link from "next/link"
import { Clock, MapPin } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface MarketRequestCardProps {
  id: string
  title: string
  buyer: string
  location: string
  quantity: string
  grade: string
  price: number
  deadline: string
  status: "active" | "pending" | "completed" | "cancelled"
}

export function MarketRequestCard({
  id,
  title,
  buyer,
  location,
  quantity,
  grade,
  price,
  deadline,
  status,
}: MarketRequestCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{buyer}</CardDescription>
          </div>
          <Badge
            variant={
              status === "active"
                ? "default"
                : status === "pending"
                  ? "outline"
                  : status === "completed"
                    ? "secondary"
                    : "destructive"
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
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
            <span>{deadline}</span>
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
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button asChild variant="outline">
          <Link href={`/market-requests/${id}/details`}>View Details</Link>
        </Button>
        <Button>Opt In</Button>
      </CardFooter>
    </Card>
  )
}
