import { createClient } from '@/lib/supabase/server'
import {
  approveCoachRequest,
  rejectCoachRequest,
  regenerateCoachInvitation,
  setCoachActiveState,
  setCoachTeams,
} from './actions'

export const metadata = {
  title: 'Accès coachs · GBA Dashboard',
}

type Params = { invite?: string; status?: string; q?: string }

function toDateLabel(value: string | null) {
  if (!value) return '—'
  return new Date(value).toLocaleString('fr-FR')
}

export default async function DashboardCoachAccessPage({
  searchParams,
}: {
  searchParams?: Promise<Params>
}) {
  const supabase = await createClient()
  const params = (await searchParams) ?? {}

  const statusFilter = params.status ?? 'pending'
  const query = (params.q ?? '').trim().toLowerCase()

  const { data: requests } = await supabase
    .from('coach_access_requests')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  const filteredRequests = (requests ?? []).filter((r) => {
    const statusOk = statusFilter === 'all' ? true : r.status === statusFilter
    if (!statusOk) return false
    if (!query) return true
    return [r.full_name, r.email, r.requested_team, r.requested_pole, r.message]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(query))
  })

  const pending = filteredRequests.filter((r) => r.status === 'pending')
  const history = filteredRequests.filter((r) => r.status !== 'pending')

  const { data: latestInvitations } = await supabase
    .from('coach_invitations')
    .select('id, email, full_name, created_at, expires_at, used_at')
    .order('created_at', { ascending: false })
    .limit(10)

  const { data: coaches } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, is_active, updated_at')
    .eq('role', 'coach')
    .order('full_name', { ascending: true })

  const { data: teams } = await supabase
    .from('teams')
    .select('id, name, coach_id, category')
    .order('name', { ascending: true })

  const { data: events } = await supabase
    .from('access_admin_events')
    .select('id, action, target_type, target_id, created_at, actor_id')
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.6em] text-white/60">Admin</p>
        <h2 className="mt-3 font-[var(--font-teko)] text-3xl font-black tracking-[0.06em] text-white md:text-4xl">
          Accès coachs
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-white/70">
          Validation des demandes publiques, invitations, activation/suspension et affectation multi-équipes.
        </p>
      </div>

      {params.invite ? (
        <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-sm text-emerald-100">
          <p className="font-semibold">Invitation générée</p>
          <p className="mt-2 break-all text-emerald-50">{params.invite}</p>
          <p className="mt-2 text-xs text-emerald-200/80">
            Copiez ce lien et envoyez-le au coach (valable 72h, usage unique).
          </p>
          <p className="mt-3">
            <a
              href={`mailto:?subject=${encodeURIComponent('Activation compte coach GBA')}&body=${encodeURIComponent(`Bonjour,\n\nVoici ton lien d’activation :\n${params.invite}\n\nLe lien expire dans 72h et n’est valable qu’une fois.`)}`}
              className="rounded-full border border-emerald-300/40 bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold hover:bg-emerald-500/30"
            >
              Envoyer par email
            </a>
          </p>
        </div>
      ) : null}

      <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <form className="grid gap-3 md:grid-cols-[180px_1fr_auto]" method="get">
          <select
            name="status"
            defaultValue={statusFilter}
            className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
          >
            <option value="pending">En attente</option>
            <option value="approved">Approuvées</option>
            <option value="rejected">Rejetées</option>
            <option value="all">Toutes</option>
          </select>
          <input
            name="q"
            defaultValue={params.q ?? ''}
            placeholder="Rechercher nom / email / équipe..."
            className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/35"
          />
          <button className="rounded-2xl border border-white/20 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10">
            Filtrer
          </button>
        </form>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold text-white">Demandes en attente</h3>
          <p className="mt-1 text-sm text-white/60">{pending.length} demande(s)</p>

          {pending.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/60">
              Rien en attente.
            </p>
          ) : (
            <ul className="mt-4 grid gap-3">
              {pending.map((req) => (
                <li key={req.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{req.full_name}</p>
                      <p className="text-sm text-white/70">{req.email}</p>
                      {req.phone ? <p className="text-xs text-white/55">{req.phone}</p> : null}
                    </div>
                    <span className="rounded-full border border-white/15 px-2 py-1 text-[10px] uppercase tracking-widest text-white/70">
                      pending
                    </span>
                  </div>

                  <div className="mt-3 grid gap-1 text-xs text-white/60">
                    {req.requested_team ? <p>Équipe: {req.requested_team}</p> : null}
                    {req.message ? <p>Message: {req.message}</p> : null}
                    <p>Créée: {toDateLabel(req.created_at)}</p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <form action={approveCoachRequest}>
                      <input type="hidden" name="requestId" value={req.id} />
                      <button className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-bold text-emerald-200 border border-emerald-500/30 hover:bg-emerald-500/30">
                        Approuver & générer lien
                      </button>
                    </form>
                    <form action={rejectCoachRequest}>
                      <input type="hidden" name="requestId" value={req.id} />
                      <button className="rounded-full bg-rose-500/20 px-4 py-2 text-sm font-bold text-rose-200 border border-rose-500/30 hover:bg-rose-500/30">
                        Rejeter
                      </button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold text-white">Historique</h3>
          <p className="mt-1 text-sm text-white/60">Demandes traitées</p>
          <ul className="mt-4 grid gap-2">
            {history.length === 0 ? (
              <li className="rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-white/60">
                Aucun élément.
              </li>
            ) : (
              history.slice(0, 20).map((req) => (
                <li key={req.id} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                  <p className="text-sm font-semibold text-white">{req.full_name}</p>
                  <p className="text-xs text-white/60">{req.email}</p>
                  <p className="mt-1 text-[11px] text-white/50">
                    {req.status} • décidé: {toDateLabel(req.decided_at)}
                  </p>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold text-white">Comptes coachs</h3>
          <p className="mt-1 text-sm text-white/60">Activation/suspension + affectation multi-équipes</p>

          <ul className="mt-4 grid gap-3">
            {(coaches ?? []).map((coach) => {
              const assignedTeams = (teams ?? []).filter((t) => t.coach_id === coach.id)
              const isActive = coach.is_active !== false

              return (
                <li key={coach.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{coach.full_name || coach.email}</p>
                      <p className="text-sm text-white/70">{coach.email}</p>
                    </div>
                    <span
                      className={`rounded-full border px-2 py-1 text-[10px] uppercase tracking-widest ${
                        isActive
                          ? 'border-emerald-400/30 bg-emerald-500/20 text-emerald-200'
                          : 'border-rose-400/30 bg-rose-500/20 text-rose-200'
                      }`}
                    >
                      {isActive ? 'actif' : 'suspendu'}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <form action={setCoachActiveState}>
                      <input type="hidden" name="coachId" value={coach.id} />
                      <input type="hidden" name="active" value={isActive ? '0' : '1'} />
                      <button
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold border ${
                          isActive
                            ? 'border-rose-400/30 bg-rose-500/20 text-rose-200 hover:bg-rose-500/30'
                            : 'border-emerald-400/30 bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30'
                        }`}
                      >
                        {isActive ? 'Suspendre' : 'Réactiver'}
                      </button>
                    </form>
                  </div>

                  <form action={setCoachTeams} className="mt-4 grid gap-2">
                    <input type="hidden" name="coachId" value={coach.id} />
                    <p className="text-xs uppercase tracking-widest text-white/55">Équipes assignées</p>
                    <div className="grid gap-1 rounded-xl border border-white/10 bg-black/20 p-2 max-h-40 overflow-auto">
                      {(teams ?? []).map((team) => {
                        const checked = team.coach_id === coach.id
                        return (
                          <label key={team.id} className="flex items-center gap-2 text-xs text-white/80">
                            <input
                              type="checkbox"
                              name="teamIds"
                              value={team.id}
                              defaultChecked={checked}
                              className="h-3.5 w-3.5"
                            />
                            <span>
                              {team.name} <span className="text-white/45">({team.category})</span>
                            </span>
                          </label>
                        )
                      })}
                    </div>
                    <button className="mt-1 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10">
                      Enregistrer les équipes ({assignedTeams.length})
                    </button>
                  </form>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold text-white">Invitations récentes</h3>
          <p className="mt-1 text-sm text-white/60">10 dernières</p>

          <ul className="mt-4 grid gap-2">
            {(latestInvitations ?? []).map((inv) => (
              <li key={inv.id} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                <p className="text-sm font-semibold text-white">{inv.full_name || inv.email}</p>
                <p className="text-xs text-white/60">{inv.email}</p>
                <p className="mt-1 text-[11px] text-white/50">
                  Expire: {toDateLabel(inv.expires_at)}
                  {inv.used_at ? ' • utilisée' : ' • en attente'}
                </p>
                <div className="mt-2">
                  <form action={regenerateCoachInvitation}>
                    <input type="hidden" name="invitationId" value={inv.id} />
                    <button className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-white/80 hover:bg-white/10">
                      Régénérer le lien
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t border-white/10 pt-4">
            <h4 className="text-sm font-semibold text-white">Journal admin</h4>
            <ul className="mt-2 grid gap-2">
              {(events ?? []).map((e) => (
                <li key={e.id} className="rounded-xl border border-white/10 bg-black/20 p-2 text-xs text-white/70">
                  <span className="font-semibold text-white/90">{e.action}</span>
                  <span className="text-white/45"> • {e.target_type}</span>
                  <span className="text-white/45"> • {toDateLabel(e.created_at)}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
