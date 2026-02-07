"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function HeroShowcase() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [reduceData, setReduceData] = useState(false);

  // Enable only when the asset exists in /public (avoid 404 on clients).
  const hasHeroWebm = process.env.NEXT_PUBLIC_HERO_WEBM === "1";

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const data = window.matchMedia("(prefers-reduced-data: reduce)");

    const onChange = () => {
      setReduceMotion(motion.matches);
      setReduceData(data.matches);
    };

    onChange();
    motion.addEventListener?.("change", onChange);
    data.addEventListener?.("change", onChange);

    return () => {
      motion.removeEventListener?.("change", onChange);
      data.removeEventListener?.("change", onChange);
    };
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {reduceMotion || reduceData ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{ backgroundImage: "url(/gba-logo.png)" }}
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

      {/* Readability overlays */}
      <div className="pointer-events-none absolute inset-0 bg-black/35" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-[#02081055] to-[#020202]" />
      <div
        className={`pointer-events-none absolute inset-0 opacity-25 blur-2xl ${reduceMotion || reduceData ? "" : "hero-ambient"}`}
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(0,255,255,0.26), transparent 42%), radial-gradient(circle at 80% 0%, rgba(0,101,189,0.22), transparent 48%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 hero-vignette" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 hero-grain" aria-hidden="true" />

      <div className="absolute inset-x-0 top-28 z-10 mx-auto w-full max-w-6xl px-6 text-center text-white md:top-32 md:px-10">
        <div className="cinematic-reveal font-[var(--font-cinzel)] text-xs font-semibold tracking-widest text-white/70">
          Groupement Bruche Ackerland
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-6 z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-6 text-center text-white md:bottom-10 md:px-10 lg:bottom-14">
        <h1 className="cinematic-reveal cinematic-reveal-delay-1 font-[var(--font-teko)] text-[clamp(3.05rem,7.1vw,5.6rem)] font-black leading-[0.9] tracking-tight">
          <span className="block bg-gradient-to-r from-white via-white to-[#9fe7ff] bg-clip-text text-transparent drop-shadow-[0_18px_55px_rgba(0,161,255,0.16)]">
            Académie Monumentale
          </span>
          <span className="mt-1 block text-[clamp(1.15rem,2.2vw,1.75rem)] font-bold tracking-wide text-white/70">
            &nbsp;Un club, une culture, une fierté
          </span>
        </h1>

        <div className="cinematic-reveal cinematic-reveal-delay-2 h-px w-[min(720px,86vw)] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <p className="cinematic-reveal cinematic-reveal-delay-2 mx-auto max-w-3xl text-[0.98rem] leading-relaxed text-white/75 md:text-lg">
          Un portail premium pour faire vibrer l’histoire du GBA — valeurs, formation, vie du club, partenaires et boutique.
        </p>

        <ul
          aria-label="Thématiques"
          className="cinematic-reveal cinematic-reveal-delay-2 flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold text-white/75"
        >
          {["Histoire & valeurs", "Jeunes & formation", "Boutique"].map((label) => (
            <li
              key={label}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 shadow-[0_14px_40px_rgba(0,0,0,0.35)] backdrop-blur"
            >
              {label}
            </li>
          ))}
        </ul>

        <div className="cinematic-reveal cinematic-reveal-delay-2 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#manifesto"
            aria-label="Découvrir le club"
            className="btn-premium rounded-full border border-white/45 bg-gradient-to-r from-[#00a1ff] to-[#0065bd] px-8 py-3 text-sm font-bold text-white shadow-[0_14px_46px_rgba(0,161,255,0.38)] transition-transform duration-200 hover:scale-[1.015] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-[0.99]"
          >
            Découvrir le club
          </a>

          <Link
            href="/sponsors"
            aria-label="Devenir partenaire"
            className="btn-ghost rounded-full border border-white/25 px-8 py-3 text-sm font-bold text-white/90 transition-colors duration-200 hover:border-white/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Devenir partenaire
          </Link>
        </div>
      </div>
    </section>
  );
}
