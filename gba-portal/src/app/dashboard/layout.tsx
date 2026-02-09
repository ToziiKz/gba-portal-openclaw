import type { Metadata } from "next";

import { DashboardNav } from "@/components/DashboardNav";
import { PermissionsProvider } from "@/components/PermissionsProvider";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Espace staff GBA (données mock, sans base de données pour l’instant).",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/dashboard",
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-[#020202] via-[#050505] to-[#000000] px-4 py-10 md:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.6em] text-white/60">Espace staff</p>
          <h1 className="mt-3 font-[var(--font-teko)] text-4xl font-black tracking-[0.06em] text-white md:text-5xl">
            Dashboard
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/70">
            UI premium, sans base de données : on itère module par module avec des mocks. Les accès/permissions restent des
            placeholders.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[260px_1fr]">
          <aside className="md:sticky md:top-24 md:self-start">
            <DashboardNav />
          </aside>
          <section aria-label="Contenu du dashboard" className="min-w-0">
            <PermissionsProvider>{children}</PermissionsProvider>
          </section>
        </div>
      </div>
    </div>
  );
}
