import { createClient } from '@/lib/supabase/server'
import { approveCoachRequest, rejectCoachRequest } from './actions'

export const metadata = {
  title: 'Accès coachs · GBA Dashboard',
}

export default async function DashboardCoachAccessPage({
  searchParams,
}: {
  searchParams?: Promise<{ invite?: string }>
}) {
  const supabase = await createClient()
  const params = (await searchParams) ?? {}

  const { data: pending } = await supabase
    .from('coach_access_requests')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  const { data: latestInvitations } = await supabase
    .from('coach_invitations')
    .select('id, email, full_name, created_at, expires_at, used_at')
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.6em] text-white/60">Admin</p>
        <h2 className="mt-3 font-[var(--font-teko)] text-3xl font-black tracking-[0.06em] text-white md:text-4xl">
          Accès coachs
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-white/70">
          Validation des demandes publiques et génération des liens d’activation.
        </p>
      </div>

      {params.invite ? (
        <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-sm text-emerald-100">
          <p className="font-semibold">Invitation générée</p>
          <p className="mt-2 break-all text-emerald-50">{params.invite}</p>
          <p className="mt-2 text-xs text-emerald-200/80">
            Copiez ce lien et envoyez-le au coach (valable 72h, usage unique).
          </p>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold text-white">Demandes en attente</h3>
          <p className="mt-1 text-sm text-white/60">{pending?.length ?? 0} demande(s)</p>

          {(pending?.length ?? 0) === 0 ? (
            <p className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/60">
              Rien en attente.
            </p>
          ) : (
            <ul className="mt-4 grid gap-3">
              {pending?.map((req) => (
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
                    {req.requested_pole ? <p>Pôle: {req.requested_pole}</p> : null}
                    {req.requested_team ? <p>Équipe: {req.requested_team}</p> : null}
                    {req.message ? <p>Message: {req.message}</p> : null}
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
          <h3 className="text-lg font-semibold text-white">Invitations récentes</h3>
          <p className="mt-1 text-sm text-white/60">10 dernières</p>

          <ul className="mt-4 grid gap-2">
            {(latestInvitations ?? []).map((inv) => (
              <li key={inv.id} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                <p className="text-sm font-semibold text-white">{inv.full_name || inv.email}</p>
                <p className="text-xs text-white/60">{inv.email}</p>
                <p className="mt-1 text-[11px] text-white/50">
                  Expire: {new Date(inv.expires_at).toLocaleString('fr-FR')}
                  {inv.used_at ? ' • utilisée' : ' • en attente'}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
