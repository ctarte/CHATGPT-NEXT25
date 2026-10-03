import type {EvidenceDossier} from "./evidence";
import type {OpportunityReadiness} from "./readiness";
import type {OpportunityDecisionPage} from "./decisionPage";
export type DiscoveryRecord={
 version:2;startingPoint:string;wantMore:string[];wantLess:string[];round:number;seen:string[];
 reactions:Record<string,string>;rejectionReasons:Record<string,string[]>;quickAnswers:Record<number,string>;
 knowledge:Record<string,string>;fieldActions:Record<string,string>;lane:string;briefsOpened:string[];briefNotes?:Record<string,string>;briefEvidence?:Record<string,string[]>;experiments?:Array<{possibility:string;test:string;learning:string[];time:string;status:string}>;evidenceDossiers?:Record<string,EvidenceDossier>;readiness?:Record<string,OpportunityReadiness>;decisionBriefs?:Record<string,OpportunityDecisionPage>;progress?:{stage:number;index:number;round:number;quickQuestion:number};
};
export function createDiscoveryRecord(input:Omit<DiscoveryRecord,"version">):DiscoveryRecord{return {version:2,...input}}
export function recordSummary(r:DiscoveryRecord){
 return {signals:r.wantMore.length,conditionsToAvoid:r.wantLess.length,possibilitiesSeen:r.seen.length,reflections:Object.values(r.knowledge).filter(Boolean).length,fieldDecisions:Object.keys(r.fieldActions).length,briefsOpened:r.briefsOpened.length,evidenceDossiers:Object.keys(r.evidenceDossiers||{}).length,readinessBriefs:Object.keys(r.readiness||{}).length,decisionBriefs:Object.keys(r.decisionBriefs||{}).length};
}
