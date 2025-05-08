"use client"

import { useState, useEffect } from "react"
import { Info, AlertTriangle, CheckCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface AIPriceSuggestionProps {
  produceType: string
  grade: string
  onSuggestedPrice: (price: number) => void
}

export function AIPriceSuggestion({ produceType, grade, onSuggestedPrice }: AIPriceSuggestionProps) {
  const [loading, setLoading] = useState(true)
  const [suggestedPrice, setSuggestedPrice] = useState<number | null>(null)
  const [fairnessRating, setFairnessRating] = useState<"fair" | "unfair" | "exploitative" | null>(null)
  const [fairnessScore, setFairnessScore] = useState<number>(0)
  const [priceRange, setPriceRange] = useState<{ min: number; max: number; avg: number } | null>(null)

  useEffect(() => {
    if (!produceType || !grade) {
      setLoading(false)
      return
    }

    setLoading(true)

    // Mock AI price prediction API call
    const fetchPriceSuggestion = async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock data based on produce type and grade
      const mockPriceData: Record<string, Record<string, any>> = {
        watermelon: {
          A: { suggested: 74, min: 65, max: 80, avg: 72, fairness: 0.92 },
          B: { suggested: 65, min: 60, max: 70, avg: 65, fairness: 0.88 },
          C: { suggested: 55, min: 50, max: 60, avg: 55, fairness: 0.85 },
        },
        tomatoes: {
          A: { suggested: 90, min: 80, max: 100, avg: 90, fairness: 0.95 },
          B: { suggested: 75, min: 70, max: 85, avg: 75, fairness: 0.9 },
          C: { suggested: 60, min: 55, max: 70, avg: 60, fairness: 0.85 },
        },
        potatoes: {
          A: { suggested: 45, min: 40, max: 50, avg: 45, fairness: 0.92 },
          B: { suggested: 35, min: 30, max: 40, avg: 35, fairness: 0.88 },
          C: { suggested: 25, min: 20, max: 30, avg: 25, fairness: 0.82 },
        },
        // Default for any other produce
        default: {
          A: { suggested: 50, min: 45, max: 55, avg: 50, fairness: 0.9 },
          B: { suggested: 40, min: 35, max: 45, avg: 40, fairness: 0.85 },
          C: { suggested: 30, min: 25, max: 35, avg: 30, fairness: 0.8 },
        },
      }

      // Get grade letter only (A, B, C)
      const gradeLetter = grade.charAt(0)

      // Get price data for the produce and grade, or use default
      const priceData = mockPriceData[produceType]?.[gradeLetter] || mockPriceData.default[gradeLetter]

      setSuggestedPrice(priceData.suggested)
      setPriceRange({ min: priceData.min, max: priceData.max, avg: priceData.avg })
      setFairnessScore(priceData.fairness)

      // Set fairness rating based on score
      if (priceData.fairness >= 0.85) {
        setFairnessRating("fair")
      } else if (priceData.fairness >= 0.7) {
        setFairnessRating("unfair")
      } else {
        setFairnessRating("exploitative")
      }

      setLoading(false)
    }

    if (produceType && grade) {
      fetchPriceSuggestion()
    }
  }, [produceType, grade])

  const getFairnessColor = () => {
    if (!fairnessRating) return "bg-gray-200"

    switch (fairnessRating) {
      case "fair":
        return "bg-green-100 text-green-800 border-green-200"
      case "unfair":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "exploitative":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getFairnessIcon = () => {
    if (!fairnessRating) return null

    switch (fairnessRating) {
      case "fair":
        return <CheckCircle className="h-3.5 w-3.5 mr-1" />
      case "unfair":
        return <AlertTriangle className="h-3.5 w-3.5 mr-1" />
      case "exploitative":
        return <AlertTriangle className="h-3.5 w-3.5 mr-1" />
      default:
        return null
    }
  }

  const handleUsePrice = () => {
    if (suggestedPrice) {
      onSuggestedPrice(suggestedPrice)
    }
  }

  if (!produceType || !grade) {
    return null
  }

  return (
    <div className="rounded-lg border p-4 space-y-3 bg-muted/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h4 className="text-sm font-medium">AI Price Suggestion</h4>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  <span className="sr-only">Price suggestion info</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  This price is suggested by our AI based on historical data, current market trends, and seasonality
                  factors.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {fairnessRating && (
          <Badge className={`${getFairnessColor()} flex items-center`}>
            {getFairnessIcon()}
            {fairnessRating.charAt(0).toUpperCase() + fairnessRating.slice(1)} Price
          </Badge>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-full" />
        </div>
      ) : (
        <>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold">KES {suggestedPrice}</span>
            <span className="text-sm text-muted-foreground ml-1">/kg</span>
          </div>

          {priceRange && (
            <div className="text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>
                  Market range: KES {priceRange.min} - {priceRange.max}/kg
                </span>
                <span>Avg: KES {priceRange.avg}/kg</span>
              </div>
              <div className="mt-2 relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                    Fairness Score: {Math.round(fairnessScore * 100)}%
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${fairnessScore * 100}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                      fairnessScore >= 0.85 ? "bg-green-500" : fairnessScore >= 0.7 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <Button variant="outline" size="sm" className="w-full mt-2" onClick={handleUsePrice}>
            Use Suggested Price
          </Button>
        </>
      )}
    </div>
  )
}
