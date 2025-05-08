"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { GroupProfile, type GroupMember, type GroupProduce, type GroupGalleryItem } from "@/components/group-profile"

export default function GroupProfilePage({ params }: { params: { id: string } }) {
  const groupId = params.id
  const [isLoading, setIsLoading] = useState(true)

  // In a real application, you would fetch the group details from an API
  // This is mock data for demonstration
  const groupData = {
    id: groupId,
    name: "Nyeri Highlands Farmers Cooperative",
    location: "Nyeri Town",
    county: "Nyeri County",
    established: "2015",
    memberCount: 124,
    contactPhone: "+254712345678",
    contactEmail: "nyerihighlands@example.com",
    description: `The Nyeri Highlands Farmers Cooperative is a community-based organization of smallholder farmers dedicated to sustainable agriculture practices and economic empowerment.

Founded in 2015, our cooperative brings together 124 farmers from the Nyeri highlands region, known for its fertile soil and ideal climate for growing high-quality produce.

We specialize in coffee, tea, and various horticultural crops, implementing modern farming techniques while preserving traditional knowledge. Our members receive training in sustainable farming practices, post-harvest handling, and market access strategies.

Through collective bargaining and direct market linkages, we ensure fair prices for our members' produce while maintaining high quality standards that meet both local and international market requirements.`,
    certifications: ["Organic Certified", "Fair Trade", "GlobalG.A.P"],
    members: [
      {
        id: "1",
        name: "John Kamau",
        role: "Chairperson",
        joinedDate: "Jan 2015",
      },
      {
        id: "2",
        name: "Mary Wanjiku",
        role: "Secretary",
        joinedDate: "Feb 2015",
      },
      {
        id: "3",
        name: "Peter Mwangi",
        role: "Treasurer",
        joinedDate: "Mar 2015",
      },
      {
        id: "4",
        name: "Jane Njeri",
        role: "Member",
        joinedDate: "Apr 2016",
      },
      {
        id: "5",
        name: "James Odhiambo",
        role: "Member",
        joinedDate: "May 2016",
      },
      {
        id: "6",
        name: "Sarah Achieng",
        role: "Member",
        joinedDate: "Jun 2017",
      },
      {
        id: "7",
        name: "David Mutua",
        role: "Member",
        joinedDate: "Jul 2018",
      },
    ] as GroupMember[],
    produce: [
      {
        id: "1",
        name: "Coffee",
        variety: "Arabica SL28",
        seasonality: ["March-May", "October-December"],
        certifications: ["Organic", "Fair Trade"],
      },
      {
        id: "2",
        name: "Tea",
        variety: "Green Tea",
        seasonality: ["Year-round"],
        certifications: ["Rainforest Alliance"],
      },
      {
        id: "3",
        name: "Avocado",
        variety: "Hass",
        seasonality: ["February-August"],
        certifications: ["GlobalG.A.P"],
      },
    ] as GroupProduce[],
    gallery: [
      {
        id: "1",
        url: "/placeholder.svg?height=400&width=600",
        caption: "Coffee plantation during harvest season",
        type: "image",
      },
      {
        id: "2",
        url: "/placeholder.svg?height=400&width=600",
        caption: "Farmers sorting tea leaves",
        type: "image",
      },
      {
        id: "3",
        url: "/placeholder.svg?height=400&width=600",
        caption: "Cooperative annual general meeting",
        type: "image",
      },
      {
        id: "4",
        url: "/placeholder.svg?height=400&width=600",
        caption: "Avocado packaging for export",
        type: "image",
      },
    ] as GroupGalleryItem[],
  }

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center">
          <Button asChild variant="ghost" size="icon" className="mr-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Group Profile</h1>
          </div>
          <nav className="flex items-center gap-2">
            <Button asChild variant="default" size="sm">
              <Link href="/login">Login</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="container py-6">
        <GroupProfile {...groupData} />
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Akulima. All rights reserved.
          </p>
          <nav className="flex gap-4">
            <Link href="/about" className="text-sm text-muted-foreground hover:underline">
              About
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
