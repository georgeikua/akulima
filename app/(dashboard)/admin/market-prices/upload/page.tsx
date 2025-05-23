"use client"

import type React from "react"

import { useState, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { AlertCircle, Check, FileSpreadsheet, Loader2, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ProtectedRoute } from "@/components/protected-route"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Form schema
const uploadSchema = z.object({
  source: z.string().min(1, { message: "Please select a data source" }),
  date: z.string().min(1, { message: "Please select a date" }),
  file: z.any().refine((file) => file?.length === 1, { message: "Please select a file" }),
})

type UploadFormValues = z.infer<typeof uploadSchema>

// Sample preview data
const PREVIEW_DATA = [
  { produce: "Tomatoes", market: "Nairobi", price: 85, unit: "kg", date: "2023-06-15" },
  { produce: "Kale", market: "Nairobi", price: 45, unit: "kg", date: "2023-06-15" },
  { produce: "Onions", market: "Nairobi", price: 65, unit: "kg", date: "2023-06-15" },
  { produce: "Potatoes", market: "Nairobi", price: 50, unit: "kg", date: "2023-06-15" },
  { produce: "Cabbage", market: "Nairobi", price: 40, unit: "kg", date: "2023-06-15" },
]

export default function MarketPricesUploadPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "validating" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [previewData, setPreviewData] = useState<typeof PREVIEW_DATA>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      source: "",
      date: new Date().toISOString().split("T")[0],
      file: undefined,
    },
  })

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Reset states
      setUploadStatus("idle")
      setErrorMessage("")
      setPreviewData([])

      // Simulate file parsing and preview
      setTimeout(() => {
        // For demo purposes, just show the sample preview data
        setPreviewData(PREVIEW_DATA)
      }, 500)
    }
  }

  // Handle form submission
  async function onSubmit(data: UploadFormValues) {
    setIsSubmitting(true)
    setUploadStatus("uploading")
    setUploadProgress(0)
    setErrorMessage("")

    try {
      // Simulate file upload with progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200))
        setUploadProgress(i)
      }

      setUploadStatus("validating")

      // Simulate validation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate success
      setUploadStatus("success")
    } catch (error) {
      console.error("Error uploading file:", error)
      setUploadStatus("error")
      setErrorMessage("An error occurred while uploading the file. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upload Market Prices</h1>
          <p className="text-muted-foreground">
            Import market price data from external sources or manual data collection.
          </p>
        </div>

        {uploadStatus === "success" && (
          <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-900/30 dark:text-green-400">
            <Check className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Market price data has been successfully uploaded and processed.</AlertDescription>
          </Alert>
        )}

        {uploadStatus === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Upload Price Data</CardTitle>
            <CardDescription>
              Upload CSV or Excel files containing market price data. The system supports data from AMIS.co.ke and
              manual data collection.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="source"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data Source</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select data source" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="amis">AMIS.co.ke</SelectItem>
                            <SelectItem value="manual">Manual Collection</SelectItem>
                            <SelectItem value="ministry">Ministry of Agriculture</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Select the source of the price data</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>The date when these prices were collected</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="file"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Price Data File</FormLabel>
                      <FormControl>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                          <Input
                            type="file"
                            accept=".csv,.xlsx,.xls"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={(e) => {
                              onChange(e.target.files)
                              handleFileChange(e)
                            }}
                            {...fieldProps}
                          />
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <FileSpreadsheet className="h-8 w-8 text-muted-foreground" />
                            <div className="text-sm text-muted-foreground">
                              Drag and drop your file here, or{" "}
                              <Button
                                type="button"
                                variant="link"
                                className="p-0 h-auto"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                browse
                              </Button>
                            </div>
                            <div className="text-xs text-muted-foreground">Supports CSV and Excel files (max 10MB)</div>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Upload a CSV or Excel file with columns for produce, market, price, unit, and date
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {uploadStatus === "uploading" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}

                {uploadStatus === "validating" && (
                  <div className="flex items-center justify-center space-x-2 text-amber-600 dark:text-amber-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Validating data...</span>
                  </div>
                )}

                {previewData.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Data Preview</h3>
                    <div className="border rounded-md overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Produce</TableHead>
                            <TableHead>Market</TableHead>
                            <TableHead>Price (KES)</TableHead>
                            <TableHead>Unit</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {previewData.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell>{row.produce}</TableCell>
                              <TableCell>{row.market}</TableCell>
                              <TableCell>{row.price}</TableCell>
                              <TableCell>{row.unit}</TableCell>
                              <TableCell>{row.date}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                <Button type="submit" disabled={isSubmitting || uploadStatus === "success"}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {uploadStatus === "uploading" ? "Uploading..." : "Processing..."}
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Price Data
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
