"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Menu, Search, Briefcase, Plus, Radio } from "lucide-react"
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

function getPageTitle(pathname: string): { title: string; subtitle: string } {
  if (pathname === "/") return { title: "Command Center", subtitle: "Real-time recruitment telemetry & analytics" }
  if (pathname === "/candidates") return { title: "Candidate Matrix", subtitle: "Pipeline orchestration & applicant dossiers" }
  if (pathname.startsWith("/candidates/")) return { title: "Candidate Dossier", subtitle: "Deep inspection and stage history" }
  if (pathname === "/jobs") return { title: "Job Requisitions", subtitle: "Active position openings & department tracking" }
  if (pathname.startsWith("/jobs/")) return { title: "Requisition Details", subtitle: "Department allocations and applicant pool" }
  return { title: "Mini ATS", subtitle: "Next-generation hiring intelligence" }
}

export function Topbar({ user }: TopbarProps) {
  const pathname = usePathname()
  const { title, subtitle } = getPageTitle(pathname)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur-md sm:px-6">
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
          <SheetContent side="left" className="w-64 p-0 flex flex-col justify-between glass-panel border-r border-border/70">
            <div>
              <SheetHeader className="p-4 border-b border-border/50 flex flex-row items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-tr from-cyan-500 to-indigo-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                  <Briefcase className="h-4 w-4" />
                </div>
                <SheetTitle className="text-base font-bold tracking-tight">Mini ATS</SheetTitle>
              </SheetHeader>
              <SidebarNav onItemClick={() => setMobileOpen(false)} />
            </div>
            <SidebarUserFooter user={user} />
          </SheetContent>
        </Sheet>

        <div className="flex flex-col">
          <div className="flex items-center gap-2.5">
            <h1 className="text-base font-bold tracking-tight text-foreground md:text-lg">
              {title}
            </h1>
            <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-medium text-emerald-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span>LIVE CORE</span>
            </div>
          </div>
          <span className="hidden sm:inline-block text-[11px] text-muted-foreground font-medium">
            {subtitle}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Quick Navigate Actions */}
        <div className="hidden sm:flex items-center gap-2">
          <Link href="/candidates">
            <Button size="xs" variant="outline" className="h-7 text-xs gap-1 border-cyan-500/20 hover:border-cyan-500/40 hover:bg-cyan-500/5">
              <Plus className="h-3 w-3 text-cyan-400" />
              <span>Pipeline</span>
            </Button>
          </Link>
          <Link href="/jobs">
            <Button size="xs" variant="outline" className="h-7 text-xs gap-1 border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-500/5">
              <Briefcase className="h-3 w-3 text-purple-400" />
              <span>Jobs</span>
            </Button>
          </Link>
        </div>

        {/* Global search input */}
        <div className="relative hidden w-36 sm:block md:w-56">
          <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Neural Search..."
            className="pl-8 h-8 text-xs rounded-lg bg-muted/40 border-border/50 focus:bg-background focus:border-primary/50"
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
