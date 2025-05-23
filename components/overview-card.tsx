import type { LucideIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface OverviewCardProps {
  title: string
  value: string
  description: string
  icon: LucideIcon
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  className?: string
}

export function OverviewCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  className,
}: OverviewCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && trendValue && (
          <div className="mt-2 flex items-center text-xs">
            <span className={cn("mr-1", trend === "up" && "text-emerald-500", trend === "down" && "text-rose-500")}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
            </span>
            <span className={cn(trend === "up" && "text-emerald-500", trend === "down" && "text-rose-500")}>
              {trendValue}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
