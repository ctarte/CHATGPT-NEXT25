import type {EvidenceBasis,EvidenceLens,EvidenceSource,EvidenceStatus,SourceAuthority} from "./evidence";
import type {ResearchPlan,ResearchQuery} from "./researchIntelligence";

export type RawResearchResult={
 title:string;
 url:string;
 publisher?:string;
 publishedAt?:string;
 retrievedAt:string;
 excerpt?:string;
 claim:string;
 relation:"SUPPORTS"|"CHALLENGES"|"CONTEXT";
 sourceKind?:"GOVERNMENT"|"REGULATOR"|"EMPLOYER"|"COMPANY"|"ACADEMIC"|"TRADE"|"MARKETPLACE"|"NEWS"|"COMMUNITY"|"OTHER";
 basis?:EvidenceBasis;
};

export type NormalizedFinding={
 lens:EvidenceLens;
 claim:string;
 status:EvidenceStatus;
 sources:EvidenceSource[];
 uncertainty?:string;
 nextVerification?:string;
};

export type ResearchJob={
 id:string;
 opportunity:string;
 path:ResearchPlan["path"];
 createdAt:string;
 plan:ResearchPlan;
 state:"PLANNED"|"RUNNING"|"PARTIAL"|"COMPLETE"|"FAILED";
};

function authority(kind:RawResearchResult["sourceKind"]):SourceAuthority{
 if(kind==="GOVERNMENT"||kind==="REGULATOR"||kind==="EMPLOYER"||kind==="COMPANY")return "PRIMARY";
 if(kind==="ACADEMIC")return "AUTHORITATIVE";
 if(kind==="TRADE"||kind==="NEWS")return "INDUSTRY";
 if(kind==="MARKETPLACE")return "MARKET_SIGNAL";
 return "ANECDOTAL";
}

export function normalizeSource(raw:RawResearchResult):EvidenceSource{
 return {
  label:raw.title,
  url:raw.url,
  publisher:raw.publisher,
  publishedAt:raw.publishedAt,
  checkedAt:raw.retrievedAt,
  authority:authority(raw.sourceKind),
  basis:raw.basis||"DIRECT",
  supports:raw.relation,
  note:raw.excerpt
 };
}

export function synthesizeFinding(query:ResearchQuery,results:RawResearchResult[]):NormalizedFinding{
 const sources=results.map(normalizeSource);
 const publisherKey=(s:EvidenceSource)=>{if(s.publisher)return s.publisher.trim().toLowerCase();try{return new URL(s.url).hostname.replace(/^www\\./,"").toLowerCase()}catch{return s.url.toLowerCase()}};
 const supporting=sources.filter(s=>s.supports==="SUPPORTS");
 const challenging=sources.filter(s=>s.supports==="CHALLENGES");
 const supports=supporting.length;
 const challenges=challenging.length;
 const independentSupport=new Set(supporting.map(publisherKey)).size;
 const independentChallenges=new Set(challenging.map(publisherKey)).size;
 let status:EvidenceStatus="UNRESOLVED";
 if(supports>0&&challenges>0)status="MIXED";
 else if(challenges>=query.minimumIndependentSources&&independentChallenges>=query.minimumIndependentSources&&supports===0)status="CONTRADICTED";
 else if(supports>=query.minimumIndependentSources&&independentSupport>=query.minimumIndependentSources)status="SUPPORTED";
 return {
  lens:query.lens,
  claim:results[0]?.claim||query.question,
  status,
  sources,
  uncertainty:status==="UNRESOLVED"?"The minimum independent evidence threshold has not been met.":status==="MIXED"?"Credible evidence points in more than one direction.":undefined,
  nextVerification:status==="UNRESOLVED"?(query.contradictionSearch||query.searches[0]):undefined
 };
}

export function createResearchJob(id:string,plan:ResearchPlan,createdAt=new Date().toISOString()):ResearchJob{
 return {id,opportunity:plan.opportunity,path:plan.path,createdAt,plan,state:"PLANNED"};
}
