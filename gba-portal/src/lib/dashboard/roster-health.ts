import { createClient } from '@/lib/supabase/server'
import { getDashboardScope } from '@/lib/dashboard/getDashboardScope'
import { log } from '@/lib/logger'

/**
 * Module "Santé Équipe" pour le Coach
 * Extrait les infos critiques : administratif, logistique, éligibilité.
 */

export type PlayerHealthInfo = {
  id: string
  first_name: string
  last_name: string
  team_id: string | null
  licence_status: 'valid' | 'pending' | 'missing' | 'expired'
  payment_status: 'paid' | 'partial' | 'unpaid'
  equipment_status: 'received' | 'partial' | 'pending'
  size_label?: string | null // On l'ajoutera via metadata ou colonne si nécessaire
}

type RawPlayer = {
  id: string
  firstname: string
  lastname: string
  team_id: string | null
  licence_status: 'valid' | 'pending' | 'missing' | 'expired'
  payment_status: 'paid' | 'partial' | 'unpaid'
  equipment_status: 'received' | 'partial' | 'pending'
}

export async function getCoachRosterHealth() {
  const supabase = await createClient()
  const scope = await getDashboardScope()

  if (scope.role !== 'coach' && scope.role !== 'admin' && scope.role !== 'staff') {
    return { players: [], stats: null }
  }

  let query = supabase.from('players').select(`
    id,
    firstname,
    lastname,
    team_id,
    licence_status,
    payment_status,
    equipment_status
  `)

  if (scope.role === 'coach' && scope.viewableTeamIds?.length) {
    query = query.in('team_id', scope.viewableTeamIds)
  }

  const { data: players, error } = await query.order('lastname')

  if (error) {
    log.error('Error fetching roster health:', error)
    return { players: [], stats: null }
  }

  const stats = {
    total: players.length,
    ready: players.filter(p => p.licence_status === 'valid' && p.payment_status === 'paid').length,
    pendingEquipment: players.filter(p => p.equipment_status !== 'received').length,
    unpaid: players.filter(p => p.payment_status === 'unpaid').length
  }

  return {
    players: ((players ?? []) as RawPlayer[]).map((p) => ({
      ...p,
      first_name: p.firstname,
      last_name: p.lastname,
    })) as PlayerHealthInfo[],
    stats,
  }
}
