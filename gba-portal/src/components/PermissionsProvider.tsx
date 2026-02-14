'use client'

import React, { createContext, useContext, ReactNode } from 'react'

export type Role = 'admin' | 'staff' | 'coach' | 'viewer'

interface PermissionsContextType {
  role: Role
  canEdit: boolean
  canDelete: boolean
  canViewMoney: boolean
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined)

export function PermissionsProvider({ children, role }: { children: ReactNode; role: Role }) {
  const permissions: Record<Role, Omit<PermissionsContextType, 'role'>> = {
    admin: { canEdit: true, canDelete: true, canViewMoney: true },
    staff: { canEdit: true, canDelete: true, canViewMoney: true },
    coach: { canEdit: true, canDelete: false, canViewMoney: false },
    viewer: { canEdit: false, canDelete: false, canViewMoney: false },
  }

  return (
    <PermissionsContext.Provider value={{ role, ...permissions[role] }}>
      {children}
    </PermissionsContext.Provider>
  )
}

export function usePermissions() {
  const context = useContext(PermissionsContext)
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider')
  }
  return context
}
