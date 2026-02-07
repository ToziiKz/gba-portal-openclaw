import { HeroShowcase } from "@/components/HeroShowcase";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "GBA Portal — Le club, ses valeurs, son histoire",
  description:
    "Découvrez le Groupement Bruche Ackerland : histoire, formation des jeunes, vie du club, partenaires, résultats et boutique.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "GBA Portal — Le club, ses valeurs, son histoire",
    description: "Une vitrine premium du GBA : récit, formation, communauté, partenaires et boutique.",
    url: "/",
    images: [{ url: "/gba-logo.png", width: 1200, height: 630, alt: "GBA Portal — Groupement Bruche Ackerland" }],
  },
};

const pillars = [
  { title: "Histoire", text: "Un récit clair du club, de ses moments forts et de ses valeurs." },
  { title: "Formation", text: "Des parcours jeunes lisibles, avec des repères simples pour progresser." },
  { title: "Communauté", text: "Parents, bénévoles, supporters : le club se construit ensemble." },
];

const stats = [
  { label: "Licenciés", value: "350+", sub: "de U8 à seniors" },
  { label: "Équipes", value: "12", sub: "école de foot → seniors" },
  { label: "Partenaires", value: "18", sub: "entreprises locales" },
];

const sponsors = [
  { name: "Boulangerie Martin", role: "Alimentation / événementiel", impact: "Soutien régulier aux journées jeunes." },
  { name: "Garage de la Vallée", role: "Mobilité", impact: "Aide logistique pour les déplacements." },
  { name: "Clinique des Trois Rivières", role: "Santé / prévention", impact: "Actions prévention et accompagnement." },
  { name: "Imprimerie Ackerland", role: "Signalétique", impact: "Supports visuels club et tournois." },
  { name: "Brasserie du Canal", role: "Hospitalité", impact: "Soutien des événements locaux du club." },
  { name: "Banque Locale", role: "Soutien institutionnel", impact: "Appui aux projets structurants." },
];

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@gba-portal.fr";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020202] via-[#050505] to-[#000000]">
      <HeroShowcase />

      <section id="manifesto" className="border-t border-white/10 bg-black/40 px-6 py-16" aria-labelledby="manifesto-title">
        <div className="mx-auto max-w-6xl text-center">
          <p className="section-kicker text-xs font-bold uppercase tracking-widest text-[#00a1ff]">Le club</p>
          <h2 id="manifesto-title" className="section-title mt-2 font-[var(--font-teko)] text-4xl font-black text-white">Union, exigence, fierté</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {pillars.map((item) => (
              <article key={item.title} className="premium-card card-shell rounded-3xl p-6 text-center">
                <p className="text-lg font-bold text-white">{item.title}</p>
                <p className="mt-2 text-sm text-white/75 leading-relaxed">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 px-6 py-16" aria-label="Chiffres clés">
        <div className="mx-auto max-w-6xl grid gap-6 md:grid-cols-3">
          {stats.map((s) => (
            <article key={s.label} className="premium-card card-shell rounded-3xl p-6 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-white/60">{s.label}</p>
              <p className="mt-2 text-3xl font-black text-white">{s.value}</p>
              <p className="mt-1 text-sm text-white/65">{s.sub}</p>
            </article>
          ))}\n        </div>
      </section>

      <section id="sponsors" className="px-6 py-16" aria-labelledby="sponsors-title">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="section-kicker text-xs font-bold uppercase tracking-widest text-[#00a1ff]">Partenaires</p>
              <h2 id="sponsors-title" className="section-title mt-2 font-[var(--font-teko)] text-4xl font-black text-white">Ils font vivre le club</h2>
            </div>
            <Link href="/sponsors" className="btn-ghost rounded-full border border-white/25 px-5 py-2 text-sm font-bold text-white/80 transition-colors hover:border-white/50 hover:text-white">
              Voir la page sponsors
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sponsors.map((s) => (
              <article key={s.name} className="premium-card card-shell rounded-3xl p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-white/50">{s.role}</p>
                <h3 className="mt-2 text-lg font-bold text-white">{s.name}</h3>
                <p className="mt-2 text-sm text-white/70">{s.impact}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="actu" className="border-y border-white/10 bg-black/40 px-6 py-16">
        <div className="mx-auto max-w-6xl text-center">
          <p className="section-kicker text-xs font-bold uppercase tracking-widest text-[#00a1ff]">Suivre le club</p>
          <h2 className="section-title mt-2 font-[var(--font-teko)] text-4xl font-black text-white">Actus, boutique, contact</h2>
          <p className="section-lede mt-4 text-white/70">Un accès direct aux infos utiles, sans détour.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/news" className="rounded-full border border-white/40 bg-gradient-to-r from-[#00a1ff] to-[#0065bd] px-8 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105">
              Voir les actus
            </Link>
            <Link href="/shop" className="btn-ghost rounded-full border border-white/25 px-8 py-3 text-sm font-bold text-white/85 hover:bg-white/5 hover:border-white/40">
              Boutique
            </Link>
            <Link href="/contact" className="btn-ghost rounded-full border border-white/25 px-8 py-3 text-sm font-bold text-white/85 hover:bg-white/5 hover:border-white/40">
              Contact
            </Link>
          </div>
        </div>
      </section>

      <footer id="footer" className="border-t border-white/10 bg-black/50 px-6 py-12">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3 text-sm text-white/65">
          <div>
            <p className="text-white font-semibold">GBA Portal</p>
            <p className="mt-2">Histoire du club, formation, partenaires et vie locale.</p>
          </div>
          <div>
            <p className="text-white font-semibold">Navigation</p>
            <ul className="mt-2 space-y-1">
              <li><Link href="/news">Actus</Link></li>
              <li><Link href="/shop">Boutique</Link></li>
              <li><Link href="/sponsors">Sponsors</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-white font-semibold">Contact</p>
            <p className="mt-2">{contactEmail}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
