import type {DiscoveryReentry} from "./researchOrchestrator";

export type RedesignBrief={
 headline:string;
 why:string;
 keep:string[];
 change:string[];
 instruction:string;
};

export function buildRedesignBrief(reentry:DiscoveryReentry):RedesignBrief|null{
 if(!reentry.shouldReenter)return null;
 if(reentry.reason==="CONTRADICTED")return {
  headline:"THE PERSON MAY STILL FIT. THIS VERSION OF THE OPPORTUNITY MAY NOT.",
  why:"Outside evidence challenged one or more assumptions. We will preserve what we learned about the person and redesign the opportunity rather than forcing the original idea.",
  keep:reentry.preserve,
  change:reentry.challenge,
  instruction:reentry.instruction
 };
 return {
  headline:"THE SIGNAL IS INTERESTING, BUT THE MARKET EVIDENCE IS MIXED.",
  why:"Instead of pretending the research is clearer than it is, we will design a smaller or different version that can produce real-world evidence.",
  keep:reentry.preserve,
  change:reentry.challenge,
  instruction:reentry.instruction
 };
}
