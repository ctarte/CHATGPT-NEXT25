# Staging Go-Live Test
A staging environment is considered integrated only when:
- application deploys from `production-app`;
- auth works for customer and staff roles;
- database/RLS isolation passes;
- test Checkout -> signed webhook -> entitlement works exactly once;
- email welcome is delivered to an approved test recipient;
- assessment saves/resumes/freezes;
- Phase 26A refinement reactions persist/version correctly;
- private intelligence pipeline runs;
- reviewer can approve exact Blueprint version;
- PDF renders to private storage and only correct fictional customer can download;
- refund/revoke path works;
- export/deletion works;
- backup/restore drill works;
- monitoring catches an intentionally generated failure.

This is evidence required before any production/live-payment go-live.
