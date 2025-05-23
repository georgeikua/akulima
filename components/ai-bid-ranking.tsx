"use client"

import { useState, useEffect } from "react"
import { Star, Award, MapPin, Clock, ImageIcon, DollarSign, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Bid {
  id: string
  groupCode: string
  price: number
  quantity: number
  quality: string
  rating: number
  distance: number
  reliability: number
  photoQuality: number
  images: string[]
  notes?: string
  status: "pending" | "accepted" | "rejected"
  submittedAt: string
  aiScore?: number
  scoreBreakdown?: {
    price: number
    distance: number
    rating: number
    reliability: number
    photoQuality: number
  }
  trustTokens?: number
}

interface AIBidRankingProps {
  bids: Bid[]
  onAcceptBid: (bid: Bid) => void
  onRejectBid: (bid: Bid) => void
}

export function AIBidRanking({ bids, onAcceptBid, onRejectBid }: AIBidRankingProps) {
  const [rankedBids, setRankedBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const rankBids = async () => {
      if (!bids.length) {
        setLoading(false)
        return
      }

      setLoading(true)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Calculate AI score for each bid
      const scoredBids = bids.map((bid) => {
        // Calculate score components (0-1 scale)
        const priceScore = calculatePriceScore(bid.price)
        const distanceScore = calculateDistanceScore(bid.distance)
        const ratingScore = bid.rating / 5
        const reliabilityScore = bid.reliability / 100
        const photoQualityScore = bid.photoQuality / 100

        // Weighted score calculation
        const aiScore =
          priceScore * 0.35 +
          distanceScore * 0.15 +
          ratingScore * 0.2 +
          reliabilityScore * 0.2 +
          photoQualityScore * 0.1

        return {
          ...bid,
          aiScore: Number.parseFloat(aiScore.toFixed(2)),
          scoreBreakdown: {
            price: Number.parseFloat((priceScore * 0.35 * 100).toFixed(0)),
            distance: Number.parseFloat((distanceScore * 0.15 * 100).toFixed(0)),
            rating: Number.parseFloat((ratingScore * 0.2 * 100).toFixed(0)),
            reliability: Number.parseFloat((reliabilityScore * 0.2 * 100).toFixed(0)),
            photoQuality: Number.parseFloat((photoQualityScore * 0.1 * 100).toFixed(0)),
          },
        }
      })

      // Sort bids by AI score (descending)
      const sorted = [...scoredBids].sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0))

      setRankedBids(sorted)
      setLoading(false)
    }

    rankBids()
  }, [bids])

  // Helper function to calculate price score (lower price = higher score)
  const calculatePriceScore = (price: number) => {
    // Assuming price range of 20-200 KES
    const minPrice = 20
    const maxPrice = 200
    const normalizedPrice = Math.max(0, Math.min(1, (maxPrice - price) / (maxPrice - minPrice)))
    return normalizedPrice
  }

  // Helper function to calculate distance score (shorter distance = higher score)
  const calculateDistanceScore = (distance: number) => {
    // Assuming distance range of 0-100 km
    const maxDistance = 100
    return Math.max(0, 1 - distance / maxDistance)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">AI Bid Ranking</h3>
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border border-dashed">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!rankedBids.length) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No bids to rank yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">AI Bid Ranking</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm">
                <BarChart3 className="h-4 w-4 mr-1" />
                Ranking Factors
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="font-medium mb-1">AI Ranking Factors:</p>
              <ul className="text-xs space-y-1">
                <li>• Price (35%): Lower price = higher score</li>
                <li>• Group Rating (20%): Higher rating = higher score</li>
                <li>• Reliability (20%): Past delivery performance</li>
                <li>• Distance (15%): Closer = higher score</li>
                <li>• Photo Quality (10%): Better photos = higher score</li>
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {rankedBids.map((bid, index) => (
        <Card key={bid.id} className={index === 0 ? "border-2 border-primary" : ""}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base flex items-center">
                  Group: {bid.groupCode}
                  {bid.trustTokens && bid.trustTokens > 0 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge className="ml-2 bg-amber-100 text-amber-800 border-amber-200">
                            <Award className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
                            {bid.trustTokens} Trust Tokens
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>This group has completed {bid.trustTokens} successful orders</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </CardTitle>
                <CardDescription className="flex items-center">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500 mr-1" />
                  {bid.rating.toFixed(1)} Rating
                  <span className="mx-1">•</span>
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                  {bid.distance} km away
                </CardDescription>
              </div>
              <div className="flex flex-col items-end">
                <Badge className={index === 0 ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                  {index === 0 ? "Top Pick" : `Rank #${index + 1}`}
                </Badge>
                <span className="text-sm font-bold mt-1">KES {bid.price}/kg</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">AI Score</span>
                <span className="font-medium">{(bid.aiScore || 0) * 100}%</span>
              </div>
              <Progress value={(bid.aiScore || 0) * 100} className="h-2" />

              {bid.scoreBreakdown && (
                <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                  <div className="flex items-center">
                    <DollarSign className="h-3 w-3 text-muted-foreground mr-1" />
                    <span className="text-muted-foreground">Price:</span>
                    <span className="ml-auto font-medium">{bid.scoreBreakdown.price}%</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-muted-foreground mr-1" />
                    <span className="text-muted-foreground">Rating:</span>
                    <span className="ml-auto font-medium">{bid.scoreBreakdown.rating}%</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                    <span className="text-muted-foreground">Reliability:</span>
                    <span className="ml-auto font-medium">{bid.scoreBreakdown.reliability}%</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 text-muted-foreground mr-1" />
                    <span className="text-muted-foreground">Distance:</span>
                    <span className="ml-auto font-medium">{bid.scoreBreakdown.distance}%</span>
                  </div>
                  <div className="flex items-center col-span-2">
                    <ImageIcon className="h-3 w-3 text-muted-foreground mr-1" />
                    <span className="text-muted-foreground">Photo Quality:</span>
                    <span className="ml-auto font-medium">{bid.scoreBreakdown.photoQuality}%</span>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-2">
                <Button size="sm" variant="outline" className="text-red-600" onClick={() => onRejectBid(bid)}>
                  Reject
                </Button>
                <Button size="sm" onClick={() => onAcceptBid(bid)}>
                  Accept Bid
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
