'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

type Role = 'ADMIN' | 'COACH' | 'VIEWER'

interface PermissionsContextType {
  role: Role
  setRole: (role: Role) => void
  canEdit: boolean
  canDelete: boolean
  canViewMoney: boolean
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined)

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('ADMIN')

  const permissions = {
    ADMIN: { canEdit: true, canDelete: true, canViewMoney: true },
    COACH: { canEdit: true, canDelete: false, canViewMoney: false },
    VIEWER: { canEdit: false, canDelete: false, canViewMoney: false },
  }

  const currentPerms = permissions[role]

  return (
    <PermissionsContext.Provider value={{ role, setRole, ...currentPerms }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border border-white/10 bg-black/80 px-3 py-1.5 text-xs text-white backdrop-blur-md shadow-2xl">
        <span className="opacity-50 uppercase tracking-widest text-[10px]">Role Mock</span>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className="bg-transparent font-bold text-amber-500 focus:outline-none cursor-pointer"
        >
          <option value="ADMIN">ADMIN</option>
          <option value="COACH">COACH</option>
          <option value="VIEWER">VIEWER</option>
        </select>
      </div>
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
