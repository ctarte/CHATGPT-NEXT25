# Discovered by Design — Pre-Vercel Deployment Gate

Build 26 establishes the integration boundary between the GitHub application and production infrastructure.

## Required before production deployment
- Apply `supabase/migrations/20260929_build22_discovery_records.sql` to the intended Supabase project.
- Confirm Vercel Root Directory is `production-app`.
- Confirm production Supabase public URL and anon/publishable key are present in Vercel.
- Confirm Stripe production variables only when checkout is intentionally enabled.
- Confirm RESEND_API_KEY only when transactional email is intentionally enabled; do not enable EMAIL_FROM until a sending domain is verified.
- Run `npm install` and `npm run build` from `production-app`.
- Test authenticated GET and PUT against `/api/discovery`.
- Test two separate accounts to verify Row Level Security prevents cross-account record access.
- Test signed-out discovery: it must remain usable and must not claim secure cloud saving.
- Test save/resume, Discovery Field movement, Opportunity Brief opening, and Experiment save.
- Verify responsive layouts at phone, tablet, laptop, and large desktop widths.
- Review browser console and server logs for errors without logging Discovery Record contents or secrets.
- Verify all public pages use Discovered by Design language and customer-facing “Conditions to Discard.”
- Do not merge `discovered-by-design-front-end` into `main` until the build and integration checks pass.

## Production boundary
GitHub source code alone does not prove production persistence. A successful Supabase migration, authenticated integration test, and successful Vercel build are required before describing Save & Resume as production-ready.


## Build 28 QA findings
- Corrected Start Discovery compile contracts: recordSummary import and Opportunity Brief property names now match the current data model.
- Removed stale copy that said secure persistence was not connected.
- Hardened /api/discovery with explicit unauthenticated GET behavior, basic record-shape validation, and a 250 KB request-size guard.
- Guarded Field and Experiment pages against unauthenticated API responses.
- Source-level QA is complete; an actual Next.js production build has not been executed by the GitHub connector and remains a deployment-gate requirement.
