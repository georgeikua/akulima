"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { FarmerContributionTracker } from "@/components/farmer-contribution-tracker"

export default function FarmerContributionsPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Farmer Contributions</h1>
          <p className="text-muted-foreground">Track individual farmer contributions and earnings across all orders</p>
        </div>

        <FarmerContributionTracker />
      </div>
    </ProtectedRoute>
  )
}
