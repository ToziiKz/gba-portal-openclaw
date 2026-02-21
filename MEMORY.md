# MEMORY.md - Long-term Operational Memory

## Active Project
- Project: `gba-portal` (Next.js + TypeScript + Tailwind + Supabase)
- Workspace root: `/root/.openclaw/workspace`
- Main app: `gba-portal/`
- Dev server target: `http://localhost:3001` (3000 often occupied)

## Durable Product Decisions
- Product phase rule (critical): site is **V1 nearly usable**; do **not** redesign or change core UX/fond-forme. Prioritize only **fixes, optimization, and incremental improvements**.
- Dashboard UX target: **coach-first**, low cognitive load, fast terrain usage.
- Visual system: **single blue accent + light neutrals** (white/gray) across dashboard.
- Access workflow (`/dashboard/acces`):
  - invitation pre-assignment to teams (`target_team_ids`)
  - edit role/team/active state for existing users
  - robust delete strategy (fallback to archive/anonymize if hard delete blocked)
- Activation flow: prefill full name from invitation; avoid redundant input.
- Persistent user directive (critical): **même après fin de session, compaction, ou changement de modèle**, le site est en **V1 (presque utilisable)** et il ne faut **pas changer le fond ni la forme**. Priorité stricte: **corriger, optimiser, améliorer** au maximum.
- Additional working rule: n’hésiter pas à retourner dans les fichiers/dossiers pour retrouver du contexte ou créer un support utile, avec un contexte aussi précis et détaillé que nécessaire.

## Data / Schema Realities (important)
- `profiles` deletion does **not** imply deleting `auth.users` (reverse cascade only).
- In this live DB, players naming is currently used as `firstname` / `lastname` in app logic.
- Invitations role constraint may reject `admin` unless DB check is updated.

## Pending Critical Checks
- Verify migration applied: `20260219_invitation_teams.sql`
- Verify migration/policy applied: `20260219_profiles_delete_policy.sql`
- End-to-end QA `/dashboard/acces` after rewrites.

## Memory Optimization Protocol (applies now + future sessions)
1. Keep this file short: only stable decisions, constraints, and schema truths.
2. Put volatile logs in `memory/YYYY-MM-DD.md` only.
3. At end of big work blocks, write a 5-line checkpoint in daily memory:
   - what changed
   - what is broken
   - what is pending
   - proof command
   - next action
4. Before coding after compaction: read only
   - `MEMORY.md`
   - today + yesterday daily memory
   - touched files list
5. Prefer canonical “source of truth” bullets over narrative paragraphs.

## Models / Execution
- Preferred coding model for heavy implementation: `openai-codex/gpt-5.3-codex`.
- Use concise outputs and targeted edits by default.
