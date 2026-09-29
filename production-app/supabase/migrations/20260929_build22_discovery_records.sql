-- Build 22: secure per-customer discovery persistence
create table if not exists public.discovery_records (
 user_id uuid primary key references auth.users(id) on delete cascade,
 version integer not null default 1,
 record jsonb not null default '{}'::jsonb,
 updated_at timestamptz not null default now(),
 created_at timestamptz not null default now()
);
alter table public.discovery_records enable row level security;
create policy "customers read own discovery" on public.discovery_records for select using (auth.uid() = user_id);
create policy "customers insert own discovery" on public.discovery_records for insert with check (auth.uid() = user_id);
create policy "customers update own discovery" on public.discovery_records for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "customers delete own discovery" on public.discovery_records for delete using (auth.uid() = user_id);
create index if not exists discovery_records_updated_at_idx on public.discovery_records(updated_at desc);
