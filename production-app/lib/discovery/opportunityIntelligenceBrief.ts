import type {CustomerIntelligenceBridge} from "./customerOpportunityIntelligence";

export type OpportunityIntelligenceBrief={
 eyebrow:"OPPORTUNITY INTELLIGENCE BRIEF";
 opportunity:string;
 researchQuestion:string;
 executiveView:string;
 whatIsChanging:Array<{signal:string;finding:string;direction:string}>;
 whereOpportunitiesAre:string[];
 whyItMattersToYou:Array<{clues:string[];implication:string}>;
 warnings:string[];
 unanswered:string[];
 nextTests:string[];
 methodology:string;
 footer:string;
};

const label=(s:string)=>s.replaceAll("_"," ");

export function buildOpportunityIntelligenceBrief(opportunity:string,bridges:CustomerIntelligenceBridge[]):OpportunityIntelligenceBrief{
 const openings=bridges.filter(b=>b.response==="LEAN_IN");
 const redesigns=bridges.filter(b=>b.response==="REDESIGN");
 const protectedTests=bridges.filter(b=>b.response==="PROTECT");
 const unresolved=bridges.filter(b=>b.response==="RESEARCH_MORE");
 const value=bridges.filter(b=>b.signal==="VALUE_MIGRATION"||b.signal==="BUSINESS_MODEL"||b.signal==="SKILL_SHIFT");
 const executiveView=redesigns.length>openings.length
  ?"The personal fit may still be worth preserving, but outside change signals suggest this version of the opportunity should be redesigned before meaningful commitment."
  :openings.length&&redesigns.length
  ?"The opportunity sits inside a changing field. Some forces may create openings while others weaken the obvious version. The research points toward selective testing rather than a broad commitment."
  :openings.length
  ?"Several outside change signals may be creating an opening worth testing against the customer's Discovery evidence."
  :"The opportunity remains a hypothesis. Current change signals are not yet strong enough to justify a larger commitment.";
 return {
  eyebrow:"OPPORTUNITY INTELLIGENCE BRIEF",
  opportunity,
  researchQuestion:`Where is the world creating—or closing—opportunities around ${opportunity}, and what does that mean for this customer?`,
  executiveView,
  whatIsChanging:bridges.map(b=>({signal:label(b.signal),finding:b.worldSignal,direction:b.changeDirection})),
  whereOpportunitiesAre:value.map(b=>b.worldSignal),
  whyItMattersToYou:bridges.filter(b=>b.customerClues.length).map(b=>({clues:b.customerClues,implication:b.implication})),
  warnings:[...redesigns,...protectedTests].map(b=>b.implication),
  unanswered:unresolved.map(b=>b.nextQuestion),
  nextTests:[...new Set(bridges.map(b=>b.lowRiskTest))].slice(0,5),
  methodology:"We examine emerging and declining fields, technology, demographics, business models, skill shifts, geography, regulation and value migration. We search for evidence both for and against the opportunity, then connect those findings back to the customer's Discovery clues.",
  footer:"This brief is research for decision support, not a prediction or guarantee. Trends matter only when current evidence shows why they change the opportunity for this person."
 };
}
