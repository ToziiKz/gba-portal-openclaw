'use client'

import * as React from 'react'

export type DashboardRole = 'viewer' | 'coach' | 'staff' | 'admin'

export const DASHBOARD_ROLE_STORAGE_KEY = 'gba.dashboardRole'

const roleOrder: Record<DashboardRole, number> = {
  viewer: 0,
  coach: 1,
  staff: 2,
  admin: 3,
}

export function isAdminRole(role: DashboardRole) {
  return role === 'admin'
}

export function readDashboardRoleFromStorage(): DashboardRole {
  if (typeof window === 'undefined') return 'staff'
  try {
    const stored = window.localStorage.getItem(DASHBOARD_ROLE_STORAGE_KEY)
    const maybe = stored as DashboardRole
    if (maybe && maybe in roleOrder) return maybe
  } catch {
    // ignore
  }
  return 'staff'
}

export function useDashboardRole() {
  const [role, setRole] = React.useState<DashboardRole>('staff')

  React.useEffect(() => {
    setRole(readDashboardRoleFromStorage())

    const onStorage = (e: StorageEvent) => {
      if (e.key !== DASHBOARD_ROLE_STORAGE_KEY) return
      setRole(readDashboardRoleFromStorage())
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return role
}
