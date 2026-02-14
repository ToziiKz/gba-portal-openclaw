import { createClient } from '@/lib/supabase/server'
import { PlayersView, type PlayerWithTeam } from '@/components/dashboard/players/PlayersView'
import { getDashboardScope } from '@/lib/dashboard/getDashboardScope'

export const metadata = {
  title: 'Joueurs · GBA Dashboard',
}

export default async function PlayersPage() {
  const supabase = await createClient()

  const scope = await getDashboardScope()

  let playersQuery = supabase.from('players').select('*').order('lastname')
  let teamsQuery = supabase.from('teams').select('id, name').order('name')

  if (scope.role !== 'admin' && scope.role !== 'staff') {
    if (scope.viewableTeamIds && scope.viewableTeamIds.length > 0) {
      playersQuery = playersQuery.in('team_id', scope.viewableTeamIds)
      teamsQuery = teamsQuery.in('id', scope.viewableTeamIds)
    } else {
      playersQuery = playersQuery.eq('team_id', '__none__')
      teamsQuery = teamsQuery.eq('id', '__none__')
    }
  }

  const { data: players } = await playersQuery
  const { data: teams } = await teamsQuery

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.6em] text-white/60">Module</p>
        <h2 className="mt-3 font-[var(--font-teko)] text-3xl font-black tracking-[0.06em] text-white md:text-4xl">
          Joueurs
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-white/70">
          {scope.role === 'coach' ? "Effectif de votre pôle (lecture)." : "Gestion de l'effectif complet."}
        </p>
      </div>

      <PlayersView 
        initialPlayers={(players ?? []) as unknown as PlayerWithTeam[]} 
        teams={teams ?? []}
      />
    </div>
  )
}
