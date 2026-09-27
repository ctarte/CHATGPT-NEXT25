# Phase 26 — Production Integration & First Synthetic Customer™
Phase 26 creates a deterministic end-to-end rehearsal using fictional Elena Brooks.

Important distinction: this package does NOT claim Stripe, Supabase, email, private storage or a production host are connected. It creates the integration contracts, fixtures, test sequence and evidence model needed to connect them safely.

Target production/staging stack remains:
- Next.js application
- managed authentication + Postgres/RLS/private storage
- hosted PCI checkout + signed webhooks
- transactional email
- server-side Blueprint/PDF pipeline
- monitoring/secrets manager

Connection order:
1 staging hosting + environment separation;
2 database migrations/RLS + staff/customer auth;
3 hosted test checkout + signed webhook/idempotency;
4 entitlement + welcome email;
5 authenticated assessment save/resume/freeze;
6 server-side signals/matching/research orchestration;
7 Intelligence Studio QA;
8 approved-version PDF render/private storage;
9 authorized customer download;
10 30/60/90 follow-up;
11 failure/refund/deletion/restore drills.

Do not place live provider secrets in GitHub or browser code.
