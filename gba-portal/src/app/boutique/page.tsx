'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  Flame,
  ShoppingBag,
  Shield,
  Sparkles,
  Star,
  Truck,
} from 'lucide-react'
import { Teko, Cinzel } from 'next/font/google'

// Optimisation : Utilisation des poids spécifiques pour le rendu
const teko = Teko({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })
const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '600', '700'] })

const heroProduct = {
  name: 'Maillot domicile 25/26',
  label: 'Drop 01',
  price: '79€',
  image:
    'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1400&auto=format&fit=crop',
}

const capsules = [
  {
    title: 'Matchday elite',
    description: 'Coupe athlétique, tissu respirant, détails premium.',
    image:
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop',
    tag: 'Performance',
  },
  {
    title: 'Training ritual',
    description: 'Pièces techniques pour les séances intenses et précises.',
    image:
      'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?q=80&w=1200&auto=format&fit=crop',
    tag: 'Training',
  },
  {
    title: 'Stadium life',
    description: 'Streetwear club, logo brodé, esprit tribu.',
    image:
      'https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=1200&auto=format&fit=crop',
    tag: 'Lifestyle',
  },
]

const products = [
  {
    id: 'maillot-domicile',
    name: 'Maillot domicile 25/26',
    category: 'Matchday',
    price: '79€',
    badge: 'Best-seller',
    image:
      'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'maillot-exterieur',
    name: 'Maillot extérieur 25/26',
    category: 'Matchday',
    price: '79€',
    badge: 'Nouveau',
    image:
      'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'veste-stadium',
    name: 'Veste stadium',
    category: 'Lifestyle',
    price: '89€',
    badge: 'Édition limitée',
    image:
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'hoodie-club',
    name: 'Hoodie héritage',
    category: 'Lifestyle',
    price: '69€',
    badge: 'Focus',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'maillot-training',
    name: 'Haut training',
    category: 'Training',
    price: '49€',
    badge: 'Performance',
    image:
      'https://images.unsplash.com/photo-1521805103424-d8f8430e8933?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'pantalon-tech',
    name: 'Pantalon tech',
    category: 'Training',
    price: '59€',
    badge: 'Essentiel',
    image:
      'https://images.unsplash.com/photo-1533681701596-9f4b15f5b9f7?q=80&w=1200&auto=format&fit=crop',
  },
]


function Marquee({ text }: { text: string }) {
  return (
    <div className="relative flex overflow-hidden py-6 bg-black border-y border-white/10 select-none">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10"></div>

      <div className="animate-marquee whitespace-nowrap flex gap-12 items-center">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center gap-12">
            <span
              className={`${teko.className} text-5xl md:text-6xl font-bold uppercase tracking-[0.25em] text-transparent opacity-40`}
              style={{ WebkitTextStroke: '1px white' }}
            >
              {text}
            </span>
            <Sparkles size={28} className="text-[#0065BD] drop-shadow-[0_0_10px_rgba(0,101,189,0.8)]" fill="currentColor" />
          </div>
        ))}
      </div>

      <div className="absolute top-0 py-6 animate-marquee2 whitespace-nowrap flex gap-12 items-center">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center gap-12">
            <span
              className={`${teko.className} text-5xl md:text-6xl font-bold uppercase tracking-[0.25em] text-transparent opacity-40`}
              style={{ WebkitTextStroke: '1px white' }}
            >
              {text}
            </span>
            <Sparkles size={28} className="text-[#0065BD] drop-shadow-[0_0_10px_rgba(0,101,189,0.8)]" fill="currentColor" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function BoutiquePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020202] text-white">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,101,189,0.4),_transparent_55%)]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.08] mix-blend-overlay"></div>
        <div className="absolute -top-[25%] right-[-10%] w-[55vw] h-[55vw] bg-[#0065BD]/25 blur-[200px] rounded-full opacity-80"></div>
        <div className="absolute -bottom-[30%] left-[-15%] w-[60vw] h-[60vw] bg-white/10 blur-[220px] rounded-full opacity-40"></div>
      </div>

      <header className="relative z-20 px-6 pt-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/"
            className={`${teko.className} text-lg md:text-xl font-medium tracking-widest text-white uppercase hover:text-[#0065BD] transition-colors`}
          >
            Groupement Bruche Ackerland
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="hidden md:inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-white/70 hover:text-white hover:border-white/30 transition-colors"
            >
              Accès Staff <ArrowUpRight size={14} />
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#0065BD] px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-white shadow-[0_0_15px_rgba(0,101,189,0.5)]">
              <ShoppingBag size={14} /> Boutique officielle
            </div>
          </div>
        </div>
      </header>

      <section className="relative z-10 px-6 pt-20 pb-16">
        <div className="absolute inset-0 z-[-1]">
          <Image src="/brand/hero.jpg" alt="Boutique GBA" fill className="object-cover opacity-60" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-[#020202]"></div>
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-white/70">
              <Flame size={14} className="text-[#0065BD]" />
              Collection 25/26
            </div>
            <h1 className={`${teko.className} mt-6 text-6xl md:text-7xl lg:text-8xl uppercase leading-[0.85]`}>
              Porter nos
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400"> couleurs</span>
            </h1>
            <p className={`${cinzel.className} mt-6 max-w-xl text-lg text-white/70`}>
              La boutique officielle du groupement. Des pièces pensées pour le match, la ville, le vestiaire.
              Chaque détail porte l'identité GBA.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="#collection"
                className="inline-flex items-center gap-3 rounded-full bg-[#0065BD] px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-[0_0_30px_rgba(0,101,189,0.35)] hover:bg-white hover:text-[#0065BD] transition-all"
              >
                Découvrir la collection <ArrowRight size={16} />
              </Link>
              <Link
                href="#best-sellers"
                className="inline-flex items-center gap-3 rounded-full border border-white/20 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white hover:border-white hover:bg-white/10 transition-all"
              >
                Best-sellers <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-6 text-xs uppercase tracking-[0.3em] text-white/60">
              <span className="flex items-center gap-2">
                <Star size={14} className="text-[#0065BD]" /> Édition limitée
              </span>
              <span className="flex items-center gap-2">
                <Shield size={14} className="text-[#0065BD]" /> Pièces officielles
              </span>
              <span className="flex items-center gap-2">
                <Truck size={14} className="text-[#0065BD]" /> Envoi 48h
              </span>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="absolute -inset-6 rounded-[32px] bg-gradient-to-b from-white/20 via-white/5 to-transparent blur-2xl"></div>
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/60 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
                <div className="absolute inset-0">
                  <Image src={heroProduct.image} alt={heroProduct.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                </div>
                <div className="relative z-10 flex min-h-[420px] flex-col justify-between p-6 md:min-h-[520px]">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-white/70">
                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">{heroProduct.label}</span>
                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">Série limitée</span>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">Pièce signature</p>
                    <h3 className={`${teko.className} mt-3 text-4xl md:text-5xl uppercase`}>{heroProduct.name}</h3>
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                      <span className={`${teko.className} text-4xl text-white`}>{heroProduct.price}</span>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-black hover:bg-[#0065BD] hover:text-white transition-all"
                      >
                        Ajouter <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-xs uppercase tracking-[0.4em] text-white/50">Capsules</span>
              <h2 className={`${teko.className} mt-3 text-5xl md:text-6xl uppercase`}>Rituels de jeu</h2>
            </div>
            <div className="text-xs uppercase tracking-[0.3em] text-white/50">Pièces pensées pour la tribu</div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {capsules.map((capsule, index) => (
              <div
                key={capsule.title}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5"
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="relative h-64">
                    <Image src={capsule.image} alt={capsule.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  </div>
                  <div className="relative p-6">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">{capsule.tag}</span>
                    <h3 className={`${teko.className} mt-3 text-3xl uppercase`}>{capsule.title}</h3>
                    <p className="mt-3 text-sm text-white/65">{capsule.description}</p>
                    <button
                      type="button"
                      className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#0065BD] hover:text-white transition-colors"
                    >
                      Explorer <ArrowUpRight size={14} />
                    </button>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Marquee text="BOUTIQUE OFFICIELLE" />

      <section id="collection" className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-xs uppercase tracking-[0.4em] text-white/50">Collection</span>
              <h2 className={`${teko.className} mt-3 text-5xl md:text-6xl uppercase`}>
                Pièces essentielles
              </h2>
            </div>
            <Link
              href="#best-sellers"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white transition-colors"
            >
              Voir les best-sellers <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5"
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <div className="relative h-64">
                    <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                    <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white/70">
                      {product.badge}
                    </span>
                  </div>
                  <div className="p-6">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">{product.category}</span>
                    <h3 className={`${teko.className} mt-3 text-3xl uppercase`}>{product.name}</h3>
                    <div className="mt-6 flex items-center justify-between">
                      <span className={`${teko.className} text-3xl`}>{product.price}</span>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-white/70 hover:border-white hover:text-white transition-colors"
                      >
                        Ajouter <ArrowUpRight size={12} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 pb-24">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-black to-black p-10 md:p-14">
          <div className="absolute -right-10 -top-10 h-[35vw] w-[35vw] rounded-full bg-[#0065BD]/30 blur-[160px] opacity-70"></div>
          <div className="relative z-10">
            <span className="text-xs uppercase tracking-[0.4em] text-white/50">La tribu</span>
            <h2 className={`${teko.className} mt-4 text-5xl md:text-6xl uppercase`}>Le maillot, le serment</h2>
            <p className={`${cinzel.className} mt-6 max-w-2xl text-lg text-white/70`}>
              Chaque pièce est une promesse. Rejoins l'allure GBA, porte la même énergie que sur le terrain.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="#collection"
                className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-black hover:bg-[#0065BD] hover:text-white transition-all"
              >
                Commander maintenant <ArrowUpRight size={16} />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-3 rounded-full border border-white/20 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white hover:border-white hover:bg-white/10 transition-all"
              >
                Retour au club <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}