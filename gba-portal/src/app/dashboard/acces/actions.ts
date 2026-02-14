'use server'

import { createHash, randomBytes } from 'crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/dashboard/authz'

async function requireAdmin() {
  const { supabase, user } = await requireRole('admin')
  return { supabase, user }
}

function buildInviteUrl(invitationId: string, token: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${base}/activate?inv=${invitationId}&token=${token}`
}

async function logAccessEvent(
  supabase: Awaited<ReturnType<typeof createClient>>,
  actorId: string,
  action: string,
  targetType: string,
  targetId: string,
  meta?: Record<string, unknown>
) {
  await supabase.from('access_admin_events').insert([
    {
      actor_id: actorId,
      action,
      target_type: targetType,
      target_id: targetId,
      meta: meta ?? {},
    },
  ])
}

export async function approveCoachRequest(formData: FormData) {
  const { supabase, user } = await requireAdmin()

  const requestId = String(formData.get('requestId') ?? '')
  if (!requestId) throw new Error('requestId manquant')

  const { data: request, error: reqErr } = await supabase
    .from('coach_access_requests')
    .select('*')
    .eq('id', requestId)
    .single()

  if (reqErr || !request) throw new Error('Demande introuvable')

  const token = randomBytes(24).toString('hex')
  const tokenHash = createHash('sha256').update(token).digest('hex')

  const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString()

  const { data: inv, error: invErr } = await supabase
    .from('coach_invitations')
    .insert([
      {
        request_id: request.id,
        email: request.email,
        full_name: request.full_name,
        role: 'coach',
        token_hash: tokenHash,
        expires_at: expiresAt,
        created_by: user.id,
      },
    ])
    .select('id')
    .single()

  if (invErr || !inv) throw new Error('Impossible de créer l’invitation')

  const { error: updErr } = await supabase
    .from('coach_access_requests')
    .update({ status: 'approved', decided_at: new Date().toISOString(), decided_by: user.id })
    .eq('id', request.id)

  if (updErr) throw new Error('Invitation créée, mais update demande impossible')

  await logAccessEvent(supabase, user.id, 'request.approve', 'coach_access_request', request.id, {
    invitationId: inv.id,
    email: request.email,
  })

  revalidatePath('/dashboard/acces')

  const inviteUrl = buildInviteUrl(inv.id, token)
  redirect(`/dashboard/acces?invite=${encodeURIComponent(inviteUrl)}`)
}

export async function regenerateCoachInvitation(formData: FormData) {
  const { supabase, user } = await requireAdmin()

  const invitationId = String(formData.get('invitationId') ?? '')
  if (!invitationId) throw new Error('invitationId manquant')

  const { data: inv, error: invErr } = await supabase
    .from('coach_invitations')
    .select('id')
    .eq('id', invitationId)
    .single()

  if (invErr || !inv) throw new Error('Invitation introuvable')

  const token = randomBytes(24).toString('hex')
  const tokenHash = createHash('sha256').update(token).digest('hex')
  const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString()

  const { error: updErr } = await supabase
    .from('coach_invitations')
    .update({ token_hash: tokenHash, expires_at: expiresAt, used_at: null, used_by: null })
    .eq('id', inv.id)

  if (updErr) throw new Error('Impossible de régénérer l’invitation')

  await logAccessEvent(supabase, user.id, 'invitation.regenerate', 'coach_invitation', inv.id)

  revalidatePath('/dashboard/acces')

  const inviteUrl = buildInviteUrl(inv.id, token)
  redirect(`/dashboard/acces?invite=${encodeURIComponent(inviteUrl)}`)
}

export async function rejectCoachRequest(formData: FormData) {
  const { supabase, user } = await requireAdmin()

  const requestId = String(formData.get('requestId') ?? '')
  if (!requestId) throw new Error('requestId manquant')

  const { error } = await supabase
    .from('coach_access_requests')
    .update({ status: 'rejected', decided_at: new Date().toISOString(), decided_by: user.id })
    .eq('id', requestId)

  if (error) throw new Error('Impossible de rejeter la demande')

  await logAccessEvent(supabase, user.id, 'request.reject', 'coach_access_request', requestId)
  revalidatePath('/dashboard/acces')
}

export async function setCoachActiveState(formData: FormData) {
  const { supabase, user } = await requireAdmin()

  const coachId = String(formData.get('coachId') ?? '')
  const active = String(formData.get('active') ?? '') === '1'

  if (!coachId) throw new Error('coachId manquant')

  const { error } = await supabase
    .from('profiles')
    .update({ is_active: active })
    .eq('id', coachId)
    .eq('role', 'coach')

  if (error) throw new Error('Impossible de changer l’état du coach')

  await logAccessEvent(supabase, user.id, active ? 'coach.activate' : 'coach.suspend', 'profile', coachId)
  revalidatePath('/dashboard/acces')
}

export async function setCoachTeams(formData: FormData) {
  const { supabase, user } = await requireAdmin()

  const coachId = String(formData.get('coachId') ?? '')
  const teamIds = formData.getAll('teamIds').map((v) => String(v)).filter(Boolean)

  if (!coachId) throw new Error('coachId manquant')

  const { error: profileRoleErr } = await supabase
    .from('profiles')
    .update({ role: 'coach', is_active: true })
    .eq('id', coachId)

  if (profileRoleErr) throw new Error('Impossible de basculer le compte en coach')

  const { error: clearErr } = await supabase.from('teams').update({ coach_id: null }).eq('coach_id', coachId)
  if (clearErr) throw new Error('Impossible de nettoyer les anciennes affectations')

  if (teamIds.length > 0) {
    const { error: assignErr } = await supabase
      .from('teams')
      .update({ coach_id: coachId })
      .in('id', teamIds)
    if (assignErr) throw new Error('Impossible d’affecter les équipes')
  }

  // Legacy compatibility: keep staff_team_memberships in sync when table exists.
  const { error: clearMembershipErr } = await supabase
    .from('staff_team_memberships')
    .delete()
    .eq('user_id', coachId)

  // Ignore if table does not exist; otherwise fail to avoid silent inconsistency.
  if (clearMembershipErr && !String(clearMembershipErr.message || '').includes('does not exist')) {
    throw new Error('Impossible de nettoyer les memberships coach')
  }

  if (teamIds.length > 0) {
    const rows = teamIds.map((teamId) => ({ user_id: coachId, team_id: teamId, role: 'coach' }))
    const { error: insertMembershipErr } = await supabase.from('staff_team_memberships').insert(rows)
    if (insertMembershipErr && !String(insertMembershipErr.message || '').includes('does not exist')) {
      throw new Error('Impossible d’enregistrer les memberships coach')
    }
  }

  const { data: assignedRows, error: verifyErr } = await supabase
    .from('teams')
    .select('id')
    .eq('coach_id', coachId)

  if (verifyErr) throw new Error('Impossible de vérifier les affectations coach')
  const assignedCount = assignedRows?.length ?? 0
  if (assignedCount !== teamIds.length) {
    throw new Error('Affectation partielle détectée. Merci de réessayer.')
  }

  await logAccessEvent(supabase, user.id, 'coach.assign_teams', 'profile', coachId, {
    teamIds,
    count: teamIds.length,
  })

  revalidatePath('/dashboard/acces')
}
