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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Sample commission tiers
const INITIAL_TIERS = [
  { id: "tier1", minTonnage: 0, maxTonnage: 1, commissionRate: 10 },
  { id: "tier2", minTonnage: 1, maxTonnage: 3, commissionRate: 12 },
  { id: "tier3", minTonnage: 3, maxTonnage: 5, commissionRate: 13 },
  { id: "tier4", minTonnage: 5, maxTonnage: 10, commissionRate: 14 },
  { id: "tier5", minTonnage: 10, maxTonnage: null, commissionRate: 15 },
]

// Form schema
const tierSchema = z.object({
  minTonnage: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Minimum tonnage must be a non-negative number",
  }),
  maxTonnage: z.string().refine((val) => val === "" || (!isNaN(Number(val)) && Number(val) > 0), {
    message: "Maximum tonnage must be a positive number or empty for unlimited",
  }),
  commissionRate: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 100, {
    message: "Commission rate must be between 0 and 100",
  }),
})

type TierFormValues = z.infer<typeof tierSchema>

export default function CommissionTiersPage() {
  const [tiers, setTiers] = useState(INITIAL_TIERS)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTier, setEditingTier] = useState<(typeof INITIAL_TIERS)[0] | null>(null)

  // Form
  const form = useForm<TierFormValues>({
    resolver: zodResolver(tierSchema),
    defaultValues: {
      minTonnage: "",
      maxTonnage: "",
      commissionRate: "",
    },
  })

  // Handle form submission
  async function onSubmit(data: TierFormValues) {
    setIsSubmitting(true)
    setSubmitSuccess(false)

    try {
      // Validate tier ranges
      const minTonnage = Number(data.minTonnage)
      const maxTonnage = data.maxTonnage === "" ? null : Number(data.maxTonnage)
      const commissionRate = Number(data.commissionRate)

      if (maxTonnage !== null && minTonnage >= maxTonnage) {
        form.setError("maxTonnage", {
          type: "manual",
          message: "Maximum tonnage must be greater than minimum tonnage",
        })
        return
      }

      // Check for overlapping ranges
      const hasOverlap = tiers.some((tier) => {
        if (editingTier && tier.id === editingTier.id) return false

        const tierMin = tier.minTonnage
        const tierMax = tier.maxTonnage

        // Check if the new tier overlaps with existing tier
        if (tierMax === null) {
          return minTonnage >= tierMin
        }

        if (maxTonnage === null) {
          return tierMin >= minTonnage
        }

        return minTonnage < tierMax && maxTonnage > tierMin
      })

      if (hasOverlap) {
        form.setError("minTonnage", {
          type: "manual",
          message: "This tier overlaps with an existing tier",
        })
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (editingTier) {
        // Update existing tier
        setTiers(
          tiers.map((tier) =>
            tier.id === editingTier.id
              ? {
                  ...tier,
                  minTonnage,
                  maxTonnage,
                  commissionRate,
                }
              : tier,
          ),
        )
      } else {
        // Add new tier
        const newTier = {
          id: `tier${Date.now()}`,
          minTonnage,
          maxTonnage,
          commissionRate,
        }
        setTiers([...tiers, newTier])
      }

      setSubmitSuccess(true)
      setDialogOpen(false)
      form.reset()
      setEditingTier(null)
    } catch (error) {
      console.error("Error saving tier:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Edit tier
  function editTier(tier: (typeof INITIAL_TIERS)[0]) {
    setEditingTier(tier)
    form.reset({
      minTonnage: tier.minTonnage.toString(),
      maxTonnage: tier.maxTonnage === null ? "" : tier.maxTonnage.toString(),
      commissionRate: tier.commissionRate.toString(),
    })
    setDialogOpen(true)
  }

  // Delete tier
  async function deleteTier(tierId: string) {
    if (confirm("Are you sure you want to delete this commission tier?")) {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Remove tier
      setTiers(tiers.filter((tier) => tier.id !== tierId))

      setSubmitSuccess(true)
    }
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Commission Tiers</h1>
          <p className="text-muted-foreground">
            Set commission rates based on order tonnage. Higher volume orders can have different commission rates.
          </p>
        </div>

        {submitSuccess && (
          <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-900/30 dark:text-green-400">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Commission tiers have been updated successfully.</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Commission Tiers by Tonnage</CardTitle>
            <CardDescription>
              Configure different commission rates based on the total tonnage of an order. Higher volume orders can have
              higher commission rates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-4">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setEditingTier(null)
                      form.reset({
                        minTonnage: "",
                        maxTonnage: "",
                        commissionRate: "",
                      })
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Commission Tier
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>{editingTier ? "Edit Commission Tier" : "Add New Commission Tier"}</DialogTitle>
                    <DialogDescription>
                      {editingTier
                        ? "Update the tonnage range and commission rate for this tier."
                        : "Add a new commission tier based on order tonnage."}
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="minTonnage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Minimum Tonnage</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.1" min="0" placeholder="0" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="maxTonnage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Maximum Tonnage</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  placeholder="Leave empty for unlimited"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="commissionRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Commission Rate (%)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" min="0" max="100" placeholder="10" {...field} />
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
                              Save Tier
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Minimum Tonnage</TableHead>
                  <TableHead>Maximum Tonnage</TableHead>
                  <TableHead>Commission Rate (%)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tiers
                  .sort((a, b) => a.minTonnage - b.minTonnage)
                  .map((tier) => (
                    <TableRow key={tier.id}>
                      <TableCell>{tier.minTonnage} tons</TableCell>
                      <TableCell>{tier.maxTonnage === null ? "Unlimited" : `${tier.maxTonnage} tons`}</TableCell>
                      <TableCell>{tier.commissionRate}%</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => editTier(tier)}>
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => deleteTier(tier.id)}>
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
      </div>
    </ProtectedRoute>
  )
}
