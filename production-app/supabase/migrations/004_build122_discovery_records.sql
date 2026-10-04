-- Build 122: current Discovery persistence store.
-- One versioned record per authenticated customer. RLS prevents cross-customer access.
create table if not exists public.discovery_records (
  user_id uuid primary key references auth.users(id) on delete cascade,
  version integer not null default 2 check (version in (1,2)),
  record jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.discovery_records enable row level security;

revoke all on public.discovery_records from anon, authenticated;
grant select, insert, update, delete on public.discovery_records to authenticated;

create policy "discovery_records_select_own"
on public.discovery_records for select to authenticated
using (auth.uid() = user_id);

create policy "discovery_records_insert_own"
on public.discovery_records for insert to authenticated
with check (auth.uid() = user_id);

create policy "discovery_records_update_own"
on public.discovery_records for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "discovery_records_delete_own"
on public.discovery_records for delete to authenticated
using (auth.uid() = user_id);
