"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Calendar,
  FileText,
  Home,
  Package,
  Settings,
  Truck,
  Users,
  Wallet,
  Gavel,
  LayoutDashboard,
  Apple,
  TrendingUp,
  MapPin,
  MessageSquare,
  ShoppingCart,
  User,
  Upload,
  Percent,
  CheckSquare,
  PieChart,
  PiggyBank,
  Shield,
  LockKeyhole,
  Smartphone,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {
  userRole?: string
}

export function SidebarNav({ className, userRole, ...props }: SidebarNavProps) {
  const pathname = usePathname()
  const { user } = useAuth()

  // Use provided userRole or get from auth context
  const role = userRole || user?.role

  return (
    <div className={cn("border-r bg-background md:block md:w-64", className)} {...props}>
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package className="h-6 w-6" />
            <span>Akulima</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 px-2 py-2">
          <div className="space-y-2 px-2">
            {/* Group user navigation */}
            {role === "group" && (
              <>
                <Button
                  asChild
                  variant={pathname === "/group-dashboard" ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href="/group-dashboard">
                    <Home className="mr-2 h-4 w-4" />
                    Group Dashboard
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={pathname === "/group-members" ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href="/group-members">
                    <Users className="mr-2 h-4 w-4" />
                    Members
                  </Link>
                </Button>
                <Button asChild variant={pathname === "/orders" ? "default" : "ghost"} className="w-full justify-start">
                  <Link href="/orders">
                    <FileText className="mr-2 h-4 w-4" />
                    Orders
                  </Link>
                </Button>
                <Button asChild variant={pathname === "/bids" ? "default" : "ghost"} className="w-full justify-start">
                  <Link href="/bids">
                    <Gavel className="mr-2 h-4 w-4" />
                    Bids
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={pathname === "/transit" ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href="/transit">
                    <Truck className="mr-2 h-4 w-4" />
                    Transit
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={pathname === "/payments" ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href="/payments">
                    <Wallet className="mr-2 h-4 w-4" />
                    Payments
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={pathname === "/dashboard" ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href="/dashboard">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Statistics
                  </Link>
                </Button>
              </>
            )}

            {/* Buyer user navigation */}
            {role === "buyer" && (
              <>
                <Button
                  asChild
                  variant={pathname === "/buyer-dashboard" ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href="/buyer-dashboard">
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={pathname === "/my-requests" ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href="/my-requests">
                    <FileText className="mr-2 h-4 w-4" />
                    My Requests
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={pathname === "/market-requests" ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href="/market-requests">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Market Requests
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={pathname === "/buyer-orders" ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href="/buyer-orders">
                    <Package className="mr-2 h-4 w-4" />
                    Orders
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={pathname === "/trusted-groups" ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href="/trusted-groups">
                    <Users className="mr-2 h-4 w-4" />
                    Trusted Groups
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={pathname === "/market-prices" ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href="/market-prices">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Market Prices
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={pathname === "/post-request" ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href="/post-request">
                    <FileText className="mr-2 h-4 w-4" />
                    Post Request
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={pathname === "/calendar" ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href="/calendar">
                    <Calendar className="mr-2 h-4 w-4" />
                    Calendar
                  </Link>
                </Button>
              </>
            )}

            {/* Admin user navigation */}
            {role === "admin" &&
              [
                {
                  title: "Admin Dashboard",
                  href: "/admin",
                  icon: <LayoutDashboard className="h-5 w-5" />,
                },
                {
                  title: "Admin Login",
                  href: "/admin-login",
                  icon: <Shield className="h-5 w-5" />,
                },
                {
                  title: "Role Management",
                  href: "/admin/roles",
                  icon: <Users className="h-5 w-5" />,
                },
                {
                  title: "Session Management",
                  href: "/admin/sessions",
                  icon: <LockKeyhole className="h-5 w-5" />,
                },
                {
                  title: "Two-Factor Setup",
                  href: "/admin/setup-2fa",
                  icon: <Smartphone className="h-5 w-5" />,
                },
                {
                  title: "Groups",
                  href: "/admin/groups",
                  icon: <Users className="h-5 w-5" />,
                },
                {
                  title: "Buyers",
                  href: "/admin/buyers",
                  icon: <ShoppingCart className="h-5 w-5" />,
                },
                {
                  title: "Farmer Contributions",
                  href: "/admin/farmer-contributions",
                  icon: <User className="h-5 w-5" />,
                },
                {
                  title: "Produce Categories",
                  href: "/admin/produce-categories",
                  icon: <Apple className="h-5 w-5" />,
                },
                {
                  title: "Produce",
                  href: "/admin/produce",
                  icon: <Package className="h-5 w-5" />,
                },
                {
                  title: "Market Prices Upload",
                  href: "/admin/market-prices/upload",
                  icon: <Upload className="h-5 w-5" />,
                },
                {
                  title: "Commission Tiers",
                  href: "/admin/commission-tiers",
                  icon: <Percent className="h-5 w-5" />,
                },
                {
                  title: "Approvals",
                  href: "/admin/approvals",
                  icon: <CheckSquare className="h-5 w-5" />,
                },
                {
                  title: "Floor Prices",
                  href: "/admin/floor-prices",
                  icon: <TrendingUp className="h-5 w-5" />,
                },
                {
                  title: "Revenue Reports",
                  href: "/admin/revenue-reports",
                  icon: <PieChart className="h-5 w-5" />,
                },
                {
                  title: "Savings Management",
                  href: "/admin/savings",
                  icon: <PiggyBank className="h-5 w-5" />,
                },
                {
                  title: "Regions",
                  href: "/admin/regions",
                  icon: <MapPin className="h-5 w-5" />,
                },
                {
                  title: "WhatsApp",
                  href: "/admin/whatsapp",
                  icon: <MessageSquare className="h-5 w-5" />,
                },
              ].map((link) => (
                <Button
                  key={link.href}
                  asChild
                  variant={pathname === link.href ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href={link.href}>
                    {link.icon}
                    <span className="ml-2">{link.title}</span>
                  </Link>
                </Button>
              ))}

            {/* Transporter user navigation */}
            {role === "transporter" && (
              <>
                <Button
                  asChild
                  variant={pathname === "/transporter/deliveries" ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href="/transporter/deliveries">
                    <Truck className="mr-2 h-4 w-4" />
                    Deliveries
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={pathname === "/calendar" ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href="/calendar">
                    <Calendar className="mr-2 h-4 w-4" />
                    Calendar
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={pathname === "/market-prices" ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href="/market-prices">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Market Prices
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={pathname === "/dashboard" ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href="/dashboard">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Statistics
                  </Link>
                </Button>
              </>
            )}

            {/* Grader user navigation */}
            {role === "grader" && (
              <>
                <Button
                  asChild
                  variant={pathname === "/grader/transactions" ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href="/grader/transactions">
                    <FileText className="mr-2 h-4 w-4" />
                    Transactions
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={pathname === "/calendar" ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href="/calendar">
                    <Calendar className="mr-2 h-4 w-4" />
                    Calendar
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={pathname === "/market-prices" ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href="/market-prices">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Market Prices
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={pathname === "/dashboard" ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href="/dashboard">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Statistics
                  </Link>
                </Button>
              </>
            )}

            {/* Farmer user navigation */}
            {role === "farmer" && (
              <>
                <Button
                  asChild
                  variant={pathname === "/dashboard" ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href="/dashboard">
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={pathname === "/market-prices" ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href="/market-prices">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Market Prices
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={pathname === "/price-trends" ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href="/price-trends">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Price Trends
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={pathname === "/market-requests" ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href="/market-requests">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Market Requests
                  </Link>
                </Button>
                <Button asChild variant={pathname === "/orders" ? "default" : "ghost"} className="w-full justify-start">
                  <Link href="/orders">
                    <FileText className="mr-2 h-4 w-4" />
                    Orders
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={pathname === "/calendar" ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href="/calendar">
                    <Calendar className="mr-2 h-4 w-4" />
                    Calendar
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={pathname === "/my-produce" ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href="/my-produce">
                    <Package className="mr-2 h-4 w-4" />
                    My Produce
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={pathname === "/group-management" ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href="/group-management">
                    <Users className="mr-2 h-4 w-4" />
                    Group Management
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={pathname === "/produce-receiving" ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href="/produce-receiving">
                    <Truck className="mr-2 h-4 w-4" />
                    Receive Produce
                  </Link>
                </Button>
              </>
            )}
          </div>

          <div className="py-2">
            <div className="space-y-2 px-2">
              <Button asChild variant={pathname === "/help" ? "default" : "ghost"} className="w-full justify-start">
                <Link href="/help">
                  <FileText className="mr-2 h-4 w-4" />
                  Help & Manual
                </Link>
              </Button>
              <Button asChild variant={pathname === "/profile" ? "default" : "ghost"} className="w-full justify-start">
                <Link href="/profile">
                  <Users className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </Button>
              <Button asChild variant={pathname === "/settings" ? "default" : "ghost"} className="w-full justify-start">
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

// Export as both SidebarNav and Sidebar for backward compatibility
export const Sidebar = SidebarNav
