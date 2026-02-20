import { createClient } from '@/lib/supabase/server'
import { approveRequest, rejectRequest } from './actions'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Check, X, Clock, User, Calendar, MapPin, Tag } from 'lucide-react'

export const metadata = {
  title: 'Validations · GBA Dashboard',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

type ApprovalRequestRow = {
  id: string
  action: string
  entity: string
  payload: Record<string, string | null>
  status: string
  created_at: string
  profiles: { firstname?: string | null; lastname?: string | null } | null
}

export default async function ValidationsPage() {
  const supabase = await createClient()

  const { data: requests } = await supabase
    .from('approval_requests')
    .select(`
      id, 
      action, 
      entity, 
      payload, 
      status, 
      created_at, 
      requested_by,
      profiles:requested_by (
        firstname,
        lastname
      )
    `)
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
          Modération des demandes envoyées par le staff. Examinez et validez les changements.
        </p>
      </div>

      {(requests ?? []).length === 0 ? (
        <Card className="premium-card card-shell rounded-3xl">
          <CardContent className="py-12 text-center">
            <Check className="mx-auto h-12 w-12 text-emerald-500/20 mb-4" />
            <p className="text-sm font-semibold text-white">Tout est à jour</p>
            <p className="mt-1 text-sm text-white/45">Aucune demande d&apos;approbation en attente.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {((requests ?? []) as ApprovalRequestRow[]).map((r) => {
            const payload = r.payload
            const isDeletion = r.action.includes('.delete')
            
            return (
              <Card key={r.id} className="premium-card card-shell rounded-3xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Action Type Sidebar */}
                    <div className={`w-full md:w-2 px-6 py-2 md:p-0 ${isDeletion ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                    
                    <div className="flex-1 p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="space-y-4 flex-1 min-w-[300px]">
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${isDeletion ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                              {isDeletion ? 'Suppression' : 'Création'}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">
                              {r.entity}
                            </span>
                          </div>

                          <div>
                            <h3 className="text-xl font-bold text-white">
                              {isDeletion ? 'Supprimer la séance' : `Nouvelle séance : ${payload.pole || 'Planning'}`}
                            </h3>
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
                              <div className="flex items-center gap-2 text-sm text-white/60">
                                <User className="w-4 h-4 text-white/20" />
                                <span>Par : <span className="text-white font-medium">{r.profiles?.firstname} {r.profiles?.lastname}</span></span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-white/60">
                                <Clock className="w-4 h-4 text-white/20" />
                                <span>Le : <span className="text-white font-medium">{formatDate(r.created_at)}</span></span>
                              </div>
                              {!isDeletion && (
                                <>
                                  <div className="flex items-center gap-2 text-sm text-white/60">
                                    <Calendar className="w-4 h-4 text-white/20" />
                                    <span>Jour : <span className="text-white font-medium">{payload.day} ({payload.start_time}-{payload.end_time})</span></span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-white/60">
                                    <Calendar className="w-4 h-4 text-white/20" />
                                    <span>Date : <span className="text-white font-medium">{payload.session_date ?? 'Récurrent (hebdo)'}</span></span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-white/60">
                                    <MapPin className="w-4 h-4 text-white/20" />
                                    <span>Lieu : <span className="text-white font-medium">{payload.location}</span></span>
                                  </div>
                                </>
                              )}
                              {isDeletion && (
                                <div className="flex items-center gap-2 text-sm text-white/60">
                                  <Tag className="w-4 h-4 text-white/20" />
                                  <span>ID Séance : <span className="text-mono text-[10px] text-white/40">{payload.id}</span></span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex md:flex-col gap-2 pt-2 md:pt-0">
                          <form action={approveRequest}>
                            <input type="hidden" name="id" value={r.id} />
                            <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl">
                              <Check className="w-4 h-4 mr-2" /> Approuver
                            </Button>
                          </form>
                          <form action={rejectRequest}>
                            <input type="hidden" name="id" value={r.id} />
                            <Button type="submit" variant="secondary" className="w-full border-rose-500/20 text-rose-400 hover:bg-rose-500/10 font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl">
                              <X className="w-4 h-4 mr-2" /> Rejeter
                            </Button>
                          </form>
                        </div>
                      </div>
                    </div>
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
