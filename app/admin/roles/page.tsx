"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { AlertCircle, CheckCircle2, Edit2, Loader2, Plus, Shield, Trash2, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProtectedRoute } from "@/components/protected-route"

// Form schema for role creation/editing
const roleSchema = z.object({
  name: z.string().min(3, "Role name must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  permissions: z.array(z.string()).min(1, "Select at least one permission"),
})

type RoleValues = z.infer<typeof roleSchema>

// Available permissions
const availablePermissions = [
  { id: "dashboard_view", label: "View Dashboard" },
  { id: "users_manage", label: "Manage Users" },
  { id: "groups_manage", label: "Manage Groups" },
  { id: "produce_manage", label: "Manage Produce" },
  { id: "prices_manage", label: "Manage Prices" },
  { id: "reports_view", label: "View Reports" },
  { id: "reports_export", label: "Export Reports" },
  { id: "payments_view", label: "View Payments" },
  { id: "payments_process", label: "Process Payments" },
  { id: "settings_manage", label: "Manage Settings" },
]

// Mock initial roles
const initialRoles = [
  {
    id: "role-1",
    name: "Super Admin",
    description: "Full access to all system features",
    permissions: availablePermissions.map((p) => p.id),
    isSystem: true,
  },
  {
    id: "role-2",
    name: "Finance Admin",
    description: "Manage financial aspects of the platform",
    permissions: ["dashboard_view", "reports_view", "reports_export", "payments_view", "payments_process"],
    isSystem: false,
  },
  {
    id: "role-3",
    name: "Operations Admin",
    description: "Manage day-to-day operations",
    permissions: ["dashboard_view", "groups_manage", "produce_manage", "prices_manage", "reports_view"],
    isSystem: false,
  },
]

export default function AdminRolesPage() {
  const [roles, setRoles] = useState(initialRoles)
  const [isLoading, setIsLoading] = useState(false)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<(typeof initialRoles)[0] | null>(null)

  // Initialize form
  const form = useForm<RoleValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      description: "",
      permissions: [],
    },
  })

  // Reset form when dialog opens/closes or editing role changes
  const resetForm = () => {
    if (editingRole) {
      form.reset({
        name: editingRole.name,
        description: editingRole.description,
        permissions: editingRole.permissions,
      })
    } else {
      form.reset({
        name: "",
        description: "",
        permissions: [],
      })
    }
  }

  // Handle dialog open
  const handleOpenDialog = (role: (typeof initialRoles)[0] | null = null) => {
    setEditingRole(role)
    setIsDialogOpen(true)

    // Reset form with role data if editing
    if (role) {
      form.reset({
        name: role.name,
        description: role.description,
        permissions: role.permissions,
      })
    } else {
      form.reset({
        name: "",
        description: "",
        permissions: [],
      })
    }
  }

  // Handle dialog close
  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingRole(null)
    form.reset()
  }

  // Handle role submission (create/edit)
  async function onSubmit(data: RoleValues) {
    setIsLoading(true)
    setActionSuccess(null)
    setActionError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (editingRole) {
        // Update existing role
        setRoles(
          roles.map((role) =>
            role.id === editingRole.id
              ? { ...role, name: data.name, description: data.description, permissions: data.permissions }
              : role,
          ),
        )
        setActionSuccess(`Role "${data.name}" updated successfully`)
      } else {
        // Create new role
        const newRole = {
          id: `role-${Date.now()}`,
          name: data.name,
          description: data.description,
          permissions: data.permissions,
          isSystem: false,
        }
        setRoles([...roles, newRole])
        setActionSuccess(`Role "${data.name}" created successfully`)
      }

      // Close dialog
      handleCloseDialog()

      // Clear success message after a delay
      setTimeout(() => {
        setActionSuccess(null)
      }, 3000)
    } catch (error) {
      console.error("Failed to save role:", error)
      setActionError("Failed to save role. Please try again.")

      // Clear error message after a delay
      setTimeout(() => {
        setActionError(null)
      }, 3000)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle role deletion
  const deleteRole = async (roleId: string) => {
    setIsLoading(true)
    setActionSuccess(null)
    setActionError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Find role to delete
      const roleToDelete = roles.find((role) => role.id === roleId)

      if (!roleToDelete) {
        throw new Error("Role not found")
      }

      if (roleToDelete.isSystem) {
        throw new Error("Cannot delete system role")
      }

      // Remove the role from the list
      setRoles(roles.filter((role) => role.id !== roleId))

      // Show success message
      setActionSuccess(`Role "${roleToDelete.name}" deleted successfully`)

      // Clear success message after a delay
      setTimeout(() => {
        setActionSuccess(null)
      }, 3000)
    } catch (error) {
      console.error("Failed to delete role:", error)
      setActionError(error instanceof Error ? error.message : "Failed to delete role")

      // Clear error message after a delay
      setTimeout(() => {
        setActionError(null)
      }, 3000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Roles</h1>
            <p className="text-muted-foreground">Manage admin roles and permissions</p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <UserPlus className="mr-2 h-4 w-4" />
            Create New Role
          </Button>
        </div>

        {actionSuccess && (
          <Alert className="border-green-500">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{actionSuccess}</AlertDescription>
          </Alert>
        )}

        {actionError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{actionError}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Admin Roles</CardTitle>
            <CardDescription>Define roles with specific permissions for admin users</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Shield className="mr-2 h-4 w-4 text-primary" />
                        <span>{role.name}</span>
                        {role.isSystem && (
                          <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            System
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.length > 3 ? (
                          <>
                            {role.permissions.slice(0, 3).map((permId) => {
                              const perm = availablePermissions.find((p) => p.id === permId)
                              return (
                                <span key={permId} className="text-xs bg-muted px-2 py-0.5 rounded-full">
                                  {perm?.label || permId}
                                </span>
                              )
                            })}
                            <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                              +{role.permissions.length - 3} more
                            </span>
                          </>
                        ) : (
                          role.permissions.map((permId) => {
                            const perm = availablePermissions.find((p) => p.id === permId)
                            return (
                              <span key={permId} className="text-xs bg-muted px-2 py-0.5 rounded-full">
                                {perm?.label || permId}
                              </span>
                            )
                          })
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(role)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={role.isSystem || isLoading}
                          onClick={() => deleteRole(role.id)}
                        >
                          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Role creation/editing dialog */}
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            if (!open) handleCloseDialog()
            setIsDialogOpen(open)
            if (open) resetForm()
          }}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingRole ? "Edit Role" : "Create New Role"}</DialogTitle>
              <DialogDescription>
                {editingRole
                  ? "Update the role details and permissions"
                  : "Define a new admin role with specific permissions"}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Finance Admin" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Brief description of this role" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="permissions"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Permissions</FormLabel>
                        <FormDescription>Select the permissions for this role</FormDescription>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {availablePermissions.map((permission) => (
                          <FormField
                            key={permission.id}
                            control={form.control}
                            name="permissions"
                            render={({ field }) => {
                              return (
                                <FormItem key={permission.id} className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(permission.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, permission.id])
                                          : field.onChange(field.value?.filter((value) => value !== permission.id))
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">{permission.label}</FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        {editingRole ? "Update Role" : "Create Role"}
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
