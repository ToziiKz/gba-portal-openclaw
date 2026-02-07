import type { Metadata } from "next";
import Link from "next/link";

import { TrustPageShell } from "@/components/TrustPageShell";

export const metadata: Metadata = {
  title: "Actus du club",
  description:
    "Actualités du Groupement Bruche Ackerland : moments forts, infos club, partenaires et boutique. Page placeholder (sans DB).",
  alternates: {
    canonical: "/news",
  },
  openGraph: {
    title: "Actus · GBA Portal",
    description: "Moments forts, infos club, partenaires et boutique (placeholder sans DB).",
    url: "/news",
    images: [
      {
        url: "/gba-logo.png",
        width: 1200,
        height: 630,
        alt: "GBA Portal — Actus",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Actus · GBA Portal",
    description: "Moments forts, infos club, partenaires et boutique (placeholder sans DB).",
    images: [
      {
        url: "/gba-logo.png",
        alt: "GBA Portal — Actus",
      },
    ],
  },
};

const news = [
  {
    title: "Week-end de match : l’école de foot à l’honneur",
    date: "2026-02-01",
    summary: "Tournoi jeunes, buvette, photos : une journée club qui rassemble toutes les générations.",
    tag: "Vie de club",
  },
  {
    title: "Partenaire premium signé",
    date: "2026-01-25",
    summary: "Boulangerie Martin devient official partner et soutient la formation et la vie locale.",
    tag: "Partenaires",
  },
  {
    title: "Boutique : précommandes ouvertes",
    date: "2026-01-20",
    summary: "Maillot, écharpe, pack supporter : une boutique simple et locale (paiement hors-ligne pour l’instant).",
    tag: "Boutique",
  },
];

export default function NewsPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Actualités — GBA Portal",
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    itemListElement: news.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      url: "/news",
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <TrustPageShell
        eyebrow="Club"
        title="Actus"
        lead="Une page simple pour suivre les infos club, les moments forts, et les liens utiles (boutique, partenaires, contact)."
        cta={
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/shop"
              className="rounded-full border border-white/40 bg-gradient-to-r from-[#00a1ff] to-[#0065bd] px-6 py-3 text-center text-xs font-bold uppercase tracking-widest text-white shadow-[0_15px_50px_rgba(0,161,255,0.45)]"
            >
              Boutique
            </Link>
            <Link
              href="/sponsors"
              className="btn-ghost rounded-full border border-white/25 bg-white/5 px-6 py-3 text-center text-xs font-semibold uppercase tracking-widest text-white/90 transition-transform duration-200 hover:scale-[1.03] hover:border-white/40 active:scale-[0.99]"
            >
              Sponsors
            </Link>
            <Link
              href="/contact"
              className="btn-ghost rounded-full border border-white/25 bg-white/5 px-6 py-3 text-center text-xs font-semibold uppercase tracking-widest text-white/90 transition-transform duration-200 hover:scale-[1.03] hover:border-white/40 active:scale-[0.99]"
            >
              Contact
            </Link>
          </div>
        }
      >
        <section aria-labelledby="news-list" className="space-y-6">
          <h2 id="news-list" className="text-2xl font-bold text-white">
            Dernières infos (placeholder)
          </h2>
          <p className="text-sm leading-relaxed text-white/70">
            Objectif : une lecture rapide (mobile) et des contenus courts. Pas de base de données pour l’instant : les entrées ci-dessous sont
            statiques.
          </p>

          <div className="grid gap-4">
            {news.map((item) => (
              <article key={item.title} className="premium-card card-shell rounded-3xl p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs font-bold text-white/50">{item.tag}</p>
                  <time className="text-xs uppercase tracking-widest text-white/45" dateTime={item.date}>
                    {new Date(item.date).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "2-digit",
                    })}
                  </time>
                </div>
                <h3 className="mt-4 text-2xl font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-sm text-white/70">{item.summary}</p>
                {item.tag === "Boutique" ? (
                  <p className="mt-4 text-xs text-white/50">
                    Envie de soutenir ? <Link href="/shop" className="font-semibold text-white/75 hover:text-white">Voir la boutique</Link>.
                  </p>
                ) : null}
              </article>
            ))}
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/40 p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-white/50">À venir</p>
            <p className="mt-3 text-sm text-white/70">
              Une page article par actu (URL dédiée), filtres (jeunes / seniors / partenaires), et mise en avant des liens utiles (boutique,
              dossiers sponsor).
            </p>
          </div>
        </section>
      </TrustPageShell>
    </>
  );
}
