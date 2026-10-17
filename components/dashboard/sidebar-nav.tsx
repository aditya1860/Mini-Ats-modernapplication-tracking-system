"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Briefcase, Activity, Sparkles } from "lucide-react"
import { cn } from "cn"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  glowColor?: string
}

const navItems: NavItem[] = [
  {
    title: "Command Center",
    href: "/",
    icon: LayoutDashboard,
    badge: "HUD",
    glowColor: "from-cyan-500/20 to-blue-500/20",
  },
  {
    title: "Candidate Matrix",
    href: "/candidates",
    icon: Users,
    badge: "40",
    glowColor: "from-purple-500/20 to-pink-500/20",
  },
  {
    title: "Job Requisitions",
    href: "/jobs",
    icon: Briefcase,
    badge: "6",
    glowColor: "from-emerald-500/20 to-teal-500/20",
  },
]

interface SidebarNavProps {
  onItemClick?: () => void
}

export function SidebarNav({ onItemClick }: SidebarNavProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="flex flex-col gap-6 px-3 py-4">
      <div className="flex flex-col gap-1">
        <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/70">
          Navigation Matrix
        </div>
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                "group relative flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-all duration-150",
                active
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
                    active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <span>{item.title}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-mono",
                    active
                      ? "bg-primary-foreground/20 text-primary-foreground font-bold"
                      : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </div>

      <div className="rounded-xl border border-primary/20 bg-linear-to-b from-primary/10 to-transparent p-3 mx-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Neural Engine v2.4</span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          AI Candidate matching & automated stage velocity scoring enabled.
        </p>
      </div>
    </div>
  )
}
