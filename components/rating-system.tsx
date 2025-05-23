"use client"

import { useState } from "react"
import { Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

interface RatingSystemProps {
  entityId: string
  entityName: string
  entityType: "group" | "buyer"
  initialRating?: number
  onRatingSubmit?: (rating: number, feedback: string) => void
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  buttonSize?: "default" | "sm" | "lg" | "icon"
  buttonText?: string
}

export function RatingSystem({
  entityId,
  entityName,
  entityType,
  initialRating = 5,
  onRatingSubmit,
  buttonVariant = "outline",
  buttonSize = "sm",
  buttonText = "Rate",
}: RatingSystemProps) {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(initialRating)
  const [feedback, setFeedback] = useState("")

  const handleSubmit = () => {
    // Call the onRatingSubmit callback if provided
    if (onRatingSubmit) {
      onRatingSubmit(rating, feedback)
    } else {
      // Default behavior
      toast({
        title: "Rating Submitted",
        description: `You've rated ${entityName} with ${rating} stars.`,
      })
    }

    setOpen(false)
    setFeedback("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} size={buttonSize}>
          <Star className="mr-1 h-3.5 w-3.5" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Rate {entityType === "group" ? "Group" : "Buyer"} {entityName}
          </DialogTitle>
          <DialogDescription>
            Please rate your experience with this {entityType} and provide feedback.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-4">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-8 w-8 cursor-pointer ${
                  star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                }`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
        </div>
        <Textarea
          placeholder={`Share your experience with this ${entityType}...`}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="min-h-[100px]"
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit Rating</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
