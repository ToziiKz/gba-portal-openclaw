import type { Metadata } from 'next'

import { CoachAccessForm } from './request-form'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Demande d’accès coach · GBA',
  description: 'Formulaire public pour demander un accès coach au dashboard GBA.',
}

export default async function CoachAccessPage() {
  const supabase = await createClient()
  const { data: teams } = await supabase.from('teams').select('name').order('name', { ascending: true })

  const teamOptions = (teams ?? [])
    .map((t) => t.name)
    .filter((name): name is string => Boolean(name))

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020202] via-[#050505] to-[#000000] px-6 py-24">
      <div className="mx-auto w-full max-w-2xl rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-[0_25px_90px_rgba(0,0,0,0.65)] backdrop-blur md:p-10">
        <p className="text-xs uppercase tracking-widest text-white/60">Accès coach</p>
        <h1 className="mt-4 font-[var(--font-teko)] text-4xl font-black tracking-[0.06em] text-white md:text-5xl">
          Demande d’accès
        </h1>
        <p className="mt-4 text-sm text-white/70">
          Votre demande est validée par un admin avant création de compte. Vous recevrez un lien
          d’activation personnel.
        </p>

        <div className="mt-8">
          <CoachAccessForm teamOptions={teamOptions} />
        </div>
      </div>
    </div>
  )
}
