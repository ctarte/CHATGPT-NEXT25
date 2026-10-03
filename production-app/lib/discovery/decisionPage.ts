import type {OpportunityReadiness} from "./readiness";
import type {ExecutiveReadinessBrief} from "./readinessBrief";
import type {Experiment} from "./experimentDesigner";
import type {DiscoveryReentry} from "./researchOrchestrator";

export type OpportunityDecisionPage={
 eyebrow:string;
 title:string;
 thesis:string;
 status:string;
 encouraging:string[];
 needsProof:string[];
 changeOurMind:string[];
 nextStep:string;
 experiment?:{title:string;action:string;boundary:string};
 returnToDiscovery?:{title:string;reason:string};
 footer:string;
};

export function buildOpportunityDecisionPage(opportunity:string,readiness:OpportunityReadiness,brief:ExecutiveReadinessBrief,thesis:string,experiment?:Experiment,reentry?:DiscoveryReentry):OpportunityDecisionPage{
 return {
  eyebrow:"YOUR OPPORTUNITY DECISION BRIEF",
  title:opportunity,
  thesis,
  status:brief.statusLine,
  encouraging:brief.whatLooksEncouraging,
  needsProof:brief.whatNeedsProof,
  changeOurMind:brief.whatWouldChangeOurMind,
  nextStep:brief.nextCommitment,
  experiment:experiment?{title:experiment.title,action:experiment.action,boundary:`Timebox: ${experiment.timeboxDays} days · Maximum test spend: $${experiment.maxSpend} · Stop after ${experiment.targetCount} qualified attempts and interpret what happened.`}:undefined,
  returnToDiscovery:reentry?.shouldReenter?{title:"THIS VERSION DOESN’T HOLD UP YET.",reason:reentry.instruction}:undefined,
  footer:"This is a decision aid, not a verdict. The purpose is to make the next step more informed, smaller and more reversible."
 };
}
