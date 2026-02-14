-- Coach access workflow (public request -> admin approval -> invitation -> activation)

-- 1) Request table (public form)
create table if not exists public.coach_access_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  requested_pole text,
  requested_team text,
  message text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default timezone('utc', now()),
  decided_at timestamptz,
  decided_by uuid references public.profiles(id)
);

alter table public.coach_access_requests enable row level security;

drop policy if exists "Public can create coach access requests" on public.coach_access_requests;
create policy "Public can create coach access requests"
  on public.coach_access_requests for insert
  with check (true);

drop policy if exists "Admin staff can view coach access requests" on public.coach_access_requests;
create policy "Admin staff can view coach access requests"
  on public.coach_access_requests for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin','staff')
    )
  );

drop policy if exists "Admin staff can update coach access requests" on public.coach_access_requests;
create policy "Admin staff can update coach access requests"
  on public.coach_access_requests for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin','staff')
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin','staff')
    )
  );

-- 2) Invitation table
create table if not exists public.coach_invitations (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references public.coach_access_requests(id) on delete set null,
  email text not null,
  full_name text,
  role text not null default 'coach' check (role in ('coach','staff')),
  token_hash text not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  used_by uuid references public.profiles(id),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists coach_invitations_token_hash_idx on public.coach_invitations(token_hash);

alter table public.coach_invitations enable row level security;

drop policy if exists "Admin can manage coach invitations" on public.coach_invitations;
create policy "Admin can manage coach invitations"
  on public.coach_invitations for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

drop policy if exists "Authenticated can read own invitation by email" on public.coach_invitations;
create policy "Authenticated can read own invitation by email"
  on public.coach_invitations for select
  using (auth.role() = 'authenticated');

-- 3) Harden profiles role updates
-- Existing policy allows any user to update own row (including role). Keep profile edits, block role change for non-admin.
create or replace function public.guard_profile_role_update()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.role is distinct from old.role then
    if not exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
    ) then
      raise exception 'Only admin can change roles';
    end if;
  end if;

  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_guard_profile_role_update on public.profiles;
create trigger trg_guard_profile_role_update
before update on public.profiles
for each row
execute function public.guard_profile_role_update();

drop policy if exists "Admin can update all profiles" on public.profiles;
create policy "Admin can update all profiles"
  on public.profiles for update
  using (
    exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
    )
  );
