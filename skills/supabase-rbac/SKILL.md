# SKILL: Supabase RBAC & Policy Management

## Context
Managing Row Level Security (RLS) policies in PostgreSQL/Supabase requires specific syntax and patterns to avoid errors and ensure security.

## Best Practices
- **Drop Before Create:** Always use `DROP POLICY IF EXISTS ... ON table_name;` before `CREATE POLICY`.
- **Separate Operations:** Avoid `FOR ALL` or `FOR INSERT, UPDATE, DELETE`. Create explicit policies:
  - `policy_insert`
  - `policy_update`
  - `policy_delete`
  - `policy_select`
- **Role Verification:** Use `auth.uid()` and join tables (e.g., `teams`) to verify ownership or role.
- **Admin Override:** Ideally, admins act via `service_role` or have a bypass policy, but RLS often includes `OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'`.

## Templates

### 1. Basic Read Policy (Public/Authenticated)
```sql
DROP POLICY IF EXISTS "Enable read access for all users" ON public.some_table;
CREATE POLICY "Enable read access for all users" ON public.some_table
FOR SELECT USING (true); -- Or (auth.role() = 'authenticated')
```

### 2. Owner-Based Write (Insert)
```sql
DROP POLICY IF EXISTS "Enable insert for owners" ON public.some_table;
CREATE POLICY "Enable insert for owners" ON public.some_table
FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 3. Team-Based Coach Access (The "Coach Pattern")
Use this for tables linked to teams (like `attendance`, `planning_sessions`).

```sql
-- READ
DROP POLICY IF EXISTS "Coach can view team data" ON public.linked_table;
CREATE POLICY "Coach can view team data" ON public.linked_table
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.teams t
    WHERE t.id = linked_table.team_id
    AND t.coach_id = auth.uid()
  )
);

-- UPDATE
DROP POLICY IF EXISTS "Coach can update team data" ON public.linked_table;
CREATE POLICY "Coach can update team data" ON public.linked_table
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.teams t
    WHERE t.id = linked_table.team_id
    AND t.coach_id = auth.uid()
  )
);
```

## Troubleshooting
- **Error: 42601 syntax error**: Often due to `IF NOT EXISTS` in `CREATE POLICY`.
- **Policy not applying**: Check if RLS is enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`).
- **Infinite Recursion**: Avoid policies that query the table itself without careful conditions.
