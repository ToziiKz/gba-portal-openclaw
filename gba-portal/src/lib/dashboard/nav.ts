import type { DashboardRole } from '@/lib/dashboardRole'

export type NavItem = {
  label: string
  href: string
  status: 'ready' | 'coming'
  note?: string
  minRole?: DashboardRole
  children?: NavItem[]
}

export const roleLabels: Record<DashboardRole, string> = {
  viewer: 'lecture',
  coach: 'coach',
  staff: 'staff',
  admin: 'admin',
}

export const roleOrder: Record<DashboardRole, number> = {
  viewer: 0,
  coach: 1,
  staff: 2,
  admin: 3,
}

export const navItems: NavItem[] = [
  { label: 'Vue d’ensemble', href: '/dashboard', status: 'ready', minRole: 'viewer' },
  {
    label: 'Match',
    href: '/dashboard/match',
    status: 'ready',
    note: 'composition + convocations',
    minRole: 'coach',
    children: [
      {
        label: 'Composition',
        href: '/dashboard/tactique',
        status: 'ready',
        note: 'compo & terrain',
        minRole: 'coach',
      },
      {
        label: 'Convocations',
        href: '/dashboard/convocations',
        status: 'ready',
        note: 'groupe match',
        minRole: 'coach',
      },
    ],
  },
  {
    label: 'Rapports',
    href: '/dashboard/rapports',
    status: 'ready',
    note: 'KPIs + alertes',
    minRole: 'viewer',
  },
  {
    label: 'Relances',
    href: '/dashboard/relances',
    status: 'ready',
    note: 'backlog actionnable',
    minRole: 'staff',
  },
  { label: 'Équipes', href: '/dashboard/equipes', status: 'ready', minRole: 'coach' },
  {
    label: 'Effectif',
    href: '/dashboard/effectif',
    status: 'ready',
    note: 'équipes + joueurs',
    minRole: 'coach',
  },
  {
    label: 'Catégories',
    href: '/dashboard/categories',
    status: 'ready',
    note: 'U6 → U18 / seniors',
    minRole: 'coach',
  },
  { label: 'Joueurs', href: '/dashboard/joueurs', status: 'ready', minRole: 'coach' },
  {
    label: 'Planning hebdomadaire',
    href: '/dashboard/planning',
    status: 'ready',
    minRole: 'coach',
  },
  {
    label: 'Présences',
    href: '/dashboard/presences',
    status: 'ready',
    note: 'par séance',
    minRole: 'coach',
  },
  {
    label: 'Licences & paiements',
    href: '/dashboard/licences',
    status: 'ready',
    minRole: 'staff',
  },
  { label: 'Équipements', href: '/dashboard/equipements', status: 'ready', minRole: 'staff' },
  {
    label: 'Stock & matériel',
    href: '/dashboard/stock',
    status: 'ready',
    note: 'inventaire',
    minRole: 'staff',
  },
  {
    label: 'Staff (annuaire)',
    href: '/dashboard/staff',
    status: 'ready',
    note: 'contacts & dispo',
    minRole: 'admin',
  },
  {
    label: 'Validations',
    href: '/dashboard/validations',
    status: 'ready',
    note: 'file d’approbation',
    minRole: 'admin',
  },
  {
    label: 'Accès coachs',
    href: '/dashboard/acces',
    status: 'ready',
    note: 'invitations',
    minRole: 'admin',
  },
]

const coachPrimaryHrefs = new Set([
  '/dashboard',
  '/dashboard/effectif',
  '/dashboard/planning',
  '/dashboard/presences',
  '/dashboard/match',
])

export function canAccess(role: DashboardRole, item: NavItem) {
  const min = item.minRole ?? 'viewer'
  return roleOrder[role] >= roleOrder[min]
}

export function getVisibleNavItems(role: DashboardRole) {
  const base = navItems
    .filter((item) => item.status === 'ready' && canAccess(role, item))
    .map((item) => ({
      ...item,
      children: (item.children ?? []).filter((child) => child.status === 'ready' && canAccess(role, child)),
    }))

  if (role !== 'coach') return base
  return base.filter((item) => coachPrimaryHrefs.has(item.href))
}

export function flattenVisibleNavItems(role: DashboardRole) {
  const visible = getVisibleNavItems(role)
  const out: NavItem[] = []

  for (const item of visible) {
    out.push(item)
    for (const child of item.children ?? []) out.push(child)
  }

  return out
}

export function normalizePath(pathname: string | null) {
  if (!pathname) return '/'
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1)
  return pathname
}

export function isActivePath(current: string, href: string) {
  const cur = normalizePath(current)
  const target = normalizePath(href)
  return cur === target
}

export function getNavLabelForPath(pathname: string | null) {
  const cur = normalizePath(pathname)

  for (const item of navItems) {
    if (normalizePath(item.href) === cur) return item.label
    for (const child of item.children ?? []) {
      if (normalizePath(child.href) === cur) return child.label
    }
  }

  return 'Dashboard'
}
