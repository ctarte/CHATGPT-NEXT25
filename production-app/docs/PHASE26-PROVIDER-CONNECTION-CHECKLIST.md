# Provider Connection Checklist
No provider is represented as connected by this Phase 26 package.

Before first live customer, supply/configure outside the public repository:
- production/staging hosting account and domain;
- database/auth/storage project;
- payment provider account, product/price IDs and webhook secret;
- transactional email domain/provider;
- support inbox;
- monitoring/error alerting;
- secrets/environment management;
- final legal URLs/versions.

After credentials are configured, run the synthetic customer in STAGING first. Only a fully evidenced pass can convert a Phase 25 launch gate from NOT_CONFIGURED/BLOCKER to PASS.
