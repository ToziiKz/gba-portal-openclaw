'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/dashboard/authz'

/**
 * Met à jour le profil complet d'un utilisateur (rôle, activité)
 * et ses équipes assignées.
 */
export async function updateUserProfile(formData: FormData) {
  const { supabase, user: adminUser } = await requireRole('admin')

  const userId = String(formData.get('userId') ?? '')
  const role = String(formData.get('role') ?? 'viewer')
  const isActive = formData.get('isActive') === 'on'
  const teamIds = formData.getAll('teamIds').map((v) => String(v)).filter(Boolean)

  if (!userId) throw new Error('userId manquant')

  // 1. Mise à jour du profil
  const { error: profileErr } = await supabase
    .from('profiles')
    .update({ 
      role, 
      is_active: isActive,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)

  if (profileErr) throw new Error('Erreur profil: ' + profileErr.message)

  // 2. Mise à jour des équipes (si rôle coach)
  // On nettoie d'abord les anciennes affectations pour cet utilisateur
  const { error: clearErr } = await supabase
    .from('teams')
    .update({ coach_id: null })
    .eq('coach_id', userId)
  
  if (clearErr) throw new Error('Erreur reset équipes: ' + clearErr.message)

  // Si c'est un coach, on assigne les nouvelles
  if (role === 'coach' && teamIds.length > 0) {
    const { error: assignErr } = await supabase
      .from('teams')
      .update({ coach_id: userId })
      .in('id', teamIds)
    
    if (assignErr) throw new Error('Erreur assignation équipes: ' + assignErr.message)
  }

  // 3. Synchronisation legacy staff_team_memberships (si la table existe)
  const { error: clearMembershipErr } = await supabase
    .from('staff_team_memberships')
    .delete()
    .eq('user_id', userId)

  // Ignore if table missing; otherwise keep error for debugging
  if (clearMembershipErr && !String(clearMembershipErr.message || '').includes('does not exist')) {
    console.error('Membership clear error:', clearMembershipErr)
  }

  if (role === 'coach' && teamIds.length > 0) {
    const rows = teamIds.map((tid) => ({ user_id: userId, team_id: tid, role: 'coach' }))
    const { error: insertMembershipErr } = await supabase.from('staff_team_memberships').insert(rows)
    if (insertMembershipErr && !String(insertMembershipErr.message || '').includes('does not exist')) {
      console.error('Membership insert error:', insertMembershipErr)
    }
  }

  revalidatePath('/dashboard/acces')
  return { ok: true }
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
    
    // 4. Supprimer les memberships legacy
    await supabase.from('staff_team_memberships').delete().eq('user_id', userId)

    // 5. Supprimer le profil staff étendu (si existant)
    await supabase.from('staff_profiles').delete().eq('user_id', userId)

    // 6. Tenter la suppression finale du profil public
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (error) throw error

    revalidatePath('/dashboard/acces')
    return { ok: true }
  } catch (err: any) {
    console.error('Delete error:', err)
    
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
    return { ok: true, note: 'Compte anonymisé et désactivé (données historiques conservées).' }
  }
}
