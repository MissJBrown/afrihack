'use client'

import type { LucideIcon } from 'lucide-react'
import { LogOut } from 'lucide-react'
import { Wordmark } from './logo'
import { useAuth } from '@/lib/auth'

export type NavItem = { id: string; label: string; icon: LucideIcon }

export function PortalShell({
  badge,
  nav,
  active,
  onSelect,
  children,
}: {
  badge: string
  nav: NavItem[]
  active: string
  onSelect: (id: string) => void
  children: React.ReactNode
}) {
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-sidebar px-4 py-6 text-sidebar-foreground md:flex">
        <div className="px-2">
          <Wordmark variant="light" />
        </div>
        <div className="mt-1 px-2">
          <span className="inline-flex rounded-full bg-sidebar-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
            {badge}
          </span>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {nav.map((item) => {
            const Icon = item.icon
            const isActive = active === item.id
            return (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                }`}
              >
                <Icon className="size-4 shrink-0" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="mt-4 border-t border-sidebar-border pt-4">
          <div className="flex items-center gap-3 px-2">
            <div className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {user?.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{user?.name}</div>
              <div className="truncate text-xs text-sidebar-foreground/60">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top nav */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto bg-sidebar px-4 py-3 md:hidden">
          <Wordmark variant="light" />
          <button onClick={logout} aria-label="Sign out" className="text-sidebar-foreground/70">
            <LogOut className="size-5" />
          </button>
        </div>
        <div className="flex gap-1 overflow-x-auto border-b border-border bg-card px-2 py-2 md:hidden">
          {nav.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium ${
                active === item.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  )
}
