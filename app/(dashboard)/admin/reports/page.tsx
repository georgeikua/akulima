"use client"

import { ProtectedRoute } from "@/components/protected-route"

export default function AdminReportsPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Generate and view system reports</p>
        <div className="rounded-lg border p-8 text-center">
          <h2 className="text-xl font-semibold">Reports Module</h2>
          <p className="mt-2 text-muted-foreground">This module is under development</p>
        </div>
      </div>
    </ProtectedRoute>
  )
}
