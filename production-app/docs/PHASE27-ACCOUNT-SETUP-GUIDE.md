# Phase 27 — Account Setup Guide
This is the first phase where owner-controlled external accounts are required. The repository cannot create or possess them safely on its own.

## Recommended connection order
1. Choose/confirm the production domain. Keep GitHub Pages as public staging/reference until the production app is ready.
2. Create application-hosting project for the `production-app/` directory with separate Preview/Staging and Production settings.
3. Create separate staging and production database/auth/storage projects. Apply migrations in staging first.
4. Create payment-provider test configuration: Founding Client product at $595, hosted Checkout, webhook endpoint, refund/dispute handling. Do not enable live charges yet.
5. Configure transactional email and verify a sending domain. Use controlled test recipients in staging.
6. Configure private Blueprint storage and authenticated/signed download rules.
7. Configure monitoring/alerts and identify who receives customer-support and incident messages.
8. Enter secret values only in provider/hosting encrypted environment settings—not GitHub, HTML, client JavaScript, screenshots, chat, or documentation.
9. Run Phase 26 synthetic Elena Brooks in staging.
10. Convert launch gates to PASS only from test evidence.

## Information the owner will eventually need to choose/provide
- desired NEXT25 domain;
- billing/business identity required by payment provider;
- support email address;
- email sending domain/address;
- payment settlement bank/business information directly inside the payment provider;
- counsel-approved Terms/Privacy/refund/service-scope text.

Do not put bank, tax ID, passwords, API keys or identity-verification documents into the repository.
