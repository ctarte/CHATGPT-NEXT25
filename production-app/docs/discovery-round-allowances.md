# Discovery round allowances — proposed implementation specification

Status: APPROVED DIRECTION FOR DEVELOPMENT; NOT YET ENFORCED OR CUSTOMER-CONTRACTUAL.
Scope: one paying participant per Discovery purchase; Production must remain unchanged pending approval.

## Package design
- Discovery ($595): 3 initial Discovery rounds, plus up to 2 refinement rounds when no direction feels sufficiently suitable.
- Discovery + Opportunity Intelligence ($995): same Discovery round allowance; additional deeper evidence/research and decision support.
- A round is a completed presentation-and-reaction cycle, not a page visit, login, regenerated view, or individual idea.
- Refinement is for improving fit based on explicit rejection, ambivalence, or unresolved constraints; extra unrelated idea browsing is a separate future offering, not an automatic free entitlement.
- No outcome guarantee. Purchased Blueprint and historical Discovery Record remain accessible after allowance is exhausted.
- Additional exploration price, refund/dispute handling, accessibility exceptions and any grandfathering require separate approval.

## Customer experience
1. Display progress as “Discovery round 1 of 3” and, if needed, “Refinement 1 of 2” only after reliable server records exist.
2. On round completion ask whether the participant found a direction, wants refinement, wants unrelated exploration, or is researching for another person.
3. Refinement asks what did not fit, including free text and structured rejection reasons. Show an understandable summary of how that feedback changes the next set.
4. When promising directions exist, route toward the Blueprint; do not penalize customers who remain genuinely uncertain.
5. Unrelated exploration should explain the separate optional offering, without showing a price or payment button until an actual SKU and checkout entitlement exist.
6. Another person's Discovery requires their own participation and entitlement; never encourage entering their private data without permission.

## Required server enforcement
- Bind purchases to authenticated customer ID, plan, purchase ID, and one participant-specific discovery ID.
- Track completed rounds in database transactionally, with idempotent server-side completion events and audit timestamps.
- Distinguish initial and refinement round counters, eligibility, and completion; do not count retries, refreshes or errors.
- Validate ownership and remaining allowance on server for every new round and every costly research request. Client-side hiding alone is insufficient.
- Persist round results, reaction reasons, prior suggestions, retained directions, and the refinement goal before incrementing usage.
- Avoid repeating rejected directions unless the customer expressly reopens them; detect near-duplicate suggestions and require meaningful novelty.
- Preserve completed records/Blueprint after limits. Keep $995 Opportunity Intelligence research entitlement separate from Discovery rounds.
- Implement support/admin exceptions as audited grants, not silent client-side resets.
- Test signed-out users, two tabs/race conditions, webhook retries, canceled payments, restored sessions, and access across devices.

## Release gates
1. Define exact completion semantics and persistence schema.
2. Implement server-side entitlement and atomic counters.
3. Verify actual refinement diversity with fictional personas, including rejecting every initial idea.
4. Test purchased and unpaid journeys and confirm Stripe/Supabase access controls.
5. Review customer-facing terms/pricing wording for consistency.
6. Deploy to Preview, validate, and promote to Production only after explicit approval.
