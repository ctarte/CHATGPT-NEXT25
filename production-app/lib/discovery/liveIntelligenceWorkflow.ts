import type {EvidenceDossier} from "./evidence";
import {createEvidenceDossier} from "./evidence";
import {buildResearchPlan,type ResearchQuery} from "./researchIntelligence";
import {createResearchJob,type RawResearchResult,type NormalizedFinding,synthesizeFinding} from "./liveResearch";
import {assembleOpportunityIntelligence,type OpportunityIntelligence} from "./opportunityIntelligence";
import {nextResearchTasks,discoveryReentry} from "./researchOrchestrator";
import {buildReadiness,type OpportunityReadiness} from "./readiness";
import {executiveReadinessBrief} from "./readinessBrief";
import {buildOpportunityDecisionPage,type OpportunityDecisionPage} from "./decisionPage";
import type {Experiment} from "./experimentDesigner";
import type {ExperimentResult,ExperimentInterpretation} from "./experimentLearning";

export type ResearchProvider=(
 query:ResearchQuery & {opportunity:string;path:"CAREER"|"BUSINESS"|"BOTH"}
)=>Promise<RawResearchResult[]>;

export type LiveIntelligencePackage={
 opportunity:string;
 dossier:EvidenceDossier;
 intelligence:OpportunityIntelligence;
 readiness:OpportunityReadiness;
 decisionBrief:OpportunityDecisionPage;
 researchComplete:boolean;
 remainingResearch:ReturnType<typeof nextResearchTasks>;
 generatedAt:string;
};

export async function runLiveIntelligence(input:{
 opportunity:string;
 path:"CAREER"|"BUSINESS"|"BOTH";
 provider:ResearchProvider;
 experiment?:Experiment;
 result?:ExperimentResult;
 interpretation?:ExperimentInterpretation;
 now?:Date;
}):Promise<LiveIntelligencePackage>{
 const now=input.now||new Date();
 const base=createEvidenceDossier(input.opportunity,input.path);
 const plan=buildResearchPlan(input.opportunity,input.path);
 const job=createResearchJob(`research-${now.getTime()}`,plan,now.toISOString());
 const findings:NormalizedFinding[]=[];
 for(const q of plan.queries){
  const raw=await input.provider({...q,opportunity:input.opportunity,path:input.path});
  const finding=synthesizeFinding(q,raw);
  findings.push({...finding,scope:q.scope});
 }
 const intelligence=assembleOpportunityIntelligence(job,base,findings,now.toISOString());
 const remainingResearch=nextResearchTasks(intelligence.job,intelligence.findings,now);
 const readiness=buildReadiness(intelligence,input.experiment,input.result,input.interpretation);
 const executive=executiveReadinessBrief(readiness);
 const reentry=discoveryReentry(intelligence);
 const decisionBrief=buildOpportunityDecisionPage(input.opportunity,readiness,executive,base.hypothesis,input.experiment,reentry);
 return {opportunity:input.opportunity,dossier:intelligence.dossier,intelligence,readiness,decisionBrief,researchComplete:remainingResearch.length===0,remainingResearch,generatedAt:now.toISOString()};
}

export function persistencePatch(pkg:LiveIntelligencePackage){
 return {
  evidenceDossiers:{[pkg.opportunity]:pkg.dossier},
  readiness:{[pkg.opportunity]:pkg.readiness},
  decisionBriefs:{[pkg.opportunity]:pkg.decisionBrief}
 };
}
