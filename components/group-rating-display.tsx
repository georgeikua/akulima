import { Star } from "lucide-react"

interface GroupRatingDisplayProps {
  rating: number
  showValue?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export function GroupRatingDisplay({ rating, showValue = true, size = "md", className = "" }: GroupRatingDisplayProps) {
  // Calculate full and partial stars
  const fullStars = Math.floor(rating)
  const hasPartialStar = rating % 1 !== 0
  const emptyStars = 5 - fullStars - (hasPartialStar ? 1 : 0)

  // Size classes
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  const starSize = sizeClasses[size]
  const textSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }[size]

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className={`${starSize} text-amber-500 fill-amber-500`} />
        ))}

        {/* Partial star */}
        {hasPartialStar && (
          <div className="relative">
            <Star className={`${starSize} text-amber-500 fill-amber-500`} />
            <div
              className="absolute top-0 right-0 bg-white overflow-hidden"
              style={{ width: `${(1 - (rating % 1)) * 100}%`, height: "100%" }}
            >
              <Star className={`${starSize} text-amber-500`} />
            </div>
          </div>
        )}

        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className={`${starSize} text-amber-500`} />
        ))}
      </div>

      {showValue && <span className={`ml-1 font-medium text-amber-600 ${textSize}`}>{rating.toFixed(1)}</span>}
    </div>
  )
}
