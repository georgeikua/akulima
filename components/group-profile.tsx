"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { QRCodeSVG } from "qrcode.react"
import { MapPin, Phone, Mail, Users, Calendar, Share2, Download, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

export type GroupMember = {
  id: string
  name: string
  role: string
  joinedDate: string
}

export type GroupProduce = {
  id: string
  name: string
  variety: string
  seasonality: string[]
  certifications: string[]
}

export type GroupGalleryItem = {
  id: string
  url: string
  caption: string
  type: "image" | "video"
}

interface GroupProfileProps {
  id: string
  name: string
  location: string
  county: string
  established: string
  memberCount: number
  contactPhone: string
  contactEmail: string
  description: string
  certifications: string[]
  members: GroupMember[]
  produce: GroupProduce[]
  gallery: GroupGalleryItem[]
}

export function GroupProfile({
  id,
  name,
  location,
  county,
  established,
  memberCount,
  contactPhone,
  contactEmail,
  description,
  certifications,
  members,
  produce,
  gallery,
}: GroupProfileProps) {
  const [showAllMembers, setShowAllMembers] = useState(false)

  // Generate profile URL for sharing
  const profileUrl = typeof window !== "undefined" ? window.location.href : ""

  const handleShareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${name} - Akulima Group Profile`,
          text: `Check out ${name}, a farmer group on Akulima`,
          url: profileUrl,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(profileUrl)
      alert("Profile URL copied to clipboard!")
    }
  }

  const handleDownloadProfile = () => {
    // In a real application, this would generate a PDF
    alert("Downloading group profile as PDF...")
  }

  // Display only the first 5 members if showAllMembers is false
  const displayedMembers = showAllMembers ? members : members.slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="relative h-48 w-full overflow-hidden rounded-xl bg-gradient-to-r from-green-600 to-green-400 sm:h-64">
        {gallery.length > 0 && (
          <Image
            src={gallery[0].url || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover opacity-50"
            priority
          />
        )}
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          <h1 className="text-3xl font-bold">{name}</h1>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <p>
              {location}, {county}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About {name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {certifications.map((cert) => (
                  <Badge key={cert} variant="outline">
                    {cert}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="produce">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="produce">Produce</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
            </TabsList>
            <TabsContent value="produce" className="space-y-4">
              {produce.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">{item.name}</CardTitle>
                    <CardDescription>Variety: {item.variety}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium">Seasonality</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {item.seasonality.map((season) => (
                            <Badge key={season} variant="secondary">
                              {season}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Certifications</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {item.certifications.map((cert) => (
                            <Badge key={cert} variant="outline">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="gallery">
              <Card>
                <CardHeader>
                  <CardTitle>Group Gallery</CardTitle>
                  <CardDescription>Photos and videos of our farm and produce</CardDescription>
                </CardHeader>
                <CardContent>
                  {gallery.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No gallery items available</p>
                  ) : (
                    <Carousel className="w-full">
                      <CarouselContent>
                        {gallery.map((item) => (
                          <CarouselItem key={item.id}>
                            <div className="p-1">
                              <div className="relative aspect-video overflow-hidden rounded-xl">
                                {item.type === "image" ? (
                                  <Image
                                    src={item.url || "/placeholder.svg"}
                                    alt={item.caption}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <video src={item.url} controls className="h-full w-full object-cover" />
                                )}
                              </div>
                              <p className="mt-2 text-sm text-center text-muted-foreground">{item.caption}</p>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${contactPhone}`} className="text-primary hover:underline">
                  {contactPhone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">
                  {contactEmail}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>
                  {location}, {county}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{memberCount} members</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Established {established}</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="space-y-4">
                <QRCodeSVG value={profileUrl} size={150} />
                <p className="text-xs text-center text-muted-foreground">Scan to view this group profile</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleShareProfile} className="flex-1">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownloadProfile} className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Group Members</CardTitle>
              <CardDescription>{memberCount} registered members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {displayedMembers.map((member) => (
                  <div key={member.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Joined {member.joinedDate}</p>
                  </div>
                ))}
                {members.length > 5 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => setShowAllMembers(!showAllMembers)}
                  >
                    {showAllMembers ? "Show Less" : `Show All (${members.length})`}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interested in buying?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Contact us directly or place an order through the Akulima platform.
              </p>
              <Button asChild className="w-full">
                <Link href="/market-requests/new">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Place Order Request
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
