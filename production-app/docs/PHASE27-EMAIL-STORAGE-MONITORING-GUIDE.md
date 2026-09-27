# Email, Private Delivery & Monitoring
Email:
- verify sending domain;
- configure purchase, welcome, clarification, Blueprint-ready and 30/60/90 templates;
- do not attach private Blueprints to ordinary email;
- email should direct authenticated customer to portal.

Private PDF:
- render exact approved version server-side;
- store in private bucket;
- record checksum/version/owner;
- authorize every download;
- use short-lived signed delivery where appropriate.

Monitoring:
- alert on payment webhook failures, entitlement failures, pipeline blockers, PDF render failures and delivery failures;
- keep logs minimal—IDs, status and technical context rather than assessment narrative;
- define incident owner and support escalation.
