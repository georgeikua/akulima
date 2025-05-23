"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { AdminRevenueDashboard } from "@/components/admin-revenue-dashboard"

export default function AdminRevenuePage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminRevenueDashboard />
    </ProtectedRoute>
  )
}
