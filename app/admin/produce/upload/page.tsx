"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Download, FileSpreadsheet, Upload } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/navbar"
import { SidebarNav } from "@/components/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const uploadFormSchema = z.object({
  file: z.any().refine((files) => files && files.length > 0, {
    message: "Please select a file to upload.",
  }),
})

const manualFormSchema = z.object({
  csvData: z.string().min(10, {
    message: "CSV data must be at least 10 characters long.",
  }),
})

type UploadFormValues = z.infer<typeof uploadFormSchema>
type ManualFormValues = z.infer<typeof manualFormSchema>

export default function ProduceUploadPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [previewData, setPreviewData] = useState<string[][]>([])

  const uploadForm = useForm<UploadFormValues>({
    resolver: zodResolver(uploadFormSchema),
  })

  const manualForm = useForm<ManualFormValues>({
    resolver: zodResolver(manualFormSchema),
    defaultValues: {
      csvData: "",
    },
  })

  function onUploadSubmit(data: UploadFormValues) {
    setIsUploading(true)
    setUploadSuccess(false)
    setUploadError(null)

    const file = data.file[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const csvData = e.target?.result as string
        processCSVData(csvData)
        setUploadSuccess(true)
      } catch (error) {
        setUploadError("Failed to process the CSV file. Please check the format and try again.")
      } finally {
        setIsUploading(false)
      }
    }

    reader.onerror = () => {
      setUploadError("Failed to read the file. Please try again.")
      setIsUploading(false)
    }

    reader.readAsText(file)
  }

  function onManualSubmit(data: ManualFormValues) {
    setIsUploading(true)
    setUploadSuccess(false)
    setUploadError(null)

    try {
      processCSVData(data.csvData)
      setUploadSuccess(true)
    } catch (error) {
      setUploadError("Failed to process the CSV data. Please check the format and try again.")
    } finally {
      setIsUploading(false)
    }
  }

  function processCSVData(csvData: string) {
    // Parse CSV data
    const rows = csvData.split("\n").map((row) => row.split(",").map((cell) => cell.trim()))
    setPreviewData(rows.slice(0, 10)) // Preview first 10 rows

    // In a real application, you would process and save this data to your database
    console.log("Processing CSV data:", rows.length, "rows")
  }

  const sampleCSVData = `Name,Type,Variety,Grade,Base Price,Unit,Description,Season Start,Season End
Watermelon,Fruit,Sugar Baby,A,400,kg,Sweet and juicy watermelons with bright red flesh,January,April
Tomatoes,Vegetable,Roma,A,120,kg,Medium-sized tomatoes ideal for cooking,March,August
Potatoes,Vegetable,Shangi,B,80,kg,Medium-sized potatoes good for frying and boiling,February,June
Onions,Vegetable,Red Creole,A,90,kg,Large red onions with strong flavor,April,September
Maize,Grain,H614,B,50,kg,Dry maize ready for milling or animal feed,May,August`

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
                  <Link href="/admin/produce">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                  </Link>
                </Button>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Bulk Upload Produce</h1>
                  <p className="text-muted-foreground">Upload multiple produce types at once using CSV format</p>
                </div>
              </div>

              <Tabs defaultValue="upload" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="upload">File Upload</TabsTrigger>
                  <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                  <TabsTrigger value="template">CSV Template</TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Upload CSV File</CardTitle>
                      <CardDescription>Upload a CSV file containing produce data</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...uploadForm}>
                        <form onSubmit={uploadForm.handleSubmit(onUploadSubmit)} className="space-y-6">
                          <FormField
                            control={uploadForm.control}
                            name="file"
                            render={({ field: { onChange, value, ...rest } }) => (
                              <FormItem>
                                <FormLabel>CSV File</FormLabel>
                                <FormControl>
                                  <Input
                                    type="file"
                                    accept=".csv"
                                    onChange={(e) => onChange(e.target.files)}
                                    {...rest}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Upload a CSV file with the following columns: Name, Type, Variety, Grade, Base Price,
                                  Unit, Description, Season Start, Season End
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit" disabled={isUploading}>
                            {isUploading ? (
                              <>
                                <FileSpreadsheet className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload File
                              </>
                            )}
                          </Button>
                        </form>
                      </Form>

                      {uploadSuccess && (
                        <Alert className="mt-6 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          <FileSpreadsheet className="h-4 w-4" />
                          <AlertTitle>Upload Successful</AlertTitle>
                          <AlertDescription>
                            The CSV file has been processed successfully. Preview the data below.
                          </AlertDescription>
                        </Alert>
                      )}

                      {uploadError && (
                        <Alert
                          className="mt-6 bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                          variant="destructive"
                        >
                          <AlertTitle>Upload Failed</AlertTitle>
                          <AlertDescription>{uploadError}</AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>

                  {previewData.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Data Preview</CardTitle>
                        <CardDescription>Preview of the first 10 rows from the uploaded file</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="border-b">
                                {previewData[0].map((header, index) => (
                                  <th key={index} className="p-2 text-left text-sm font-medium">
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {previewData.slice(1).map((row, rowIndex) => (
                                <tr key={rowIndex} className="border-b">
                                  {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} className="p-2 text-sm">
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="ml-auto">Confirm Import</Button>
                      </CardFooter>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="manual" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Manual CSV Entry</CardTitle>
                      <CardDescription>Paste CSV data directly into the text area</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...manualForm}>
                        <form onSubmit={manualForm.handleSubmit(onManualSubmit)} className="space-y-6">
                          <FormField
                            control={manualForm.control}
                            name="csvData"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CSV Data</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Paste CSV data here..."
                                    className="min-h-[300px] font-mono"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Paste CSV data with the following columns: Name, Type, Variety, Grade, Base Price,
                                  Unit, Description, Season Start, Season End
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => manualForm.setValue("csvData", sampleCSVData)}
                            >
                              Load Sample Data
                            </Button>
                            <Button type="submit" disabled={isUploading}>
                              {isUploading ? (
                                <>
                                  <FileSpreadsheet className="mr-2 h-4 w-4 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <Upload className="mr-2 h-4 w-4" />
                                  Process Data
                                </>
                              )}
                            </Button>
                          </div>
                        </form>
                      </Form>

                      {uploadSuccess && (
                        <Alert className="mt-6 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          <FileSpreadsheet className="h-4 w-4" />
                          <AlertTitle>Processing Successful</AlertTitle>
                          <AlertDescription>
                            The CSV data has been processed successfully. Preview the data below.
                          </AlertDescription>
                        </Alert>
                      )}

                      {uploadError && (
                        <Alert
                          className="mt-6 bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                          variant="destructive"
                        >
                          <AlertTitle>Processing Failed</AlertTitle>
                          <AlertDescription>{uploadError}</AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>

                  {previewData.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Data Preview</CardTitle>
                        <CardDescription>Preview of the first 10 rows from the entered data</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="border-b">
                                {previewData[0].map((header, index) => (
                                  <th key={index} className="p-2 text-left text-sm font-medium">
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {previewData.slice(1).map((row, rowIndex) => (
                                <tr key={rowIndex} className="border-b">
                                  {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} className="p-2 text-sm">
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="ml-auto">Confirm Import</Button>
                      </CardFooter>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="template" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>CSV Template</CardTitle>
                      <CardDescription>Download a template CSV file to get started</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Use this template as a starting point for your CSV file. Fill in the data for each produce
                          type and upload the file using the File Upload tab.
                        </p>
                        <div className="rounded-md bg-muted p-4">
                          <pre className="overflow-x-auto whitespace-pre-wrap text-xs">{sampleCSVData}</pre>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="ml-auto">
                        <Download className="mr-2 h-4 w-4" />
                        Download Template
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>CSV Format Instructions</CardTitle>
                      <CardDescription>Guidelines for preparing your CSV file</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Follow these guidelines to ensure your CSV file is properly formatted:
                        </p>
                        <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                          <li>The first row should contain the column headers as shown in the template.</li>
                          <li>Each subsequent row should contain data for one produce type.</li>
                          <li>
                            All fields should be comma-separated. If a field contains commas, enclose it in double
                            quotes.
                          </li>
                          <li>Base Price should be a number without currency symbols (e.g., 400 not KES 400).</li>
                          <li>
                            After uploading, you will have a chance to review the data before confirming the import.
                          </li>
                        </ul>
                      </div>
                    </CardContent>
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
