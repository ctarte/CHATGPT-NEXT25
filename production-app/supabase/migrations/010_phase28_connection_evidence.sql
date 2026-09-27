create table if not exists public.connection_evidence(
 id uuid primary key default gen_random_uuid(), capability text not null, environment text not null,
 state text not null, proof jsonb not null default '[]'::jsonb, checked_at timestamptz not null default now(),
 checked_by uuid, notes text);
alter table public.connection_evidence enable row level security;
revoke all on public.connection_evidence from anon,authenticated;
-- staff/server only; never store secret values in proof or notes.
