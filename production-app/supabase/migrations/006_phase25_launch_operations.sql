-- Phase 25 production operations. Review/test before deployment.
create table if not exists public.lifecycle_events(
 id uuid primary key default gen_random_uuid(), customer_id uuid not null references public.customers(id) on delete cascade,
 order_id uuid, blueprint_id uuid, event_type text not null, idempotency_key text unique,
 metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now());
alter table public.lifecycle_events enable row level security; revoke all on public.lifecycle_events from anon,authenticated;

create table if not exists public.launch_gate_checks(
 id uuid primary key default gen_random_uuid(), gate_id text not null, status text not null, checked_by uuid,
 evidence text, checked_at timestamptz not null default now());
alter table public.launch_gate_checks enable row level security; revoke all on public.launch_gate_checks from anon,authenticated;

create table if not exists public.incidents(
 id uuid primary key default gen_random_uuid(), severity text not null, incident_type text not null,
 customer_id uuid, order_id uuid, blueprint_id uuid, status text not null default 'open',
 summary text not null, opened_by uuid, opened_at timestamptz not null default now(), resolved_at timestamptz);
alter table public.incidents enable row level security; revoke all on public.incidents from anon,authenticated;

create table if not exists public.followup_events(
 id uuid primary key default gen_random_uuid(), customer_id uuid not null references public.customers(id) on delete cascade,
 blueprint_id uuid references public.blueprints(id) on delete cascade, cadence_day int not null check(cadence_day in (30,60,90)),
 status text not null default 'scheduled', due_at timestamptz not null, completed_at timestamptz, feedback jsonb);
alter table public.followup_events enable row level security; revoke all on public.followup_events from anon,authenticated;
-- Operations tables are staff/server only unless a separate narrowly scoped customer policy is deliberately added.
