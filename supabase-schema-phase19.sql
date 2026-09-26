-- NEXT25 Phase 19 RLS scaffold; review/test before production.
create table if not exists public.customers (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 status text not null default 'prospect',
 created_at timestamptz not null default now(),
 unique(user_id)
);
alter table public.customers enable row level security;
revoke all on public.customers from anon, authenticated;
grant select on public.customers to authenticated;
create policy customers_select_own on public.customers for select to authenticated
 using (auth.uid() is not null and auth.uid() = user_id);

create table if not exists public.assessments (
 id uuid primary key default gen_random_uuid(),
 customer_id uuid not null references public.customers(id) on delete cascade,
 assessment_version text not null,
 status text not null default 'in_progress',
 started_at timestamptz not null default now(),
 completed_at timestamptz
);
alter table public.assessments enable row level security;
revoke all on public.assessments from anon, authenticated;
grant select, insert, update on public.assessments to authenticated;
create policy assessments_select_own on public.assessments for select to authenticated using (
 exists(select 1 from public.customers c where c.id=customer_id and c.user_id=auth.uid())
);
create policy assessments_insert_own on public.assessments for insert to authenticated with check (
 exists(select 1 from public.customers c where c.id=customer_id and c.user_id=auth.uid())
);
create policy assessments_update_own on public.assessments for update to authenticated using (
 exists(select 1 from public.customers c where c.id=customer_id and c.user_id=auth.uid())
) with check (
 exists(select 1 from public.customers c where c.id=customer_id and c.user_id=auth.uid())
);

create table if not exists public.responses (
 id uuid primary key default gen_random_uuid(),
 assessment_id uuid not null references public.assessments(id) on delete cascade,
 question_id text not null,
 value jsonb not null,
 updated_at timestamptz not null default now(),
 unique(assessment_id,question_id)
);
alter table public.responses enable row level security;
revoke all on public.responses from anon, authenticated;
grant select, insert, update on public.responses to authenticated;
create policy responses_select_own on public.responses for select to authenticated using (
 exists(select 1 from public.assessments a join public.customers c on c.id=a.customer_id where a.id=assessment_id and c.user_id=auth.uid())
);
create policy responses_insert_own on public.responses for insert to authenticated with check (
 exists(select 1 from public.assessments a join public.customers c on c.id=a.customer_id where a.id=assessment_id and c.user_id=auth.uid())
);
create policy responses_update_own on public.responses for update to authenticated using (
 exists(select 1 from public.assessments a join public.customers c on c.id=a.customer_id where a.id=assessment_id and c.user_id=auth.uid())
) with check (
 exists(select 1 from public.assessments a join public.customers c on c.id=a.customer_id where a.id=assessment_id and c.user_id=auth.uid())
);
-- Add orders, entitlements, consents, private engine runs, Blueprints and audit events in reviewed migrations.
