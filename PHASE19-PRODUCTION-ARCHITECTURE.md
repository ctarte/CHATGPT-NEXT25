# NEXT25 Phase 19 — Production Architecture
## Recommended pilot stack
- Next.js deployed to Vercel.
- Supabase Auth + Postgres + Row Level Security + private Storage.
- Stripe-hosted Checkout for the one-time $595 Founding Client price.
- Resend for transactional email from a verified NEXT25 domain.

Public GitHub Pages may remain staging/reference during migration; paid-customer flows move to the protected production application.

## Payment state machine
created -> checkout_started -> paid -> entitlement_granted
Exceptions: cancelled | failed | refunded | disputed | revoked
Success URL is UX only. Entitlement is granted only after server-side payment-event verification.

## Security rules
1. No raw card data touches NEXT25.
2. No service/database/payment secrets in browser bundles or Git.
3. RLS enabled and explicitly tested on every customer-facing table.
4. Staff/admin access separate from customer authorization.
5. Proprietary signal/matching weights and Blueprint generation stay private/server-side.
6. Private documents use non-public storage and controlled access.
7. Log identifiers/state changes, not unnecessary assessment prose.
8. Version consent, assessment, signal engine, matcher and Blueprint template.
9. Test backup/recovery, export/deletion, refund/revoke and lost-access before launch.

## Core data model
profiles; customers; orders; entitlements; consents; assessments; responses; signal_runs; match_runs; opportunity_briefs; blueprints; experiments; audit_events.

## Pilot rule
First cohort does not receive a fully automated Blueprint without human review.
