'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const fadeStagger = {
  hidden: { opacity: 0, y: 26 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
  }),
}

const DEFAULT_HERO_AUDIO =
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'

export function HeroShowcase() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const volumeRafRef = useRef<number | null>(null)

  const [isMuted, setIsMuted] = useState(true)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [parallaxProgress, setParallaxProgress] = useState(0)

  const hasHeroWebm = process.env.NEXT_PUBLIC_HERO_WEBM === '1'
  const audioSrc = process.env.NEXT_PUBLIC_HERO_AUDIO_URL || DEFAULT_HERO_AUDIO

  const stopVolumeAnimation = useCallback(() => {
    if (volumeRafRef.current) {
      cancelAnimationFrame(volumeRafRef.current)
      volumeRafRef.current = null
    }
  }, [])

  const fadeVolume = useCallback(
    (targetVolume: number, durationMs = 900) => {
      const audio = audioRef.current
      if (!audio) return

      stopVolumeAnimation()

      const startVolume = audio.volume
      const startTs = performance.now()

      const tick = (ts: number) => {
        const elapsed = ts - startTs
        const progress = Math.min(elapsed / durationMs, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        audio.volume = startVolume + (targetVolume - startVolume) * eased

        if (progress < 1) {
          volumeRafRef.current = requestAnimationFrame(tick)
        } else {
          volumeRafRef.current = null
        }
      }

      volumeRafRef.current = requestAnimationFrame(tick)
    },
    [stopVolumeAnimation],
  )

  const toggleSound = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return

    if (isMuted) {
      audio.volume = 0

      try {
        await audio.play()
      } catch {
        return
      }

      fadeVolume(0.85, 1200)
      setIsMuted(false)
      return
    }

    fadeVolume(0, 550)
    setTimeout(() => {
      audioRef.current?.pause()
    }, 580)
    setIsMuted(true)
  }, [fadeVolume, isMuted])

  useEffect(() => {
    const video = videoRef.current
    const audio = audioRef.current
    if (!video || !audio) return

    video.muted = true
    video.volume = 0

    audio.loop = true
    audio.preload = 'metadata'
    audio.volume = 0

    return () => {
      stopVolumeAnimation()
      audio.pause()
    }
  }, [stopVolumeAnimation])

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotion = () => setPrefersReducedMotion(motionQuery.matches)
    updateMotion()
    motionQuery.addEventListener?.('change', updateMotion)

    const updateParallax = () => {
      if (!sectionRef.current || motionQuery.matches) {
        setParallaxProgress(0)
        return
      }

      const rect = sectionRef.current.getBoundingClientRect()
      const sectionHeight = Math.max(rect.height, 1)
      const progress = Math.min(Math.max(-rect.top / sectionHeight, 0), 1)
      setParallaxProgress(progress)
    }

    updateParallax()
    window.addEventListener('scroll', updateParallax, { passive: true })
    window.addEventListener('resize', updateParallax)

    return () => {
      motionQuery.removeEventListener?.('change', updateMotion)
      window.removeEventListener('scroll', updateParallax)
      window.removeEventListener('resize', updateParallax)
    }
  }, [])

  const videoTransform = prefersReducedMotion
    ? 'translate3d(0,0,0) scale(1)'
    : `translate3d(0, ${parallaxProgress * 12}%, 0) scale(${1 + parallaxProgress * 0.08})`

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden bg-black text-white">
      <motion.video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/gba-logo.png"
        disablePictureInPicture
        disableRemotePlayback
        controls={false}
        aria-hidden="true"
        tabIndex={-1}
        style={{ transform: videoTransform }}
        className="absolute inset-0 h-full w-full object-cover"
      >
        {hasHeroWebm ? <source src="/hero.webm" type="video/webm" /> : null}
        <source src="/hero.mp4" type="video/mp4" />
      </motion.video>

      <audio ref={audioRef} src={audioSrc} preload="metadata" aria-hidden="true" />

      <div className="pointer-events-none absolute inset-0 bg-black/55" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-black/45 to-black/85" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-10 mix-blend-soft-light"
        style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
      />

      <div className="relative z-50 flex h-full flex-col items-center justify-center px-4 text-center pointer-events-none">
        <motion.h1
          initial="hidden"
          animate="visible"
          custom={0.2}
          variants={fadeStagger}
          className="font-[var(--font-teko)] text-[10vw] font-black uppercase leading-[0.88] tracking-[0.08em] text-white [text-shadow:0_8px_30px_rgba(0,0,0,0.55)] [-webkit-text-stroke:1px_rgba(255,255,255,0.2)]"
        >
          <span className="block bg-gradient-to-b from-white via-white to-white/70 bg-clip-text text-transparent">
            Football Amateur
          </span>
          <span className="block bg-gradient-to-b from-white via-white to-white/70 bg-clip-text text-transparent">
            Vision Pro
          </span>
        </motion.h1>

        <motion.button
          type="button"
          onClick={toggleSound}
          initial="hidden"
          animate="visible"
          custom={0.45}
          variants={fadeStagger}
          className="mt-8 relative z-50 pointer-events-auto inline-flex items-center gap-2 cursor-pointer rounded-full border border-white/30 bg-black/35 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm transition hover:border-white/70 hover:text-white hover:scale-105 active:scale-95"
          aria-pressed={!isMuted}
          aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
        >
          <span
            className={`inline-flex h-2 w-2 rounded-full ${
              isMuted ? 'bg-white/50' : 'animate-pulse bg-red-400'
            }`}
          />
          {isMuted ? 'Activer le son 🔊' : 'On Air • Son actif'}
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
        aria-hidden="true"
      >
        <motion.div
          animate={prefersReducedMotion ? undefined : { y: [0, 7, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center text-white/70"
        >
          <span className="mb-2 text-[10px] uppercase tracking-[0.24em]">Scroll</span>
          <span className="text-lg">⌄</span>
        </motion.div>
      </motion.div>
    </section>
  )
}
