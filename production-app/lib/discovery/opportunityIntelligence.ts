import type {EvidenceDossier} from "./evidence";
import type {ResearchJob,NormalizedFinding} from "./liveResearch";
import {applyEvidenceUpdates,evidenceDecisionState} from "./evidence";

export type OpportunityIntelligence={
 job:ResearchJob;
 findings:NormalizedFinding[];
 dossier:EvidenceDossier;
 decision:ReturnType<typeof evidenceDecisionState>;
 refreshedAt?:string;
};

export function assembleOpportunityIntelligence(job:ResearchJob,base:EvidenceDossier,findings:NormalizedFinding[],refreshedAt=new Date().toISOString()):OpportunityIntelligence{
 const dossier=applyEvidenceUpdates(base,findings.map(f=>({lens:f.lens,finding:f.claim,status:f.status,sources:f.sources,uncertainty:f.uncertainty,nextVerification:f.nextVerification})));
 return {job:{...job,state:findings.length?"PARTIAL":"PLANNED"},findings,dossier,decision:evidenceDecisionState(dossier),refreshedAt};
}

export function researchCoverage(intel:OpportunityIntelligence){
 const plannedLenses=new Set(intel.job.plan.queries.map(q=>q.lens));
 const researchedLenses=new Set(intel.findings.map(f=>f.lens));
 const planned=plannedLenses.size;
 const researched=[...plannedLenses].filter(l=>researchedLenses.has(l)).length;
 return {planned,researched,complete:researched>=planned,remaining:Math.max(0,planned-researched)};
}
