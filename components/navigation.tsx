"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, Ticket, Users } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Events", href: "/events", icon: Calendar },
  { name: "Bookings", href: "/bookings", icon: Ticket },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/events" className="flex items-center space-x-2">
              <Users className="h-6 w-6" />
              <span className="font-bold text-xl">EventBooker</span>
            </Link>

            <div className="flex space-x-6">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
