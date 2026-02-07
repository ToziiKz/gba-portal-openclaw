import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Accès staff (bientôt). Page de connexion placeholder pour le portail GBA.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/login",
  },
};

function safeInternalPath(input: string | undefined, fallback: string) {
  if (!input) return fallback;
  if (!input.startsWith("/")) return fallback;
  if (input.startsWith("//")) return fallback;
  if (input.includes("://")) return fallback;
  return input;
}

function appendQueryParam(path: string, key: string, value: string) {
  const [base, rawQuery] = path.split("?");
  const params = new URLSearchParams(rawQuery ?? "");
  params.set(key, value);
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{
    next?: string;
  }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const nextPath = safeInternalPath(resolvedSearchParams?.next, "/dashboard");
  const demoPath = appendQueryParam(nextPath, "accessCode", "DEMO");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020202] via-[#050505] to-[#000000] px-6 py-24">
      <div className="mx-auto w-full max-w-xl rounded-[2.5rem] border border-white/10 bg-white/5 p-10 shadow-[0_25px_90px_rgba(0,0,0,0.65)] backdrop-blur">
        <p className="text-xs uppercase tracking-[0.6em] text-white/60">Accès staff</p>
        <h1 className="mt-4 font-[var(--font-teko)] text-4xl font-black tracking-[0.06em] text-white md:text-5xl">
          Connexion
        </h1>
        <p className="mt-4 text-sm text-white/70">
          L’espace staff arrive bientôt. Pour l’instant, cette page sert de point d’entrée clair (sans authentification) et guide
          vers le <span className="font-semibold text-white/80">/dashboard</span> (placeholder) pour valider le routing login → dashboard.
        </p>
        <p className="mt-3 text-xs text-white/45">
          Pour le grand public : la vitrine du club reste sur <span className="font-semibold text-white/70">/</span> et la boutique sur{" "}
          <Link href="/shop" className="font-semibold text-white/70 underline-offset-4 hover:underline">
            /shop
          </Link>
          .
        </p>

        <div className="mt-8 flex flex-col gap-4">
          <form action={nextPath} method="get" className="grid gap-3">
            <label className="text-xs uppercase tracking-[0.6em] text-white/50" htmlFor="accessCode">
              Code d’accès (optionnel)
            </label>
            <input
              id="accessCode"
              name="accessCode"
              inputMode="text"
              autoComplete="off"
              placeholder="Ex: STAFF-2026"
              className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white/85 outline-none placeholder:text-white/30 focus:border-white/30 focus:ring-2 focus:ring-[#00A1FF] focus:ring-offset-2 focus:ring-offset-black"
            />
            <button
              type="submit"
              className="rounded-full border border-white/40 bg-gradient-to-r from-[#00a1ff] to-[#0065bd] px-6 py-3 text-center text-xs font-black uppercase tracking-[0.5em] text-white shadow-[0_15px_50px_rgba(0,161,255,0.45)]"
            >
              Continuer vers le dashboard
            </button>
            <Link
              href={nextPath}
              className="btn-ghost inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-center text-[10px] font-black uppercase tracking-[0.5em] text-white/80 transition hover:border-white/40 hover:bg-white/10"
            >
              Accéder directement (sans code)
            </Link>
            <Link
              href={demoPath}
              className="btn-ghost inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-center text-[10px] font-black uppercase tracking-[0.5em] text-white/80 transition hover:border-white/40 hover:bg-white/10"
            >
              Ouvrir la démo (code DEMO)
            </Link>
            <p className="text-xs text-white/50">
              Pas d’auth pour l’instant : le champ sert à préparer l’UX (éventuel code / rôle). Le dashboard reste un placeholder.
            </p>
            {nextPath !== "/dashboard" ? (
              <p className="text-xs text-white/45">
                Après validation, vous serez redirigé vers : <span className="font-semibold text-white/70">{nextPath}</span>
              </p>
            ) : null}
          </form>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/"
              className="btn-ghost rounded-full border border-white/25 bg-white/5 px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.5em] text-white/90 transition-transform duration-200 hover:scale-[1.03] hover:border-white/40 active:scale-[0.99]"
            >
              Retour à la vitrine
            </Link>
            <Link
              href="/shop"
              className="btn-ghost rounded-full border border-white/25 bg-white/5 px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.5em] text-white/90 transition-transform duration-200 hover:scale-[1.03] hover:border-white/40 active:scale-[0.99]"
            >
              Boutique
            </Link>
          </div>
          <p className="text-xs text-white/50">
            Prochaine étape : authentification + rôles (admin / staff / coach) et restrictions d’accès au dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
