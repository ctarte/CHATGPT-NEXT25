# Development customer-journey acceptance review

**Scope:** `work/checkout-entitlements-blueprint-review` only. Do not modify Production, production data, or customer entitlements.

## Release rule
A Vercel READY build is necessary but **not sufficient**. Do not invite the customer to review until the checks below have evidence (test date, preview commit/URL, viewport, steps, expected/actual results, screenshots where appropriate). Mark untested items **NOT VERIFIED**, never PASS.

## Customer journey and editorial standards
- [ ] Homepage: value proposition, primary CTA, sign-in, navigation, mobile and desktop text legible.
- [ ] Pricing: $595 Discovery and $995 Discovery + Opportunity Intelligence clearly differentiated; no accidental access grants.
- [ ] Discovery introduction: explain where the visitor is, what to do, and what comes next; one primary CTA.
- [ ] Sections 01–07: all content visible and legible; every section has concise instructions, a clear next step, and usable back navigation.
- [ ] Expandable content: opens and closes, keyboard accessible, no permanently highlighted closed controls; preserves the meaningful long-form copy.
- [ ] Discovery Portrait/Map: editable findings and wild-card corrections; edits persist as intended.
- [ ] Think Tank Reveal: clear response location; reactions can be changed; no mandatory-looking optional research questions.
- [ ] Refinement rounds: three initial rounds and up to two refinements, with clear progress and no confusing loops.
- [ ] Blueprint: preview versus entitled full Blueprint clearly explained; customer can reach the correct destination without unnecessary detours.
- [ ] Dashboard: save/resume, current progress, return navigation, and Blueprint link function correctly.
- [ ] Auth/checkout: sign-in-before-checkout, Stripe test checkout, webhook-based entitlement, no access solely from a checkout return URL.
- [ ] Mobile, tablet, desktop: check clipping, contrast, font size, sticky elements, touch targets, scroll position, and focus visibility.
- [ ] Editorial audit: remove duplicated instructions and repeated claims; move useful explanations into optional disclosures rather than deleting approved copy.

## Test evidence log
| Area | Status | Evidence / issue |
|---|---|---|
| Vercel build | NOT VERIFIED for newest changes | Record current commit and READY deployment |
| Homepage / pricing | NOT VERIFIED | |
| Discovery 01–07 | NOT VERIFIED | |
| Navigation / dropdowns / reactions | NOT VERIFIED | |
| Blueprint / dashboard | NOT VERIFIED | |
| Authentication / checkout / entitlement | NOT VERIFIED | |
| Mobile / tablet / desktop | NOT VERIFIED | |

## Guardrails
Use isolated test identities and Stripe test mode only when the environment is proven safe. The preview may share Production database configuration; do not create, edit, or delete real customer records or perform migrations. If safe end-to-end testing cannot be established, document the blocker and withhold the review-ready announcement.
