import { CONTACT_EMAIL, SPONSORS_LIST } from "@/lib/site-content";
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
  },
];

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center text-[11px] font-bold uppercase tracking-widest text-[#00A1FF]">
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
    <div className="min-h-screen bg-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <header className="px-6 pt-24 pb-16 md:pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3" aria-label="Thèmes">
              <Pill>Sponsoring</Pill>
            </div>
            <h1 className="max-w-4xl font-[var(--font-teko)] text-5xl font-black tracking-[0.06em] text-white sm:text-7xl">
              Devenez sponsor. <br className="hidden sm:block" />
              <span className="text-white/40">Prenez place dans l’histoire.</span>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-white/60">
              Visibilité claire, investissement utile. Ensemble, finançons le terrain et la formation.
            </p>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#contact"
                className="rounded-full bg-white px-8 py-4 text-sm font-bold text-black transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                Proposer un partenariat
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="rounded-full border border-white/10 px-8 py-4 text-sm font-bold text-white transition-colors hover:border-white hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                Contacter par email
              </a>
            </div>
          </div>
        </div>
      </header>

      <section id="pourquoi" className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Pourquoi nous rejoindre</p>
              <h2 className="mt-2 font-[var(--font-teko)] text-4xl font-bold uppercase tracking-wide text-white">Un plan simple, une image forte</h2>
            </div>
          </div>

          <div className="mt-12 grid gap-12 md:grid-cols-3">
            {reasons.map((reason) => (
              <article key={reason.title}>
                <h3 className="text-lg font-bold text-white">{reason.title}</h3>
                <p className="mt-2 text-sm text-white/50 leading-relaxed">{reason.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="chiffres" className="px-6 py-20 border-t border-white/5">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 text-center">
            {stats.map((stat) => (
              <article key={stat.label}>
                <p className="text-3xl font-[var(--font-teko)] font-bold text-white">{stat.value}</p>
                <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1 font-bold">{stat.label}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="offres" className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 max-w-2xl">
            <h2 className="font-[var(--font-teko)] text-4xl font-bold uppercase tracking-wide text-white">3 Tiers. 1 Objectif.</h2>
            <p className="mt-4 text-sm text-white/50">
              Des packs clairs pour éviter les négociations interminables.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {tiers.map((tier) => (
              <article
                key={tier.name}
                className={`flex flex-col rounded-2xl p-8 ${tier.featured ? 'bg-white/[0.05]' : 'bg-transparent border border-white/5'}`}
              >
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                  {tier.featured && <span className="text-[10px] font-bold uppercase tracking-widest text-[#00A1FF]">Populaire</span>}
                </div>
                <p className="mt-4 text-3xl font-[var(--font-teko)] font-bold text-white">{tier.price}</p>
                <p className="mt-1 text-xs text-white/40">{tier.tagline}</p>
                
                <ul className="mt-8 space-y-3 text-sm text-white/60 flex-1">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="flex gap-3 items-start">
                      <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-white/40" />
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
        className="border-b border-white/5 px-6 py-20"
        aria-labelledby="boutique-partenaires-title"
      >
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Activation</p>
              <h2
                id="boutique-partenaires-title"
                className="mt-2 font-[var(--font-teko)] text-4xl font-bold uppercase tracking-wide text-white"
              >
                Boutique & éditions partenaires
              </h2>
              <p className="mt-4 max-w-xl text-sm text-white/60">
                Pour certains partenaires, on peut imaginer une <span className="text-white/80">série limitée</span> (co‑branding).
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="text-xs font-bold text-white border-b border-white/30 pb-0.5 hover:text-white hover:border-white transition-colors"
                aria-label="Découvrir la boutique du club"
              >
                Voir la boutique
              </Link>
            </div>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { id: "01", title: "Une offre claire", desc: "Produit simple, quantités maîtrisées, message “soutien formation”." },
              { id: "02", title: "Visibilité naturelle", desc: "Mise en avant sur la vitrine + la boutique, relais terrain." },
              { id: "03", title: "Impact club", desc: "Finance du concret (équipements, déplacements, événements)." }
            ].map((item) => (
              <article key={item.id} className="rounded-3xl bg-white/[0.02] p-8">
                <p className="text-xs font-bold text-white/30">{item.id}</p>
                <h3 className="mt-2 text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-white/60">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="logos" className="px-6 py-20 border-t border-white/5">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <h2 className="font-[var(--font-teko)] text-4xl font-bold text-white">Partenaires actuels</h2>
            <p className="text-sm text-white/40 max-w-md text-right">Ils soutiennent déjà le projet.</p>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm text-white/60">
            {SPONSORS_LIST.map((partner) => (
              <div key={partner.name} className="flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                 <span className="font-semibold text-white/80">{partner.name}</span>
                 <span className="hidden sm:inline text-white/30">— {partner.impact}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="px-6 py-20" aria-labelledby="faq-title">
        <div className="mx-auto max-w-3xl">
          <h2 id="faq-title" className="mb-12 text-center font-[var(--font-teko)] text-4xl font-bold uppercase tracking-wide text-white">
            Questions fréquentes
          </h2>

          <div className="space-y-8">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Quels types de partenariats ?</h3>
              <p className="text-sm leading-relaxed text-white/50">Trois tiers (Bronze, Argent, Or) + du sur-mesure (équipement, événements, contenus).</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Délai d&apos;activation ?</h3>
              <p className="text-sm leading-relaxed text-white/50">En général 1 à 2 semaines selon les supports (maillots, panneaux, contenus) et vos validations.</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Attestation fournie ?</h3>
              <p className="text-sm leading-relaxed text-white/50">Oui, une attestation est incluse (au minimum dans le tier Bronze).</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="px-6 pb-20 pt-12 text-center">
        <h2 className="font-[var(--font-teko)] text-5xl font-bold text-white mb-6 uppercase tracking-wide">On commence ?</h2>
        <div className="flex justify-center gap-4">
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Partenariat sponsor — GBA")}`}
              className="text-sm font-bold text-white border-b border-white/30 pb-0.5 hover:text-white hover:border-white transition-colors"
            >
              {CONTACT_EMAIL}
            </a>
        </div>
      </section>
    </div>
  );
}
