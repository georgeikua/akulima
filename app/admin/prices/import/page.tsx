"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, LucideCalendar, Download, FileSpreadsheet, RefreshCw } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/navbar"
import { SidebarNav } from "@/components/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"

const importFormSchema = z.object({
  market: z.string({
    required_error: "Please select a market.",
  }),
  produceType: z.string({
    required_error: "Please select a produce type.",
  }),
  date: z.date({
    required_error: "Please select a date.",
  }),
})

type ImportFormValues = z.infer<typeof importFormSchema>

export default function PriceImportPage() {
  const [isImporting, setIsImporting] = useState(false)
  const [importSuccess, setImportSuccess] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [priceData, setPriceData] = useState<any[]>([])

  const importForm = useForm<ImportFormValues>({
    resolver: zodResolver(importFormSchema),
    defaultValues: {
      market: "",
      produceType: "",
      date: new Date(),
    },
  })

  function onImportSubmit(data: ImportFormValues) {
    setIsImporting(true)
    setImportSuccess(false)
    setImportError(null)

    // In a real application, you would fetch data from AMIS.co.ke API
    // For this example, we'll simulate a successful import with mock data
    setTimeout(() => {
      try {
        const mockData = generateMockPriceData(data.market, data.produceType, data.date)
        setPriceData(mockData)
        setImportSuccess(true)
      } catch (error) {
        setImportError("Failed to import price data. Please try again.")
      } finally {
        setIsImporting(false)
      }
    }, 2000)
  }

  function generateMockPriceData(market: string, produceType: string, date: Date) {
    const formattedDate = format(date, "yyyy-MM-dd")

    // Generate mock data based on the selected parameters
    return [
      {
        date: formattedDate,
        market,
        produce: produceType,
        unit: "kg",
        wholesale_price: Math.floor(Math.random() * 50) + 50,
        retail_price: Math.floor(Math.random() * 100) + 100,
        supply_level: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)],
      },
      {
        date: format(new Date(date.getTime() - 86400000), "yyyy-MM-dd"), // Previous day
        market,
        produce: produceType,
        unit: "kg",
        wholesale_price: Math.floor(Math.random() * 50) + 50,
        retail_price: Math.floor(Math.random() * 100) + 100,
        supply_level: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)],
      },
      {
        date: format(new Date(date.getTime() - 172800000), "yyyy-MM-dd"), // 2 days ago
        market,
        produce: produceType,
        unit: "kg",
        wholesale_price: Math.floor(Math.random() * 50) + 50,
        retail_price: Math.floor(Math.random() * 100) + 100,
        supply_level: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)],
      },
    ]
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1">
          <SidebarNav />
          <main className="flex-1 p-4 md:p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="icon">
                  <Link href="/admin/prices">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                  </Link>
                </Button>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Import Price Data</h1>
                  <p className="text-muted-foreground">Import market price data from AMIS.co.ke</p>
                </div>
              </div>

              <Tabs defaultValue="import" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="import">Import Data</TabsTrigger>
                  <TabsTrigger value="history">Import History</TabsTrigger>
                  <TabsTrigger value="settings">API Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="import" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Import from AMIS.co.ke</CardTitle>
                      <CardDescription>Fetch current market prices from the AMIS Kenya API</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...importForm}>
                        <form onSubmit={importForm.handleSubmit(onImportSubmit)} className="space-y-6">
                          <div className="grid gap-6 sm:grid-cols-3">
                            <FormField
                              control={importForm.control}
                              name="market"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Market</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select market" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="nairobi">Nairobi</SelectItem>
                                      <SelectItem value="mombasa">Mombasa</SelectItem>
                                      <SelectItem value="kisumu">Kisumu</SelectItem>
                                      <SelectItem value="nakuru">Nakuru</SelectItem>
                                      <SelectItem value="eldoret">Eldoret</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={importForm.control}
                              name="produceType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Produce Type</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select produce" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="watermelon">Watermelon</SelectItem>
                                      <SelectItem value="tomatoes">Tomatoes</SelectItem>
                                      <SelectItem value="potatoes">Potatoes</SelectItem>
                                      <SelectItem value="onions">Onions</SelectItem>
                                      <SelectItem value="maize">Maize</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={importForm.control}
                              name="date"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Date</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant={"outline"}
                                          className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground",
                                          )}
                                        >
                                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <LucideCalendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => date > new Date()}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <FormDescription>
                                    Select the date for which you want to import price data.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <Button type="submit" disabled={isImporting}>
                            {isImporting ? (
                              <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Importing...
                              </>
                            ) : (
                              <>
                                <Download className="mr-2 h-4 w-4" />
                                Import Data
                              </>
                            )}
                          </Button>
                        </form>
                      </Form>

                      {importSuccess && (
                        <Alert className="mt-6 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          <FileSpreadsheet className="h-4 w-4" />
                          <AlertTitle>Import Successful</AlertTitle>
                          <AlertDescription>
                            Price data has been successfully imported. Preview the data below.
                          </AlertDescription>
                        </Alert>
                      )}

                      {importError && (
                        <Alert
                          className="mt-6 bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                          variant="destructive"
                        >
                          <AlertTitle>Import Failed</AlertTitle>
                          <AlertDescription>{importError}</AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>

                  {priceData.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Imported Price Data</CardTitle>
                        <CardDescription>Preview of the imported price data</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="border-b">
                                <th className="p-2 text-left text-sm font-medium">Date</th>
                                <th className="p-2 text-left text-sm font-medium">Market</th>
                                <th className="p-2 text-left text-sm font-medium">Produce</th>
                                <th className="p-2 text-left text-sm font-medium">Unit</th>
                                <th className="p-2 text-left text-sm font-medium">Wholesale Price (KES)</th>
                                <th className="p-2 text-left text-sm font-medium">Retail Price (KES)</th>
                                <th className="p-2 text-left text-sm font-medium">Supply Level</th>
                              </tr>
                            </thead>
                            <tbody>
                              {priceData.map((item, index) => (
                                <tr key={index} className="border-b">
                                  <td className="p-2 text-sm">{item.date}</td>
                                  <td className="p-2 text-sm">{item.market}</td>
                                  <td className="p-2 text-sm">{item.produce}</td>
                                  <td className="p-2 text-sm">{item.unit}</td>
                                  <td className="p-2 text-sm">{item.wholesale_price}</td>
                                  <td className="p-2 text-sm">{item.retail_price}</td>
                                  <td className="p-2 text-sm">{item.supply_level}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="ml-auto">Save to Database</Button>
                      </CardFooter>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="history" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Import History</CardTitle>
                      <CardDescription>Recent price data imports</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b">
                              <th className="p-2 text-left text-sm font-medium">Date</th>
                              <th className="p-2 text-left text-sm font-medium">Market</th>
                              <th className="p-2 text-left text-sm font-medium">Produce Types</th>
                              <th className="p-2 text-left text-sm font-medium">Records</th>
                              <th className="p-2 text-left text-sm font-medium">Status</th>
                              <th className="p-2 text-left text-sm font-medium">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="p-2 text-sm">2023-05-15</td>
                              <td className="p-2 text-sm">Nairobi</td>
                              <td className="p-2 text-sm">All</td>
                              <td className="p-2 text-sm">125</td>
                              <td className="p-2 text-sm">
                                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                                  Completed
                                </span>
                              </td>
                              <td className="p-2 text-sm">
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                              </td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2 text-sm">2023-05-10</td>
                              <td className="p-2 text-sm">Mombasa</td>
                              <td className="p-2 text-sm">Fruits</td>
                              <td className="p-2 text-sm">42</td>
                              <td className="p-2 text-sm">
                                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                                  Completed
                                </span>
                              </td>
                              <td className="p-2 text-sm">
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                              </td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2 text-sm">2023-05-05</td>
                              <td className="p-2 text-sm">Kisumu</td>
                              <td className="p-2 text-sm">Vegetables</td>
                              <td className="p-2 text-sm">38</td>
                              <td className="p-2 text-sm">
                                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                                  Completed
                                </span>
                              </td>
                              <td className="p-2 text-sm">
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>API Settings</CardTitle>
                      <CardDescription>Configure AMIS.co.ke API integration</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="api-key">API Key</Label>
                          <Input id="api-key" type="password" value="••••••••••••••••" readOnly />
                          <p className="text-xs text-muted-foreground">
                            Your AMIS.co.ke API key. Contact administrator to update.
                          </p>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="api-url">API URL</Label>
                          <Input id="api-url" value="https://api.amis.co.ke/v1/prices" readOnly />
                          <p className="text-xs text-muted-foreground">The base URL for the AMIS.co.ke API.</p>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="sync-frequency">Sync Frequency</Label>
                          <Select defaultValue="daily">
                            <SelectTrigger id="sync-frequency">
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hourly">Hourly</SelectItem>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="manual">Manual Only</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground">
                            How often to automatically sync price data from AMIS.co.ke.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="ml-auto">Save Settings</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

// Helper component for the date picker
function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {children}
    </label>
  )
}

// Helper component for the date picker
function Calendar({ mode, selected, onSelect, disabled, initialFocus }: any) {
  return (
    <div className="p-3">
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="text-center text-sm font-medium">
              {day}
            </div>
          ))}
          {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
            <Button
              key={day}
              variant="ghost"
              className={cn(
                "h-9 w-9",
                selected && format(selected, "d") === String(day) && "bg-primary text-primary-foreground",
              )}
              onClick={() => {
                const date = new Date()
                date.setDate(day)
                onSelect(date)
              }}
            >
              {day}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
