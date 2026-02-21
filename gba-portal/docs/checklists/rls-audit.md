# RLS Policy Checklist (Tactique Module)

Target: `matches` table (Tactique)

## Required Policies
- [ ] SELECT: Authenticated users can view matches they are part of (coach/player).
- [ ] INSERT: Coaches can create matches for their teams.
- [ ] UPDATE: Coaches can update match details.
- [ ] DELETE: Coaches can delete matches.

## Implementation Steps
1. Create migration file: `src/lib/supabase/migrations/YYYYMMDD_tactique_rls.sql`
2. Enable RLS on `matches`.
3. Add policies using `auth.uid()` and team membership checks.
4. Verify with `scripts/verify-rls.ts` (if exists) or manual test.

## Notes
- Avoid "God Function" validation in RLS.
- Use helper functions for team membership if possible.
