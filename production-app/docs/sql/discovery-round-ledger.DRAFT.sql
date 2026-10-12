-- DEVELOPMENT-ONLY DRAFT. Do NOT apply to the shared Production Supabase database.
-- Requires isolated staging review, RLS review, and explicit migration approval.
-- Round ledger for a single paid participant and a single qualifying purchase.
-- A purchase must be resolved and verified server-side; never trust a browser-supplied purchase ID.

begin;

create table if not exists public.discovery_participations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  purchase_entitlement_id uuid not null references public.purchase_entitlements(id),
  initial_round_limit integer not null default 3 check (initial_round_limit between 0 and 100),
  refinement_round_limit integer not null default 2 check (refinement_round_limit between 0 and 100),
  initial_rounds_completed integer not null default 0 check (initial_rounds_completed >= 0),
  refinement_rounds_completed integer not null default 0 check (refinement_rounds_completed >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, purchase_entitlement_id),
  check (initial_rounds_completed <= initial_round_limit),
  check (refinement_rounds_completed <= refinement_round_limit)
);

create table if not exists public.discovery_round_completions (
  id uuid primary key default gen_random_uuid(),
  participation_id uuid not null references public.discovery_participations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  request_key uuid not null,
  round_kind text not null check (round_kind in ('initial','refinement')),
  ordinal integer not null check (ordinal > 0),
  -- Evidence is a server-validated immutable snapshot, not a client-supplied counter.
  reaction_snapshot jsonb not null,
  feedback_snapshot jsonb not null default '{}'::jsonb,
  completed_at timestamptz not null default now(),
  unique (participation_id, request_key),
  unique (participation_id, round_kind, ordinal)
);

create index if not exists discovery_participations_user_idx
  on public.discovery_participations(user_id);
create index if not exists discovery_round_completions_user_idx
  on public.discovery_round_completions(user_id);

alter table public.discovery_participations enable row level security;
alter table public.discovery_round_completions enable row level security;

-- Read-only participant policies. No client INSERT/UPDATE/DELETE policies:
-- completion must occur in a reviewed server-side transaction.
create policy discovery_participations_select_own
 on public.discovery_participations for select to authenticated
 using (user_id = (select auth.uid()));

create policy discovery_round_completions_select_own
 on public.discovery_round_completions for select to authenticated
 using (user_id = (select auth.uid()));

commit;

-- REQUIRED BEFORE APPLICATION:
-- 1. Verify purchase_entitlements.id is uuid (not bigint/text) and unique purchase semantics.
-- 2. Implement a reviewed SECURITY DEFINER RPC or trusted transactional service with
--    locked participation row, verified paid entitlement, ownership, and idempotent request key.
-- 3. Enforce initial completion before eligible refinement, and validate real reaction content.
-- 4. Prevent a client from forging user_id, participation_id, round_kind, or ordinal.
-- 5. Decide how canceled/refunded/disputed payments and additional purchases are handled.
-- 6. Test race conditions, retries, read-only RLS, migration rollback, and staging isolation.
-- 7. Never run this draft on Production without explicit approval.
