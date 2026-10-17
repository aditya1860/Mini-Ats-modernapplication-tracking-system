"use client"

import * as React from "react"
import { signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LogOut, User as UserIcon } from "lucide-react"

interface UserNavProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

function getInitials(name?: string | null): string {
  if (!name) return "U"
  const parts = name.trim().split(" ")
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function UserNav({ user }: UserNavProps) {
  const initials = getInitials(user?.name)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="relative h-9 w-9 rounded-full p-0 ring-offset-background"
          />
        }
      >
        <Avatar className="h-9 w-9 cursor-pointer">
          {user?.image && <AvatarImage src={user.image} alt={user?.name || "User"} />}
          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
              <p className="text-xs leading-none text-muted-foreground truncate">
                {user?.email || "recruiter@miniats.com"}
              </p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="cursor-pointer gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function SidebarUserFooter({ user }: UserNavProps) {
  const initials = getInitials(user?.name)

  return (
    <div className="border-t border-border p-3 flex items-center justify-between gap-2">
      <div className="flex items-center gap-3 min-w-0">
        <Avatar className="h-8 w-8 shrink-0">
          {user?.image && <AvatarImage src={user.image} alt={user?.name || "User"} />}
          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium leading-tight truncate text-foreground">
            {user?.name || "Alex Rivera"}
          </span>
          <span className="text-xs text-muted-foreground truncate">
            {user?.email || "recruiter@miniats.com"}
          </span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
        onClick={() => signOut({ callbackUrl: "/login" })}
        title="Sign out"
        aria-label="Sign out"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  )
}
