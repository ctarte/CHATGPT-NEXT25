-- Phase 27: environment/integration audit evidence
create table if not exists public.integration_checks(
 id uuid primary key default gen_random_uuid(), environment text not null, capability text not null,
 status text not null, checked_at timestamptz not null default now(), checked_by uuid,
 evidence jsonb not null default '{}'::jsonb);
alter table public.integration_checks enable row level security;
revoke all on public.integration_checks from anon,authenticated;
-- Staff/server-only. Never store provider secrets in evidence.
