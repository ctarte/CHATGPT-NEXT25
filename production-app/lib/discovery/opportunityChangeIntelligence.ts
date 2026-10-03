export type OpportunityChangeSignal=
 "EMERGING_FIELD"|"DECLINING_FIELD"|"AI_TECHNOLOGY"|"DEMOGRAPHICS"|"BUSINESS_MODEL"|"SKILL_SHIFT"|"GEOGRAPHY"|"REGULATION"|"VALUE_MIGRATION";

export type OpportunityIntelligenceQuestion={
 signal:OpportunityChangeSignal;
 question:string;
 searches:(opportunity:string)=>string[];
 challenge:(opportunity:string)=>string;
 whyItMatters:string;
};

export type OpportunityIntelligencePlan={
 opportunity:string;
 generatedAt:string;
 questions:Array<{
  signal:OpportunityChangeSignal;
  question:string;
  searches:string[];
  challengeSearch:string;
  whyItMatters:string;
 }>;
};

const framework:OpportunityIntelligenceQuestion[]=[
 {signal:"EMERGING_FIELD",question:"What adjacent fields, categories, roles or customer needs are gaining momentum?",searches:o=>[o+" emerging adjacent fields growth 2026",o+" new roles new markets demand 2026"],challenge:o=>o+" hype weak demand stalled growth",whyItMatters:"Growth can create openings that do not yet appear in conventional job titles or business categories."},
 {signal:"DECLINING_FIELD",question:"What parts of this field are structurally weakening, commoditizing or losing demand?",searches:o=>[o+" declining demand commoditization layoffs closures 2026",o+" shrinking margins displacement risk"],challenge:o=>o+" durable demand resilience growth",whyItMatters:"An attractive idea can still be a poor destination if the underlying economics or demand are deteriorating."},
 {signal:"AI_TECHNOLOGY",question:"How are AI, automation and new technology changing who creates value and how the work gets done?",searches:o=>[o+" AI automation technology impact 2026",o+" AI new roles productivity disruption"],challenge:o=>o+" resistant to automation human advantage",whyItMatters:"Technology may remove routine work while increasing the value of judgment, trust, domain expertise or new combinations of skills."},
 {signal:"DEMOGRAPHICS",question:"Which demographic changes are creating new needs, shortages or customer populations?",searches:o=>[o+" demographics aging population workforce shortage demand",o+" demographic trends customers 2026"],challenge:o=>o+" demographic headwinds shrinking population demand",whyItMatters:"Aging, longevity, migration and workforce composition can create durable needs that are easy to miss when looking only at today's market."},
 {signal:"BUSINESS_MODEL",question:"Which new business models are changing how this value is packaged, bought or delivered?",searches:o=>[o+" new business models subscription platform fractional marketplace 2026",o+" changing business model pricing delivery"],challenge:o=>o+" business model failure unit economics margin pressure",whyItMatters:"The opportunity may be less about entering a new field than using a better model inside an existing one."},
 {signal:"SKILL_SHIFT",question:"Which skills are becoming more valuable—and which are becoming easier to replace?",searches:o=>[o+" skills in demand 2026 future skills",o+" skill shortage premium skills"],challenge:o=>o+" skills declining obsolete automated",whyItMatters:"This helps connect the customer's existing experience to where scarcity and value may be moving."},
 {signal:"GEOGRAPHY",question:"Where is demand strengthening or weakening geographically, including remote and cross-border markets?",searches:o=>[o+" geographic demand hotspots remote markets 2026",o+" regional growth jobs customers"],challenge:o=>o+" regional decline geographic concentration risk",whyItMatters:"A weak local opportunity can be a strong national or remote opportunity—and the reverse can also be true."},
 {signal:"REGULATION",question:"What regulatory, licensing, reimbursement or policy changes could expand or constrain the opportunity?",searches:o=>[o+" regulation licensing policy changes 2026",o+" regulatory outlook requirements"],challenge:o=>o+" regulatory barriers restrictions compliance costs",whyItMatters:"Regulation can create barriers, protected niches, new demand or hidden costs that materially change attractiveness."},
 {signal:"VALUE_MIGRATION",question:"Where is money, attention or decision-making power moving within this field?",searches:o=>[o+" value chain shifts spending trends buyers budgets 2026",o+" where value is moving industry"],challenge:o=>o+" margin compression budget cuts buyer resistance",whyItMatters:"The most useful question is often not whether a field is growing, but which part of the field is capturing the new value."}
];

export function buildOpportunityIntelligencePlan(opportunity:string,generatedAt=new Date().toISOString()):OpportunityIntelligencePlan{
 return {opportunity,generatedAt,questions:framework.map(q=>({signal:q.signal,question:q.question,searches:q.searches(opportunity),challengeSearch:q.challenge(opportunity),whyItMatters:q.whyItMatters}))};
}

export type OpportunityChangeFinding={
 signal:OpportunityChangeSignal;
 direction:"OPENING"|"MIXED"|"CLOSING"|"UNCLEAR";
 finding:string;
 implicationForCustomer:string;
 evidenceFor:string[];
 evidenceAgainst:string[];
 confidence:"LOW"|"MODERATE"|"HIGH";
};

export function summarizeOpportunityChange(findings:OpportunityChangeFinding[]){
 const opening=findings.filter(f=>f.direction==="OPENING");
 const closing=findings.filter(f=>f.direction==="CLOSING");
 const mixed=findings.filter(f=>f.direction==="MIXED");
 return {
  openings:opening,
  warnings:closing,
  tensions:mixed,
  headline:closing.length>opening.length?"CHANGE MAY BE CLOSING MORE DOORS THAN IT OPENS—REDESIGN BEFORE COMMITTING.":opening.length&&closing.length?"THE FIELD IS CHANGING. THE OPPORTUNITY MAY BE IN A DIFFERENT PART OF IT.":opening.length?"CHANGE MAY BE CREATING AN OPENING WORTH TESTING.":"THE DIRECTION REMAINS INTERESTING, BUT THE CHANGE SIGNALS ARE NOT YET CLEAR."
 };
}
