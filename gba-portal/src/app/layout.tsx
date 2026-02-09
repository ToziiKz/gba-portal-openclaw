import "../styles/globals.css";
import { Navbar } from "../components/Navbar";
import { ScrollPulse } from "../components/ScrollPulse";
import type { Metadata, Viewport } from "next";
import { Cinzel, Inter, Teko } from "next/font/google";

import { getBaseUrl, getMetadataBase } from "@/lib/site";

const teko = Teko({ subsets: ["latin"], variable: "--font-teko" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: "GBA Portal",
    template: "%s · GBA Portal",
  },
  applicationName: "GBA Portal",
  description: "Vitrine premium du Groupement Bruche Ackerland : histoire, formation, communauté, partenaires et boutique.",
  keywords: [
    "GBA",
    "Groupement Bruche Ackerland",
    "football",
    "académie",
    "club",
    "jeunes",
    "sponsors",
    "boutique",
  ],
  authors: [{ name: "GBA Portal" }],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "GBA Portal",
    description: "Une vitrine premium du club : récit, formation, communauté, partenaires et boutique.",
    type: "website",
    url: "/",
    siteName: "GBA Portal",
    locale: "fr_FR",
    images: [
      {
        url: "/gba-logo.png",
        width: 1200,
        height: 630,
        alt: "GBA Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GBA Portal",
    description: "Une vitrine premium du club : récit, formation, communauté, partenaires et boutique.",
    images: [
      {
        url: "/gba-logo.png",
        alt: "GBA Portal",
      },
    ],
  },
  icons: {
    icon: "/gba-logo.png",
    shortcut: "/gba-logo.png",
    apple: "/gba-logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#020202",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const baseUrl = getBaseUrl();
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@gba-portal.fr";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}#organization`,
        name: "Groupement Bruche Ackerland",
        url: baseUrl,
        email: contactEmail,
        logo: `${baseUrl}/gba-logo.png`,
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}#website`,
        name: "GBA Portal",
        url: baseUrl,
        inLanguage: "fr-FR",
        publisher: { "@id": `${baseUrl}#organization` },
      },
    ],
  };

  return (
    <html lang="fr">
      <body className={`${teko.variable} ${cinzel.variable} ${inter.variable} bg-[#020202] text-white`}>
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[60] focus:rounded-full focus:bg-black/80 focus:px-4 focus:py-2 focus:text-xs focus:uppercase focus:tracking-[0.4em]"
        >
          Aller au contenu
        </a>
        <Navbar />
        <ScrollPulse />
        <main id="content" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
