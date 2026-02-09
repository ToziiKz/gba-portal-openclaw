import type { Metadata } from "next";
import { TrustPageShell } from "@/components/TrustPageShell";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez GBA Portal : demande de démo, sponsoring, accès staff et questions produit.",
  alternates: {
    canonical: "/contact",
  },
};

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@gba-portal.fr";

export default function ContactPage() {
  const subject = encodeURIComponent("GBA Portal — Contact");

  return (
    <TrustPageShell
      eyebrow="Support & démo"
      title="Contact"
      lead="Une question, une demande de démo, un sponsoring ? On répond vite, avec des réponses concrètes."
      cta={
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href={`mailto:${contactEmail}?subject=${subject}`}
            className="btn-premium inline-flex items-center justify-center rounded-full border border-white/40 bg-gradient-to-r from-[#00a1ff] to-[#0065bd] px-6 py-3 text-xs font-black uppercase tracking-[0.5em] text-white shadow-[0_15px_50px_rgba(0,161,255,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A1FF] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Envoyer un email
          </a>
          <p className="text-xs text-white/50">
            Adresse : <span className="font-semibold text-white/70">{contactEmail}</span>
          </p>
        </div>
      }
    >
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Ce qu’on peut traiter</h2>
        <ul className="mt-4 space-y-3 text-sm text-white/70">
          {[
            "Demande d’info ou de présentation (site, projet club, partenaires).",
            "Accès staff / partenaires (création de compte, droits).",
            "Partenariats sponsor : offre, visibilité, activation.",
            "Questions conformité : confidentialité, cookies, accessibilité.",
          ].map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[#00a1ff]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Pour aller plus vite</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-black/40 p-6">
            <p className="text-xs uppercase tracking-[0.6em] text-white/50">Objet</p>
            <p className="mt-3 text-sm text-white/70">Indiquez “Démo”, “Sponsor” ou “Support” en début d’email.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/40 p-6">
            <p className="text-xs uppercase tracking-[0.6em] text-white/50">Contexte</p>
            <p className="mt-3 text-sm text-white/70">Ajoutez l’équipe concernée, la date, et l’objectif (info / action / validation).</p>
          </div>
        </div>
        <p className="text-xs text-white/45">
          Micro-copy premium : on préfère une réponse claire en 3 points à un roman. Vous gagnez du temps, nous aussi.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Liens utiles</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { href: "/about", label: "À propos" },
            { href: "/shop", label: "Boutique" },
            { href: "/privacy", label: "Confidentialité" },
            { href: "/terms", label: "Conditions" },
            { href: "/accessibility", label: "Accessibilité" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="btn-ghost rounded-full border border-white/25 bg-white/5 px-5 py-2 text-[10px] font-black uppercase tracking-[0.45em] text-white/80 transition hover:border-white/50 hover:bg-white/10"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </TrustPageShell>
  );
}
