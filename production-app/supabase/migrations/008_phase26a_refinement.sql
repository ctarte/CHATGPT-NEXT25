-- Phase 26A Possibility Refinement Loop
create table if not exists public.possibility_reactions(
 id uuid primary key default gen_random_uuid(), customer_id uuid not null references public.customers(id) on delete cascade,
 blueprint_id uuid not null references public.blueprints(id) on delete cascade, possibility_key text not null,
 reaction text not null, why text, attractive_parts jsonb not null default '[]'::jsonb,
 customer_idea text, customer_confirmed boolean not null default false, created_at timestamptz not null default now());
alter table public.possibility_reactions enable row level security;

create table if not exists public.refinement_runs(
 id uuid primary key default gen_random_uuid(), customer_id uuid not null references public.customers(id) on delete cascade,
 blueprint_id uuid not null references public.blueprints(id) on delete cascade, exploration_mode text not null,
 input_version text not null, output_version text, status text not null default 'created',
 reason_codes jsonb not null default '[]'::jsonb, created_at timestamptz not null default now(), completed_at timestamptz);
alter table public.refinement_runs enable row level security;
-- Production: add narrowly scoped customer ownership policies for reaction INSERT/SELECT.
-- Refinement runs remain server/reviewer controlled; do not expose proprietary weights.
