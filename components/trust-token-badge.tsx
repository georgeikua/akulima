import { Award } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TrustTokenBadgeProps {
  count: number
  className?: string
  showTooltip?: boolean
}

export function TrustTokenBadge({ count, className, showTooltip = true }: TrustTokenBadgeProps) {
  if (count <= 0) return null

  const badge = (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        "bg-amber-100 text-amber-800 border-amber-200",
        className,
      )}
    >
      <Award className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
      {count} Trust {count === 1 ? "Token" : "Tokens"}
    </div>
  )

  if (!showTooltip) return badge

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent>
          <p>This group has successfully completed {count} orders</p>
          <p className="text-xs text-muted-foreground mt-1">Verified on blockchain</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
