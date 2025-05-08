"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export type UserRole =
  | "group"
  | "buyer"
  | "admin"
  | "transporter"
  | "grader"
  | "admin_super"
  | "admin_finance"
  | "admin_operations"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  groupId?: string
  is2FAEnabled?: boolean
  lastLogin?: string
  permissions?: string[]
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string, role: string) => Promise<void>
  adminLogin: (email: string, password: string, securityCode: string) => Promise<void>
  logout: () => void
  verify2FA: (code: string) => Promise<boolean>
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Load user from localStorage on initial render
  useEffect(() => {
    const loadUser = () => {
      setIsLoading(true)
      try {
        const storedUser = localStorage.getItem("akulima_user")
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
        }
      } catch (error) {
        console.error("Error loading user from localStorage:", error)
        localStorage.removeItem("akulima_user")
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = async (email: string, password: string, role: string) => {
    setIsLoading(true)
    try {
      // Create a mock user based on the selected role
      const userRole = role as UserRole
      console.log("Setting user role:", userRole)

      const mockUser: User = {
        id: `${role}-123`,
        name:
          role === "admin"
            ? "Admin User"
            : role === "buyer"
              ? "Buyer User"
              : role === "transporter"
                ? "Transporter User"
                : role === "grader"
                  ? "Grader User"
                  : "Akulima Group",
        email,
        role: userRole,
        groupId: role === "group" ? "group-123" : undefined,
        lastLogin: new Date().toISOString(),
        is2FAEnabled: role === "admin",
        permissions: role === "admin" ? ["all"] : undefined,
      }

      // Store user in state and localStorage
      setUser(mockUser)
      localStorage.setItem("akulima_user", JSON.stringify(mockUser))
      console.log("User stored:", mockUser)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (userRole === "buyer") {
        router.push("/buyer-dashboard")
      } else if (userRole === "admin" && mockUser.is2FAEnabled) {
        router.push("/admin/setup-2fa") // Redirect to 2FA setup/verification  {
        router.push("/admin/setup-2fa") // Redirect to 2FA setup/verification
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const adminLogin = async (email: string, password: string, securityCode: string) => {
    setIsLoading(true)
    try {
      // Validate security code (in a real app, this would be done server-side)
      if (securityCode !== "123456") {
        throw new Error("Invalid security code")
      }

      // Create admin user with appropriate permissions
      const adminUser: User = {
        id: `admin-${Date.now()}`,
        name: "Admin User",
        email,
        role: "admin",
        lastLogin: new Date().toISOString(),
        is2FAEnabled: true,
        permissions: ["all"],
      }

      // Store user in state and localStorage
      setUser(adminUser)
      localStorage.setItem("akulima_user", JSON.stringify(adminUser))

      // Redirect to 2FA verification
      router.push("/admin/setup-2fa")
    } catch (error) {
      console.error("Admin login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const verify2FA = async (code: string): Promise<boolean> => {
    // In a real app, this would validate the 2FA code against a server
    // For demo purposes, we'll accept any 6-digit code
    if (code.length === 6 && /^\d+$/.test(code)) {
      // Update user with 2FA verified status
      if (user) {
        const updatedUser = { ...user, is2FAVerified: true }
        setUser(updatedUser)
        localStorage.setItem("akulima_user", JSON.stringify(updatedUser))
      }
      return true
    }
    return false
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("akulima_user", JSON.stringify(updatedUser))
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("akulima_user")
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, adminLogin, logout, verify2FA, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
