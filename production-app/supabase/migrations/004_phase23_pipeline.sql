-- Phase 23 pipeline orchestration. Review and RLS-test before production.
create table if not exists public.pipeline_runs(
 id uuid primary key default gen_random_uuid(), customer_id uuid not null references public.customers(id) on delete cascade,
 assessment_id uuid not null references public.assessments(id) on delete cascade, stage text not null,
 assessment_version text not null, signal_version text not null, workstyle_version text not null,
 matcher_version text not null, research_version text not null, blueprint_template_version text not null,
 blockers jsonb not null default '[]'::jsonb, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
alter table public.pipeline_runs enable row level security;
revoke all on public.pipeline_runs from anon,authenticated;

create table if not exists public.pipeline_artifacts(
 id uuid primary key default gen_random_uuid(), run_id uuid not null references public.pipeline_runs(id) on delete cascade,
 artifact_type text not null, version text not null, payload jsonb not null, checksum text not null, created_at timestamptz not null default now());
alter table public.pipeline_artifacts enable row level security;
revoke all on public.pipeline_artifacts from anon,authenticated;

create table if not exists public.qa_reviews(
 id uuid primary key default gen_random_uuid(), blueprint_id uuid not null references public.blueprints(id) on delete cascade,
 reviewer_id uuid, rubric_version text not null, findings jsonb not null, decision text not null,
 notes text, created_at timestamptz not null default now());
alter table public.qa_reviews enable row level security;
revoke all on public.qa_reviews from anon,authenticated;
-- Access should be server/reviewer only. Customers receive approved Blueprint/report objects through their existing ownership policies.
