"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Menu, Search, Briefcase } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SidebarNav } from "./sidebar-nav"
import { UserNav, SidebarUserFooter } from "./user-nav"
import { ThemeToggle } from "@/components/theme-toggle"

interface TopbarProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

function getPageTitle(pathname: string): string {
  if (pathname === "/") return "Dashboard"
  if (pathname === "/candidates") return "Candidates"
  if (pathname.startsWith("/candidates/")) return "Candidate Details"
  if (pathname === "/jobs") return "Jobs"
  if (pathname.startsWith("/jobs/")) return "Job Details"
  return "Mini ATS"
}

export function Topbar({ user }: TopbarProps) {
  const pathname = usePathname()
  const pageTitle = getPageTitle(pathname)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-xs sm:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Drawer */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9 text-muted-foreground"
                aria-label="Open sidebar"
              />
            }
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 flex flex-col justify-between">
            <div>
              <SheetHeader className="p-4 border-b border-border flex flex-row items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Briefcase className="h-4 w-4" />
                </div>
                <SheetTitle className="text-base font-bold">Mini ATS</SheetTitle>
              </SheetHeader>
              <SidebarNav onItemClick={() => setMobileOpen(false)} />
            </div>
            <SidebarUserFooter user={user} />
          </SheetContent>
        </Sheet>

        <h1 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Global search input */}
        <div className="relative hidden w-48 sm:block md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search candidates, jobs..."
            className="pl-8 h-9 text-sm rounded-lg bg-muted/50 focus:bg-background"
          />
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Menu */}
        <UserNav user={user} />
      </div>
    </header>
  )
}
