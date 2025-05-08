"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { useAuth } from "@/lib/auth-context"
import { AIAssistant } from "@/components/ai-assistant"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Only redirect if we're done loading and there's no user
    if (!isLoading && !user) {
      router.push("/login")
      return
    }

    // Redirect to role-specific landing pages if on dashboard or root
    if (!isLoading && user && (pathname === "/dashboard" || pathname === "/")) {
      switch (user.role) {
        case "group":
          router.push("/group-dashboard")
          break
        case "buyer":
          router.push("/market-requests")
          break
        case "admin":
          router.push("/admin")
          break
        case "transporter":
          router.push("/transporter/deliveries")
          break
        case "grader":
          router.push("/grader/transactions")
          break
        default:
          // For other roles like farmer, keep dashboard as landing
          break
      }
    }
  }, [user, isLoading, router, pathname])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  // Don't render anything if not authenticated
  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar userRole={user.role} className="hidden md:block" />
      <div className="flex flex-1 flex-col">
        <Navbar userRole={user.role} />
        <main className="flex-1 overflow-auto p-4 pb-20 md:pb-4">{children}</main>
        <MobileNav userRole={user?.role} />
        {/* Add AI Assistant */}
        <AIAssistant userRole={user?.role || "buyer"} />
      </div>
    </div>
  )
}
