"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-10 w-40">
            <Image
              src="/placeholder.svg?height=80&width=200&query=FreshXchange logo with green and grey colors"
              alt="FreshXchange Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="sr-only">FreshXchange</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
            Products
          </Link>
          <Link href="#" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
            Certifications
          </Link>
          <Link href="#" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
            Logistics
          </Link>
          <Link href="#" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
            About Us
          </Link>
          <Link href="#" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button className="hidden md:flex bg-green-600 hover:bg-green-700 text-white">Request Sample</Button>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  href="#"
                  className="text-base font-medium text-gray-600 hover:text-green-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Products
                </Link>
                <Link
                  href="#"
                  className="text-base font-medium text-gray-600 hover:text-green-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Certifications
                </Link>
                <Link
                  href="#"
                  className="text-base font-medium text-gray-600 hover:text-green-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Logistics
                </Link>
                <Link
                  href="#"
                  className="text-base font-medium text-gray-600 hover:text-green-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  href="#"
                  className="text-base font-medium text-gray-600 hover:text-green-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </Link>
                <Button className="mt-4 bg-green-600 hover:bg-green-700 text-white">Request Sample</Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
