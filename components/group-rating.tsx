"use client"

import { useState } from "react"
import { Star, StarHalf } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface GroupRatingProps {
  groupCode: string
  initialRating?: number
  onRatingSubmit?: (rating: number, feedback: string) => void
  readOnly?: boolean
  showDialog?: boolean
  size?: "sm" | "md" | "lg"
}

export function GroupRating({
  groupCode,
  initialRating = 0,
  onRatingSubmit,
  readOnly = false,
  showDialog = true,
  size = "md",
}: GroupRatingProps) {
  const [rating, setRating] = useState(initialRating)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const starSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  const handleRatingClick = (newRating: number) => {
    if (readOnly) return
    setRating(newRating)

    if (!showDialog) {
      onRatingSubmit?.(newRating, "")
    }
  }

  const handleSubmitRating = async () => {
    if (readOnly) return

    setIsSubmitting(true)
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 800))
      onRatingSubmit?.(rating, feedback)
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error submitting rating:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStar = (position: number) => {
    const isActive = (hoveredRating || rating) >= position
    const isHalfStar = !isActive && (hoveredRating || rating) + 0.5 === position

    return (
      <button
        type="button"
        key={position}
        className={`text-${isActive ? "amber-500" : "gray-300"} ${readOnly ? "cursor-default" : "cursor-pointer"}`}
        onMouseEnter={() => !readOnly && setHoveredRating(position)}
        onMouseLeave={() => !readOnly && setHoveredRating(0)}
        onClick={() => handleRatingClick(position)}
        disabled={readOnly}
      >
        {isHalfStar ? (
          <StarHalf className={`fill-amber-500 ${starSizes[size]}`} />
        ) : (
          <Star className={`${isActive ? "fill-amber-500" : ""} ${starSizes[size]}`} />
        )}
      </button>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(renderStar)}
        <span className="ml-2 text-sm font-medium">{rating > 0 ? rating.toFixed(1) : ""}</span>
      </div>

      {showDialog && !readOnly && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="link" size="sm" className="mt-1 h-auto p-0 text-xs">
              {initialRating > 0 ? "Update Rating" : "Add Rating"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Rate Group {groupCode}</DialogTitle>
              <DialogDescription>
                Share your experience working with this group. Your feedback helps other buyers.
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-center py-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(renderStar)}
                <span className="ml-2 text-sm font-medium">{rating > 0 ? rating.toFixed(1) : ""}</span>
              </div>
            </div>

            <Textarea
              placeholder="Share your experience with this group..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[100px]"
            />

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitRating} disabled={rating === 0 || isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Rating"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
