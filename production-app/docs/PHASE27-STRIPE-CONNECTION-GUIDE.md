# Hosted Payment Connection Guide
Recommended pattern: hosted Checkout.

Test mode first:
- Create Founding Client product and $595 one-time test price.
- Server creates Checkout session.
- Customer is redirected to hosted provider checkout.
- Success/cancel URLs are user experience only.
- Signed webhook is the authoritative payment event.
- Store provider event ID/idempotency key.
- Grant entitlement exactly once after verified payment.
- Test duplicate events, failed payment, cancellation, refund and dispute.
- Reconcile provider state for exceptions.

Only after all staging tests and legal/commercial gates pass should live payment keys/price IDs be configured. Payment/bank/business verification data belongs directly in the provider account, not NEXT25 source code.
