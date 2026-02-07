import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sponsors",
  description:
    "Devenez partenaire du Groupement Bruche Ackerland : visibilité locale, impact terrain, narration premium et activations sur-mesure.",
  alternates: {
    canonical: "/sponsors",
  },
  openGraph: {
    title: "Sponsors · GBA Portal",
    description:
      "Une vitrine cinématique pour convertir des partenaires : pourquoi sponsoriser, chiffres clés, offres et contact.",
    images: [
      {
        url: "/gba-logo.png",
        width: 1200,
        height: 630,
        alt: "GBA Portal — Sponsors",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sponsors · GBA Portal",
    description:
      "Une vitrine cinématique pour convertir des partenaires : pourquoi sponsoriser, chiffres clés, offres et contact.",
    images: [
      {
        url: "/gba-logo.png",
        alt: "GBA Portal — Sponsors",
      },
    ],
  },
};

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@gba-portal.fr";

const reasons = [
  {
    title: "Visibilité premium",
    description: "Présence en match, sur nos supports, et sur une vitrine web premium (sobre et claire)."
  },
  {
    title: "Impact local mesurable",
    description: "Vous financez du concret : équipements, déplacements, actions jeunes, et événements club.",
  },
  {
    title: "Activation sur-mesure",
    description: "Opérations terrain, contenus courts, offres partenaires : un plan simple et efficace."
  },
];

const stats = [
  { label: "Licenciés", value: "350+", sub: "École de foot → Seniors" },
  { label: "Équipes", value: "20+", sub: "Jeunes, féminines, seniors" },
  { label: "Rendez-vous", value: "Chaque week-end", sub: "Présence locale régulière" },
  { label: "Audience", value: "Multi-canal", sub: "Terrain · réseau · vitrine web" },
];

const tiers = [
  {
    name: "Bronze",
    price: "Dès 300€ / an",
    tagline: "Entrer dans le collectif",
    perks: ["Logo (supports club)", "Mention sur la page Sponsors", "Attestation partenariat"],
    accent: "from-white/10 to-transparent",
  },
  {
    name: "Argent",
    price: "Dès 800€ / an",
    tagline: "Visibilité + activation",
    perks: [
      "Pack logo + emplacement prioritaire",
      "Post réseau (1/an)",
      "Présence événement (1/an)",
    ],
    accent: "from-[#00a1ff]/15 to-transparent",
    featured: true,
  },
  {
    name: "Or",
    price: "Sur devis",
    tagline: "Partenariat signature",
    perks: [
      "Opération co-brandée",
      "Contenus photo/vidéo",
      "Bandeau / mise en avant premium",
      "Reporting & bilan annuel",
    ],
    accent: "from-[#0065bd]/20 to-transparent",
  },
];

const partnerProofs = [
  { name: "Boulangerie Martin", note: "Soutien des tournois jeunes." },
  { name: "Garage de la Vallée", note: "Appui logistique déplacements." },
  { name: "Clinique des Trois Rivières", note: "Prévention et accompagnement." },
  { name: "Imprimerie Ackerland", note: "Supports visuels et signalétique." },
  { name: "Brasserie du Canal", note: "Soutien événements club." },
  { name: "Banque Locale", note: "Contribution aux projets annuels." },
];

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-white/70">
      {children}
    </span>
  );
}

export default function SponsorsPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Quels types de partenariats proposez-vous ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Trois tiers (Bronze, Argent, Or) + du sur-mesure (équipement, événements, contenus).",
        },
      },
      {
        "@type": "Question",
        name: "Combien de temps faut-il pour activer un partenariat ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "En général 1 à 2 semaines selon les supports (maillots, panneaux, contenus) et vos validations.",
        },
      },
      {
        "@type": "Question",
        name: "Fournissez-vous une attestation de partenariat ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Oui, une attestation est incluse (au minimum dans le tier Bronze).",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020202] via-[#050505] to-[#000000]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <header className="px-6 pt-36 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3" aria-label="Thèmes">
              <Pill>Sponsoring</Pill>
              <Pill>Partenaires</Pill>
              <Pill>Impact local</Pill>
            </div>
            <h1 className="max-w-4xl font-[var(--font-teko)] text-5xl font-black tracking-[0.06em] text-white sm:text-6xl">
              Devenez sponsor. Prenez place dans l’histoire.
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-white/70">
              Une visibilité claire, un investissement utile, sans superflu. Ensemble, on finance le terrain et on fait grandir la formation.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#contact"
                className="rounded-full border border-white/40 bg-gradient-to-r from-[#00a1ff] to-[#0065bd] px-6 py-3 text-xs font-black uppercase tracking-[0.5em] text-white shadow-[0_15px_50px_rgba(0,161,255,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A1FF] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                Proposer un partenariat
              </a>
              <a
                href={`mailto:${contactEmail}`}
                className="rounded-full border border-white/25 bg-white/5 px-6 py-3 text-xs font-semibold uppercase tracking-[0.5em] text-white/80 hover:border-white/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A1FF] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                Contacter par email
              </a>
            </div>
          </div>
        </div>
      </header>

      <section id="pourquoi" className="border-y border-white/10 bg-black/40 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.6em] text-white/60">Pourquoi sponsoriser</p>
              <h2 className="mt-3 font-[var(--font-teko)] text-4xl font-black tracking-[0.06em] text-white">Un plan simple, une image forte</h2>
            </div>
            <span className="text-xs uppercase tracking-[0.45em] text-white/45">Territoire · Jeunesse · Performance</span>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {reasons.map((reason) => (
              <article
                key={reason.title}
                className="premium-card card-shell rounded-[2rem] p-6"
              >
                <p className="text-[10px] uppercase tracking-[0.6em] text-white/50">Axe</p>
                <h3 className="mt-4 text-2xl font-bold text-white">{reason.title}</h3>
                <p className="mt-3 text-sm text-white/70">{reason.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="chiffres" className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.6em] text-white/60">Chiffres clés</p>
            <h2 className="mt-3 font-[var(--font-teko)] text-4xl font-black tracking-[0.06em] text-white">Le terrain parle</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-white/70">
              Indicateurs à adapter selon la saison. L’objectif : un cadre clair et lisible.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <article key={stat.label} className="premium-card card-shell space-y-2 rounded-3xl p-6 text-center">
                <p className="text-xs uppercase tracking-[0.6em] text-white/50">{stat.label}</p>
                <p className="text-3xl font-black text-white">{stat.value}</p>
                <p className="text-sm text-white/60">{stat.sub}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="offres" className="border-y border-white/10 bg-black/40 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.6em] text-white/60">Offres</p>
              <h2 className="mt-3 font-[var(--font-teko)] text-4xl font-black tracking-[0.06em] text-white">3 tiers pour matcher votre marque</h2>
              <p className="mt-4 max-w-2xl text-sm text-white/70">
                Packs indicatifs. On peut aussi composer un partenariat sur-mesure (matériel, dotations, événements, contenus).
              </p>
            </div>
            <a
              href="#contact"
              className="btn-ghost inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-6 py-3 text-[10px] font-black uppercase tracking-[0.5em] text-white/80 transition hover:border-white/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A1FF] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Demander le dossier
            </a>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {tiers.map((tier) => (
              <article
                key={tier.name}
                className={`premium-card card-shell relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${tier.accent} p-7`}
              >
                {tier.featured ? (
                  <div className="absolute right-6 top-6 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-[10px] font-black uppercase tracking-[0.45em] text-white/70">
                    Populaire
                  </div>
                ) : null}
                <p className="text-[10px] uppercase tracking-[0.6em] text-white/50">Tier</p>
                <h3 className="mt-4 text-3xl font-black text-white">{tier.name}</h3>
                <p className="mt-1 text-sm text-white/70">{tier.tagline}</p>
                <p className="mt-5 text-sm font-semibold text-white/85">{tier.price}</p>
                <ul className="mt-6 space-y-3 text-sm text-white/70">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[#00a1ff]" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="boutique-partenaires"
        className="border-y border-white/10 bg-black/40 px-6 py-16"
        aria-labelledby="boutique-partenaires-title"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.6em] text-white/60">Activation</p>
              <h2
                id="boutique-partenaires-title"
                className="mt-3 font-[var(--font-teko)] text-4xl font-black tracking-[0.06em] text-white"
              >
                Boutique & éditions partenaires
              </h2>
              <p className="mt-4 max-w-2xl text-sm text-white/70">
                Pour certains partenaires, on peut imaginer une <span className="font-semibold text-white/85">série limitée</span> (co‑branding)
                : un textile, un accessoire, ou un pack supporter. Objectif : une activation simple, utile, et visible.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="rounded-full border border-white/40 bg-gradient-to-r from-[#00a1ff] to-[#0065bd] px-6 py-3 text-center text-[10px] font-black uppercase tracking-[0.5em] text-white shadow-[0_15px_50px_rgba(0,161,255,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A1FF] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                aria-label="Découvrir la boutique du club"
              >
                Voir la boutique
              </Link>
              <a
                href={`mailto:${contactEmail}?subject=${encodeURIComponent("Édition partenaire / co-branding — Boutique GBA")}`}
                className="btn-ghost inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-6 py-3 text-center text-[10px] font-black uppercase tracking-[0.5em] text-white/80 transition hover:border-white/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A1FF] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                Proposer une édition
              </a>
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <article className="premium-card card-shell rounded-[2rem] p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white/50">01</p>
              <h3 className="mt-4 text-2xl font-bold text-white">Une offre claire</h3>
              <p className="mt-3 text-sm text-white/70">
                Produit simple (précommande si besoin), quantités maîtrisées, et message “soutien à la formation”.
              </p>
            </article>
            <article className="premium-card card-shell rounded-[2rem] p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white/50">02</p>
              <h3 className="mt-4 text-2xl font-bold text-white">Visibilité naturelle</h3>
              <p className="mt-3 text-sm text-white/70">
                Mise en avant sur la vitrine + la boutique, relais terrain (match / événement), et contenus courts.
              </p>
            </article>
            <article className="premium-card card-shell rounded-[2rem] p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white/50">03</p>
              <h3 className="mt-4 text-2xl font-bold text-white">Impact club</h3>
              <p className="mt-3 text-sm text-white/70">
                Une activation qui finance du concret (équipements, déplacements, événements) et renforce l’identité.
              </p>
            </article>
          </div>

          <p className="mt-6 text-sm text-white/60">
            Vous pouvez déjà voir l’esprit de la boutique : précommandes, packs supporters, et micro‑copy premium.
            <span className="ml-1">
              <Link className="hover:text-white" href="/shop">
                Aller sur /shop
              </Link>
              .
            </span>
          </p>
        </div>
      </section>

      <section id="logos" className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-white/60">Ils nous soutiennent</p>
            <h2 className="mt-3 font-[var(--font-teko)] text-4xl font-black text-white">Sponsors & partenaires</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-white/70">
              Exemples de partenaires déjà impliqués, avec un impact concret sur la saison.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {partnerProofs.map((partner) => (
              <article key={partner.name} className="premium-card card-shell rounded-3xl p-5">
                <h3 className="text-lg font-bold text-white">{partner.name}</h3>
                <p className="mt-2 text-sm text-white/70">{partner.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="border-t border-white/10 bg-black/40 px-6 py-16" aria-labelledby="faq-title">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-white/60">FAQ</p>
            <h2 id="faq-title" className="mt-3 font-[var(--font-teko)] text-4xl font-black text-white">
              Les réponses rapides
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-white/70">
              Un format clair. Et si vous voulez du sur-mesure, on le construit ensemble.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-3xl space-y-4">
            <details className="premium-card card-shell rounded-3xl p-6">
              <summary className="cursor-pointer rounded-2xl text-sm font-semibold text-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A1FF] focus-visible:ring-offset-2 focus-visible:ring-offset-black">
                Quels types de partenariats proposez-vous ?
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-white/70">
                Trois tiers (Bronze, Argent, Or) + du sur-mesure (équipement, événements, contenus).
              </p>
            </details>

            <details className="premium-card card-shell rounded-3xl p-6">
              <summary className="cursor-pointer rounded-2xl text-sm font-semibold text-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A1FF] focus-visible:ring-offset-2 focus-visible:ring-offset-black">
                Combien de temps faut-il pour activer un partenariat ?
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-white/70">
                En général 1 à 2 semaines selon les supports (maillots, panneaux, contenus) et vos validations.
              </p>
            </details>

            <details className="premium-card card-shell rounded-3xl p-6">
              <summary className="cursor-pointer rounded-2xl text-sm font-semibold text-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A1FF] focus-visible:ring-offset-2 focus-visible:ring-offset-black">
                Fournissez-vous une attestation de partenariat ?
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-white/70">
                Oui, une attestation est incluse (au minimum dans le tier Bronze).
              </p>
            </details>
          </div>
        </div>
      </section>

      <section id="contact" className="px-6 pb-20">
        <div className="mx-auto max-w-6xl rounded-[3rem] border border-white/10 bg-gradient-to-br from-[#001326] to-[#020202]/80 p-10 text-center shadow-[0_20px_80px_rgba(0,0,0,0.65)]">
          <p className="text-xs font-bold uppercase tracking-widest text-white/60">CTA</p>
          <h2 className="mt-4 font-[var(--font-teko)] text-4xl font-black text-white">Parlons impact & activation</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-white/70">
            Dites-nous votre budget, votre objectif (visibilité / recrutement / image), et la période souhaitée. On revient avec un plan.
          </p>
          <div className="mt-8 flex flex-col gap-4 md:flex-row md:justify-center">
            <a
              href={`mailto:${contactEmail}?subject=${encodeURIComponent("Partenariat sponsor — GBA")}`}
              className="rounded-full border border-white/40 bg-gradient-to-r from-[#00a1ff] to-[#0065bd] px-8 py-3 text-sm font-bold text-white shadow-[0_15px_50px_rgba(0,161,255,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A1FF] focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-transform hover:scale-105"
            >
              Envoyer un email
            </a>
            <a
              href="/cahier-des-charges.md"
              download
              className="rounded-full border border-white/25 bg-white/5 px-8 py-3 text-sm font-bold text-white/80 hover:border-white/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A1FF] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Télécharger le dossier
            </a>
          </div>
          <p className="mt-6 text-xs text-white/45">Contact : {contactEmail}</p>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black/50 px-6 py-12">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
          <div className="space-y-3">
            <p className="font-[var(--font-cinzel)] text-xs uppercase tracking-[0.45em] text-white/70">GBA Portal</p>
            <p className="text-sm text-white/60">
              Sponsoring conçu comme un produit : visibilité mesurable, activation propre, et un reporting lisible.
            </p>
            <p className="text-xs text-white/45">Micro-copy premium : on promet peu, on exécute bien — et on documente.</p>
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.6em] text-white/60">Liens</p>
            <ul className="space-y-2 text-sm text-white/65">
              <li>
                <a className="hover:text-white" href="/about">
                  À propos
                </a>
              </li>
              <li>
                <a className="hover:text-white" href="/contact">
                  Contact
                </a>
              </li>
              <li>
                <a className="hover:text-white" href="/shop">
                  Boutique
                </a>
              </li>
              <li>
                <a className="hover:text-white" href="/privacy">
                  Confidentialité
                </a>
              </li>
              <li>
                <a className="hover:text-white" href="/terms">
                  Conditions
                </a>
              </li>
              <li>
                <a className="hover:text-white" href="/accessibility">
                  Accessibilité
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.6em] text-white/60">Sponsor</p>
            <p className="text-sm text-white/65">Demande d’offre, activation, ou validation d’un pack.</p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`mailto:${contactEmail}?subject=${encodeURIComponent("Partenariat sponsor — GBA")}`}
                className="btn-ghost rounded-full border border-white/25 bg-white/5 px-5 py-2 text-[10px] font-black uppercase tracking-[0.45em] text-white/80 transition-transform duration-200 hover:scale-[1.03] hover:border-white/50 hover:bg-white/10 active:scale-[0.99]"
              >
                Email
              </a>
              <a
                href="/cahier-des-charges.md"
                download
                className="btn-ghost rounded-full border border-white/25 bg-white/5 px-5 py-2 text-[10px] font-black uppercase tracking-[0.45em] text-white/80 transition-transform duration-200 hover:scale-[1.03] hover:border-white/50 hover:bg-white/10 active:scale-[0.99]"
              >
                Dossier
              </a>
            </div>
            <p className="text-xs text-white/45">Contact : {contactEmail}</p>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-6xl border-t border-white/10 pt-6 text-center text-xs text-white/45">
          © {new Date().getFullYear()} Groupement Bruche Ackerland — Partenariats & sponsoring.
        </div>
      </footer>
    </div>
  );
}
