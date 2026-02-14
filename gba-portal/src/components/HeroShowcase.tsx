'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export function HeroShowcase() {
  const [reduceMotion, setReduceMotion] = useState(false)
  const [reduceData, setReduceData] = useState(false)

  // Enable only when the asset exists in /public (avoid 404 on clients).
  const hasHeroWebm = process.env.NEXT_PUBLIC_HERO_WEBM === '1'

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const data = window.matchMedia('(prefers-reduced-data: reduce)')

    const onChange = () => {
      setReduceMotion(motion.matches)
      setReduceData(data.matches)
    }

    onChange()
    motion.addEventListener?.('change', onChange)
    data.addEventListener?.('change', onChange)

    return () => {
      motion.removeEventListener?.('change', onChange)
      data.removeEventListener?.('change', onChange)
    }
  }, [])

  return (
    <section className="relative min-h-screen overflow-hidden">
      {reduceMotion || reduceData ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{ backgroundImage: 'url(/gba-logo.png)' }}
        />
      ) : (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/gba-logo.png"
          disablePictureInPicture
          disableRemotePlayback
          controls={false}
          className="absolute inset-0 h-full w-full object-cover opacity-70"
          aria-hidden="true"
          tabIndex={-1}
        >
          {hasHeroWebm ? <source src="/hero.webm" type="video/webm" /> : null}
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      )}

      <div className="pointer-events-none absolute inset-0 bg-black/40" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-[#02081044] to-[#020202]" />
      <div className="pointer-events-none absolute inset-0 hero-vignette" aria-hidden="true" />

      <div className="absolute inset-x-0 top-28 z-10 mx-auto w-full max-w-6xl px-6 text-center text-white md:top-32 md:px-10">
        <div className="cinematic-reveal font-[var(--font-cinzel)] text-xs font-semibold tracking-widest text-white/70">
          Groupement Bruche Ackerland
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-6 z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-6 text-center text-white md:bottom-10 md:px-10 lg:bottom-14">
        <h1 className="cinematic-reveal cinematic-reveal-delay-1 font-[var(--font-teko)] text-[clamp(3rem,6vw,5rem)] font-black leading-none tracking-tight text-white">
          <span className="block drop-shadow-lg">Football amateur, vision pro</span>
          <span className="mt-2 block text-[clamp(1.2rem,2vw,1.5rem)] font-medium tracking-normal text-white/80">
            Former. Accompagner. Faire grandir.
          </span>
        </h1>

        <p className="cinematic-reveal cinematic-reveal-delay-2 mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
          Vivez l&rsquo;expérience GBA. L&rsquo;histoire s&rsquo;écrit ensemble, sur et en dehors du
          terrain.
        </p>

        <ul
          aria-label="Thématiques"
          className="cinematic-reveal cinematic-reveal-delay-2 flex flex-wrap items-center justify-center gap-3 text-[11px] font-medium tracking-wide uppercase text-white/60"
        >
          {['Formation', 'Encadrement', 'Compétition', 'Territoire'].map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>

        <div className="cinematic-reveal cinematic-reveal-delay-2 mt-4 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/#manifesto"
            className="rounded-full bg-white px-8 py-3 text-sm font-bold text-black transition-transform hover:scale-105 active:scale-95"
          >
            Découvrir le club
          </Link>

          <Link
            href="/contact"
            className="rounded-full border border-white/20 px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
          >
            Devenir partenaire
          </Link>
        </div>
      </div>
    </section>
  )
}
