'use client'

import * as React from 'react'

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

import { Button } from '@/components/ui/Button'
import { getNavLabelForPath } from '@/lib/dashboard/nav'
import { useDashboardScope } from '@/components/dashboard/DashboardScopeProvider'
import type { DashboardRole } from '@/lib/dashboardRole'

type Props = {
  role: DashboardRole
  userName?: string
  userEmail?: string
  onOpenSpotlight: () => void
}

export function DashboardTopbar({ role, userName, userEmail, onOpenSpotlight }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const title = React.useMemo(() => getNavLabelForPath(pathname), [pathname])
  const scope = useDashboardScope()

  const assignedTeamsLabel = React.useMemo(() => {
    if (role !== 'coach') return null
    if (!scope.assignedTeams || scope.assignedTeams.length === 0) return null
    // Display: "U13 D1" or "U13 D1 + 1" if multiple
    const primary = scope.assignedTeams[0]
    const extra = scope.assignedTeams.length - 1
    return extra > 0 ? `${primary.name} + ${extra}` : primary.name
  }, [role, scope.assignedTeams])

  const handleLogout = async () => {
    // Clear session
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="sticky top-6 z-40 mb-6">
      <div className="rounded-[28px] border border-[color:var(--ui-border)] bg-[color:var(--ui-surface)] px-4 py-3 shadow-[var(--ui-shadow-sm)] backdrop-blur-xl md:px-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.52em] text-[color:var(--ui-muted-2)]">
              Quartier général
            </p>
            <p className="mt-2 truncate font-[var(--font-teko)] text-2xl font-black uppercase tracking-[0.08em] text-[color:var(--ui-fg)] md:text-3xl">
              {title}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="hidden flex-col items-end md:flex">
              <p className="text-sm font-bold text-[color:var(--ui-fg)]">
                {userName ?? 'Utilisateur'}
              </p>
              {userEmail ? (
                <p className="mt-0.5 text-xs text-[color:var(--ui-muted)]">{userEmail}</p>
              ) : null}
              <div className="mt-1 flex items-center gap-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--ui-muted)]">
                  {role}
                </p>
                {assignedTeamsLabel ? (
                  <span className="rounded-full border border-[color:var(--ui-border)] bg-[color:var(--ui-surface-2)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[color:var(--ui-muted)]">
                    {assignedTeamsLabel}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="h-8 w-[1px] bg-[color:var(--ui-border)] hidden md:block" />

            <button
              type="button"
              onClick={onOpenSpotlight}
              className="group inline-flex items-center gap-3 rounded-full border border-[color:var(--ui-border)] bg-[color:var(--ui-surface)] px-4 py-2 text-xs font-semibold text-[color:var(--ui-fg)] transition hover:bg-[color:var(--ui-surface-2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ui-ring)]"
              aria-label="Ouvrir la recherche (Cmd+K)"
            >
              <span className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--ui-muted-2)]">
                Rechercher
              </span>
              <span className="font-black">⌘K</span>
            </button>

            <Link
              href="/"
              className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-[var(--ui-radius-sm)] px-3 text-sm font-medium text-[color:var(--ui-fg)] transition-colors hover:bg-[color:var(--ui-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ui-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--ui-bg)] md:inline-flex"
              aria-label="Retourner au site public"
              title="Site public"
            >
              Site public
            </Link>

            <Button size="sm" variant="secondary" onClick={handleLogout}>
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
