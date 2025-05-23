"use client"
import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { SidebarNav } from "@/components/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { FarmerSavingsDashboard } from "@/components/farmer-savings-dashboard"

export default function FarmerSavingsPage() {
  const { user } = useAuth()

  // Mock user data if not available
  const mockUser = {
    id: "farmer-001",
    name: "Jane Wanjiku",
    role: "farmer",
  }

  const currentUser = user || mockUser

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1">
          <SidebarNav userRole={currentUser.role} />
          <main className="flex-1 p-4 md:p-6">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">My Savings</h1>
                <p className="text-muted-foreground">
                  Manage your compulsory savings invested with Africa Alliance Money Market Fund
                </p>
              </div>

              <FarmerSavingsDashboard farmerId={currentUser.id} farmerName={currentUser.name} />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
