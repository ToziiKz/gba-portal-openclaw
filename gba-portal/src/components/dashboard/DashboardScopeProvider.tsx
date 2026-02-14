'use client'

import * as React from 'react'

export type DashboardScope = {
  role: 'viewer' | 'coach' | 'staff' | 'admin'
  editableTeamIds: string[]
  assignedTeams: { id: string; name: string; category: string }[]
  viewableTeamIds: string[] | null
  viewablePoles: string[] | null
}

const Ctx = React.createContext<DashboardScope | null>(null)

export function DashboardScopeProvider({ scope, children }: { scope: DashboardScope; children: React.ReactNode }) {
  return <Ctx.Provider value={scope}>{children}</Ctx.Provider>
}

export function useDashboardScope() {
  const v = React.useContext(Ctx)
  if (!v) throw new Error('useDashboardScope must be used within DashboardScopeProvider')
  return v
}
