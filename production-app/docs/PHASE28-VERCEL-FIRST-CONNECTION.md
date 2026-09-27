# First Connection — Vercel
1. Sign in to Vercel and choose Add New > Project.
2. Import `ctarte/CHATGPT-NEXT25`.
3. Set Root Directory to `production-app`.
4. Confirm Next.js is detected.
5. Do not add live payment/database/email secrets yet.
6. Deploy.
7. Open the generated staging URL and `/api/health`.
8. If build fails, capture the build error but redact any secret values.
9. Once the staging runtime works, the next connection is Supabase staging.

Expected Phase 27/28 health response is a scaffold response; that is acceptable at this step. The goal is proving the server-side Next.js runtime exists.
