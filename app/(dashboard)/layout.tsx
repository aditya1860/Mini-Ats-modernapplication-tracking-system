import * as React from "react"
import { auth } from "@/lib/auth"
import { Briefcase } from "lucide-react"
import Link from "next/link"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { SidebarUserFooter } from "@/components/dashboard/user-nav"
import { Topbar } from "@/components/dashboard/topbar"
export const dynamic = "force-dynamic"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const user = session?.user

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Desktop Sidebar (240px = w-60) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col justify-between border-r border-border bg-sidebar md:flex">
        <div className="flex flex-col">
          {/* Logo & Brand Header */}
          <div className="flex h-16 items-center gap-3 border-b border-border px-6">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                <Briefcase className="h-4 w-4" />
              </div>
              <span className="text-base tracking-tight">Mini ATS</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <SidebarNav />
        </div>

        {/* User Card & Sign Out at Bottom */}
        <SidebarUserFooter user={user} />
      </aside>

      {/* Main Content Area */}
      <div className="flex min-h-screen flex-col md:pl-60">
        <Topbar user={user} />
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
