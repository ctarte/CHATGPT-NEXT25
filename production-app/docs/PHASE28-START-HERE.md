# Phase 28 — Start Here
This phase is deliberately different. The code package prepares the connection workflow, but the next progress depends on owner-controlled external accounts.

## First action: hosting
Create a managed Next.js hosting project (recommended: Vercel) from the existing GitHub repository and set the Root Directory to `production-app`.

Do not add production secrets yet. First establish a staging/preview deployment and return only the public staging URL and any non-secret build error.

After hosting works, proceed to staging database/auth/private storage, then payments, email, monitoring and finally production domain.

You do not need to make all accounts at once. Complete them in sequence so each connection can be tested before the next dependency is added.
