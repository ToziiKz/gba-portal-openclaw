import type { Metadata } from "next";
import Link from "next/link";

import { TrustPageShell } from "@/components/TrustPageShell";
import { featuredProducts, shopCategories, shopFaqs } from "@/lib/shop-data";

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

  const categoryAnchors = shopCategories.map((category) => ({
    ...category,
    id: toAnchorId(category.title),
  }));

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: shopFaqs.map((item) => ({
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
              className="rounded-full bg-white px-6 py-3 text-center text-xs font-bold uppercase tracking-widest text-black transition hover:bg-white/90"
            >
              Précommander
            </a>
            <Link
              href="/contact"
              className="rounded-full border border-white/20 bg-transparent px-6 py-3 text-center text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-white/10"
            >
              Questions
            </Link>
            <Link
              href="/sponsors"
              className="rounded-full border border-white/20 bg-transparent px-6 py-3 text-center text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-white/10"
            >
              Devenir partenaire
            </Link>
          </div>
        }
      >
        <section aria-labelledby="shop-express" className="rounded-3xl border border-white/5 p-8">
          <h2 id="shop-express" className="text-xs font-bold uppercase tracking-widest text-white/50">
            Pré-lancement : commander en 2 minutes
          </h2>
          <ol className="mt-6 grid gap-6 text-sm text-white/70 md:grid-cols-3">
            <li className="space-y-2">
              <p className="text-xs font-bold text-white/30">01</p>
              <p className="font-bold text-white">Choisir l’article</p>
              <p className="text-xs text-white/50">Article + taille + quantité.</p>
            </li>
            <li className="space-y-2">
              <p className="text-xs font-bold text-white/30">02</p>
              <p className="font-bold text-white">Envoyer l’email</p>
              <p className="text-xs text-white/50">Un message suffit, on centralise tout.</p>
            </li>
            <li className="space-y-2">
              <p className="text-xs font-bold text-white/30">03</p>
              <p className="font-bold text-white">Confirmation</p>
              <p className="text-xs text-white/50">Prix exact + retrait club.</p>
            </li>
          </ol>
          <p className="mt-6 text-xs text-white/30">
            Pas de paiement en ligne pour l’instant : simple, local et fiable.
          </p>
        </section>

        <section aria-labelledby="shop-featured" className="space-y-8">
          <h2 id="shop-featured" className="text-xs font-bold uppercase tracking-widest text-white/50">
            Offres à la une
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {featuredProducts.map((product) => (
              <article key={product.name} className="flex flex-col justify-between rounded-3xl border border-white/10 p-6 transition-colors hover:border-white/20 bg-white/[0.02]">
                <div>
                  <p className="text-xs font-bold text-white/40">{product.priceHint}</p>
                  <h3 className="mt-3 text-xl font-bold text-white font-[family-name:var(--font-teko)] tracking-wide">{product.name}</h3>
                  <p className="mt-3 text-sm text-white/60">{product.detail}</p>
                </div>
                <a
                  className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-white/10 px-5 py-3 text-center text-xs font-bold text-white transition hover:bg-white hover:text-black uppercase tracking-widest"
                  href={`${mailtoBase}?subject=${encodeURIComponent(`Précommande — ${product.name}`)}&body=${encodeURIComponent(
                    `Bonjour,\n\nJe souhaite précommander : ${product.name}.\n\n- Nom :\n- Article : ${product.name}\n- Taille (si applicable) :\n- Quantité :\n- Flocage (optionnel) :\n- Téléphone (optionnel) :\n\nMerci !`
                  )}`}
                >
                  {product.cta}
                </a>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="shop-categories">
          <h2 id="shop-categories" className="text-xs font-bold uppercase tracking-widest text-white/50">
            Sélection
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {categoryAnchors.map((category) => (
              <article
                key={category.title}
                id={category.id}
                className="scroll-mt-28 rounded-3xl border border-white/10 p-8 transition-colors hover:border-white/20"
              >
                <h3 className="text-2xl font-bold text-white font-[family-name:var(--font-teko)] tracking-wide">{category.title}</h3>
                <p className="mt-3 text-sm text-white/60">{category.detail}</p>
                <p className="mt-4 text-xs uppercase tracking-widest text-white/30">{category.note}</p>

                <a
                  className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-transparent px-5 py-3 text-center text-xs font-bold text-white transition hover:bg-white hover:text-black uppercase tracking-widest"
                  href={`${mailtoBase}?subject=${encodeURIComponent(`Boutique — ${category.title}`)}&body=${encodeURIComponent(
                    `Bonjour,\n\nJe souhaite commander / précommander (catégorie) : ${category.title}.\n\n- Nom :\n- Article (détail) :\n- Taille (si applicable) :\n- Quantité :\n- Flocage (optionnel) :\n- Téléphone (optionnel) :\n\nMerci !`
                  )}`}
                >
                  {category.cta}
                </a>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="shop-why" className="space-y-8">
          <h2 id="shop-why" className="text-xs font-bold uppercase tracking-widest text-white/50">
            Pourquoi la boutique existe
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <article className="rounded-3xl border border-white/5 p-6">
              <p className="text-xs font-bold text-white/30">Formation</p>
              <p className="mt-3 text-sm text-white/60">
                Les bénéfices soutiennent l’encadrement et le matériel.
              </p>
            </article>
            <article className="rounded-3xl border border-white/5 p-6">
              <p className="text-xs font-bold text-white/30">Événements</p>
              <p className="mt-3 text-sm text-white/60">
                Finance ce qui crée du lien (tournois, déplacements).
              </p>
            </article>
            <article className="rounded-3xl border border-white/5 p-6">
              <p className="text-xs font-bold text-white/30">Identité</p>
              <p className="mt-3 text-sm text-white/60">
                Afficher une fierté commune sur les terrains.
              </p>
            </article>
          </div>
        </section>

        <section id="shop-faq" aria-labelledby="shop-faq-title" className="space-y-8">
          <h2 id="shop-faq-title" className="text-xs font-bold uppercase tracking-widest text-white/50">FAQ</h2>
          <div className="space-y-4">
            {shopFaqs.map((item) => (
              <details
                key={item.q}
                className="group rounded-3xl border border-white/5 p-6 open:bg-white/5"
              >
                <summary className="cursor-pointer list-none text-sm font-semibold text-white/80 group-open:text-white">
                  {item.q}
                  <span className="float-right text-xs text-white/30 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-white/60">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section aria-labelledby="shop-final-cta" className="space-y-8">
          <h2 id="shop-final-cta" className="text-xs font-bold uppercase tracking-widest text-white/50">
            Prêt à commander ?
          </h2>
          <div className="rounded-3xl border border-white/5 bg-white/[0.05] p-8">
            <p className="text-sm text-white/70">
              Envoyez un email avec <span className="font-semibold text-white">article</span>, <span className="font-semibold text-white">taille</span>, <span className="font-semibold text-white">quantité</span>.
              On confirme prix et retrait.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={`mailto:${contactEmail}?subject=${encodeURIComponent("Commande boutique GBA")}&body=${encodeURIComponent(
                  "Bonjour,\n\nJe souhaite commander / précommander :\n\n- Nom :\n- Article :\n- Taille (si applicable) :\n- Quantité :\n- Flocage (optionnel) :\n- Téléphone (optionnel) :\n\nMerci !"
                )}`}
                className="rounded-full bg-white px-8 py-3 text-center text-xs font-bold uppercase tracking-widest text-black transition hover:bg-white/90"
              >
                Commander par email
              </a>
              <Link
                href="/contact"
                className="rounded-full border border-white/10 bg-transparent px-8 py-3 text-center text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-white/10"
              >
                Une question
              </Link>
            </div>
          </div>
        </section>
      </TrustPageShell>
    </>
  );
}
