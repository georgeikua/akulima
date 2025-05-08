"use client"

import { ProtectedRoute } from "@/components/protected-route"

export default function AdminPricesPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Price Data</h1>
        <p className="text-muted-foreground">Manage market price data from AMIS.co.ke</p>
        {/* Content from the original admin/prices page */}
      </div>
    </ProtectedRoute>
  )
}
