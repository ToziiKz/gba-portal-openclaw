import { HeroShowcase } from '@/components/HeroShowcase'
import { ProductCard } from '@/components/shop/ProductCard'
import { featuredProducts } from '@/lib/shop-data'
import { CONTACT_EMAIL, KEY_STATS, SPONSORS_LIST } from '@/lib/site-content'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "GBA Portal — Plus qu'un club, une famille",
  description:
    "Découvrez le Groupement Bruche Ackerland : une aventure humaine, sportive et locale. Formation, passion et excellence au cœur de l'Alsace.",
  alternates: { canonical: '/' },
  openGraph: {
    title: "GBA Portal — Plus qu'un club, une famille",
    description:
      "Rejoignez l'aventure GBA. Une histoire de passion, de formation et de victoires partagées.",
    url: '/',
    images: [
      {
        url: '/gba-logo.png',
        width: 1200,
        height: 630,
        alt: 'GBA Portal — Groupement Bruche Ackerland',
      },
    ],
  },
}

const pillars = [
  {
    title: 'Notre Histoire',
    text: 'Né de la fusion de villages passionnés, le GBA est devenu une référence régionale. Une épopée humaine où chaque saison écrit un nouveau chapitre de gloire et de partage.',
  },
  {
    title: "L'Esprit GBA",
    text: 'Bienveillance, Exigence, Dépassement. Ici, on ne forme pas seulement des joueurs, on construit des personnalités. Un maillot qui se porte avec fierté et humilité.',
  },
  {
    title: 'Notre Force',
    text: "Une communauté soudée, des bénévoles en or et des supporters inconditionnels. Le GBA, c'est le cœur battant de notre territoire, vibrant au rythme de chaque match.",
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <HeroShowcase />

      <section id="manifesto" className="px-6 py-24" aria-labelledby="manifesto-title">
        <div className="mx-auto max-w-6xl text-center">
          <h2
            id="manifesto-title"
            className="font-[family-name:var(--font-teko)] text-5xl font-bold uppercase tracking-wide"
          >
            L&apos;Excellence & La Passion
          </h2>
          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {pillars.map((item) => (
              <article
                key={item.title}
                className="text-center group hover:bg-white/[0.02] p-6 rounded-2xl transition-colors"
              >
                <p className="text-2xl font-bold text-white mb-4 font-[family-name:var(--font-teko)] uppercase tracking-wide">
                  {item.title}
                </p>
                <p className="text-base text-white/70 leading-relaxed">{item.text}</p>
              </article>
            ))}
          </div>

          <div className="mt-20 pt-12 border-t border-white/5 grid grid-cols-3 gap-8">
            {KEY_STATS.map((s) => (
              <article key={s.label} className="text-center">
                <p className="text-4xl md:text-5xl font-black font-[family-name:var(--font-teko)]">
                  {s.value}
                </p>
                <p className="text-xs font-bold uppercase tracking-widest text-white/40 mt-2">
                  {s.label}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="formation" className="relative px-6 py-24 bg-white/[0.02] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-50 pointer-events-none" />
        <div className="relative mx-auto max-w-5xl text-center">
          <h2 className="font-[family-name:var(--font-teko)] text-4xl md:text-5xl font-bold uppercase tracking-wide">
            La Formation GBA
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-white/60 leading-relaxed">
            Du premier ballon touché aux matchs décisifs, nous accompagnons chaque talent. Une école
            de la vie où grandir signifie apprendre, respecter et gagner ensemble.
          </p>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "L'École de Foot", sub: 'U7 à U9 — Découverte & Sourires' },
              { label: 'La Préformation', sub: 'U11 à U13 — Bases & Technique' },
              { label: 'La Formation', sub: 'U15 à U18 — Compétition & Rigueur' },
              { label: 'Les Séniors', sub: 'Équipe Fanion — Ambition & Exemplarité' },
            ].map((level) => (
              <div
                key={level.label}
                className="p-6 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors"
              >
                <p className="text-lg font-bold font-[family-name:var(--font-teko)] tracking-wide">
                  {level.label}
                </p>
                <p className="text-xs uppercase tracking-wider text-white/50 mt-2">{level.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="shop-preview" className="px-6 py-24 border-t border-white/5">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
            <div className="text-center md:text-left">
              <h2 className="font-[family-name:var(--font-teko)] text-4xl font-bold uppercase tracking-wide">
                Boutique Officielle
              </h2>
              <p className="mt-2 text-white/50">
                Affichez vos couleurs sur et en dehors du terrain.
              </p>
            </div>
            <Link
              href="/shop"
              className="px-6 py-2 border border-white/20 rounded-full text-sm font-bold hover:bg-white hover:text-black transition-all"
            >
              Voir toute la boutique
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.name} {...product} contactEmail={CONTACT_EMAIL} />
            ))}
          </div>
        </div>
      </section>

      <section
        id="sponsors"
        className="px-6 py-24 border-t border-white/5"
        aria-labelledby="sponsors-title"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left mb-16">
            <div>
              <h2
                id="sponsors-title"
                className="font-[family-name:var(--font-teko)] text-4xl font-bold uppercase tracking-wide"
              >
                Nos Partenaires
              </h2>
              <p className="mt-2 text-white/50">Ils croient en nous, nous gagnons avec eux.</p>
            </div>
            <Link
              href="/sponsors"
              className="px-6 py-2 border border-white/20 rounded-full text-sm font-bold hover:bg-white hover:text-black transition-all"
            >
              Devenir Partenaire
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SPONSORS_LIST.map((s) => (
              <article
                key={s.name}
                className="group p-8 bg-white/[0.02] rounded-2xl hover:bg-white/[0.04] transition-colors border border-white/5"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#00a1ff] mb-3">
                  {s.role}
                </p>
                <h3 className="text-xl font-bold font-[family-name:var(--font-teko)] tracking-wide text-white group-hover:text-white transition-colors">
                  {s.name}
                </h3>
                <p className="mt-3 text-sm text-white/50">{s.impact}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="actu" className="relative px-6 py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#00a1ff]/10 to-transparent opacity-30 pointer-events-none" />
        <div className="relative mx-auto max-w-4xl text-center z-10">
          <h2 className="font-[family-name:var(--font-teko)] text-5xl md:text-6xl font-bold uppercase tracking-wide mb-6">
            Rejoignez la Tribu
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed mb-12">
            Vibrez au bord du terrain, portez nos couleurs, partagez nos victoires. Le GBA
            n&apos;attend que vous.
          </p>

          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
            <Link
              href="/shop"
              className="px-10 py-4 bg-white text-black font-black text-sm uppercase tracking-widest rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              Accéder à la Boutique
            </Link>
            <Link
              href="/news"
              className="px-10 py-4 border border-white/20 text-white font-bold text-sm uppercase tracking-widest rounded-full hover:bg-white/10 transition-colors"
            >
              Lire les Actualités
            </Link>
          </div>
        </div>
      </section>

      <footer id="footer" className="border-t border-white/10 bg-black px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-12 text-sm text-white/60 md:grid-cols-4">
          <div className="col-span-1 md:col-span-1">
            <p className="text-white font-bold font-[family-name:var(--font-teko)] text-3xl tracking-wide mb-4">
              GBA.
            </p>
            <p className="leading-relaxed text-white/50">
              L&apos;esprit d&apos;équipe, la passion du jeu, la force du collectif.
            </p>
          </div>
          <div>
            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-white">Explorer</p>
            <ul className="space-y-4">
              <li>
                <Link href="/news" className="hover:text-white transition-colors">
                  Actualités
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  Boutique
                </Link>
              </li>
              <li>
                <Link href="/sponsors" className="hover:text-white transition-colors">
                  Partenaires
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-white">Légal</p>
            <ul className="space-y-4">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Conditions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-white">Contact</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="block hover:text-[#00a1ff] transition-colors mb-2"
            >
              {CONTACT_EMAIL}
            </a>
            <p className="text-white/30 text-xs mt-4">
              &copy; {new Date().getFullYear()} GBA. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
