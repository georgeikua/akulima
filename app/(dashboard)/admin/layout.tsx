import type { ReactNode } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Akulima Admin Dashboard",
  description: "Comprehensive admin dashboard for the Akulima platform",
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="container mx-auto py-6">{children}</div>
}
