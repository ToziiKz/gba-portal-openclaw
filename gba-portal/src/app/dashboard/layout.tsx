import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'

import { createClient } from '@/lib/supabase/server'
import { PermissionsProvider } from '@/components/PermissionsProvider'

import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { getDashboardScope } from '@/lib/dashboard/getDashboardScope'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Espace staff GBA.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: '/dashboard',
  },
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  noStore()
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  const rawUserProfile = profile || {
    full_name: user.user_metadata.full_name || user.email,
    role: 'viewer',
    email: user.email!,
    is_active: true,
  }

  const normalizedRole = String(rawUserProfile.role ?? 'viewer').trim().toLowerCase()
  const userProfile = {
    ...rawUserProfile,
    role:
      normalizedRole === 'admin' ||
      normalizedRole === 'staff' ||
      normalizedRole === 'coach' ||
      normalizedRole === 'viewer'
        ? normalizedRole
        : 'viewer',
  }

  if (userProfile.is_active === false) {
    redirect('/login?disabled=1')
  }

  const scope = await getDashboardScope()

  return (
    <DashboardShell userProfile={userProfile} scope={scope}>
      <div className="mx-auto w-full max-w-6xl">
        <section aria-label="Contenu du dashboard" className="min-w-0">
          <PermissionsProvider role={scope.role}>{children}</PermissionsProvider>
        </section>
      </div>
    </DashboardShell>
  )
}
