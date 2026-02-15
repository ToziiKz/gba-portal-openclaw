import { FormationTimeline } from '@/components/FormationTimeline'
import { HeroShowcase } from '@/components/HeroShowcase'
import { ManifestoPanel } from '@/components/ManifestoPanel'
import { StatsTicker } from '@/components/StatsTicker'
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

const formationSteps = [
  { label: "L'École de Foot", sub: 'U7 à U9 — Découverte & Sourires' },
  { label: 'La Préformation', sub: 'U11 à U13 — Bases & Technique' },
  { label: 'La Formation', sub: 'U15 à U18 — Compétition & Rigueur' },
  { label: 'Les Séniors', sub: 'Équipe Fanion — Ambition & Exemplarité' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[#03040a] text-white">
      <HeroShowcase />

      <section
        id="proof"
        className="relative overflow-hidden border-t border-white/5 px-5 py-16 sm:px-6"
        aria-labelledby="proof-title"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(34,211,238,0.12),transparent_35%),radial-gradient(circle_at_85%_0%,rgba(99,102,241,0.16),transparent_45%)]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 text-center md:flex-row md:items-end md:justify-between md:text-left">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-100/55">Preuves</p>
              <h2
                id="proof-title"
                className="mt-3 font-[family-name:var(--font-teko)] text-4xl font-bold uppercase tracking-wide sm:text-5xl"
              >
                Un club structuré, visible, actif
              </h2>
            </div>
            <Link
              href="/contact"
              className="mx-auto rounded-full border border-cyan-300/30 bg-white/[0.03] px-6 py-2 text-sm font-bold backdrop-blur-sm transition hover:border-cyan-200/70 hover:bg-cyan-300/10 md:mx-0"
            >
              Nous contacter
            </Link>
          </div>

          <div className="mt-10">
            <StatsTicker stats={KEY_STATS} />
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                title: 'Parents & joueurs',
                text: 'Découvrir les équipes, la méthode et le cadre de progression.',
                href: '/about',
                cta: 'Découvrir le club',
              },
              {
                title: 'Partenaires',
                text: 'Associer votre image à un projet sportif local et durable.',
                href: '/sponsors',
                cta: 'Voir les partenaires',
              },
              {
                title: 'Supporters',
                text: 'Porter les couleurs du club au quotidien.',
                href: '/shop',
                cta: 'Aller à la boutique',
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm"
              >
                <h3 className="font-[family-name:var(--font-teko)] text-xl font-bold tracking-wide">{item.title}</h3>
                <p className="mt-2 text-sm text-white/60">{item.text}</p>
                <Link
                  href={item.href}
                  className="mt-4 inline-block text-sm font-bold underline decoration-white/25 hover:decoration-white/70"
                >
                  {item.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="manifesto" className="relative overflow-hidden px-5 py-24 sm:px-6" aria-labelledby="manifesto-title">
        <div className="pointer-events-none absolute inset-0 opacity-20 mix-blend-soft-light" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.03] to-transparent" />
        <div className="relative mx-auto max-w-6xl text-center">
          <p className="text-xs uppercase tracking-[0.36em] text-white/45">Manifesto</p>
          <h2
            id="manifesto-title"
            className="mt-4 font-[family-name:var(--font-teko)] text-5xl font-black uppercase tracking-[0.04em] text-white sm:text-6xl"
          >
            L&apos;Excellence & La Passion
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-sm leading-relaxed text-white/65 sm:text-base">
            Nous croyons qu&apos;une génération se construit avec de la discipline, du respect et des émotions partagées. La victoire se prépare bien avant le coup d&apos;envoi.
          </p>

          <ManifestoPanel items={pillars} />
        </div>
      </section>

      <section id="formation" className="relative overflow-hidden bg-white/[0.02] px-5 py-24 sm:px-6">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/70" />
        <div className="relative mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-100/55">Formation</p>
            <h2 className="mt-3 font-[family-name:var(--font-teko)] text-4xl font-bold uppercase tracking-wide sm:text-5xl">
              La Formation GBA
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/60">
              Du premier ballon touché aux matchs décisifs, nous accompagnons chaque talent. Une école
              de la vie où grandir signifie apprendre, respecter et gagner ensemble. Pour supporter le
              club au quotidien, découvrez aussi la{' '}
              <Link href="/shop" className="underline decoration-white/30 hover:decoration-white/70">
                boutique officielle du GBA
              </Link>
              .
            </p>
          </div>

          <div className="mt-12">
            <FormationTimeline steps={formationSteps} />
          </div>
        </div>
      </section>

      <section id="shop-preview" className="border-t border-white/5 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="text-center md:text-left">
              <h2 className="font-[family-name:var(--font-teko)] text-4xl font-bold uppercase tracking-wide">
                Boutique Officielle
              </h2>
              <p className="mt-2 text-white/50">Affichez vos couleurs sur et en dehors du terrain.</p>
            </div>
            <Link
              href="/shop"
              className="rounded-full border border-white/20 px-6 py-2 text-sm font-bold transition-all hover:bg-white hover:text-black"
            >
              Voir toute la boutique GBA
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.name} {...product} contactEmail={CONTACT_EMAIL} />
            ))}
          </div>
        </div>
      </section>

      <section id="sponsors" className="border-t border-white/5 px-6 py-24" aria-labelledby="sponsors-title">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
            <div>
              <h2
                id="sponsors-title"
                className="font-[family-name:var(--font-teko)] text-4xl font-bold uppercase tracking-wide"
              >
                Nos Partenaires
              </h2>
              <p className="mt-2 text-white/50">
                Ils croient en nous, nous gagnons avec eux. Vous aussi, vous pouvez soutenir le club via
                la{' '}
                <Link href="/shop" className="underline decoration-white/20 hover:decoration-white/60">
                  boutique officielle
                </Link>
                .
              </p>
            </div>
            <Link
              href="/sponsors"
              className="rounded-full border border-white/20 px-6 py-2 text-sm font-bold transition-all hover:bg-white hover:text-black"
            >
              Découvrir tous nos partenaires
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SPONSORS_LIST.map((s) => (
              <article
                key={s.name}
                className="group rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-colors hover:bg-white/[0.04]"
              >
                <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#00a1ff]">{s.role}</p>
                <h3 className="font-[family-name:var(--font-teko)] text-xl font-bold tracking-wide text-white transition-colors group-hover:text-white">
                  {s.name}
                </h3>
                <p className="mt-3 text-sm text-white/50">{s.impact}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="actu" className="relative overflow-hidden px-6 py-32">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#00a1ff]/10 to-transparent opacity-30" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h2 className="mb-6 font-[family-name:var(--font-teko)] text-5xl font-bold uppercase tracking-wide md:text-6xl">
            Rejoignez la Tribu
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-xl leading-relaxed text-white/70">
            Vibrez au bord du terrain, portez nos couleurs, partagez nos victoires. Le GBA
            n&apos;attend que vous.
          </p>

          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
            <Link
              href="/shop"
              className="rounded-full bg-white px-10 py-4 text-sm font-black uppercase tracking-widest text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-transform hover:scale-105"
            >
              Accéder à la Boutique
            </Link>
            <Link
              href="/news"
              className="rounded-full border border-white/20 px-10 py-4 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-white/10"
            >
              Lire les Actualités
            </Link>
          </div>
        </div>
      </section>

      <footer id="footer" className="border-t border-white/10 bg-black px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-12 text-sm text-white/60 md:grid-cols-4">
          <div className="col-span-1 md:col-span-1">
            <p className="mb-4 font-[family-name:var(--font-teko)] text-3xl font-bold tracking-wide text-white">
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
                <Link href="/news" className="transition-colors hover:text-white">
                  Actualités
                </Link>
              </li>
              <li>
                <Link href="/shop" className="transition-colors hover:text-white">
                  Boutique
                </Link>
              </li>
              <li>
                <Link href="/sponsors" className="transition-colors hover:text-white">
                  Partenaires
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-white">Légal</p>
            <ul className="space-y-4">
              <li>
                <Link href="/privacy" className="transition-colors hover:text-white">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-colors hover:text-white">
                  Conditions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-white">Contact</p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="mb-2 block transition-colors hover:text-[#00a1ff]">
              {CONTACT_EMAIL}
            </a>
            <p className="mt-4 text-xs text-white/30">&copy; {new Date().getFullYear()} GBA. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
