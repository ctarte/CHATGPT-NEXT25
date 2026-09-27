# Phase 25 — Founding Client Launch Runbook
## Launch rule
Do not accept a real customer's $595 payment until every mandatory gate is PASS. Static pages, prototype redirects and localStorage are not production controls.

## Pre-launch
1. Finalize service scope, Terms, Privacy, refund/cancellation language and support contact.
2. Configure production domain/app, secrets manager and separate staging/production environments.
3. Configure hosted payment product/price; verify signed webhook events and idempotency.
4. Configure customer auth and staff roles.
5. Apply database migrations and RLS; run two-customer isolation tests.
6. Connect secure assessment persistence/save-resume.
7. Connect private pipeline, research tasks and Intelligence Studio.
8. Implement server PDF renderer/private storage/authorized download.
9. Test consent versions, export, deletion, backup/restore, monitoring and incidents.
10. Run an end-to-end synthetic purchase twice: success path and failure/refund path.

## First customer
Payment verified -> entitlement -> welcome -> intake -> freeze -> intelligence -> research -> draft -> QA -> approve -> render -> release -> follow-up.

## Daily pilot operations
Review payment exceptions; stuck customer stages; open research tasks; QA queue; delivery failures; support inbox; incidents. Do not use email to move raw assessment data or private Blueprint files.

## After each Blueprint
Record production time, research time, revision count, customer questions, experiment selected, confusing sections and missing information. Improve the process before automating around a bad assumption.

## Cohort close
Review the 5–10 cases together. Identify repeated friction, repeated research, low-value report sections, highest-value insights, support burden and real turnaround time before setting a public SLA or scaling acquisition.
