import { createClient } from '@/lib/supabase/server'
import { approveRequest, rejectRequest } from './actions'

export const metadata = {
  title: 'Validations · GBA Dashboard',
}

export default async function ValidationsPage() {
  const supabase = await createClient()

  const { data: requests } = await supabase
    .from('approval_requests')
    .select('id, action, entity, payload, status, created_at, requested_by')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.6em] text-white/60">Admin</p>
        <h2 className="mt-3 font-[var(--font-teko)] text-3xl font-black tracking-[0.06em] text-white md:text-4xl">
          Validations
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-white/70">
          Toutes les créations / modifications / suppressions passent ici pour approbation.
        </p>
      </div>

      {(requests ?? []).length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white/70">
          Aucune demande en attente.
        </div>
      ) : (
        <ul className="grid gap-3">
          {(requests ?? []).map((r) => (
            <li key={r.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/50">{r.entity}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{r.action}</p>
                  <pre className="mt-3 overflow-auto rounded-2xl border border-white/10 bg-black/30 p-3 text-xs text-white/70">
                    {JSON.stringify(r.payload, null, 2)}
                  </pre>
                </div>

                <div className="flex gap-2">
                  <form action={approveRequest}>
                    <input type="hidden" name="id" value={r.id} />
                    <button className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-bold text-emerald-200 border border-emerald-500/30 hover:bg-emerald-500/30">
                      Approuver
                    </button>
                  </form>
                  <form action={rejectRequest}>
                    <input type="hidden" name="id" value={r.id} />
                    <button className="rounded-full bg-rose-500/20 px-4 py-2 text-sm font-bold text-rose-200 border border-rose-500/30 hover:bg-rose-500/30">
                      Rejeter
                    </button>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
