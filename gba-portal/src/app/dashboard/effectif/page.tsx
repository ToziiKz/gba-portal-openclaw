import Link from 'next/link'

import { getScopedRosterData } from '@/lib/dashboard/server-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

type TeamRow = {
  id: string
  name: string
  category: string | null
  pole: string | null
}

type PlayerRow = {
  id: string
  firstname: string | null
  lastname: string | null
  team_id: string | null
}

function fullName(p: PlayerRow) {
  return `${p.firstname ?? ''} ${p.lastname ?? ''}`.trim() || 'Joueur sans nom'
}

function byName(a: { name: string }, b: { name: string }) {
  return a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' })
}

export default async function EffectifPage({
  searchParams,
}: {
  searchParams?: Promise<{ group?: string }>
}) {
  const params = (await searchParams) ?? {}
  const group = params.group === 'pole' ? 'pole' : 'team'

  const { teams, players } = await getScopedRosterData()

  const teamList = (teams as TeamRow[]).map((t) => ({
    ...t,
    name: t.name ?? 'Équipe sans nom',
    category: t.category ?? '—',
    pole: t.pole ?? 'Pôle non défini',
  }))

  const playersByTeam = new Map<string, PlayerRow[]>()
  for (const p of players as PlayerRow[]) {
    if (!p.team_id) continue
    const arr = playersByTeam.get(p.team_id) ?? []
    arr.push(p)
    playersByTeam.set(p.team_id, arr)
  }

  const teamsWithPlayers = teamList
    .map((team) => {
      const roster = (playersByTeam.get(team.id) ?? []).slice().sort((a, b) =>
        fullName(a).localeCompare(fullName(b), 'fr', { sensitivity: 'base' })
      )
      return {
        id: team.id,
        name: team.name,
        category: team.category,
        pole: team.pole,
        players: roster,
      }
    })
    .sort(byName)

  const poles = Array.from(
    teamsWithPlayers.reduce((map, team) => {
      const key = team.pole
      const arr = map.get(key) ?? []
      arr.push(team)
      map.set(key, arr)
      return map
    }, new Map<string, typeof teamsWithPlayers>())
  ).sort((a, b) => a[0].localeCompare(b[0], 'fr', { sensitivity: 'base' }))

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.6em] text-white/60">Module</p>
        <h2 className="mt-3 font-[var(--font-teko)] text-3xl font-black tracking-[0.06em] text-white md:text-4xl">
          Effectif
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-white/70">
          Vue consolidée équipes + joueurs, lisible par effectif ou par pôle.
        </p>
      </div>

      <Card className="premium-card card-shell rounded-3xl">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <Link href="/dashboard/effectif?group=team">
              <Button size="sm" variant={group === 'team' ? 'primary' : 'secondary'}>
                Par effectif
              </Button>
            </Link>
            <Link href="/dashboard/effectif?group=pole">
              <Button size="sm" variant={group === 'pole' ? 'primary' : 'secondary'}>
                Par pôle
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {group === 'team' ? (
        <div className="grid gap-4">
          {teamsWithPlayers.map((team) => (
            <Card key={team.id} className="premium-card card-shell rounded-3xl">
              <CardHeader>
                <CardTitle>{team.name}</CardTitle>
                <CardDescription>
                  {team.category} • {team.pole} • {team.players.length} joueur(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {team.players.length === 0 ? (
                  <p className="text-sm text-white/55">Aucun joueur dans cet effectif.</p>
                ) : (
                  <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {team.players.map((p) => (
                      <li key={p.id} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90">
                        {fullName(p)}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {poles.map(([pole, teamsInPole]) => {
            const total = teamsInPole.reduce((acc, t) => acc + t.players.length, 0)
            return (
              <Card key={pole} className="premium-card card-shell rounded-3xl">
                <CardHeader>
                  <CardTitle>{pole}</CardTitle>
                  <CardDescription>
                    {teamsInPole.length} équipe(s) • {total} joueur(s)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {teamsInPole.map((team) => (
                      <div key={team.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                        <p className="text-sm font-bold text-white">{team.name}</p>
                        <p className="text-xs text-white/60">{team.players.length} joueur(s)</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
