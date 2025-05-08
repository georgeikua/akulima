"use client"

import { ProtectedRoute } from "@/components/protected-route"

export default function AdminProducePage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Produce Management</h1>
        <p className="text-muted-foreground">Manage produce types and pricing</p>
        {/* Content from the original admin/produce page */}
      </div>
    </ProtectedRoute>
  )
}
