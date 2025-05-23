"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Plus, Save, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ProtectedRoute } from "@/components/protected-route"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample produce categories
const INITIAL_CATEGORIES = [
  { id: "veg", name: "Vegetables", description: "Fresh vegetables including leafy greens and root vegetables" },
  { id: "fruits", name: "Fruits", description: "Fresh fruits including citrus, berries, and tropical varieties" },
  { id: "legumes", name: "Legumes", description: "Beans, peas, and other legumes" },
  { id: "herbs", name: "Herbs & Spices", description: "Fresh herbs and spices for culinary use" },
]

// Sample produce items
const INITIAL_PRODUCE = [
  { id: "tomatoes", name: "Tomatoes", category: "veg", unit: "kg", floorPrice: 80, description: "Fresh ripe tomatoes" },
  { id: "kale", name: "Kale", category: "veg", unit: "kg", floorPrice: 40, description: "Fresh sukuma wiki" },
  { id: "spinach", name: "Spinach", category: "veg", unit: "kg", floorPrice: 50, description: "Fresh spinach leaves" },
  { id: "cabbage", name: "Cabbage", category: "veg", unit: "kg", floorPrice: 35, description: "Fresh cabbage heads" },
  { id: "onions", name: "Onions", category: "veg", unit: "kg", floorPrice: 60, description: "Fresh red onions" },
  { id: "carrots", name: "Carrots", category: "veg", unit: "kg", floorPrice: 45, description: "Fresh carrots" },
  {
    id: "green_peppers",
    name: "Green Peppers",
    category: "veg",
    unit: "kg",
    floorPrice: 90,
    description: "Fresh green bell peppers",
  },
  { id: "cucumber", name: "Cucumber", category: "veg", unit: "kg", floorPrice: 55, description: "Fresh cucumbers" },
  {
    id: "green_beans",
    name: "Green Beans",
    category: "legumes",
    unit: "kg",
    floorPrice: 70,
    description: "Fresh green beans",
  },
  { id: "peas", name: "Peas", category: "legumes", unit: "kg", floorPrice: 85, description: "Fresh green peas" },
  { id: "bananas", name: "Bananas", category: "fruits", unit: "kg", floorPrice: 60, description: "Fresh ripe bananas" },
  { id: "mangoes", name: "Mangoes", category: "fruits", unit: "kg", floorPrice: 75, description: "Fresh mangoes" },
  { id: "avocados", name: "Avocados", category: "fruits", unit: "kg", floorPrice: 150, description: "Fresh avocados" },
  {
    id: "passion_fruit",
    name: "Passion Fruit",
    category: "fruits",
    unit: "kg",
    floorPrice: 120,
    description: "Fresh passion fruits",
  },
  { id: "oranges", name: "Oranges", category: "fruits", unit: "kg", floorPrice: 65, description: "Fresh oranges" },
  {
    id: "watermelon",
    name: "Watermelon",
    category: "fruits",
    unit: "kg",
    floorPrice: 30,
    description: "Fresh watermelons",
  },
  {
    id: "coriander",
    name: "Coriander",
    category: "herbs",
    unit: "kg",
    floorPrice: 100,
    description: "Fresh coriander/dhania",
  },
  { id: "mint", name: "Mint", category: "herbs", unit: "kg", floorPrice: 120, description: "Fresh mint leaves" },
  { id: "ginger", name: "Ginger", category: "herbs", unit: "kg", floorPrice: 180, description: "Fresh ginger root" },
  {
    id: "chillies",
    name: "Chillies",
    category: "herbs",
    unit: "kg",
    floorPrice: 150,
    description: "Fresh hot chillies",
  },
]

// Form schemas
const categorySchema = z.object({
  name: z.string().min(2, { message: "Category name must be at least 2 characters" }),
  description: z.string().optional(),
})

const produceSchema = z.object({
  name: z.string().min(2, { message: "Produce name must be at least 2 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  unit: z.string().min(1, { message: "Please select a unit" }),
  floorPrice: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Floor price must be a positive number",
  }),
  description: z.string().optional(),
})

type CategoryFormValues = z.infer<typeof categorySchema>
type ProduceFormValues = z.infer<typeof produceSchema>

export default function ProduceCategoriesPage() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES)
  const [produce, setProduce] = useState(INITIAL_PRODUCE)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [produceDialogOpen, setProduceDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<(typeof INITIAL_CATEGORIES)[0] | null>(null)
  const [editingProduce, setEditingProduce] = useState<(typeof INITIAL_PRODUCE)[0] | null>(null)

  // Category form
  const categoryForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  // Produce form
  const produceForm = useForm<ProduceFormValues>({
    resolver: zodResolver(produceSchema),
    defaultValues: {
      name: "",
      category: "",
      unit: "kg",
      floorPrice: "",
      description: "",
    },
  })

  // Handle category form submission
  async function onCategorySubmit(data: CategoryFormValues) {
    setIsSubmitting(true)
    setSubmitSuccess(false)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (editingCategory) {
        // Update existing category
        setCategories(
          categories.map((cat) =>
            cat.id === editingCategory.id
              ? {
                  ...cat,
                  name: data.name,
                  description: data.description || "",
                }
              : cat,
          ),
        )
      } else {
        // Add new category
        const newCategory = {
          id: data.name.toLowerCase().replace(/\s+/g, "_"),
          name: data.name,
          description: data.description || "",
        }
        setCategories([...categories, newCategory])
      }

      setSubmitSuccess(true)
      setCategoryDialogOpen(false)
      categoryForm.reset()
      setEditingCategory(null)
    } catch (error) {
      console.error("Error saving category:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle produce form submission
  async function onProduceSubmit(data: ProduceFormValues) {
    setIsSubmitting(true)
    setSubmitSuccess(false)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (editingProduce) {
        // Update existing produce
        setProduce(
          produce.map((prod) =>
            prod.id === editingProduce.id
              ? {
                  ...prod,
                  name: data.name,
                  category: data.category,
                  unit: data.unit,
                  floorPrice: Number(data.floorPrice),
                  description: data.description || "",
                }
              : prod,
          ),
        )
      } else {
        // Add new produce
        const newProduce = {
          id: data.name.toLowerCase().replace(/\s+/g, "_"),
          name: data.name,
          category: data.category,
          unit: data.unit,
          floorPrice: Number(data.floorPrice),
          description: data.description || "",
        }
        setProduce([...produce, newProduce])
      }

      setSubmitSuccess(true)
      setProduceDialogOpen(false)
      produceForm.reset()
      setEditingProduce(null)
    } catch (error) {
      console.error("Error saving produce:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Edit category
  function editCategory(category: (typeof INITIAL_CATEGORIES)[0]) {
    setEditingCategory(category)
    categoryForm.reset({
      name: category.name,
      description: category.description,
    })
    setCategoryDialogOpen(true)
  }

  // Edit produce
  function editProduce(prod: (typeof INITIAL_PRODUCE)[0]) {
    setEditingProduce(prod)
    produceForm.reset({
      name: prod.name,
      category: prod.category,
      unit: prod.unit,
      floorPrice: prod.floorPrice.toString(),
      description: prod.description,
    })
    setProduceDialogOpen(true)
  }

  // Delete category
  async function deleteCategory(categoryId: string) {
    if (confirm("Are you sure you want to delete this category? This will also delete all produce in this category.")) {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Remove category
      setCategories(categories.filter((cat) => cat.id !== categoryId))

      // Remove all produce in this category
      setProduce(produce.filter((prod) => prod.category !== categoryId))

      setSubmitSuccess(true)
    }
  }

  // Delete produce
  async function deleteProduce(produceId: string) {
    if (confirm("Are you sure you want to delete this produce item?")) {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Remove produce
      setProduce(produce.filter((prod) => prod.id !== produceId))

      setSubmitSuccess(true)
    }
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produce Categories & Price Floors</h1>
          <p className="text-muted-foreground">
            Manage produce categories, items, and set minimum floor prices for each produce type.
          </p>
        </div>

        {submitSuccess && (
          <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-900/30 dark:text-green-400">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Your changes have been saved successfully.</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="categories" className="space-y-4">
          <TabsList>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="produce">Produce Items</TabsTrigger>
          </TabsList>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setEditingCategory(null)
                      categoryForm.reset({
                        name: "",
                        description: "",
                      })
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
                    <DialogDescription>
                      {editingCategory
                        ? "Update the details of this produce category."
                        : "Add a new produce category to organize your produce items."}
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...categoryForm}>
                    <form onSubmit={categoryForm.handleSubmit(onCategorySubmit)} className="space-y-4">
                      <FormField
                        control={categoryForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Vegetables" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={categoryForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Brief description of this category"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Category
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Produce Categories</CardTitle>
                <CardDescription>Organize your produce items into these categories</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Items Count</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.description}</TableCell>
                        <TableCell>{produce.filter((p) => p.category === category.id).length}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => editCategory(category)}>
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => deleteCategory(category.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Produce Items Tab */}
          <TabsContent value="produce" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={produceDialogOpen} onOpenChange={setProduceDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setEditingProduce(null)
                      produceForm.reset({
                        name: "",
                        category: "",
                        unit: "kg",
                        floorPrice: "",
                        description: "",
                      })
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Produce Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>{editingProduce ? "Edit Produce Item" : "Add New Produce Item"}</DialogTitle>
                    <DialogDescription>
                      {editingProduce
                        ? "Update the details and floor price of this produce item."
                        : "Add a new produce item and set its minimum floor price."}
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...produceForm}>
                    <form onSubmit={produceForm.handleSubmit(onProduceSubmit)} className="space-y-4">
                      <FormField
                        control={produceForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Produce Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Tomatoes" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={produceForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={produceForm.control}
                        name="unit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a unit" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="kg">Kilogram (kg)</SelectItem>
                                <SelectItem value="g">Gram (g)</SelectItem>
                                <SelectItem value="piece">Piece</SelectItem>
                                <SelectItem value="bunch">Bunch</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={produceForm.control}
                        name="floorPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Floor Price (KES)</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <span className="mr-2">KES</span>
                                <Input type="number" step="0.01" min="0" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={produceForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Brief description of this produce"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Produce
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Produce Items & Floor Prices</CardTitle>
                <CardDescription>Manage produce items and set minimum floor prices</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produce Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Floor Price (KES)</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {produce.map((prod) => (
                      <TableRow key={prod.id}>
                        <TableCell className="font-medium">{prod.name}</TableCell>
                        <TableCell>
                          {categories.find((cat) => cat.id === prod.category)?.name || prod.category}
                        </TableCell>
                        <TableCell>{prod.unit}</TableCell>
                        <TableCell>{prod.floorPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => editProduce(prod)}>
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => deleteProduce(prod.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
