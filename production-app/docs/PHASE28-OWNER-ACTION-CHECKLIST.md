# Owner Action Checklist
## 1 — Hosting
- Create/import the GitHub repo in Vercel (or equivalent).
- Root Directory: `production-app`.
- Framework: Next.js.
- Deploy staging/preview.
- Do not paste secret keys into GitHub.
- Record public staging URL.

## 2 — Data/Auth/Storage
- Create separate Supabase staging project.
- Apply migrations in order.
- Configure customer authentication and staff authorization.
- Create private Blueprint storage bucket.
- Run two-fictional-customer isolation test.

## 3 — Payments
- Create/configure Stripe account directly with Stripe.
- Use TEST MODE.
- Create Founding Client one-time product at $595.
- Add webhook endpoint only after staging host exists.
- Test signed webhook/idempotency before live mode.

## 4 — Email
- Create Resend account or equivalent.
- Verify domain/sender.
- Use controlled test recipients in staging.

## 5 — Monitoring
- Configure error and failure alerts.
- Test an intentional staging failure.

## 6 — Domain
- Choose/acquire NEXT25 domain.
- Connect only after staging synthetic run passes.

### Never send or commit
Passwords, API secret keys, webhook secrets, service-role keys, database passwords, bank information, identity documents or recovery codes.
