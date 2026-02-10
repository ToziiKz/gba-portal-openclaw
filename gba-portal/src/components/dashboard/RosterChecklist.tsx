'use client'

import * as React from 'react'
import { Button } from '@/components/ui/Button'
import { dashboardPlayersMock } from '@/lib/mocks/dashboardPlayers'
import { attendanceSessionsMock, type AttendanceStatus } from '@/lib/mocks/dashboardAttendance'

type RosterChecklistProps = {
  planningSessionId: string
  team: string
  onBack: () => void
  onClose: () => void
}

type LocalAttendance = {
  playerId: string
  name: string
  status: AttendanceStatus
  note: string
}

const statusOptions: { value: AttendanceStatus; label: string; color: string }[] = [
  {
    value: 'present',
    label: 'Présent',
    color: 'text-green-400 bg-green-400/10 border-green-400/20',
  },
  {
    value: 'late',
    label: 'Retard',
    color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  },
  { value: 'excused', label: 'Excusé', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  { value: 'absent', label: 'Absent', color: 'text-red-400 bg-red-400/10 border-red-400/20' },
]

export function RosterChecklist({
  planningSessionId,
  team,
  onBack,
  onClose,
}: RosterChecklistProps) {
  const [rows, setRows] = React.useState<LocalAttendance[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)

  React.useEffect(() => {
    // Simulate fetch
    const t = window.setTimeout(() => {
      const existing = attendanceSessionsMock.find((a) => a.planningSessionId === planningSessionId)

      let data: LocalAttendance[] = []

      if (existing) {
        data = existing.rows.map((r) => ({
          playerId: r.playerId,
          name: r.playerName,
          status: r.status,
          note: r.note || '',
        }))
      } else {
        // Build from players mock
        const teamPlayers = dashboardPlayersMock.filter((p) => p.team === team)
        // Fallback if no players found for that exact team string
        const pool = teamPlayers.length > 0 ? teamPlayers : dashboardPlayersMock.slice(0, 10)

        data = pool.map((p) => ({
          playerId: p.id,
          name: `${p.firstName} ${p.lastName}`,
          status: 'present',
          note: '',
        }))
      }
      setRows(data)
      setIsLoading(false)
    }, 400)

    return () => window.clearTimeout(t)
  }, [planningSessionId, team])

  const handleStatusChange = (playerId: string, newStatus: AttendanceStatus) => {
    setRows((prev) =>
      prev.map((row) => (row.playerId === playerId ? { ...row, status: newStatus } : row))
    )
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      // Mock save logic
      console.log('Saved roster for', planningSessionId, rows)
      setIsSaving(false)
      onClose()
    }, 600)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 w-full animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      </div>
    )
  }

  const counts = {
    present: rows.filter((r) => r.status === 'present').length,
    late: rows.filter((r) => r.status === 'late').length,
    excused: rows.filter((r) => r.status === 'excused').length,
    absent: rows.filter((r) => r.status === 'absent').length,
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Feuille de présence</h3>
        <div className="flex gap-2 text-[10px] uppercase tracking-wider font-bold">
          <span className="text-green-400">{counts.present} P</span>
          <span className="text-yellow-400">{counts.late} R</span>
          <span className="text-blue-400">{counts.excused} E</span>
          <span className="text-red-400">{counts.absent} A</span>
        </div>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
        {rows.map((row) => (
          <div
            key={row.playerId}
            className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-3 transition hover:bg-white/10"
          >
            <span className="text-sm font-medium text-white truncate max-w-[120px] sm:max-w-none">
              {row.name}
            </span>

            <div className="flex gap-1">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleStatusChange(row.playerId, opt.value)}
                  className={`
                            h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold transition
                            ${
                              row.status === opt.value
                                ? opt.color + ' border ring-1 ring-inset ring-white/10'
                                : 'text-white/20 hover:bg-white/10 hover:text-white/60'
                            }
                        `}
                  title={opt.label}
                  aria-label={`Marquer ${opt.label}`}
                >
                  {opt.label.charAt(0)}
                </button>
              ))}
            </div>
          </div>
        ))}

        {rows.length === 0 && (
          <p className="text-center text-sm text-white/40 py-4">
            Aucun joueur trouvé pour cette équipe.
          </p>
        )}
      </div>

      <div className="pt-4 border-t border-white/10 flex justify-between gap-3">
        <Button variant="ghost" onClick={onBack} disabled={isSaving}>
          Retour
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Sauvegarde...' : 'Enregistrer'}
        </Button>
      </div>
    </div>
  )
}
