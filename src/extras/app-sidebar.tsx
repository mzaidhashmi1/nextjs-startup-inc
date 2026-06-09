'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"

import { usePathname } from 'next/navigation'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChevronsUpDown } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Inter } from 'next/font/google'
import Link from "next/link"
import { Building } from "lucide-react"
import { Users } from "lucide-react"
import { LayoutDashboard } from "lucide-react"
import { logout } from "@/lib/api"

const inter = Inter({ subsets: ['latin'] })

export function AppSidebar() {

const pathname = usePathname()

const isDashboardActive = pathname === "/dashboard"
const isUsersActive = pathname === "/users"
const isOrganizationsActive = pathname === "/organizations"

  return (
    <Sidebar className={inter.className} collapsible="icon">

      <SidebarHeader>
  <div className="flex flex-row items-center gap-2 w-full">
    <Avatar className="h-8 w-8 rounded-lg shrink-0">
      <AvatarFallback className="rounded-lg bg-neutral-800 text-white">PA</AvatarFallback>
    </Avatar>

    <span className="whitespace-nowrap text-base font-semibold group-data-[collapsible=icon]:hidden"> 
      Platform Admin
    </span>

  </div>
</SidebarHeader>

      <SidebarContent>
        <SidebarGroup>

          <SidebarGroupLabel>Portal</SidebarGroupLabel>

          <SidebarGroupContent>
  <SidebarMenu>

    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isDashboardActive} size="default">
        <Link href="/dashboard">
          <LayoutDashboard />
          <span>Dashboard</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>

    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isUsersActive} size="default">
        <Link href="/users">
          <Users />
          <span>Users</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>

    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isOrganizationsActive} size="default">
        <Link href="/organizations">
          <Building />
          <span>Organizations</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>

  </SidebarMenu>
</SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton size="lg">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg bg-neutral-800 text-white">AD</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Admin1</span>
              <span className="truncate text-xs text-muted-foreground">admin@techanzy.com</span>
            </div>
            <ChevronsUpDown className="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="end">
          <DropdownMenuItem className={inter.className} onClick={logout}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}