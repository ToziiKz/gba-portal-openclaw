import type { Metadata } from 'next'
import Link from 'next/link'

import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Connexion',
  description: 'Accès staff GBA. Connectez-vous pour accéder au dashboard.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: '/login',
  },
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020202] via-[#050505] to-[#000000] px-6 py-24">
      <div className="mx-auto w-full max-w-md rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-[0_25px_90px_rgba(0,0,0,0.65)] backdrop-blur md:p-10">
        <p className="text-xs uppercase tracking-widest text-white/60">Espace staff</p>
        <h1 className="mt-4 font-[var(--font-teko)] text-4xl font-black tracking-[0.06em] text-white md:text-5xl">
          Connexion
        </h1>
        <p className="mt-4 text-sm text-white/70">
          Connectez-vous pour gérer les équipes, le planning et les licences.
        </p>

        <div className="mt-8">
          <LoginForm />
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-xs font-semibold text-white/40 hover:text-white hover:underline"
          >
            Retour au site public
          </Link>
        </div>
      </div>
    </div>
  )
}
