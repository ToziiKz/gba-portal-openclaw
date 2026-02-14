'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'

const createSchema = z.object({
  teamId: z.string().uuid(),
  day: z.enum(['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']),
  pole: z.string().min(2),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  location: z.string().min(2),
  staff: z.string().optional(),
  note: z.string().optional(),
})

export async function createPlanningSession(prevState: unknown, formData: FormData) {
  const supabase = await createClient()

  const raw = {
    teamId: formData.get('teamId'),
    day: formData.get('day'),
    pole: formData.get('pole'),
    startTime: formData.get('startTime'),
    endTime: formData.get('endTime'),
    location: formData.get('location'),
    staff: formData.get('staff') ?? undefined,
    note: formData.get('note') ?? undefined,
  }

  const parsed = createSchema.safeParse(raw)
  if (!parsed.success) return { message: 'Données invalides' }

  const staffList = (parsed.data.staff ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { message: 'Non authentifié' }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

  const payload = {
    team_id: parsed.data.teamId,
    day: parsed.data.day,
    pole: parsed.data.pole,
    start_time: parsed.data.startTime,
    end_time: parsed.data.endTime,
    location: parsed.data.location,
    staff: staffList,
    note: parsed.data.note ? parsed.data.note : null,
  }

  if (profile?.role === 'admin') {
    const { error } = await supabase.from('planning_sessions').insert([payload])
    if (error) return { message: 'Erreur création séance' }
    revalidatePath('/dashboard/planning')
    return { success: true }
  }

  const { error } = await supabase.from('approval_requests').insert([
    {
      requested_by: user.id,
      action: 'planning_sessions.create',
      entity: 'planning_sessions',
      payload,
    },
  ])

  if (error) return { message: 'Erreur demande validation' }

  revalidatePath('/dashboard/validations')
  return { success: true }
}

export async function deletePlanningSession(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const id = formData.get('id')
  if (typeof id !== 'string' || !id) throw new Error('ID manquant')

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Non authentifié')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

  if (profile?.role === 'admin') {
    const { error } = await supabase.from('planning_sessions').delete().eq('id', id)
    if (error) throw new Error('Erreur suppression séance')
    revalidatePath('/dashboard/planning')
    return
  }

  const { error } = await supabase.from('approval_requests').insert([
    {
      requested_by: user.id,
      action: 'planning_sessions.delete',
      entity: 'planning_sessions',
      payload: { id },
    },
  ])

  if (error) throw new Error('Erreur demande validation')

  revalidatePath('/dashboard/validations')
  return
}
