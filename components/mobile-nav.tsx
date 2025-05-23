"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, FileText, Gavel, Home, Menu, Package, ShoppingCart, Truck, Users, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface MobileNavProps {
  userRole?: string
}

export function MobileNav({ userRole }: MobileNavProps) {
  const pathname = usePathname()

  // Define navigation items based on user role
  const getNavItems = () => {
    switch (userRole) {
      case "group":
        return [
          { href: "/group-dashboard", label: "Dashboard", icon: Home },
          { href: "/group-members", label: "Members", icon: Users },
          { href: "/orders", label: "Orders", icon: FileText },
          { href: "/bids", label: "Bids", icon: Gavel },
        ]
      case "buyer":
        return [
          { href: "/buyer-dashboard", label: "Dashboard", icon: Home },
          { href: "/my-requests", label: "My Requests", icon: FileText },
          { href: "/market-requests", label: "Market", icon: ShoppingCart },
          { href: "/buyer-orders", label: "Orders", icon: Package },
        ]
      case "admin":
        return [
          { href: "/admin", label: "Admin", icon: BarChart3 },
          { href: "/admin/groups", label: "Groups", icon: Users },
          { href: "/admin/produce", label: "Produce", icon: Package },
          { href: "/admin/prices", label: "Prices", icon: Package },
        ]
      case "transporter":
        return [
          { href: "/transporter/deliveries", label: "Deliveries", icon: Truck },
          { href: "/calendar", label: "Calendar", icon: FileText },
          { href: "/market-prices", label: "Prices", icon: Package },
          { href: "/dashboard", label: "Stats", icon: BarChart3 },
        ]
      case "grader":
        return [
          { href: "/grader/transactions", label: "Transactions", icon: FileText },
          { href: "/calendar", label: "Calendar", icon: FileText },
          { href: "/market-prices", label: "Prices", icon: Package },
          { href: "/dashboard", label: "Stats", icon: BarChart3 },
        ]
      case "farmer":
      default:
        return [
          { href: "/dashboard", label: "Dashboard", icon: Home },
          { href: "/market-prices", label: "Prices", icon: Package },
          { href: "/market-requests", label: "Requests", icon: ShoppingCart },
          { href: "/orders", label: "Orders", icon: FileText },
        ]
    }
  }

  const navItems = getNavItems()

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-background md:hidden">
      <div className="flex h-16 items-center justify-around">
        {navItems.map((item, index) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center text-xs",
                pathname === item.href ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="mb-1 h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="flex flex-1 flex-col items-center justify-center text-xs">
              <Menu className="mb-1 h-5 w-5" />
              <span>More</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-xl">
            <SheetHeader className="mb-4">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-3 gap-4">
              {userRole === "buyer" && (
                <>
                  <Link href="/post-request" className="flex flex-col items-center justify-center p-4 text-center">
                    <ShoppingCart className="mb-2 h-6 w-6" />
                    <span className="text-sm">Post Request</span>
                  </Link>
                  <Link href="/market-prices" className="flex flex-col items-center justify-center p-4 text-center">
                    <BarChart3 className="mb-2 h-6 w-6" />
                    <span className="text-sm">Market Prices</span>
                  </Link>
                  <Link href="/calendar" className="flex flex-col items-center justify-center p-4 text-center">
                    <FileText className="mb-2 h-6 w-6" />
                    <span className="text-sm">Calendar</span>
                  </Link>
                  <Link href="/find-groups" className="flex flex-col items-center justify-center p-4 text-center">
                    <Users className="mb-2 h-6 w-6" />
                    <span className="text-sm">Find Groups</span>
                  </Link>
                  <Link href="/delivery-tracking" className="flex flex-col items-center justify-center p-4 text-center">
                    <Truck className="mb-2 h-6 w-6" />
                    <span className="text-sm">Track Deliveries</span>
                  </Link>
                  <Link href="/payment-history" className="flex flex-col items-center justify-center p-4 text-center">
                    <Wallet className="mb-2 h-6 w-6" />
                    <span className="text-sm">Payments</span>
                  </Link>
                </>
              )}
              {userRole === "group" && (
                <>
                  <Link href="/transit" className="flex flex-col items-center justify-center p-4 text-center">
                    <Truck className="mb-2 h-6 w-6" />
                    <span className="text-sm">Transit</span>
                  </Link>
                  <Link href="/payments" className="flex flex-col items-center justify-center p-4 text-center">
                    <Wallet className="mb-2 h-6 w-6" />
                    <span className="text-sm">Payments</span>
                  </Link>
                  <Link href="/dashboard" className="flex flex-col items-center justify-center p-4 text-center">
                    <BarChart3 className="mb-2 h-6 w-6" />
                    <span className="text-sm">Statistics</span>
                  </Link>
                </>
              )}
              {userRole === "farmer" && (
                <>
                  <Link href="/my-produce" className="flex flex-col items-center justify-center p-4 text-center">
                    <Package className="mb-2 h-6 w-6" />
                    <span className="text-sm">My Produce</span>
                  </Link>
                  <Link href="/group-management" className="flex flex-col items-center justify-center p-4 text-center">
                    <Users className="mb-2 h-6 w-6" />
                    <span className="text-sm">Groups</span>
                  </Link>
                  <Link href="/price-trends" className="flex flex-col items-center justify-center p-4 text-center">
                    <BarChart3 className="mb-2 h-6 w-6" />
                    <span className="text-sm">Trends</span>
                  </Link>
                </>
              )}
              <Link href="/profile" className="flex flex-col items-center justify-center p-4 text-center">
                <Users className="mb-2 h-6 w-6" />
                <span className="text-sm">Profile</span>
              </Link>
              <Link href="/help" className="flex flex-col items-center justify-center p-4 text-center">
                <FileText className="mb-2 h-6 w-6" />
                <span className="text-sm">Help</span>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
