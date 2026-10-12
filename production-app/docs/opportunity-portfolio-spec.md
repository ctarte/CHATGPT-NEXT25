# Opportunity Portfolio — approved product direction

Status: PRODUCT DIRECTION APPROVED; NOT YET IMPLEMENTED. Development branch only. Production unchanged.

## Customer promise
Do not discard credible, distinct opportunities because a presentation or round quota was reached. Equally, do not overwhelm customers with an unfiltered idea dump. The system considers as many plausible directions as warranted, prioritizes the most relevant, and preserves the rest in a personal Opportunity Portfolio.

## Discovery presentation targets, not hard ceilings
- Internal candidate pool: approximately 20–50+ when supported by real evidence and diverse hypotheses. Quality and distinctness matter more than count.
- Customer-facing Discovery field: approximately 9–15 credible, differentiated directions over initial rounds, flexing up or down for the person.
- Blueprint shortlist: approximately 3–5 strongest directions, with reasons and tradeoffs.
- Deep research: approximately 1–3 selected directions for the Opportunity Intelligence tier.
- No promise of any fixed minimum number of credible matches. Do not fabricate weak ideas to hit a target.

## Opportunity Portfolio categories
1. Strongest Matches — fit supported by stated interests, capabilities, resources, constraints and reactions.
2. Emerging Opportunities — plausible directions needing learning, experiments, or additional validation.
3. Opportunity Reserve — other credible distinct ideas preserved for later consideration.

Preserve every candidate's unique ID, readable title, rationale, confidence/evidence limits, category, first-seen round, customer reaction, rejection reasons, and revision history. Keep rejected ideas accessible but do not repeatedly suggest them as new matches without an explicit customer request. Do not equate generated idea count with discovery round consumption.

## Package consistency
- Both $595 Discovery and $995 Discovery + Opportunity Intelligence include the same personalized Discovery process, Opportunity Portfolio, and shortlist.
- Premium differentiation is additional outward-looking evidence and deeper research, not withholding promising ideas from Discovery customers.
- Three initial Discovery rounds and up to two qualifying refinement rounds remain the proposed allowance. A round is a meaningful presentation-and-reaction cycle, not a fixed number of recommendations or a page visit.
- The Portfolio and historical Blueprint remain accessible after round allowance is exhausted; new research/rounds require authorization.

## Implementation considerations
- Store candidate opportunities separately from round counters with stable IDs, provenance, and user ownership; distinguish candidate generation from presentation and from completion.
- Use deduplication and semantic near-duplicate checks; avoid recycling rejected ideas.
- Rank by customer fit and constraints, with transparent reasons and uncertainty; allow customers to revisit Reserve ideas.
- Persist and use free-text feedback (e.g. an interest in AI) to guide subsequent generation, not merely display it.
- Avoid revealing one participant's personal Discovery to an employer or another customer.
- Test personas with few, many, and no good matches; verify no forced quotas, loss of promising ideas, or unwarranted claims of market evidence.

## Release gate
Before claiming the Portfolio exists, demonstrate persistent categorization, retrieval across devices, and accurate Blueprint display using isolated test accounts. Obtain explicit approval before Production promotion.
