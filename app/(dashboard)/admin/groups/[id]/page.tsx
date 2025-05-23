"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { SellerCRMProfile } from "@/components/seller-crm-profile"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SellerProfilePage({ params }: { params: { id: string } }) {
  const sellerId = params.id

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/groups">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Group Profile</h1>
        </div>

        <SellerCRMProfile sellerId={sellerId} />
      </div>
    </ProtectedRoute>
  )
}
