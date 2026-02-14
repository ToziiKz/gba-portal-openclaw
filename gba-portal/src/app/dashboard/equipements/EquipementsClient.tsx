'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Teko } from 'next/font/google'
import { motion, AnimatePresence } from 'framer-motion'
import { readLocal, writeLocal } from '@/lib/dashboard/storage'
import {
  Package,
  ClipboardList,
  CheckCircle2,
  Clock3,
  XCircle,
  Search,
  Filter,
  Plus,
  X,
  Save,
  ArrowUpRight,
  AlertTriangle,
} from 'lucide-react'

const teko = Teko({ subsets: ['latin'], weight: ['400', '600'] })

type RequestStatus = 'EN_ATTENTE' | 'VALIDE' | 'LIVRE' | 'REFUSE'

type RequestItem = { name: string; qty: number; sku?: string }

type EquipmentRequest = {
  id: string
  title: string
  team: string
  category: 'Textile' | 'Matériel' | 'Medical'
  priority: 'Normal' | 'Urgent'
  status: RequestStatus
  createdAt: string
  items: RequestItem[]
  note?: string
}

type StockItem = {
  id: string
  name: string
  sku: string
  qty: number
  min: number
  updatedAt?: string
}

type StockMove = {
  id: string
  type: 'IN' | 'OUT'
  itemId: string
  itemName: string
  qty: number
  reason: string
  at: string
}

const STORAGE_KEY_REQUESTS = 'gba-dashboard-equipements-requests-v1'
const STOCK_ITEMS_KEY = 'gba-dashboard-stock-items-v1'
const STOCK_MOVES_KEY = 'gba-dashboard-stock-moves-v1'

const INITIAL_REQUESTS: EquipmentRequest[] = [
  {
    id: 'r1',
    title: 'Réassort chasubles',
    team: 'U15',
    category: 'Matériel',
    priority: 'Normal',
    status: 'EN_ATTENTE',
    createdAt: '2026-02-10 11:02',
    items: [
      { name: 'Chasubles', qty: 10, sku: 'GBA-CHA-20' },
      { name: 'Cones', qty: 30 },
    ],
    note: 'Séances intenses cette semaine.',
  },
  {
    id: 'r2',
    title: 'Maillots match',
    team: 'R1',
    category: 'Textile',
    priority: 'Urgent',
    status: 'VALIDE',
    createdAt: '2026-02-09 18:40',
    items: [
      { name: 'Maillot domicile (M)', qty: 6, sku: 'GBA-MAI-2526-M' },
      { name: 'Chaussettes', qty: 12 },
    ],
  },
  {
    id: 'r3',
    title: 'Trousse secours',
    team: 'U18',
    category: 'Medical',
    priority: 'Normal',
    status: 'LIVRE',
    createdAt: '2026-02-08 09:12',
    items: [
      { name: 'Bande cohésive', qty: 6 },
      { name: 'Spray froid', qty: 2, sku: 'GBA-MED-SF' },
    ],
  },
]

function statusChip(status: RequestStatus) {
  switch (status) {
    case 'EN_ATTENTE':
      return {
        label: 'En attente',
        cls: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
        Icon: Clock3,
      }
    case 'VALIDE':
      return {
        label: 'Validé',
        cls: 'border-[#0065BD]/30 bg-[#0065BD]/15 text-[#9fd3ff]',
        Icon: CheckCircle2,
      }
    case 'LIVRE':
      return {
        label: 'Livré',
        cls: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
        Icon: Package,
      }
    case 'REFUSE':
      return {
        label: 'Refusé',
        cls: 'border-red-500/30 bg-red-500/10 text-red-200',
        Icon: XCircle,
      }
  }
}

function lowered(s: string) {
  return (s ?? '').toLowerCase()
}

function applyDeliveryToStock(req: EquipmentRequest) {
  const stockItems = readLocal<StockItem[]>(STOCK_ITEMS_KEY, [])
  const stockMoves = readLocal<StockMove[]>(STOCK_MOVES_KEY, [])

  // Matching strategy: SKU exact > name includes
  const updatedItems = stockItems.map((it) => {
    const bySku = req.items.find((ri) => ri.sku && lowered(ri.sku) === lowered(it.sku))
    const byName = req.items.find((ri) => !ri.sku && lowered(it.name).includes(lowered(ri.name)))
    const match = bySku ?? byName
    if (!match) return it

    return {
      ...it,
      qty: Math.max(0, Number(it.qty ?? 0) - Number(match.qty ?? 0)),
      updatedAt: '2026-02-10',
    }
  })

  // Create a bulk movement entry (simple but useful)
  const outQty = req.items.reduce((acc, i) => acc + Number(i.qty ?? 0), 0)
  const newMoves: StockMove[] = [
    {
      id: `m${Math.random().toString(16).slice(2)}`,
      type: 'OUT',
      itemId: 'bulk',
      itemName: `Livraison équipements (${req.team})`,
      qty: outQty,
      reason: `Demande livrée: ${req.title}`,
      at: '2026-02-10 18:05',
    },
    ...stockMoves,
  ]

  writeLocal(STOCK_ITEMS_KEY, updatedItems)
  writeLocal(STOCK_MOVES_KEY, newMoves)

  // Provide preview for UI (optional)
  const lowAfter = updatedItems.filter((i) => Number(i.qty) < Number(i.min ?? 0)).length
  return { updatedItems, lowAfter }
}

export default function EquipementsClient() {
  const [requests, setRequests] = useState<EquipmentRequest[]>(() => INITIAL_REQUESTS)

  // restore persisted state
  useEffect(() => {
    const saved = readLocal<EquipmentRequest[]>(STORAGE_KEY_REQUESTS, INITIAL_REQUESTS)
    setRequests(saved)
    setSelectedId((prev) => prev ?? saved[0]?.id ?? null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // persist
  useEffect(() => {
    writeLocal(STORAGE_KEY_REQUESTS, requests)
  }, [requests])

  const searchParams = useSearchParams()

  const [q, setQ] = useState('')
  const [status, setStatus] = useState<RequestStatus | 'ALL'>('ALL')

  const [selectedId, setSelectedId] = useState<string | null>(requests[0]?.id ?? null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState<Partial<EquipmentRequest>>({
    title: '',
    team: 'U15',
    category: 'Matériel',
    priority: 'Normal',
    items: [{ name: 'Chasubles', qty: 10, sku: 'GBA-CHA-20' }],
    note: '',
  })

  // Init from URL (deep links)
  const didInitFromUrl = useRef(false)
  useEffect(() => {
    if (didInitFromUrl.current) return
    const s = searchParams?.get('status')
    const delivery = searchParams?.get('delivery')
    const qParam = searchParams?.get('q') ?? searchParams?.get('query')

    if (typeof qParam === 'string' && qParam.trim()) setQ(qParam)

    if (delivery === 'todo') {
      // demande à traiter
      setStatus('EN_ATTENTE')
    } else if (s && ['EN_ATTENTE', 'VALIDE', 'LIVRE', 'REFUSE'].includes(s)) {
      setStatus(s as RequestStatus)
    }

    didInitFromUrl.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Delivery confirm modal
  const [isDeliverOpen, setIsDeliverOpen] = useState(false)
  const [deliverDeduct, setDeliverDeduct] = useState(true)
  const [deliverInfo, setDeliverInfo] = useState<{ lowAfter?: number } | null>(null)

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    return requests
      .filter((r) => (status === 'ALL' ? true : r.status === status))
      .filter((r) => {
        if (!query) return true
        const hay = `${r.title} ${r.team} ${r.category} ${r.priority}`.toLowerCase()
        return hay.includes(query)
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }, [requests, q, status])

  const selected = useMemo(() => {
    return requests.find((r) => r.id === selectedId) ?? filtered[0] ?? null
  }, [requests, selectedId, filtered])

  const counts = useMemo(() => {
    const pending = requests.filter((r) => r.status === 'EN_ATTENTE').length
    const urgent = requests.filter((r) => r.priority === 'Urgent' && r.status !== 'LIVRE').length
    return { pending, urgent }
  }, [requests])

  const openModal = () => {
    setForm({
      title: '',
      team: 'U15',
      category: 'Matériel',
      priority: 'Normal',
      items: [{ name: 'Chasubles', qty: 10, sku: 'GBA-CHA-20' }],
      note: '',
    })
    setIsModalOpen(true)
  }

  const addItemRow = () => {
    setForm((p) => ({
      ...p,
      items: [...(p.items ?? []), { name: 'Article', qty: 1, sku: '' }],
    }))
  }

  const updateItemRow = (idx: number, patch: { name?: string; qty?: number; sku?: string }) => {
    setForm((p) => ({
      ...p,
      items: (p.items ?? []).map((it: RequestItem, i) => (i === idx ? { ...it, ...patch } : it)),
    }))
  }

  const removeItemRow = (idx: number) => {
    setForm((p) => ({
      ...p,
      items: (p.items ?? []).filter((_, i) => i !== idx),
    }))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      const newReq: EquipmentRequest = {
        id: `r${Math.random().toString(16).slice(2)}`,
        title: String(form.title ?? '').trim() || 'Demande équipements',
        team: String(form.team ?? 'U15'),
        category: (form.category ?? 'Matériel') as EquipmentRequest['category'],
        priority: (form.priority ?? 'Normal') as EquipmentRequest['priority'],
        status: 'EN_ATTENTE',
        createdAt: '2026-02-10 18:06',
        items: (form.items ?? []) as RequestItem[],
        note: String(form.note ?? ''),
      }
      setRequests((prev) => [newReq, ...prev])
      setSelectedId(newReq.id)
      setIsSubmitting(false)
      setIsModalOpen(false)
    }, 650)
  }

  const setReqStatus = (id: string, newStatus: RequestStatus) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)))
  }

  const openDeliver = () => {
    if (!selected) return
    setDeliverInfo(null)
    setDeliverDeduct(true)
    setIsDeliverOpen(true)
  }

  const confirmDeliver = () => {
    if (!selected) return
    // update request status
    setReqStatus(selected.id, 'LIVRE')

    // optional stock deduction
    if (deliverDeduct) {
      const info = applyDeliveryToStock(selected)
      setDeliverInfo({ lowAfter: info?.lowAfter })
    }

    setIsDeliverOpen(false)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#0065BD] font-bold">Logistique</span>
          <h1 className={`${teko.className} text-5xl md:text-6xl uppercase leading-[0.9] mt-2 text-black`}>
            Équipements
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-black/70">
            <ClipboardList size={14} className="text-[#0065BD]" /> {counts.pending} en attente
          </div>
          <div className="hidden md:flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-amber-200">
            <AlertTriangle size={14} /> {counts.urgent} urgent
          </div>

          <button
            onClick={openModal}
            className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-black/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-black/70 hover:bg-black/5 transition"
          >
            <Plus size={16} className="text-[#0065BD]" /> Nouvelle demande
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 p-1 bg-black/5 border border-black/10 rounded-2xl backdrop-blur-md">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher (titre / équipe / catégorie)"
            className="w-full bg-transparent border-none outline-none text-black pl-12 py-3 placeholder:text-slate-600 font-medium"
          />
        </div>
        <div className="w-px bg-black/5 hidden md:block" />
        <div className="flex items-center gap-2 px-4 py-2">
          <Filter size={16} className="text-slate-500" />
          {(['ALL', 'EN_ATTENTE', 'VALIDE', 'LIVRE', 'REFUSE'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setStatus(t)}
              className={`px-3 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.28em] transition ${
                status === t
                  ? 'border-[#0065BD]/40 bg-[#0065BD]/15 text-black'
                  : 'border-black/10 bg-black/5 text-black/60 hover:bg-black/5'
              }`}
            >
              {t === 'ALL' ? 'Tout' : t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.05fr] gap-6">
        {/* List */}
        <div className="rounded-2xl border border-black/10 bg-white/70 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-black/55">Demandes</p>
              <h2 className={`${teko.className} text-3xl uppercase mt-2`}>File</h2>
            </div>
            <p className="text-xs text-black/45">{filtered.length} résultat(s)</p>
          </div>

          <div className="mt-5 grid gap-3">
            {filtered.map((r) => {
              const chip = statusChip(r.status)
              const Icon = chip.Icon
              const isSel = r.id === selected?.id

              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedId(r.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    isSel
                      ? 'border-black/25 bg-black/5'
                      : 'border-black/10 bg-black/5 hover:border-black/20 hover:bg-black/7'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-black truncate">{r.title}</p>
                        {r.priority === 'Urgent' && r.status !== 'LIVRE' ? (
                          <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-amber-200">
                            <AlertTriangle size={14} /> URGENT
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-[10px] font-black uppercase tracking-[0.28em] text-black/40">
                        {r.team} · {r.category} · {r.createdAt}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] ${chip.cls}`}
                    >
                      <Icon size={14} /> {chip.label}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Details */}
        <div className="rounded-2xl border border-black/10 bg-white/70 p-5">
          {!selected ? (
            <div className="rounded-2xl border border-black/10 bg-black/5 p-6">
              <p className="text-sm font-semibold text-black">Aucune sélection</p>
              <p className="mt-2 text-sm text-black/65">Choisis une demande dans la file.</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-black/55">Détails</p>
                  <h2 className={`${teko.className} text-4xl uppercase mt-2`}>{selected.title}</h2>
                  <p className="mt-2 text-[10px] font-black uppercase tracking-[0.28em] text-black/40">
                    {selected.team} · {selected.category} · priorité {selected.priority} · {selected.createdAt}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setReqStatus(selected.id, 'VALIDE')}
                    className="rounded-xl border border-black/10 bg-black/5 px-3 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-black/70 hover:bg-black/5 transition"
                    type="button"
                  >
                    Valider
                  </button>
                  <button
                    onClick={openDeliver}
                    className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-emerald-200 hover:bg-emerald-500/15 transition"
                    type="button"
                  >
                    Livrer
                  </button>
                  <button
                    onClick={() => setReqStatus(selected.id, 'REFUSE')}
                    className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-red-200 hover:bg-red-500/15 transition"
                    type="button"
                  >
                    Refuser
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-black/5 p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-black/45">Articles</p>
                <ul className="mt-3 grid gap-2">
                  {selected.items.map((it, idx) => (
                    <li
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl border border-black/10 bg-black/5 px-4 py-3"
                    >
                      <div>
                        <span className="text-sm text-black/80">{it.name}</span>
                        {it.sku ? (
                          <div className="mt-1 text-[10px] font-black uppercase tracking-[0.28em] text-black/35">SKU {it.sku}</div>
                        ) : null}
                      </div>
                      <span className={`${teko.className} text-2xl text-black`}>x{it.qty}</span>
                    </li>
                  ))}
                </ul>
                {selected.note ? <p className="mt-4 text-sm text-black/55">Note : {selected.note}</p> : null}
              </div>

              <div className="rounded-2xl border border-black/10 bg-black/5 p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-black/45">Raccourcis</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href="/dashboard/stock"
                    className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-black/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-black/70 hover:bg-black/5 transition"
                  >
                    Vérifier stock <ArrowUpRight size={14} className="text-[#0065BD]" />
                  </a>
                  <a
                    href="/dashboard/licences"
                    className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-black/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-black/70 hover:bg-black/5 transition"
                  >
                    Admin <ArrowUpRight size={14} className="text-[#0065BD]" />
                  </a>
                </div>
              </div>

              <p className="text-xs text-black/35">
                Next : permissions, workflow par rôle, génération bon de commande, liaison stock par SKU.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal: new request */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            >
              <div className="h-full w-full">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              </div>
            </div>

            <div className="relative w-full max-w-xl rounded-2xl border border-black/10 bg-white shadow-2xl overflow-hidden">
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 16 }}
              >
              <div className="bg-black/5 px-8 py-6 border-b border-black/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.35em] text-black/40 font-black">Logistique</p>
                  <h3 className={`${teko.className} text-3xl uppercase text-black mt-2`}>Nouvelle demande</h3>
                </div>
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-black transition-colors">
                  <X size={22} />
                </button>
              </div>

              <form onSubmit={submit} className="p-8 space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.28em] text-black/45 font-black">Titre</label>
                  <input
                    required
                    value={form.title ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    className="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-3 text-sm text-black outline-none focus:border-black/25 focus:ring-2 focus:ring-white/20"
                    placeholder="ex: Pack match week-end"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.28em] text-black/45 font-black">Équipe</label>
                    <input
                      value={form.team ?? ''}
                      onChange={(e) => setForm((p) => ({ ...p, team: e.target.value }))}
                      className="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-3 text-sm text-black outline-none focus:border-black/25 focus:ring-2 focus:ring-white/20"
                      placeholder="U15"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.28em] text-black/45 font-black">Priorité</label>
                    <select
                      value={form.priority ?? 'Normal'}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          priority: e.target.value as EquipmentRequest['priority'],
                        }))
                      }
                      className="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-3 text-sm text-black outline-none focus:border-black/25 focus:ring-2 focus:ring-white/20"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.28em] text-black/45 font-black">Catégorie</label>
                    <select
                      value={form.category ?? 'Matériel'}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          category: e.target.value as EquipmentRequest['category'],
                        }))
                      }
                      className="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-3 text-sm text-black outline-none focus:border-black/25 focus:ring-2 focus:ring-white/20"
                    >
                      <option value="Textile">Textile</option>
                      <option value="Matériel">Matériel</option>
                      <option value="Medical">Medical</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.28em] text-black/45 font-black">Note</label>
                    <input
                      value={form.note ?? ''}
                      onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
                      className="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-3 text-sm text-black outline-none focus:border-black/25 focus:ring-2 focus:ring-white/20"
                      placeholder="Optionnel"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-black/5 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-black/45">Articles</p>
                    <button
                      type="button"
                      onClick={addItemRow}
                      className="rounded-full border border-black/10 bg-black/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-black/70 hover:bg-black/5 transition"
                    >
                      + ajouter
                    </button>
                  </div>

                  <div className="mt-3 grid gap-3">
                    {(form.items ?? []).map((it: RequestItem, idx: number) => (
                      <div key={idx} className="grid grid-cols-1 sm:grid-cols-[1fr_160px_90px_40px] gap-2">
                        <input
                          value={it.name}
                          onChange={(e) => updateItemRow(idx, { name: e.target.value })}
                          className="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2 text-sm text-black outline-none focus:border-black/25"
                          placeholder="Article"
                        />
                        <input
                          value={it.sku ?? ''}
                          onChange={(e) => updateItemRow(idx, { sku: e.target.value })}
                          className="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2 text-sm text-black outline-none focus:border-black/25"
                          placeholder="SKU (optionnel)"
                        />
                        <input
                          type="number"
                          value={it.qty}
                          onChange={(e) => updateItemRow(idx, { qty: Number(e.target.value) })}
                          className="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2 text-sm text-black outline-none focus:border-black/25"
                        />
                        <button
                          type="button"
                          onClick={() => removeItemRow(idx)}
                          className="rounded-xl border border-black/10 bg-black/5 text-black/60 hover:bg-black/5 transition"
                          aria-label="Supprimer"
                        >
                          <X size={18} className="mx-auto" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 rounded-xl border border-black/10 bg-black/5 px-4 py-3 text-[10px] font-black uppercase tracking-[0.28em] text-black/60 hover:bg-black/5 transition"
                  >
                    Annuler
                  </button>
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="flex-[2] inline-flex items-center justify-center gap-2 rounded-xl border border-[#0065BD]/30 bg-[#0065BD] px-4 py-3 text-[10px] font-black uppercase tracking-[0.28em] text-black hover:bg-[#00549e] transition"
                  >
                    {isSubmitting ? 'Envoi…' : 'Créer demande'}
                    {!isSubmitting && <Save size={16} />}
                  </button>
                </div>
              </form>
            </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: deliver confirm */}
      <AnimatePresence>
        {isDeliverOpen && selected && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div
              onClick={() => setIsDeliverOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            >
              <div className="h-full w-full">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              </div>
            </div>

            <div className="relative w-full max-w-xl rounded-2xl border border-black/10 bg-white shadow-2xl overflow-hidden">
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 16 }}
            >
              <div className="bg-black/5 px-8 py-6 border-b border-black/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.35em] text-black/40 font-black">Workflow</p>
                  <h3 className={`${teko.className} text-3xl uppercase text-black mt-2`}>Confirmer livraison</h3>
                </div>
                <button type="button" onClick={() => setIsDeliverOpen(false)} className="text-slate-400 hover:text-black transition-colors">
                  <X size={22} />
                </button>
              </div>

              <div className="p-8 space-y-5">
                <div className="rounded-2xl border border-black/10 bg-black/5 p-5">
                  <p className="text-sm text-black/80">
                    <span className="font-semibold">{selected.title}</span> — {selected.team}
                  </p>
                  <p className="mt-2 text-[10px] font-black uppercase tracking-[0.28em] text-black/40">
                    Cette action passera la demande au statut LIVRÉ.
                  </p>
                </div>

                <div className="rounded-2xl border border-black/10 bg-black/5 p-5">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={deliverDeduct}
                      onChange={(e) => setDeliverDeduct(e.target.checked)}
                      className="mt-1"
                    />
                    <div>
                      <p className="text-sm font-semibold text-black">Déduire automatiquement du stock</p>
                      <p className="mt-1 text-sm text-black/60">
                        Matching : SKU exact si fourni, sinon nom (approx.).
                      </p>
                    </div>
                  </label>
                </div>

                <div className="rounded-2xl border border-black/10 bg-black/5 p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-black/45">Résumé articles</p>
                  <ul className="mt-3 grid gap-2">
                    {selected.items.map((it, idx) => (
                      <li key={idx} className="flex items-center justify-between rounded-xl border border-black/10 bg-black/5 px-4 py-3">
                        <div>
                          <div className="text-sm text-black/80">{it.name}</div>
                          {it.sku ? (
                            <div className="text-[10px] font-black uppercase tracking-[0.28em] text-black/35">SKU {it.sku}</div>
                          ) : null}
                        </div>
                        <div className={`${teko.className} text-2xl text-black`}>x{it.qty}</div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsDeliverOpen(false)}
                    className="flex-1 rounded-xl border border-black/10 bg-black/5 px-4 py-3 text-[10px] font-black uppercase tracking-[0.28em] text-black/60 hover:bg-black/5 transition"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={confirmDeliver}
                    className="flex-[2] inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-[10px] font-black uppercase tracking-[0.28em] text-emerald-200 hover:bg-emerald-500/15 transition"
                  >
                    Confirmer
                    <CheckCircle2 size={16} />
                  </button>
                </div>

                {deliverInfo?.lowAfter != null ? (
                  <p className="text-xs text-black/45">
                    Stock : {deliverInfo.lowAfter} article(s) sous le minimum après livraison.
                  </p>
                ) : null}
              </div>
            </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
