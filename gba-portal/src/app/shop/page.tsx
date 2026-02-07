import type { Metadata } from "next";
import Link from "next/link";

import { TrustPageShell } from "@/components/TrustPageShell";

export const metadata: Metadata = {
  title: "Boutique officielle · GBA Portal",
  description:
    "Boutique officielle du Groupement Bruche Ackerland : porter les couleurs, soutenir la formation et la vie du club. Précommandes et packs supporters.",
  keywords: [
    "boutique GBA",
    "maillot GBA",
    "écharpe GBA",
    "pack supporter",
    "Groupement Bruche Ackerland",
    "football",
  ],
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: "Boutique · GBA Portal",
    description:
      "Maillots, écharpes, packs supporters : porter les couleurs et soutenir le club. Précommandes et infos pratiques.",
    url: "/shop",
    images: [
      {
        url: "/gba-logo.png",
        width: 1200,
        height: 630,
        alt: "Boutique GBA Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Boutique · GBA Portal",
    description:
      "Maillots, écharpes, packs supporters : porter les couleurs et soutenir le club. Précommandes et infos pratiques.",
    images: [
      {
        url: "/gba-logo.png",
        alt: "Boutique GBA Portal",
      },
    ],
  },
};

const featuredProducts = [
  {
    name: "Maillot officiel 2026",
    priceHint: "à partir de 39€",
    detail: "Domicile / extérieur · tailles enfant & adulte · flocage possible.",
    cta: "Précommander le maillot",
  },
  {
    name: "Pack supporter",
    priceHint: "à partir de 25€",
    detail: "Écharpe + textile + goodies · idéal cadeau / derby.",
    cta: "Réserver un pack",
  },
  {
    name: "Écharpe GBA",
    priceHint: "à partir de 15€",
    detail: "Classique, simple, indispensable au stade.",
    cta: "Précommander une écharpe",
  },
];

const categories = [
  {
    title: "Maillot officiel",
    detail: "Équipement club (domicile / extérieur) avec options flocage.",
    note: "Tailles enfant & adulte · précommande",
    cta: "Précommander un maillot",
  },
  {
    title: "Packs supporters",
    detail: "Kit prêt à offrir : écharpe + textile + goodies club.",
    note: "Idéal événements & derbies",
    cta: "Réserver un pack",
  },
  {
    title: "Accessoires",
    detail: "Écharpes, casquettes, sacs, gourdes — l’essentiel aux couleurs du GBA.",
    note: "Stocks variables",
    cta: "Demander les accessoires",
  },
  {
    title: "Éditions partenaires",
    detail: "Séries limitées co-brandées avec nos soutiens.",
    note: "Quantités limitées",
    cta: "Proposer une édition",
  },
];

const faqs = [
  {
    q: "Comment commander ?",
    a: "La boutique est en cours de mise en ligne. En attendant, nous centralisons les précommandes par email (nom, article, taille, quantité).",
  },
  {
    q: "Paiement : comment ça se passe ?",
    a: "Pas de paiement en ligne pour l’instant. Le règlement se fait au retrait (ou selon les modalités confirmées avec le club).",
  },
  {
    q: "Livraison ou retrait ?",
    a: "Selon les produits : retrait club (jours de match / permanence) et/ou remise lors d’un entraînement. Les modalités exactes sont confirmées à la commande.",
  },
  {
    q: "Puis-je floquer un prénom/numéro ?",
    a: "Oui sur certains textiles (maillots/vestes). Indiquez le flocage souhaité dans votre message.",
  },
  {
    q: "Commande groupe / entreprise ?",
    a: "Oui : indiquez le volume et la date cible (match, tournoi, événement). Nous confirmons la faisabilité et proposons des packs dédiés.",
  },
];

function toAnchorId(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ShopPage() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@gba-portal.fr";

  const mailtoBase = `mailto:${contactEmail}`;

  const categoryAnchors = categories.map((category) => ({
    ...category,
    id: toAnchorId(category.title),
  }));

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: "/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Boutique",
        item: "/shop",
      },
    ],
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Comment précommander sur la boutique GBA",
    description:
      "La boutique est en pré-lancement : les commandes sont centralisées par email. Vous recevez une confirmation de prix et de retrait.",
    totalTime: "PT5M",
    step: [
      {
        "@type": "HowToStep",
        name: "Choisir l’article",
        text: "Sélectionnez un article (maillot, pack supporter, écharpe) et notez la taille/quantité.",
        url: "/shop#shop-featured",
      },
      {
        "@type": "HowToStep",
        name: "Envoyer l’email",
        text: "Envoyez une demande de précommande avec nom, article, taille, quantité et flocage éventuel.",
        url: "/shop#shop-final-cta",
      },
      {
        "@type": "HowToStep",
        name: "Recevoir la confirmation",
        text: "Le club confirme la disponibilité, le prix exact et les modalités de retrait/livraison.",
        url: "/shop#shop-faq",
      },
    ],
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Sélection boutique GBA",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: categoryAnchors.map((category, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: category.title,
      url: `/shop#${category.id}`,
    })),
  };

  const featuredProductsJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Offres à la une — Boutique GBA",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: featuredProducts.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        description: product.detail,
        brand: {
          "@type": "Brand",
          name: "Groupement Bruche Ackerland",
        },
        offers: {
          "@type": "Offer",
          url: "/shop",
          priceCurrency: "EUR",
          availability: "https://schema.org/PreOrder",
        },
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(featuredProductsJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />

      <TrustPageShell
        eyebrow="Boutique"
        title="Porter les couleurs"
        lead="Maillots, accessoires, packs supporters : une boutique pensée pour soutenir la formation, les événements et la vie du Groupement Bruche Ackerland."
        cta={
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={`mailto:${contactEmail}?subject=${encodeURIComponent("Précommande boutique GBA")}`}
              className="rounded-full border border-white/40 bg-gradient-to-r from-[#00a1ff] to-[#0065bd] px-6 py-3 text-center text-xs font-bold uppercase tracking-widest text-white shadow-[0_15px_50px_rgba(0,161,255,0.45)]"
            >
              Précommander
            </a>
            <a
              href="#shop-final-cta"
              className="btn-ghost rounded-full border border-white/25 bg-white/5 px-6 py-3 text-center text-xs font-semibold uppercase tracking-widest text-white/90 transition-transform duration-200 hover:scale-[1.03] hover:border-white/40 active:scale-[0.99]"
            >
              Guide express
            </a>
            <Link
              href="/contact"
              className="btn-ghost rounded-full border border-white/25 bg-white/5 px-6 py-3 text-center text-xs font-semibold uppercase tracking-widest text-white/90 transition-transform duration-200 hover:scale-[1.03] hover:border-white/40 active:scale-[0.99]"
            >
              Questions
            </Link>
            <Link
              href="/sponsors"
              className="btn-ghost rounded-full border border-white/25 bg-white/5 px-6 py-3 text-center text-xs font-semibold uppercase tracking-widest text-white/90 transition-transform duration-200 hover:scale-[1.03] hover:border-white/40 active:scale-[0.99]"
            >
              Devenir partenaire
            </Link>
          </div>
        }
      >
        <section aria-labelledby="shop-express" className="premium-card card-shell rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 id="shop-express" className="text-xs font-bold uppercase tracking-widest text-white/60">
            Pré-lancement : commander en 2 minutes
          </h2>
          <ol className="mt-4 grid gap-3 text-sm text-white/70 md:grid-cols-3">
            <li className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs font-bold text-white/45">01</p>
              <p className="mt-2 font-semibold text-white/85">Choisir l’article</p>
              <p className="mt-1 text-xs text-white/55">Article + taille + quantité (flocage si besoin).</p>
            </li>
            <li className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs font-bold text-white/45">02</p>
              <p className="mt-2 font-semibold text-white/85">Envoyer l’email</p>
              <p className="mt-1 text-xs text-white/55">Un message suffit : on centralise les précommandes.</p>
            </li>
            <li className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs font-bold text-white/45">03</p>
              <p className="mt-2 font-semibold text-white/85">Confirmation</p>
              <p className="mt-1 text-xs text-white/55">Prix exact + retrait club / entraînement.</p>
            </li>
          </ol>
          <p className="mt-4 text-xs text-white/45">
            Pas de paiement en ligne pour l’instant : l’objectif est d’être simple, local, et fiable.
          </p>
        </section>

        <section aria-labelledby="shop-toc" className="space-y-4">
          <h2 id="shop-toc" className="text-xs font-bold uppercase tracking-widest text-white/60">
            Au sommaire
          </h2>
          <ul className="flex flex-wrap gap-3">
            {categoryAnchors.map((category) => (
              <li key={category.id}>
                <a
                  href={`#${category.id}`}
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-5 py-2 text-xs font-bold text-white/80 hover:border-white/50 hover:bg-white/10"
                >
                  {category.title}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#shop-faq"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-5 py-2 text-xs font-bold text-white/80 hover:border-white/50 hover:bg-white/10"
              >
                FAQ
              </a>
            </li>
          </ul>
        </section>

        <section aria-labelledby="shop-featured" className="space-y-6">
          <h2 id="shop-featured" className="text-xs font-bold uppercase tracking-widest text-white/60">
            Offres à la une
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {featuredProducts.map((product) => (
              <article key={product.name} className="premium-card card-shell rounded-3xl p-6">
                <p className="text-xs font-bold text-white/50">{product.priceHint}</p>
                <h3 className="mt-4 text-xl font-bold text-white">{product.name}</h3>
                <p className="mt-3 text-sm text-white/70">{product.detail}</p>
                <a
                  className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-white/35 bg-gradient-to-r from-[#00a1ff] to-[#0065bd] px-5 py-3 text-center text-xs font-bold text-white shadow-[0_15px_50px_rgba(0,161,255,0.35)]"
                  href={`${mailtoBase}?subject=${encodeURIComponent(`Précommande — ${product.name}`)}&body=${encodeURIComponent(
                    `Bonjour,\n\nJe souhaite précommander : ${product.name}.\n\n- Nom :\n- Article : ${product.name}\n- Taille (si applicable) :\n- Quantité :\n- Flocage (optionnel) :\n- Téléphone (optionnel) :\n\nMerci !`
                  )}`}
                >
                  {product.cta}
                </a>
              </article>
            ))}
          </div>
          <p className="text-sm text-white/60">
            Les prix exacts et la disponibilité sont confirmés à la commande. L’objectif : une boutique simple, locale, et utile au club.
          </p>
        </section>

        <section aria-labelledby="shop-categories">
          <h2 id="shop-categories" className="text-xs font-bold uppercase tracking-widest text-white/60">
            Sélection
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {categoryAnchors.map((category) => (
              <article
                key={category.title}
                id={category.id}
                className="premium-card card-shell scroll-mt-28 rounded-3xl p-6"
              >
                <h3 className="text-2xl font-bold text-white">{category.title}</h3>
                <p className="mt-3 text-sm text-white/70">{category.detail}</p>
                <p className="mt-4 text-xs uppercase tracking-widest text-white/45">{category.note}</p>

                <a
                  className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-white/30 bg-white/5 px-5 py-3 text-center text-xs font-bold text-white/85 transition hover:border-white/50 hover:bg-white/10"
                  href={`${mailtoBase}?subject=${encodeURIComponent(`Boutique — ${category.title}`)}&body=${encodeURIComponent(
                    `Bonjour,\n\nJe souhaite commander / précommander (catégorie) : ${category.title}.\n\n- Nom :\n- Article (détail) :\n- Taille (si applicable) :\n- Quantité :\n- Flocage (optionnel) :\n- Téléphone (optionnel) :\n\nMerci !`
                  )}`}
                >
                  {category.cta}
                </a>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm text-white/60">
            Astuce : pour une commande groupe (équipe, parents, événement), indiquez le volume estimé — nous proposons des packs et des tarifs
            dédiés.
          </p>
        </section>

        <section aria-labelledby="shop-why" className="space-y-6">
          <h2 id="shop-why" className="text-xs font-bold uppercase tracking-widest text-white/60">
            Pourquoi la boutique existe
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <article className="premium-card card-shell rounded-3xl p-6">
              <p className="text-xs font-bold text-white/50">Formation</p>
              <p className="mt-4 text-sm text-white/70">
                Les bénéfices servent en priorité à soutenir l’encadrement, le matériel et les projets jeunes.
              </p>
            </article>
            <article className="premium-card card-shell rounded-3xl p-6">
              <p className="text-xs font-bold text-white/50">Événements</p>
              <p className="mt-4 text-sm text-white/70">
                Tournois, journées club, déplacements : la boutique aide à financer ce qui crée du lien.
              </p>
            </article>
            <article className="premium-card card-shell rounded-3xl p-6">
              <p className="text-xs font-bold text-white/50">Identité</p>
              <p className="mt-4 text-sm text-white/70">
                Porter les couleurs, c’est afficher une fierté commune — sur les terrains comme au quotidien.
              </p>
            </article>
          </div>
          <p className="text-sm text-white/60">
            Vous aimez les éditions limitées ? Certaines séries peuvent être co-brandées avec nos partenaires.
            <span className="ml-1">
              <Link className="hover:text-white" href="/sponsors">
                Découvrir le sponsoring
              </Link>
              .
            </span>
          </p>
        </section>

        <section aria-labelledby="shop-how" className="space-y-6">
          <h2 id="shop-how" className="text-xs font-bold uppercase tracking-widest text-white/60">
            Commander (pré-lancement)
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <article className="premium-card card-shell rounded-3xl p-6">
              <p className="text-xs font-bold text-white/50">01</p>
              <h3 className="mt-4 text-lg font-bold text-white">Envoyer la demande</h3>
              <p className="mt-3 text-sm text-white/70">Article, taille, quantité, flocage éventuel.</p>
            </article>
            <article className="premium-card card-shell rounded-3xl p-6">
              <p className="text-xs font-bold text-white/50">02</p>
              <h3 className="mt-4 text-lg font-bold text-white">Confirmation</h3>
              <p className="mt-3 text-sm text-white/70">Disponibilité, prix, modalités de retrait/livraison.</p>
            </article>
            <article className="premium-card card-shell rounded-3xl p-6">
              <p className="text-xs font-bold text-white/50">03</p>
              <h3 className="mt-4 text-lg font-bold text-white">Retrait club</h3>
              <p className="mt-3 text-sm text-white/70">Pratique, local, et pensé pour la vie du club.</p>
            </article>
          </div>
          <p className="text-sm text-white/60">Astuce : indiquez votre numéro de téléphone dans l’email si vous souhaitez un retour rapide.</p>
        </section>

        <section id="shop-faq" aria-labelledby="shop-faq-title" className="space-y-6">
          <h2 id="shop-faq-title" className="text-xs font-bold uppercase tracking-widest text-white/60">FAQ</h2>
          <div className="space-y-4">
            {faqs.map((item) => (
              <details
                key={item.q}
                className="premium-card card-shell rounded-3xl border border-white/10 bg-white/5 p-6 open:border-white/20"
              >
                <summary className="cursor-pointer list-none text-sm font-semibold text-white">
                  {item.q}
                  <span className="float-right text-xs uppercase tracking-widest text-white/50">+</span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-white/70">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section aria-labelledby="shop-final-cta" className="space-y-6">
          <h2 id="shop-final-cta" className="text-xs font-bold uppercase tracking-widest text-white/60">
            Prêt à commander ?
          </h2>
          <div className="premium-card card-shell rounded-3xl border border-white/10 bg-gradient-to-br from-black/30 via-black/10 to-black/30 p-6">
            <p className="text-sm text-white/70">
              Envoyez un email avec <span className="font-semibold text-white/85">article</span>, <span className="font-semibold text-white/85">taille</span>, <span className="font-semibold text-white/85">quantité</span> et, si besoin, le <span className="font-semibold text-white/85">flocage</span>.
              On vous confirme le prix exact + la mise à disposition (retrait club / remise entraînement).
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={`mailto:${contactEmail}?subject=${encodeURIComponent("Commande boutique GBA")}&body=${encodeURIComponent(
                  "Bonjour,\n\nJe souhaite commander / précommander :\n\n- Nom :\n- Article :\n- Taille (si applicable) :\n- Quantité :\n- Flocage (optionnel) :\n- Téléphone (optionnel) :\n\nMerci !"
                )}`}
                className="rounded-full border border-white/40 bg-gradient-to-r from-[#00a1ff] to-[#0065bd] px-6 py-3 text-center text-xs font-bold uppercase tracking-widest text-white shadow-[0_15px_50px_rgba(0,161,255,0.45)]"
              >
                Écrire pour commander
              </a>
              <Link
                href="/contact"
                className="btn-ghost rounded-full border border-white/25 bg-white/5 px-6 py-3 text-center text-xs font-semibold uppercase tracking-widest text-white/90 transition-transform duration-200 hover:scale-[1.03] hover:border-white/40 active:scale-[0.99]"
              >
                Une question
              </Link>
              <Link
                href="/sponsors"
                className="btn-ghost rounded-full border border-white/25 bg-white/5 px-6 py-3 text-center text-xs font-semibold uppercase tracking-widest text-white/90 transition-transform duration-200 hover:scale-[1.03] hover:border-white/40 active:scale-[0.99]"
              >
                Commande entreprise / partenaire
              </Link>
            </div>
            <p className="mt-4 text-xs text-white/45">
              Note : boutique en pré-lancement — pas de paiement en ligne pour l’instant.
            </p>
          </div>
        </section>

        <section aria-labelledby="shop-news" className="space-y-6">
          <h2 id="shop-news" className="text-xs font-bold uppercase tracking-widest text-white/60">
            Actus boutique
          </h2>
          <div className="premium-card card-shell rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/70">
              Pour les dates de précommande, les arrivages et les séries limitées, on publie des notes courtes dans les actus.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/news"
                className="rounded-full border border-white/40 bg-gradient-to-r from-[#00a1ff] to-[#0065bd] px-6 py-3 text-center text-xs font-bold text-white shadow-[0_15px_50px_rgba(0,161,255,0.35)]"
              >
                Voir les actus
              </Link>
              <a
                href="#shop-faq"
                className="btn-ghost rounded-full border border-white/25 bg-white/5 px-6 py-3 text-center text-xs font-bold text-white/80 transition hover:border-white/50 hover:bg-white/10"
              >
                Lire la FAQ
              </a>
            </div>
          </div>
          <p className="text-xs text-white/45">
            Astuce : pour une commande importante (équipe / entreprise), passez plutôt par l’email — on vous répond avec une proposition simple.
          </p>
        </section>

        <section aria-labelledby="shop-links" className="space-y-4">
          <h2 id="shop-links" className="text-xs font-bold uppercase tracking-widest text-white/60">
            Liens utiles
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            <li>
              <Link className="hover:text-white" href="/">
                Retour à la vitrine
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/about">
                Le club (à propos)
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/sponsors">
                Sponsors & partenaires
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/contact">
                Contact
              </Link>
            </li>
          </ul>
        </section>
      </TrustPageShell>
    </>
  );
}
