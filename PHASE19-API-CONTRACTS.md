# NEXT25 Pilot API Contracts — Design Scaffold
Not live endpoints in this static package.

POST /api/checkout/session
Server resolves fixed server-side product price; never trusts browser amount. Returns hosted checkout URL.

POST /api/webhooks/stripe
Verify provider signature; deduplicate event; update order; verified paid event creates entitlement and queues welcome. Do not unnecessarily log full payload.

GET /api/me
Auth required. Return minimum customer DTO: display identity, entitlement, assessment status, Blueprint status.

PUT /api/assessments/:id/responses
Auth required; owner only; validate question/response and save versioned response.

POST /api/assessments/:id/complete
Auth required; owner only; validate completeness and freeze submitted version.

POST /api/internal/match/:assessmentId
Staff/server only. Run private signal + matching pipeline; store versioned reason codes.

POST /api/internal/opportunity-brief/:matchRunId/:possibilityId
Staff/server only. Current factual claims require source/date metadata.

POST /api/internal/blueprints/:assessmentId/generate
Staff/server only. Generate draft; status = needs_review.

POST /api/internal/blueprints/:id/approve
Reviewer only; requires QA checklist; creates private deliverable.

GET /api/blueprints/:id/download
Auth required; owner only; short-lived signed access or authorized stream.

POST /api/privacy/export
Auth required; controlled export request.

POST /api/privacy/delete
Auth required; re-authentication recommended; follow defined retention policy.
