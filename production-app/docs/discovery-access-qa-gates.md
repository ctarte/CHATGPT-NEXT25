# Discovery purchase-access and round-enforcement verification plan

Status: DEVELOPMENT ONLY. No live entitlement or round-limit test has passed. Production changes are prohibited without explicit approval.

## Verified code-level observations (2026-10-12)
- `app/api/discovery/access/route.ts` reads paid purchase entitlements for the signed-in user and deliberately returns `canStartAdditionalRound: false`, `roundAllowanceStatus: not_yet_enforced`.
- `app/api/discovery/route.ts` currently accepts a client-provided `round` in PUT and does not authorize round progression against purchase entitlements or atomic counters.
- `lib/discovery/persistence.ts` upserts a single JSON discovery record per authenticated user; it does not implement per-purchase counters or idempotent completion events.
- The Preview deployment is READY and aliased to preview.mynextniche.com. Automated HTTP access receives Vercel authentication 401; READY is not a passed endpoint test.
- Preview shares Production database credentials; do not write test entitlements or run destructive migrations against that database.

## Release-blocking tests
| ID | Scenario | Required outcome |
|---|---|---|
| A1 | Signed-out GET /api/discovery/access | 401, no entitlement |
| A2 | Signed-in customer without paid purchase | No paid Discovery or Intelligence access |
| A3 | Paid $595 purchase verified via Stripe | Discovery only; participant and purchase bound |
| A4 | Paid $995 purchase verified via Stripe | Discovery plus Opportunity Intelligence |
| A5 | Checkout canceled, pending, refunded or disputed | Access governed by documented payment policy, never a success redirect alone |
| R1 | First three completed Discovery rounds | Exactly three unique server-recorded completion events |
| R2 | Two permitted refinement rounds | Exactly two unique server-recorded refinement events when eligible |
| R3 | Sixth round, forged round count or changed user ID | Server rejects advancement |
| R4 | Refresh, duplicate request, two tabs or webhook replay | Idempotent: no extra round consumed |
| R5 | Customer revisits completed Blueprint | Historical content remains accessible |
| P1 | User enters interest in AI and rejects irrelevant ideas | New round explicitly incorporates AI and exclusions; no repeated rejected ideas |
| P2 | No acceptable ideas after initial rounds | Genuine refinement path, clear limits, no unsupported guarantee |
| S1 | Preview isolation | No writes to real customer records, purchase entitlements or Production schema |

## Implementation order
1. Obtain an authenticated, isolated Preview testing path without disabling deployment security.
2. Design migration for participant-bound round completion ledger and entitlement grants, **commit only** to development branch. Do not apply to shared Production Supabase.
3. Implement atomic/idempotent server-side completion with user ownership checks and no client-controlled allowance.
4. Wire client progression to server authorization and personalized free-text feedback.
5. Run unit/integration tests using isolated fake data; then approved staging end-to-end tests.
6. Verify Stripe entitlement handling and customer-facing package language.
7. Seek explicit approval before any Production deployment.

## Open questions requiring product approval
- Whether a refunded/disputed purchase revokes access to already-created Blueprint.
- Whether employer-sponsored participants receive the same round allowance.
- Whether existing preview test accounts receive grandfathered access for QA.
