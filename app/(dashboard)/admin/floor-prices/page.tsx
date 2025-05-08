"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ProtectedRoute } from "@/components/protected-route"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Updated floor prices for fresh perishable produce (in KES per kg)
const INITIAL_FLOOR_PRICES = {
  // Vegetables
  tomatoes: 80,
  kale: 40,
  spinach: 50,
  cabbage: 35,
  onions: 60,
  carrots: 45,
  green_peppers: 90,
  cucumber: 55,

  // Legumes
  green_beans: 70,
  peas: 85,

  // Fruits
  bananas: 60,
  mangoes: 75,
  avocados: 150,
  passion_fruit: 120,
  oranges: 65,
  watermelon: 30,

  // Herbs and Spices
  coriander: 100,
  mint: 120,
  ginger: 180,
  chillies: 150,
}

// Create a dynamic schema based on the produce list
const createFloorPriceSchema = (produceList: string[]) => {
  const schemaFields = produceList.reduce(
    (acc, produce) => {
      acc[produce] = z.string().refine((val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0, {
        message: "Please enter a valid price",
      })
      return acc
    },
    {} as Record<string, z.ZodString>,
  )

  return z.object(schemaFields)
}

const floorPriceSchema = createFloorPriceSchema(Object.keys(INITIAL_FLOOR_PRICES))

type FloorPriceValues = z.infer<typeof floorPriceSchema>

// Group produce by category for better organization
const PRODUCE_CATEGORIES = {
  vegetables: ["tomatoes", "kale", "spinach", "cabbage", "onions", "carrots", "green_peppers", "cucumber"],
  legumes: ["green_beans", "peas"],
  fruits: ["bananas", "mangoes", "avocados", "passion_fruit", "oranges", "watermelon"],
  herbs_spices: ["coriander", "mint", "ginger", "chillies"],
}

export default function FloorPricesPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Convert the numeric values to strings for the form
  const defaultValues: FloorPriceValues = Object.entries(INITIAL_FLOOR_PRICES).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value.toString(),
    }),
    {},
  ) as FloorPriceValues

  const form = useForm<FloorPriceValues>({
    resolver: zodResolver(floorPriceSchema),
    defaultValues,
  })

  async function onSubmit(data: FloorPriceValues) {
    setIsSubmitting(true)
    setSubmitSuccess(false)

    try {
      // Convert string values to numbers
      const numericData = Object.entries(data).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: Number.parseFloat(value),
        }),
        {},
      )

      // Simulate API call to update floor prices
      console.log("Updating floor prices:", numericData)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSubmitSuccess(true)
    } catch (error) {
      console.error("Error updating floor prices:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper function to format produce name for display
  const formatProduceName = (name: string) => {
    return name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Floor Prices</h1>
          <p className="text-muted-foreground">
            Manage minimum floor prices for fresh produce. These prices will be used to validate buyer bid requests.
          </p>
        </div>

        {submitSuccess && (
          <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-900/30 dark:text-green-400">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Floor prices have been updated successfully.</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Fresh Produce Floor Prices</CardTitle>
            <CardDescription>
              Set the minimum price per kilogram for each produce type. Buyers cannot submit bid requests below these
              prices.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs defaultValue="vegetables" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="vegetables">Vegetables</TabsTrigger>
                    <TabsTrigger value="legumes">Legumes</TabsTrigger>
                    <TabsTrigger value="fruits">Fruits</TabsTrigger>
                    <TabsTrigger value="herbs_spices">Herbs & Spices</TabsTrigger>
                  </TabsList>

                  {/* Vegetables Tab */}
                  <TabsContent value="vegetables">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Vegetable</TableHead>
                          <TableHead>Floor Price (KES/kg)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {PRODUCE_CATEGORIES.vegetables.map((produce) => (
                          <TableRow key={produce}>
                            <TableCell className="font-medium">{formatProduceName(produce)}</TableCell>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={produce as keyof FloorPriceValues}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <div className="flex items-center">
                                        <span className="mr-2">KES</span>
                                        <Input type="number" step="0.01" min="0" {...field} className="w-24" />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  {/* Legumes Tab */}
                  <TabsContent value="legumes">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Legume</TableHead>
                          <TableHead>Floor Price (KES/kg)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {PRODUCE_CATEGORIES.legumes.map((produce) => (
                          <TableRow key={produce}>
                            <TableCell className="font-medium">{formatProduceName(produce)}</TableCell>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={produce as keyof FloorPriceValues}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <div className="flex items-center">
                                        <span className="mr-2">KES</span>
                                        <Input type="number" step="0.01" min="0" {...field} className="w-24" />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  {/* Fruits Tab */}
                  <TabsContent value="fruits">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fruit</TableHead>
                          <TableHead>Floor Price (KES/kg)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {PRODUCE_CATEGORIES.fruits.map((produce) => (
                          <TableRow key={produce}>
                            <TableCell className="font-medium">{formatProduceName(produce)}</TableCell>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={produce as keyof FloorPriceValues}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <div className="flex items-center">
                                        <span className="mr-2">KES</span>
                                        <Input type="number" step="0.01" min="0" {...field} className="w-24" />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  {/* Herbs & Spices Tab */}
                  <TabsContent value="herbs_spices">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Herb/Spice</TableHead>
                          <TableHead>Floor Price (KES/kg)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {PRODUCE_CATEGORIES.herbs_spices.map((produce) => (
                          <TableRow key={produce}>
                            <TableCell className="font-medium">{formatProduceName(produce)}</TableCell>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={produce as keyof FloorPriceValues}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <div className="flex items-center">
                                        <span className="mr-2">KES</span>
                                        <Input type="number" step="0.01" min="0" {...field} className="w-24" />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Floor Prices
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
