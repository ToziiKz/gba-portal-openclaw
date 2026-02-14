'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2),
  category: z.string().min(1),
  gender: z.enum(['M', 'F', 'Mixte']),
})

export async function createTeam(prevState: unknown, formData: FormData) {
  const supabase = await createClient()

  const data = {
    name: formData.get('name'),
    category: formData.get('category'),
    gender: formData.get('gender'),
  }

  const parsed = schema.safeParse(data)

  if (!parsed.success) {
    return { message: 'Données invalides' }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { message: 'Non authentifié' }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

  if (profile?.role === 'admin') {
    const { error } = await supabase.from('teams').insert([parsed.data])
    if (error) return { message: 'Erreur lors de la création' }
    revalidatePath('/dashboard/equipes')
    return { message: 'Équipe créée !', success: true }
  }

  // Club setup: teams are fixed. Only admin can create teams.
  return { message: "Création d'équipe réservée à l'admin." }
}
