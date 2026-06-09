"use client"

import { usePathname } from "next/navigation"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/extras/app-sidebar"
import { ThemeProvider } from "@/extras/theme-provider"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { Inter } from "next/font/google"
import { PrivateRoute } from "@/extras/private-route"

const inter = Inter({
  subsets: ["latin"],
})

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/users": "Users",
  "/organizations": "Organization",
}

function Header() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const title = PAGE_TITLES[pathname] ?? "Dashboard"

  return (
    <header className="flex h-12 items-center justify-between px-4 border-b border-border">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <span className="text-sm font-semibold tracking-wide text-foreground">
          {title}
        </span>
      </div>

      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    </header>
  )
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PrivateRoute>
    <ThemeProvider>
      <div className={inter.className}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <Header />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </div>
    </ThemeProvider>
    </PrivateRoute>
  )
}