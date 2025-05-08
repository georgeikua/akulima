"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const locationSchema = z.object({
  county: z.string().min(1, "County is required"),
  subCounty: z.string().min(1, "Sub-county is required"),
  ward: z.string().min(1, "Ward is required"),
  specificLocation: z.string().min(1, "Specific location is required"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
})

type LocationValues = z.infer<typeof locationSchema>

interface LocationSelectorProps {
  onSubmit: (data: LocationValues) => void
}

// Mock data for Kenya counties
const counties = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Kiambu", "Uasin Gishu", "Meru"]

// Mock data for sub-counties (simplified)
const subCounties: Record<string, string[]> = {
  Nairobi: ["Westlands", "Dagoretti", "Langata", "Kibra", "Roysambu", "Kasarani", "Ruaraka", "Embakasi"],
  Mombasa: ["Nyali", "Kisauni", "Likoni", "Mvita", "Changamwe", "Jomvu"],
  Kisumu: ["Kisumu East", "Kisumu West", "Kisumu Central", "Seme", "Nyando", "Muhoroni", "Nyakach"],
  Nakuru: ["Nakuru Town East", "Nakuru Town West", "Naivasha", "Gilgil", "Subukia", "Rongai", "Bahati", "Molo"],
  Kiambu: [
    "Kiambu Town",
    "Kiambaa",
    "Githunguri",
    "Ruiru",
    "Thika",
    "Juja",
    "Lari",
    "Limuru",
    "Kikuyu",
    "Kabete",
    "Gatundu",
  ],
  "Uasin Gishu": ["Ainabkoi", "Kapseret", "Kesses", "Moiben", "Soy", "Turbo"],
  Meru: ["Igembe", "Tigania", "North Imenti", "South Imenti", "Central Imenti", "Buuri"],
}

// Mock data for wards (simplified)
const wards: Record<string, string[]> = {
  Westlands: ["Kitisuru", "Parklands", "Karura", "Mountain View", "Kangemi"],
  Dagoretti: ["Kilimani", "Kawangware", "Gatina", "Kileleshwa", "Kabiro"],
  "Kisumu Central": ["Railways", "Migosi", "Kondele", "Shauri Moyo", "Market Milimani"],
  "Nakuru Town East": ["Biashara", "Kivumbini", "Flamingo", "Menengai", "Nakuru East"],
  "Kiambu Town": ["Township", "Riabai", "Ndumberi", "Tinganga"],
  Ainabkoi: ["Kapsoya", "Kaptagat", "Ainabkoi/Olare"],
  "North Imenti": ["Municipality", "Ntima East", "Ntima West", "Nyaki West", "Nyaki East"],
}

export function LocationSelector({ onSubmit }: LocationSelectorProps) {
  const [selectedCounty, setSelectedCounty] = useState<string>("")
  const [selectedSubCounty, setSelectedSubCounty] = useState<string>("")
  const [availableSubCounties, setAvailableSubCounties] = useState<string[]>([])
  const [availableWards, setAvailableWards] = useState<string[]>([])
  const [useCurrentLocation, setUseCurrentLocation] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)

  const form = useForm<LocationValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      county: "",
      subCounty: "",
      ward: "",
      specificLocation: "",
      latitude: "",
      longitude: "",
    },
  })

  // Update sub-counties when county changes
  useEffect(() => {
    if (selectedCounty) {
      setAvailableSubCounties(subCounties[selectedCounty] || [])
      form.setValue("subCounty", "")
      form.setValue("ward", "")
    }
  }, [selectedCounty, form])

  // Update wards when sub-county changes
  useEffect(() => {
    if (selectedSubCounty) {
      setAvailableWards(wards[selectedSubCounty] || [])
      form.setValue("ward", "")
    }
  }, [selectedSubCounty, form])

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLocationLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          form.setValue("latitude", latitude.toString())
          form.setValue("longitude", longitude.toString())
          setLocationLoading(false)
          setUseCurrentLocation(true)
        },
        (error) => {
          console.error("Error getting location:", error)
          setLocationLoading(false)
        },
      )
    } else {
      alert("Geolocation is not supported by this browser.")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="county"
          render={({ field }) => (
            <FormItem>
              <FormLabel>County</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value)
                  setSelectedCounty(value)
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select county" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {counties.map((county) => (
                    <SelectItem key={county} value={county}>
                      {county}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subCounty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sub-County</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value)
                  setSelectedSubCounty(value)
                }}
                value={field.value}
                disabled={!selectedCounty}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sub-county" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableSubCounties.map((subCounty) => (
                    <SelectItem key={subCounty} value={subCounty}>
                      {subCounty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ward"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ward</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={!selectedSubCounty}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ward" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableWards.map((ward) => (
                    <SelectItem key={ward} value={ward}>
                      {ward}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specificLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specific Location</FormLabel>
              <FormControl>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-8" placeholder="Enter specific location or landmark" {...field} />
                </div>
              </FormControl>
              <FormDescription>Enter a specific location, landmark, or street name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center space-x-2">
          <Button type="button" variant="outline" size="sm" onClick={getCurrentLocation} disabled={locationLoading}>
            {locationLoading ? "Getting location..." : "Use Current Location"}
          </Button>
          {useCurrentLocation && <p className="text-xs text-green-600">Location coordinates captured</p>}
        </div>

        <Button type="submit" className="w-full">
          Save Location
        </Button>
      </form>
    </Form>
  )
}
