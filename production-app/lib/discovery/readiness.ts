import type {OpportunityIntelligence} from "./opportunityIntelligence";
import type {ExperimentInterpretation,ExperimentResult} from "./experimentLearning";
import type {Experiment} from "./experimentDesigner";

export type ReadinessState="STRONG_SIGNAL"|"PROMISING"|"MIXED"|"UNRESOLVED"|"CAUTION";
export type CommitmentLevel="EXPLORE"|"TEST"|"PILOT"|"PREPARE"|"COMMIT";

export type ReadinessDimension={
 key:"PERSON_FIT"|"MARKET"|"ECONOMICS"|"ENTRY"|"REAL_WORLD"|"RISK"|"REVERSIBILITY";
 label:string;
 state:ReadinessState;
 basis:string;
 unresolved?:string;
};

export type OpportunityReadiness={
 opportunity:string;
 dimensions:ReadinessDimension[];
 commitment:CommitmentLevel;
 headline:string;
 explanation:string;
 unresolved:string[];
};

const evidenceState=(intel:OpportunityIntelligence,lens:string):ReadinessState=>{
 const items=intel.dossier.items.filter(i=>i.lens===lens);
 if(!items.length||items.some(i=>i.status==="UNRESOLVED"))return "UNRESOLVED";
 if(items.some(i=>i.status==="CONTRADICTED"))return "CAUTION";
 if(items.some(i=>i.status==="MIXED"))return "MIXED";
 return "PROMISING";
};

export function buildReadiness(intel:OpportunityIntelligence,experiment?:Experiment,result?:ExperimentResult,interpretation?:ExperimentInterpretation):OpportunityReadiness{
 const unresolved=intel.dossier.items.filter(i=>i.status==="UNRESOLVED").map(i=>i.question);
 const realWorld:ReadinessState=!interpretation?"UNRESOLVED":interpretation.state==="EXPAND"?"STRONG_SIGNAL":interpretation.state==="REFINE"?"MIXED":interpretation.state==="REDESIGN"?"CAUTION":"UNRESOLVED";
 const dimensions:ReadinessDimension[]=[
  {key:"PERSON_FIT",label:"PERSONAL FIT",state:"PROMISING",basis:"The opportunity earned investigation through Discovery reactions and fit signals.",unresolved:"Personal fit should continue to be tested through behavior, not assumed from assessment answers alone."},
  {key:"MARKET",label:"MARKET EVIDENCE",state:evidenceState(intel,"MARKET"),basis:"Current outside-world demand evidence in the Opportunity Dossier."},
  {key:"ECONOMICS",label:"ECONOMIC REALITY",state:evidenceState(intel,"ECONOMICS"),basis:"Compensation, pricing, cost and margin evidence in the Opportunity Dossier."},
  {key:"ENTRY",label:"ENTRY FEASIBILITY",state:evidenceState(intel,"ENTRY"),basis:"Required credentials, capital, capabilities or access."},
  {key:"REAL_WORLD",label:"REAL-WORLD RESPONSE",state:realWorld,basis:interpretation?.language||"No completed behavioral experiment has been interpreted yet."},
  {key:"RISK",label:"UNRESOLVED RISK",state:unresolved.length?"UNRESOLVED":"PROMISING",basis:unresolved.length?`${unresolved.length} important evidence questions remain open.`:"No required evidence question remains unresolved."},
  {key:"REVERSIBILITY",label:"REVERSIBILITY",state:experiment&&experiment.maxSpend<=500&&experiment.timeboxDays<=21?"STRONG_SIGNAL":"PROMISING",basis:experiment?`Current test is capped at $${experiment.maxSpend} and ${experiment.timeboxDays} days.`:"The next step should remain small and reversible."}
 ];
 const caution=dimensions.some(d=>d.state==="CAUTION");
 const open=dimensions.some(d=>d.state==="UNRESOLVED");
 const strong=realWorld==="STRONG_SIGNAL"&&!caution&&!open;
 const commitment:CommitmentLevel=caution?"EXPLORE":open?"TEST":strong?"PILOT":"TEST";
 return {
  opportunity:intel.dossier.opportunity,
  dimensions,
  commitment,
  headline:caution?"THIS VERSION NEEDS WORK BEFORE YOU INVEST MORE.":open?"INTERESTING SIGNALS. IMPORTANT QUESTIONS ARE STILL OPEN.":strong?"THE EVIDENCE JUSTIFIES A LARGER—but still controlled—TEST.":"PROMISING ENOUGH TO KEEP TESTING. NOT ENOUGH TO MAKE A LEAP.",
  explanation:"Readiness is shown by dimension rather than compressed into a single match score. Different kinds of evidence deserve different weight.",
  unresolved
 };
}
