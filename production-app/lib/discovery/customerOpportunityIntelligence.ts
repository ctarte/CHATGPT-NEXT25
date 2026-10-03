import type {DiscoveryRecord} from "./record";
import type {OpportunityChangeFinding,OpportunityChangeSignal} from "./opportunityChangeIntelligence";

export type CustomerIntelligenceBridge={
 opportunity:string;
 signal:OpportunityChangeSignal;
 changeDirection:OpportunityChangeFinding["direction"];
 worldSignal:string;
 customerClues:string[];
 implication:string;
 response:"LEAN_IN"|"REDESIGN"|"PROTECT"|"RESEARCH_MORE";
 nextQuestion:string;
 lowRiskTest:string;
};

const signalTests:Record<OpportunityChangeSignal,string>={
 EMERGING_FIELD:"Talk with three people already working near the emerging edge and ask what demand appeared in the last 12–24 months.",
 DECLINING_FIELD:"Compare the weakening segment with two adjacent segments and identify which customers, budgets or skills are moving rather than disappearing.",
 AI_TECHNOLOGY:"Test one real workflow using current technology and identify where human judgment, trust or domain expertise still changes the outcome.",
 DEMOGRAPHICS:"Interview people serving the affected population and test whether the demographic shift is producing a paid problem rather than merely an interesting trend.",
 BUSINESS_MODEL:"Prototype the same expertise in a different delivery or pricing model and ask prospective buyers which version they would actually purchase.",
 SKILL_SHIFT:"Compare current job postings, buyer requests or project briefs and test whether the customer's strongest reusable skill appears in real demand.",
 GEOGRAPHY:"Run the same opportunity search in local, national and remote markets and compare demand, economics and entry barriers.",
 REGULATION:"Verify the relevant rules with authoritative sources and identify whether regulation creates a barrier, a protected niche or a new service need.",
 VALUE_MIGRATION:"Trace who is gaining budget, margin or decision power and speak with at least three buyers or operators in that part of the value chain."
};

function customerClues(record:DiscoveryRecord){
 const positive=record.wantMore.slice(0,4);
 const reusable=Object.values(record.knowledge||{}).map(x=>x.trim()).filter(Boolean).slice(0,3);
 return [...positive,...reusable].slice(0,6);
}

function responseFor(f:OpportunityChangeFinding):CustomerIntelligenceBridge["response"]{
 if(f.direction==="OPENING")return "LEAN_IN";
 if(f.direction==="CLOSING")return "REDESIGN";
 if(f.direction==="MIXED")return "PROTECT";
 return "RESEARCH_MORE";
}

export function connectChangeToCustomer(opportunity:string,finding:OpportunityChangeFinding,record:DiscoveryRecord):CustomerIntelligenceBridge{
 const clues=customerClues(record);
 const avoids=record.wantLess.slice(0,3);
 const implication=finding.implicationForCustomer||(
  finding.direction==="OPENING"
   ?`This change may create an opening worth examining against ${clues.slice(0,2).join(" + ")||"the customer's strongest Discovery signals"}.`
   :finding.direction==="CLOSING"
   ?`Do not force the original version of this opportunity. Preserve the customer fit, but redesign around the parts of the field where demand or value may be moving.`
   :finding.direction==="MIXED"
   ?`The personal fit may still be real, but the changing field makes a smaller, protected test more appropriate than a large commitment.`
   :`The outside-world evidence is not clear enough yet to change the customer's direction. Research the uncertainty before interpreting it as opportunity.`
 );
 const boundary=avoids.length?` Keep the test consistent with the customer's stated boundaries: ${avoids.join(", ")}.`:"";
 return {
  opportunity,
  signal:finding.signal,
  changeDirection:finding.direction,
  worldSignal:finding.finding,
  customerClues:clues,
  implication:implication+boundary,
  response:responseFor(finding),
  nextQuestion:finding.direction==="CLOSING"?"Where is the value moving if it is leaving this version of the field?":finding.direction==="OPENING"?"What specifically about this opening matches the customer's experience or desired way of working?":"What evidence would make this signal strong enough to change the next move?",
  lowRiskTest:signalTests[finding.signal]
 };
}

export function buildCustomerOpportunityIntelligence(opportunity:string,findings:OpportunityChangeFinding[],record:DiscoveryRecord){
 const bridges=findings.map(f=>connectChangeToCustomer(opportunity,f,record));
 return {
  opportunity,
  bridges,
  openings:bridges.filter(b=>b.response==="LEAN_IN"),
  redesigns:bridges.filter(b=>b.response==="REDESIGN"),
  protectedTests:bridges.filter(b=>b.response==="PROTECT"),
  unresolved:bridges.filter(b=>b.response==="RESEARCH_MORE"),
  principle:"A trend matters only when we can explain why it changes the opportunity for this person."
 };
}
