"use client"

import { ProtectedRoute } from "@/components/protected-route"

export default function AdminRegionsPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Regions</h1>
        <p className="text-muted-foreground">Manage geographical regions</p>
        <div className="rounded-lg border p-8 text-center">
          <h2 className="text-xl font-semibold">Regions Module</h2>
          <p className="mt-2 text-muted-foreground">This module is under development</p>
        </div>
      </div>
    </ProtectedRoute>
  )
}
