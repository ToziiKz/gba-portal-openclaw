'use client'

import * as React from 'react'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

import { getVisibleNavItems, isActivePath } from '@/lib/dashboard/nav'
import type { DashboardRole } from '@/lib/dashboardRole'

type Props = {
  role: DashboardRole
}

export function DashboardSidebar({ role }: Props) {
  const pathname = usePathname()
  const items = React.useMemo(() => getVisibleNavItems(role), [role])

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-full w-64 shrink-0 flex-col border-r border-[color:var(--ui-border)] bg-[color:var(--ui-surface)]/50 backdrop-blur-xl lg:flex">
      <div className="flex h-20 items-center px-6">
        <Link href="/dashboard" className="flex items-center gap-2 focus:outline-none">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[color:var(--ui-border)] bg-white/5 overflow-hidden">
            <Image src="/brand/logo.png" alt="GBA" width={40} height={40} className="h-10 w-10 object-contain" priority />
          </div>
          <div className="leading-tight text-center">
            <span className="block font-[var(--font-teko)] text-2xl font-black uppercase tracking-wider text-[color:var(--ui-fg)]">
              ESPACE GBA
            </span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.35em] text-[color:var(--ui-muted-2)]">
              Groupement Bruche Ackerland
            </span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <ul className="space-y-1">
          {items.map((item) => {
            const active = isActivePath(pathname ?? '', item.href)
            const hasActiveChild = (item.children ?? []).some((child) => isActivePath(pathname ?? '', child.href))
            const showChildren = (item.children?.length ?? 0) > 0 && (active || hasActiveChild)

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`group flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ui-ring)] ${
                    active
                      ? 'bg-[color:var(--ui-surface-2)] text-[color:var(--ui-fg)] shadow-[var(--ui-shadow-sm)]'
                      : 'text-[color:var(--ui-muted)] hover:bg-[color:var(--ui-surface)] hover:text-[color:var(--ui-fg)]'
                  }`}
                >
                  <span>{item.label}</span>
                  {active ? (
                    <div className="h-1.5 w-1.5 rounded-full bg-[color:var(--ui-ring)] shadow-[0_0_8px_currentColor]" />
                  ) : null}
                </Link>

                {showChildren ? (
                  <ul className="mt-1 grid gap-1 pl-3">
                    {(item.children ?? []).map((sub) => {
                      const subActive = isActivePath(pathname ?? '', sub.href)
                      return (
                        <li key={sub.href}>
                          <Link
                            href={sub.href}
                            className={`block rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                              subActive
                                ? 'bg-[color:var(--ui-surface-2)] text-[color:var(--ui-fg)]'
                                : 'text-[color:var(--ui-muted)] hover:bg-[color:var(--ui-surface)] hover:text-[color:var(--ui-fg)]'
                            }`}
                          >
                            {sub.label}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                ) : null}
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-[color:var(--ui-border)] p-4">
        <div className="rounded-xl border border-[color:var(--ui-border)] bg-[color:var(--ui-surface)] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--ui-muted-2)]">
            Support
          </p>
          <p className="mt-1 text-xs text-[color:var(--ui-muted)]">
            Un problème ? Contacte le support technique.
          </p>
        </div>
      </div>
    </aside>
  )
}
