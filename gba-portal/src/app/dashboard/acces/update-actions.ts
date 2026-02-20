'use server'

import { revalidatePath } from 'next/cache'
import { requireRole } from '@/lib/dashboard/authz'
import { log } from '@/lib/logger'

/**
 * Met à jour le profil complet d'un utilisateur (rôle, activité)
 * et ses équipes assignées.
 */
export async function updateUserProfile(formData: FormData) {
  const { supabase } = await requireRole('admin')

  const userId = String(formData.get('userId') ?? '')
  const role = String(formData.get('role') ?? 'viewer')
  const isActive = formData.get('isActive') === 'on'
  const teamIds = formData.getAll('teamIds').map((v) => String(v)).filter(Boolean)

  if (!userId) throw new Error('userId manquant')

  const { error: rpcErr } = await supabase.rpc('admin_update_profile_and_teams', {
    p_user_id: userId,
    p_role: role,
    p_is_active: isActive,
    p_team_ids: role === 'coach' ? teamIds : [],
  })

  if (rpcErr) {
    log.error('Atomic profile/team update failed:', rpcErr)
    throw new Error('Erreur mise à jour profil/équipes: ' + rpcErr.message)
  }

  revalidatePath('/dashboard/acces')
}

/**
 * Supprime définitivement un profil utilisateur et ses liaisons.
 */
export async function deleteUserProfile(formData: FormData) {
  const { supabase } = await requireRole('admin')
  const userId = String(formData.get('userId') ?? '')

  if (!userId) throw new Error('userId manquant')

  try {
    // 1. Détacher des équipes (coach_id)
    await supabase.from('teams').update({ coach_id: null }).eq('coach_id', userId)
    
    // 2. Supprimer les invitations liées (évite les conflits d'emails futurs)
    await supabase.from('coach_invitations').delete().eq('used_by', userId)
    
    // 3. Détacher des planning_sessions (si créé par ou staffé)
    await supabase.from('planning_sessions').update({ created_by: null }).eq('created_by', userId)
    
    // 4. Supprimer le profil staff étendu (si existant)
    await supabase.from('staff_profiles').delete().eq('user_id', userId)

    // 6. Tenter la suppression finale du profil public
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (error) throw error

    revalidatePath('/dashboard/acces')
    return
  } catch (err: unknown) {
    log.error('Delete error:', err)

    // Si échec (FK persistante), on passe en mode "Archivage" pour libérer l'email
    const { error: archiveErr } = await supabase
      .from('profiles')
      .update({ 
        is_active: false, 
        role: 'viewer',
        email: `deleted_${Date.now()}_${userId.slice(0,4)}@gba.internal`, // Libère l'email réel
        full_name: 'Compte Supprimé'
      })
      .eq('id', userId)
      
    if (archiveErr) throw new Error('Erreur archivage: ' + archiveErr.message)
    
    revalidatePath('/dashboard/acces')
    return
  }
}
