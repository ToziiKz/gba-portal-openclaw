import type { Metadata } from 'next'
import { TrustPageShell } from '@/components/TrustPageShell'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contactez GBA Portal : demande de démo, sponsoring, accès staff et questions produit.',
  alternates: {
    canonical: '/contact',
  },
}

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'contact@gba-portal.fr'

const quickCards = [
  {
    title: 'Démo club',
    description: 'Présentation guidée du site public + dashboard staff.',
    subject: 'Démo GBA Portal',
  },
  {
    title: 'Partenariat sponsor',
    description: 'Visibilité locale, activations et formats de présence.',
    subject: 'Partenariat sponsor GBA',
  },
  {
    title: 'Support accès',
    description: 'Comptes coach, droits dashboard, activation et sécurité.',
    subject: 'Support accès dashboard',
  },
]

export default function ContactPage() {
  return (
    <TrustPageShell
      eyebrow=""
      title="Contact"
      lead="Parlons concret. Une demande claire, une réponse rapide, et un suivi utile."
      showTopNav={false}
      cta={
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#081421] via-[#0b1b2b] to-[#0a1623] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">Canal principal</p>
              <p className="mt-2 text-lg font-semibold text-white">{contactEmail}</p>
            </div>
            <a
              href={`mailto:${contactEmail}?subject=${encodeURIComponent('Contact GBA Portal')}`}
              className="inline-flex items-center justify-center rounded-full border border-white/35 bg-gradient-to-r from-[#00a1ff] to-[#0065bd] px-6 py-3 text-xs font-black uppercase tracking-[0.35em] text-white shadow-[0_15px_45px_rgba(0,161,255,0.4)]"
            >
              Envoyer un email
            </a>
          </div>
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {quickCards.map((item) => (
          <a
            key={item.title}
            href={`mailto:${contactEmail}?subject=${encodeURIComponent(item.subject)}`}
            className="rounded-3xl border border-white/10 bg-black/35 p-5 transition hover:-translate-y-[1px] hover:border-white/25 hover:bg-black/45"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-white/45">Contact rapide</p>
            <h2 className="mt-3 text-lg font-bold text-white">{item.title}</h2>
            <p className="mt-2 text-sm text-white/65">{item.description}</p>
          </a>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-white/45">Pour gagner du temps</p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>• Objet clair : Démo / Sponsor / Support</li>
            <li>• Contexte en 2-3 lignes</li>
            <li>• Équipe concernée (si besoin)</li>
            <li>• Date cible ou urgence</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-white/45">Réponse</p>
          <p className="mt-4 text-sm text-white/70">
            On privilégie des réponses courtes, actionnables et structurées. Tu sais rapidement quoi faire ensuite.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {['Démo', 'Sponsor', 'Support'].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-white/70"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </TrustPageShell>
  )
}
