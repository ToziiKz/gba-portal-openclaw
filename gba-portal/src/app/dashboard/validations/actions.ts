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
        firstname: (payload.firstname as string) ?? (payload.first_name as string),
        lastname: (payload.lastname as string) ?? (payload.last_name as string),
        team_id: payload.team_id as string,
        gender: (payload.gender as string) ?? null,
        category: (payload.category as string) ?? null,
        club_name: (payload.club_name as string) ?? null,
        license_number: (payload.license_number as string) ?? null,
        mobile_phone: (payload.mobile_phone as string) ?? null,
        email: (payload.email as string) ?? null,
        legal_guardian_name: (payload.legal_guardian_name as string) ?? null,
        address_street: (payload.address_street as string) ?? null,
        address_zipcode: (payload.address_zipcode as string) ?? null,
        address_city: (payload.address_city as string) ?? null,
        licence_status: (payload.licence_status as string) ?? 'missing',
        payment_status: (payload.payment_status as string) ?? 'unpaid',
        equipment_status: (payload.equipment_status as string) ?? 'pending',
      },
    ])
    applyError = error
  } else if (action === 'players.update') {
    const { id, ...updateData } = {
      id: payload.id as string,
      team_id: payload.team_id as string,
      firstname: payload.firstname as string,
      lastname: payload.lastname as string,
      gender: (payload.gender as string) ?? null,
      mobile_phone: (payload.mobile_phone as string) ?? null,
      email: (payload.email as string) ?? null,
      legal_guardian_name: (payload.legal_guardian_name as string) ?? null,
    }

    const { error } = await supabase.from('players').update(updateData).eq('id', id)
    applyError = error
  } else if (action === 'players.move') {
    const { error } = await supabase
      .from('players')
      .update({ team_id: payload.team_id as string })
      .eq('id', payload.id as string)
    applyError = error
  } else if (action === 'players.delete') {
    const { error } = await supabase.from('players').delete().eq('id', payload.id as string)
    applyError = error
  } else if (action === 'planning_sessions.create') {
    const insertPayload = {
      team_id: payload.team_id as string,
      day: payload.day as string,
      session_date: (payload.session_date as string) ?? null,
      pole: payload.pole as string,
      start_time: payload.start_time as string,
      end_time: payload.end_time as string,
      location: payload.location as string,
      staff: (payload.staff as string[]) ?? [],
      note: (payload.note as string) ?? null,
    }

    let { error } = await supabase.from('planning_sessions').insert([insertPayload])

    // Backward compatibility if session_date column not yet deployed
    if (error && (error.message?.includes('session_date') || error.code === 'PGRST204')) {
      const legacyInsertPayload = Object.fromEntries(
        Object.entries(insertPayload).filter(([key]) => key !== 'session_date')
      )
      const retry = await supabase.from('planning_sessions').insert([legacyInsertPayload])
      error = retry.error
    }

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
