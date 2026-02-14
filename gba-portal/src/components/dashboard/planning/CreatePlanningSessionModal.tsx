'use client'

import * as React from 'react'

import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

import { createPlanningSession } from '@/app/dashboard/planning/actions'

type TeamOption = { id: string; name: string; category: string }

type Props = {
  isOpen: boolean
  onClose: () => void
  teams: TeamOption[]
}

const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'] as const

function inputClassName() {
  return 'w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/25 focus:ring-2 focus:ring-white/20'
}

function labelClassName() {
  return 'block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5'
}

export function CreatePlanningSessionModal({ isOpen, onClose, teams }: Props) {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    try {
      const res = await createPlanningSession(null, formData)
      if (res?.success) {
        onClose()
      } else {
        setError(res?.message ?? 'Erreur')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ajouter une séance"
      description="Créez un créneau dans le planning."
    >
      <form action={handleSubmit} className="space-y-4">
        {error ? (
          <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
            {error}
          </div>
        ) : null}

        <div>
          <label className={labelClassName()}>Équipe</label>
          <select name="teamId" className={inputClassName()} required defaultValue="">
            <option value="" disabled>
              Sélectionner…
            </option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.category} • {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClassName()}>Jour</label>
            <select name="day" className={inputClassName()} defaultValue="Lun" required>
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClassName()}>Pôle</label>
            <input name="pole" className={inputClassName()} defaultValue="Formation" required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClassName()}>Début</label>
            <input name="startTime" type="time" className={inputClassName()} defaultValue="18:00" required />
          </div>
          <div>
            <label className={labelClassName()}>Fin</label>
            <input name="endTime" type="time" className={inputClassName()} defaultValue="19:30" required />
          </div>
        </div>

        <div>
          <label className={labelClassName()}>Lieu</label>
          <input name="location" className={inputClassName()} defaultValue="Synthétique" required />
        </div>

        <div>
          <label className={labelClassName()}>Staff (virgules)</label>
          <input name="staff" className={inputClassName()} placeholder="Coach A, Coach B" />
        </div>

        <div>
          <label className={labelClassName()}>Note</label>
          <textarea name="note" className={`${inputClassName()} min-h-[80px]`} placeholder="Optionnel" />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Création…' : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
