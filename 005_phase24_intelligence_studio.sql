-- Phase 24 private operating workspace. Review/test before production.
create table if not exists public.research_tasks(
 id uuid primary key default gen_random_uuid(), pipeline_run_id uuid not null references public.pipeline_runs(id) on delete cascade,
 opportunity_brief_id uuid, requested_by uuid, claim text not null, jurisdiction text, evidence_need text not null,
 status text not null default 'open', result jsonb, created_at timestamptz not null default now(), completed_at timestamptz);
alter table public.research_tasks enable row level security; revoke all on public.research_tasks from anon,authenticated;

create table if not exists public.studio_notes(
 id uuid primary key default gen_random_uuid(), customer_id uuid not null references public.customers(id) on delete cascade,
 blueprint_id uuid references public.blueprints(id) on delete cascade, author_id uuid, note_type text not null,
 body text not null, created_at timestamptz not null default now());
alter table public.studio_notes enable row level security; revoke all on public.studio_notes from anon,authenticated;

create table if not exists public.release_events(
 id uuid primary key default gen_random_uuid(), blueprint_id uuid not null references public.blueprints(id) on delete cascade,
 report_version_id uuid, released_by uuid, entitlement_verified boolean not null, consent_verified boolean not null,
 released_at timestamptz not null default now());
alter table public.release_events enable row level security; revoke all on public.release_events from anon,authenticated;
-- Staff authorization belongs in server-side role claims/policies; never expose studio tables to customer roles.
