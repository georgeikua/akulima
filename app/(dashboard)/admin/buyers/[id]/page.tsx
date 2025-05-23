"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { BuyerCRMProfile } from "@/components/buyer-crm-profile"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function BuyerProfilePage({ params }: { params: { id: string } }) {
  const buyerId = params.id

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/buyers">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Buyer Profile</h1>
        </div>

        <BuyerCRMProfile buyerId={buyerId} />
      </div>
    </ProtectedRoute>
  )
}
