-- Phase 26 synthetic integration evidence
create table if not exists public.synthetic_runs(
 id uuid primary key default gen_random_uuid(), scenario text not null, environment text not null,
 status text not null, started_at timestamptz not null default now(), completed_at timestamptz,
 evidence jsonb not null default '{}'::jsonb);
alter table public.synthetic_runs enable row level security; revoke all on public.synthetic_runs from anon,authenticated;
create table if not exists public.synthetic_run_steps(
 id uuid primary key default gen_random_uuid(), run_id uuid not null references public.synthetic_runs(id) on delete cascade,
 sequence_no int not null, event_type text not null, status text not null, expected text, actual text,
 created_at timestamptz not null default now(), unique(run_id,sequence_no));
alter table public.synthetic_run_steps enable row level security; revoke all on public.synthetic_run_steps from anon,authenticated;
