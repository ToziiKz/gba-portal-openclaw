'use server'

import { createHash, randomBytes } from 'crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') throw new Error('Not authorized')

  return { supabase, user }
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

  revalidatePath('/dashboard/acces')

  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const inviteUrl = `${base}/activate?inv=${inv.id}&token=${token}`
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

  revalidatePath('/dashboard/acces')
}
