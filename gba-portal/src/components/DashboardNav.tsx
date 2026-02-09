"use client";

import * as React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Card } from "@/components/ui/Card";

type DashboardRole = "viewer" | "coach" | "staff" | "admin";

type NavItem = {
  label: string;
  href: string;
  status: "ready" | "coming";
  note?: string;
  minRole?: DashboardRole;
};

const roleLabels: Record<DashboardRole, string> = {
  viewer: "lecture",
  coach: "coach",
  staff: "staff",
  admin: "admin",
};

const roleOrder: Record<DashboardRole, number> = {
  viewer: 0,
  coach: 1,
  staff: 2,
  admin: 3,
};

const navItems: NavItem[] = [
  { label: "Vue d’ensemble", href: "/dashboard", status: "ready", minRole: "viewer" },
  { label: "Rapports", href: "/dashboard/rapports", status: "ready", note: "KPIs + alertes", minRole: "viewer" },
  { label: "Relances", href: "/dashboard/relances", status: "ready", note: "backlog actionnable", minRole: "staff" },
  { label: "Équipes", href: "/dashboard/equipes", status: "ready", minRole: "coach" },
  { label: "Catégories", href: "/dashboard/categories", status: "ready", note: "U6 → U18 / seniors", minRole: "coach" },
  { label: "Joueurs", href: "/dashboard/joueurs", status: "ready", minRole: "coach" },
  { label: "Planning (pôles)", href: "/dashboard/planning", status: "ready", minRole: "coach" },
  { label: "Présences", href: "/dashboard/presences", status: "ready", note: "par séance", minRole: "coach" },
  { label: "Licences & paiements", href: "/dashboard/licences", status: "ready", minRole: "staff" },
  { label: "Équipements", href: "/dashboard/equipements", status: "ready", minRole: "staff" },
  { label: "Stock & matériel", href: "/dashboard/stock", status: "ready", note: "inventaire", minRole: "staff" },
  { label: "Staff (annuaire)", href: "/dashboard/staff", status: "ready", note: "contacts & dispo", minRole: "admin" },
];

function normalizePath(pathname: string | null) {
  if (!pathname) return "/";
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

function isActivePath(current: string, href: string) {
  const cur = normalizePath(current);
  const target = normalizePath(href);
  return cur === target;
}

function canAccess(role: DashboardRole, item: NavItem) {
  const min = item.minRole ?? "viewer";
  return roleOrder[role] >= roleOrder[min];
}

const ROLE_STORAGE_KEY = "gba.dashboardRole";

export function DashboardNav() {
  const pathname = usePathname();
  const current = React.useMemo(() => normalizePath(pathname), [pathname]);

  const [role, setRole] = React.useState<DashboardRole>("staff");

  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(ROLE_STORAGE_KEY);
      if (!stored) return;
      const maybe = stored as DashboardRole;
      if (maybe in roleOrder) setRole(maybe);
    } catch {
      // ignore (privacy mode)
    }
  }, []);

  React.useEffect(() => {
    try {
      window.localStorage.setItem(ROLE_STORAGE_KEY, role);
    } catch {
      // ignore
    }
  }, [role]);

  return (
    <Card className="premium-card card-shell rounded-3xl p-4">
      <nav aria-label="Navigation dashboard" className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isReady = item.status === "ready";
          const baseClasses = "group flex items-center justify-between rounded-2xl px-3 py-2 text-sm transition";

          if (!isReady) {
            return (
              <div
                key={item.href}
                aria-disabled="true"
                className={`${baseClasses} border border-white/10 bg-white/5 text-white/55`}
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium">{item.label}</span>
                  {item.note ? <span className="block truncate text-xs text-white/35">{item.note}</span> : null}
                </span>
                <span className="rounded-full border border-white/15 bg-black/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/55">
                  bientôt
                </span>
              </div>
            );
          }

          const allowed = canAccess(role, item);
          const active = isActivePath(current, item.href);

          if (!allowed) {
            return (
              <div
                key={item.href}
                aria-disabled="true"
                className={`${baseClasses} border border-white/10 bg-white/5 text-white/55`}
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium">{item.label}</span>
                  <span className="block truncate text-xs text-white/35">
                    {item.note ? `${item.note} • ` : ""}rôle requis: {roleLabels[item.minRole ?? "viewer"]}
                  </span>
                </span>
                <span className="rounded-full border border-white/15 bg-black/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/55">
                  verrouillé
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`${baseClasses} border bg-white/5 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
                active ? "border-white/30 bg-white/10" : "border-white/10 hover:border-white/25 hover:bg-white/10"
              }`}
            >
              <span className="min-w-0">
                <span className={`block truncate ${active ? "font-black" : "font-semibold"}`}>{item.label}</span>
                {item.note ? <span className="block truncate text-xs text-white/35">{item.note}</span> : null}
              </span>
              <span
                className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] ${
                  active ? "border-white/25 bg-white/10 text-white" : "border-white/15 bg-black/20 text-white/70"
                }`}
              >
                {active ? "actuel" : "actif"}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 border-t border-white/10 pt-4">
        <label className="grid gap-2">
          <span className="text-xs text-white/55">
            Accès (mock) : <span className="font-semibold text-white/70">{roleLabels[role]}</span>
          </span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as DashboardRole)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-white/25 focus:ring-2 focus:ring-white/20"
            aria-label="Simuler un rôle dashboard (mock)"
          >
            <option value="viewer">Lecture</option>
            <option value="coach">Coach</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <p className="mt-2 text-xs text-white/35">
          Placeholder permissions : UI-only (localStorage), pas d’auth. Les modules “verrouillés” simulent des droits.
        </p>
      </div>
    </Card>
  );
}
