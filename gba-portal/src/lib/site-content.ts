export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@gba-portal.fr";

export const KEY_STATS = [
  { label: "Passionnés", value: "350+", sub: "Des débutants aux vétérans" },
  { label: "Équipes", value: "20+", sub: "Toutes catégories représentées" },
  { label: "Soutiens", value: "18", sub: "Entreprises locales engagées" },
];

export const SPONSORS_LIST = [
  { name: "Boulangerie Martin", role: "Alimentation / événementiel", impact: "Soutien régulier aux journées jeunes." },
  { name: "Garage de la Vallée", role: "Mobilité", impact: "Aide logistique pour les déplacements." },
  { name: "Clinique des Trois Rivières", role: "Santé / prévention", impact: "Actions prévention et accompagnement." },
  { name: "Imprimerie Ackerland", role: "Signalétique", impact: "Supports visuels club et tournois." },
  { name: "Brasserie du Canal", role: "Hospitalité", impact: "Soutien des événements locaux du club." },
  { name: "Banque Locale", role: "Partenaire Institutionnel", impact: "Appui aux projets structurants." },
];

export const NAV_LINKS = [
  { label: "Le Club", href: "/#manifesto" },
  { label: "Boutique", href: "/shop", highlight: true },
  { label: "Actus", href: "/news" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Contact", href: "/contact" },
];
