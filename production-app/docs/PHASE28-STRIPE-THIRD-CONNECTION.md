# Third Connection — Stripe Test Mode
After staging host + data/auth exist:
1. Complete Stripe account setup directly with Stripe.
2. Remain in TEST MODE.
3. Create one-time Founding Client product: $595.
4. Store secret key and webhook signing secret only in encrypted staging environment variables.
5. Configure server checkout endpoint and webhook endpoint.
6. Verify signatures server-side.
7. Grant entitlement from authoritative webhook, never success redirect.
8. Replay same event and prove entitlement is not duplicated.
9. Test cancel/fail/refund/dispute.
10. Do not activate live payment until all launch gates pass.
