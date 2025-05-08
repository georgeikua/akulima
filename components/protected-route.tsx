"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth, type UserRole } from "@/lib/auth-context"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // If still loading, don't do anything yet
    if (isLoading) return

    // If no user and not on auth pages, redirect to login
    if (!user && pathname !== "/login" && pathname !== "/register") {
      router.push("/login")
      return
    }

    // If user exists but role restrictions apply
    if (user && allowedRoles && !allowedRoles.includes(user.role)) {
      router.push("/dashboard")
      return
    }

    // User is authenticated and authorized
    setIsAuthorized(true)
  }, [user, isLoading, router, pathname, allowedRoles])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // Don't render anything until authorized
  if (!isAuthorized) {
    return null
  }

  // User is authenticated and has required role (if specified)
  return <>{children}</>
}
