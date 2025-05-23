"use client"

import Link from "next/link"
import { useState } from "react"
import { Bell, Menu, Package, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { SidebarNav } from "@/components/sidebar"
import { useAuth } from "@/lib/auth-context"

interface NavbarProps {
  userRole?: string
}

export function Navbar({ userRole }: NavbarProps) {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-14 items-center px-4 sm:px-6 lg:px-8">
        <div className="mr-4 flex md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        <div className="flex items-center md:hidden">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package className="h-5 w-5" />
            <span>Akulima</span>
          </Link>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>
          <ModeToggle />
          <Button variant="ghost" onClick={logout} className="hidden md:inline-flex">
            Logout
          </Button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background md:hidden">
          <div className="flex h-14 items-center border-b px-4">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} aria-label="Close Menu">
              <X className="h-5 w-5" />
            </Button>
            <div className="ml-4">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Package className="h-5 w-5" />
                <span>Akulima</span>
              </Link>
            </div>
          </div>
          <div className="p-4">
            <SidebarNav userRole={userRole} className="border-none" />
            <div className="mt-6 border-t pt-4">
              <Button variant="ghost" onClick={logout} className="w-full justify-start">
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
