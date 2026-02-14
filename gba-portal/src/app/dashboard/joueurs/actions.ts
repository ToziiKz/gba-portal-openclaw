'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getDashboardScope } from '@/lib/dashboard/getDashboardScope'
import { z } from 'zod'

const schema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  teamId: z.string().uuid(),
})

export async function createPlayer(prevState: unknown, formData: FormData) {
  const supabase = await createClient()

  const data = {
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    teamId: formData.get('teamId'),
  }

  const parsed = schema.safeParse(data)

  if (!parsed.success) {
    return { message: 'Données invalides' }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { message: 'Non authentifié' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_active')
    .eq('id', user.id)
    .single()

  if (profile?.is_active === false) {
    return { message: 'Compte suspendu' }
  }

  const payload = {
    first_name: parsed.data.firstName,
    last_name: parsed.data.lastName,
    team_id: parsed.data.teamId,
  }

  if (profile?.role === 'coach') {
    const scope = await getDashboardScope()
    if (!scope.editableTeamIds.includes(parsed.data.teamId)) {
      return { message: 'Vous ne pouvez pas créer un joueur hors de vos équipes.' }
    }
  }

  if (profile?.role === 'admin') {
    const { error } = await supabase.from('players').insert([payload])
    if (error) return { message: 'Erreur lors de la création' }
    revalidatePath('/dashboard/joueurs')
    return { message: 'Joueur créé !', success: true }
  }

  const { error } = await supabase.from('approval_requests').insert([
    {
      requested_by: user.id,
      action: 'players.create',
      entity: 'players',
      payload,
    },
  ])

  if (error) return { message: 'Erreur demande validation' }

  revalidatePath('/dashboard/validations')
  return { message: 'Demande envoyée pour validation admin', success: true }
}
