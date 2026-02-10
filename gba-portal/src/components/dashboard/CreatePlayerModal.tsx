'use client'

import * as React from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import {
  dashboardPlayerPoles,
  type DashboardPlayer,
  type PlayerPole,
} from '@/lib/mocks/dashboardPlayers'

interface CreatePlayerModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (
    player: Omit<
      DashboardPlayer,
      'id' | 'updatedAtLabel' | 'medicalStatusLabel' | 'licenceStatus' | 'equipmentStatus'
    >
  ) => void
}

function inputBaseClassName() {
  return 'w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/25 focus:ring-2 focus:ring-white/20'
}

export function CreatePlayerModal({ isOpen, onClose, onCreate }: CreatePlayerModalProps) {
  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [birthYear, setBirthYear] = React.useState<number>(2015)
  const [category, setCategory] = React.useState('U11')
  const [pole, setPole] = React.useState<PlayerPole>('École de foot')
  const [team, setTeam] = React.useState('GBA U11')
  const [position, setPosition] = React.useState<DashboardPlayer['position']>('M')
  const [guardianName, setGuardianName] = React.useState('')
  const [phone, setPhone] = React.useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreate({
      firstName,
      lastName,
      birthYear,
      category,
      pole,
      team,
      position,
      guardianName: guardianName || undefined,
      phone: phone || undefined,
    })
    onClose()
    // Reset form
    setFirstName('')
    setLastName('')
    setBirthYear(2015)
    setCategory('U11')
    setPole('École de foot')
    setTeam('GBA U11')
    setPosition('M')
    setGuardianName('')
    setPhone('')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nouveau joueur"
      description="Ajouter un joueur à l'effectif."
    >
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
              Prénom
            </span>
            <input
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={inputBaseClassName()}
              placeholder="Ex: Léo"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
              Nom
            </span>
            <input
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={inputBaseClassName()}
              placeholder="Ex: Dubois"
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
              Année
            </span>
            <input
              type="number"
              required
              value={birthYear}
              onChange={(e) => setBirthYear(parseInt(e.target.value) || 2015)}
              className={inputBaseClassName()}
            />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
              Poste
            </span>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value as DashboardPlayer['position'])}
              className={inputBaseClassName()}
            >
              <option value="G">Gardien</option>
              <option value="D">Défenseur</option>
              <option value="M">Milieu</option>
              <option value="A">Attaquant</option>
            </select>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
              Pôle
            </span>
            <select
              value={pole}
              onChange={(e) => setPole(e.target.value as PlayerPole)}
              className={inputBaseClassName()}
            >
              {dashboardPlayerPoles.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
              Catégorie
            </span>
            <input
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputBaseClassName()}
              placeholder="Ex: U11"
            />
          </label>
        </div>

        <label className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
            Équipe
          </span>
          <input
            required
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            className={inputBaseClassName()}
            placeholder="Ex: GBA U11 A"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
              Responsable (opt)
            </span>
            <input
              value={guardianName}
              onChange={(e) => setGuardianName(e.target.value)}
              className={inputBaseClassName()}
              placeholder="Nom du parent"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
              Tél (opt)
            </span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputBaseClassName()}
              placeholder="06..."
            />
          </label>
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" variant="primary">
            Créer le joueur
          </Button>
        </div>
      </form>
    </Modal>
  )
}
