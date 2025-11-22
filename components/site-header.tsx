"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Code2, LogOut } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { supabase } from "@/lib/supabase"

interface SiteHeaderProps {
  user?: any
  loading?: boolean
}

export function SiteHeader({ user, loading }: SiteHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()

  // Determine active nav based on pathname
  const getActiveNav = (path: string) => {
    if (path === "/" || path === "/#features") return "features"
    if (path === "/pricing") return "pricing"
    if (path === "/blog") return "blog"
    if (path === "/docs") return "docs"
    return "features"
  }

  const activeNav = getActiveNav(pathname)
  const activeIndex = ["features", "pricing", "blog", "docs"].indexOf(activeNav)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  const navItems = [
    { name: "Features", href: "/#features", id: "features" },
    { name: "Pricing", href: "/pricing", id: "pricing" },
    { name: "Blog", href: "/blog", id: "blog" },
    { name: "Docs", href: "/docs", id: "docs" }
  ]

  return (
    <header className="border-b bg-gradient-to-r from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-900/60 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300 shadow-sm hover:shadow-lg">
      <div className="w-full px-6 py-3 flex items-center justify-between">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2 group cursor-pointer">
            <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-2 rounded-lg group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300 shadow-sm">
              <Code2 className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 group-hover:from-primary group-hover:to-primary transition-all">
              CodeCoach
            </h1>
          </Link>

          {/* Navigation Menu with Smooth Indicator */}
          <nav className="hidden md:flex items-center">
            <div className={`relative grid ${user ? 'grid-cols-5' : 'grid-cols-4'} bg-muted/30 rounded-lg p-1 overflow-hidden`}>
              {/* Sliding pill indicator using CSS left% */}
              <div
                className="absolute inset-y-1 rounded-md bg-primary/25 shadow-md shadow-primary/40 transition-all duration-300 ease-out"
                style={{
                  width: `${100 / (user ? 5 : 4)}%`,
                  left: `${Math.max(activeIndex, 0) * (100 / (user ? 5 : 4))}%`,
                  opacity: activeIndex === -1 ? 0 : 1
                }}
              />

              {navItems.map((item) => {
                const isActive = activeNav === item.id
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="relative text-center px-3 py-1.5 text-sm font-medium rounded-md"
                  >
                    <span
                      className={`relative z-10 transition-colors duration-200 ${isActive
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      {item.name}
                    </span>
                  </Link>
                )
              })}

              {user && (
                <Link
                  href="/dashboard"
                  className="relative text-center px-3 py-1.5 text-sm font-medium rounded-md"
                >
                  <span
                    className={`relative z-10 transition-colors duration-200 ${pathname === "/dashboard"
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    History
                  </span>
                </Link>
              )}
            </div>
          </nav>
        </div>

        {/* Right: Theme + Auth */}
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          {loading ? (
            <div className="h-10 w-24 animate-pulse bg-muted rounded-lg" />
          ) : user ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm" className="hover:text-primary hover:bg-primary/5 transition-all duration-300">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5 glow-primary">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
