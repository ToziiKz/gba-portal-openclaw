'use server'

import { revalidatePath } from 'next/cache'
import { requireRole } from '@/lib/dashboard/authz'

export async function approveRequest(formData: FormData): Promise<void> {
  const { supabase } = await requireRole('admin')
  const id = formData.get('id')
  if (typeof id !== 'string' || !id) throw new Error('ID manquant')

  const { data: req, error } = await supabase
    .from('approval_requests')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !req) throw new Error('Demande introuvable')
  if (req.status !== 'pending') throw new Error('Demande déjà traitée')

  // Apply
  const action = req.action as string
  const payload = req.payload as unknown as Record<string, unknown>

  let applyError: { message?: string } | null = null

  if (action === 'teams.create') {
    const { error } = await supabase.from('teams').insert([
      {
        name: payload.name as string,
        category: payload.category as string,
        gender: payload.gender as string,
        coach_id: (payload.coach_id as string) ?? null,
      },
    ])
    applyError = error
  } else if (action === 'players.create') {
    const { error } = await supabase.from('players').insert([
      {
        first_name: payload.first_name as string,
        last_name: payload.last_name as string,
        team_id: payload.team_id as string,
        licence_status: (payload.licence_status as string) ?? 'missing',
        payment_status: (payload.payment_status as string) ?? 'unpaid',
        equipment_status: (payload.equipment_status as string) ?? 'pending',
      },
    ])
    applyError = error
  } else if (action === 'planning_sessions.create') {
    const { error } = await supabase.from('planning_sessions').insert([
      {
        team_id: payload.team_id as string,
        day: payload.day as string,
        pole: payload.pole as string,
        start_time: payload.start_time as string,
        end_time: payload.end_time as string,
        location: payload.location as string,
        staff: (payload.staff as string[]) ?? [],
        note: (payload.note as string) ?? null,
      },
    ])
    applyError = error
  } else if (action === 'planning_sessions.delete') {
    const { error } = await supabase
      .from('planning_sessions')
      .delete()
      .eq('id', payload.id as string)
    applyError = error
  } else {
    throw new Error(`Action inconnue: ${action}`)
  }

  if (applyError) {
    throw new Error('Erreur application: ' + (applyError.message ?? ''))
  }

  // Mark approved
  const { error: updErr } = await supabase
    .from('approval_requests')
    .update({ status: 'approved', decided_at: new Date().toISOString() })
    .eq('id', id)

  if (updErr) throw new Error('Appliqué mais erreur statut')

  revalidatePath('/dashboard/validations')
  revalidatePath('/dashboard/equipes')
  revalidatePath('/dashboard/joueurs')
  revalidatePath('/dashboard/planning')

  return
}

export async function rejectRequest(formData: FormData): Promise<void> {
  const { supabase } = await requireRole('admin')
  const id = formData.get('id')
  if (typeof id !== 'string' || !id) throw new Error('ID manquant')

  const { error } = await supabase
    .from('approval_requests')
    .update({ status: 'rejected', decided_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error('Erreur rejet')

  revalidatePath('/dashboard/validations')
  return
}
