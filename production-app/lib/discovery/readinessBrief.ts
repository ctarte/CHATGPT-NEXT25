import type {OpportunityReadiness,ReadinessDimension} from "./readiness";

export type ExecutiveReadinessBrief={
 title:string;
 statusLine:string;
 whatLooksEncouraging:string[];
 whatNeedsProof:string[];
 whatWouldChangeOurMind:string[];
 nextCommitment:string;
};

export function executiveReadinessBrief(r:OpportunityReadiness):ExecutiveReadinessBrief{
 const encouraging=r.dimensions.filter(d=>d.state==="STRONG_SIGNAL"||d.state==="PROMISING");
 const needs=r.dimensions.filter(d=>d.state==="UNRESOLVED"||d.state==="MIXED");
 const researchNeedsProof=r.researchConfidence==="EARLY_SIGNAL"||r.researchConfidence==="INSUFFICIENT_EVIDENCE";
 const caution=r.dimensions.filter(d=>d.state==="CAUTION");
 const action:Record<OpportunityReadiness["commitment"],string>={
  EXPLORE:"Keep investigating. Do not make a material commitment yet.",
  TEST:"Run the next small, reversible experiment.",
  PILOT:"Increase realism with a limited pilot while preserving an exit.",
  PREPARE:"Begin practical preparation while continuing to verify remaining assumptions.",
  COMMIT:"A major commitment should require explicit human judgment beyond this readiness layer."
 };
 return {
  title:`${r.opportunity} — Opportunity Readiness`,
  statusLine:r.headline,
  whatLooksEncouraging:encouraging.map(d=>`${d.label}: ${d.basis}`),
  whatNeedsProof:[...(researchNeedsProof?[`RESEARCH STRENGTH: ${r.researchLanguage}`]:[]),...needs.map(d=>`${d.label}: ${d.unresolved||d.basis}`)],
  whatWouldChangeOurMind:caution.map(d=>`${d.label}: ${d.basis}`),
  nextCommitment:action[r.commitment]
 };
}
