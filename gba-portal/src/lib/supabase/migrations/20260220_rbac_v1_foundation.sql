-- RBAC V1 foundation (non-destructive)
-- Goal: add permissions/scopes layer without breaking existing policies.

-- 1) Permissions matrix table
create table if not exists public.role_permissions (
  id bigserial primary key,
  role text not null,
  module text not null,
  action text not null,
  scope text not null check (scope in ('team', 'pole', 'global')),
  allowed boolean not null default true,
  created_at timestamptz not null default now(),
  unique(role, module, action)
);

-- 2) User scope assignments
create table if not exists public.user_scopes (
  id bigserial primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  scope_type text not null check (scope_type in ('team', 'pole', 'global')),
  team_id uuid null references public.teams(id) on delete cascade,
  pole text null,
  created_at timestamptz not null default now(),
  unique(user_id, scope_type, team_id, pole)
);

create index if not exists idx_user_scopes_user_scope on public.user_scopes(user_id, scope_type);
create index if not exists idx_user_scopes_team on public.user_scopes(team_id);

-- 3) Seed role permissions (MVP)
insert into public.role_permissions(role, module, action, scope, allowed) values
  -- admin
  ('admin', 'all', 'all', 'global', true),

  -- resp_sportif
  ('resp_sportif', 'planning', 'approve', 'global', true),
  ('resp_sportif', 'presences', 'approve', 'global', true),
  ('resp_sportif', 'convocations', 'approve', 'global', true),
  ('resp_sportif', 'effectif', 'approve', 'global', true),
  ('resp_sportif', 'validations', 'approve', 'global', true),

  -- responsable_pole
  ('responsable_pole', 'planning', 'approve', 'pole', true),
  ('responsable_pole', 'presences', 'approve', 'pole', true),
  ('responsable_pole', 'convocations', 'approve', 'pole', true),
  ('responsable_pole', 'effectif', 'approve', 'pole', true),
  ('responsable_pole', 'validations', 'approve', 'pole', true),

  -- coach + adjoint (same rights in V1)
  ('coach', 'planning', 'write', 'team', true),
  ('coach', 'presences', 'write', 'team', true),
  ('coach', 'convocations', 'write', 'team', true),
  ('coach', 'tactique', 'write', 'team', true),
  ('coach', 'effectif', 'write', 'team', true),

  ('adjoint', 'planning', 'write', 'team', true),
  ('adjoint', 'presences', 'write', 'team', true),
  ('adjoint', 'convocations', 'write', 'team', true),
  ('adjoint', 'tactique', 'write', 'team', true),
  ('adjoint', 'effectif', 'write', 'team', true),

  -- dirigeant
  ('dirigeant', 'presences', 'write', 'team', true),
  ('dirigeant', 'convocations', 'write', 'team', true),

  -- resp_administratif
  ('resp_administratif', 'licences_admin', 'approve', 'global', true),
  ('resp_administratif', 'acces_permissions', 'write', 'global', true),
  ('resp_administratif', 'invitations_activation', 'write', 'global', true),

  -- resp_equipements
  ('resp_equipements', 'equipements_stock', 'write', 'global', true),

  -- Legacy compatibility
  ('staff', 'all', 'all', 'global', true)
on conflict (role, module, action) do nothing;

-- 4) Backfill scopes from existing model
-- Admin/staff global scope
insert into public.user_scopes(user_id, scope_type, pole)
select p.id, 'global', null
from public.profiles p
where p.role in ('admin', 'staff')
on conflict do nothing;

-- Coach team scope from teams.coach_id
insert into public.user_scopes(user_id, scope_type, team_id)
select distinct t.coach_id, 'team', t.id
from public.teams t
where t.coach_id is not null
on conflict do nothing;

-- 5) Permission helper
create or replace function public.has_permission(
  p_user_id uuid,
  p_module text,
  p_action text,
  p_team_id uuid default null,
  p_pole text default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text;
  v_scope text;
  v_allowed boolean := false;
begin
  if p_user_id is null then
    return false;
  end if;

  select role into v_role
  from public.profiles
  where id = p_user_id and coalesce(is_active, true) = true;

  if v_role is null then
    return false;
  end if;

  -- super wildcard role permission
  if exists (
    select 1 from public.role_permissions rp
    where rp.role = v_role
      and rp.allowed = true
      and ((rp.module = 'all' and rp.action = 'all') or (rp.module = p_module and rp.action = p_action))
  ) then
    select rp.scope into v_scope
    from public.role_permissions rp
    where rp.role = v_role
      and rp.allowed = true
      and ((rp.module = 'all' and rp.action = 'all') or (rp.module = p_module and rp.action = p_action))
    order by case rp.scope when 'global' then 1 when 'pole' then 2 else 3 end
    limit 1;

    if v_scope = 'global' then
      return true;
    end if;

    if v_scope = 'team' then
      return exists (
        select 1
        from public.user_scopes us
        where us.user_id = p_user_id
          and us.scope_type = 'team'
          and us.team_id = p_team_id
      );
    end if;

    if v_scope = 'pole' then
      if p_pole is null then
        return false;
      end if;
      return exists (
        select 1
        from public.user_scopes us
        where us.user_id = p_user_id
          and us.scope_type = 'pole'
          and us.pole = p_pole
      );
    end if;
  end if;

  return v_allowed;
end;
$$;

grant execute on function public.has_permission(uuid, text, text, uuid, text) to authenticated;

-- 6) Pilot policies (additive, no drop): planning_sessions + players
-- PLANNING read/write via has_permission(team)
drop policy if exists "RBAC V1 planning select" on public.planning_sessions;
create policy "RBAC V1 planning select"
  on public.planning_sessions
  for select
  using (
    public.has_permission(auth.uid(), 'planning', 'write', team_id, null)
    or public.has_permission(auth.uid(), 'planning', 'approve', team_id, null)
    or public.has_permission(auth.uid(), 'planning', 'read', team_id, null)
  );

drop policy if exists "RBAC V1 planning write" on public.planning_sessions;
create policy "RBAC V1 planning write"
  on public.planning_sessions
  for all
  using (
    public.has_permission(auth.uid(), 'planning', 'write', team_id, null)
    or public.has_permission(auth.uid(), 'planning', 'approve', team_id, null)
  )
  with check (
    public.has_permission(auth.uid(), 'planning', 'write', team_id, null)
    or public.has_permission(auth.uid(), 'planning', 'approve', team_id, null)
  );

-- PLAYERS read/write via has_permission(team)
drop policy if exists "RBAC V1 players select" on public.players;
create policy "RBAC V1 players select"
  on public.players
  for select
  using (
    public.has_permission(auth.uid(), 'effectif', 'write', team_id, null)
    or public.has_permission(auth.uid(), 'effectif', 'approve', team_id, null)
    or public.has_permission(auth.uid(), 'effectif', 'read', team_id, null)
  );

drop policy if exists "RBAC V1 players write" on public.players;
create policy "RBAC V1 players write"
  on public.players
  for all
  using (
    public.has_permission(auth.uid(), 'effectif', 'write', team_id, null)
    or public.has_permission(auth.uid(), 'effectif', 'approve', team_id, null)
  )
  with check (
    public.has_permission(auth.uid(), 'effectif', 'write', team_id, null)
    or public.has_permission(auth.uid(), 'effectif', 'approve', team_id, null)
  );
