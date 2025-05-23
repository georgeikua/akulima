"use client"

import { ProtectedRoute } from "@/components/protected-route"

export default function AdminGroupsPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Akulima Groups</h1>
        <p className="text-muted-foreground">Manage farmer groups in the system</p>
        {/* Content from the original admin/groups page */}
      </div>
    </ProtectedRoute>
  )
}
