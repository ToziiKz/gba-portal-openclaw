import { createClient } from '@/lib/supabase/server'

export type DashboardRole = 'viewer' | 'coach' | 'staff' | 'admin'

const roleOrder: Record<DashboardRole, number> = {
  viewer: 0,
  coach: 1,
  staff: 2,
  admin: 3,
}

export async function requireRole(minRole: DashboardRole) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_active')
    .eq('id', user.id)
    .single()

  const rawRole = String(profile?.role ?? 'viewer').trim().toLowerCase()
  const role: DashboardRole =
    rawRole === 'admin' || rawRole === 'staff' || rawRole === 'coach' || rawRole === 'viewer'
      ? rawRole
      : 'viewer'

  if (profile?.is_active === false) throw new Error('Compte suspendu')
  if (roleOrder[role] < roleOrder[minRole]) throw new Error('Not authorized')

  return { supabase, user, role }
}
