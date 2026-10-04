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
 scope?:"SHARED"|"CAREER"|"BUSINESS";
 claim:string;
 status:EvidenceStatus;
 sources:EvidenceSource[];
 uncertainty?:string;
 nextVerification?:string;
};

export type ClaimEvaluation={
 relation:"SUPPORTS"|"CHALLENGES"|"CONTEXT";
 confidence:"HIGH"|"MEDIUM"|"LOW";
 rationale:string;
};

const words=(s:string)=>new Set(s.toLowerCase().replace(/[^a-z0-9 ]/g," ").split(/\s+/).filter(w=>w.length>3));
const overlap=(a:string,b:string)=>{const x=words(a),y=words(b);return [...x].filter(w=>y.has(w)).length};

export function evaluateResearchResult(query:ResearchQuery,result:RawResearchResult):ClaimEvaluation{
 const text=`${result.title} ${result.excerpt||""} ${result.claim||""}`;
 const relevance=overlap(query.question+" "+query.searches.join(" "),text);
 if(relevance<2)return {relation:"CONTEXT",confidence:"LOW",rationale:"The search result does not contain enough question-specific language to classify it as evidence."};
 const t=text.toLowerCase();
 const challengeTerms=["decline","declining","layoff","closure","challenge","risk","displace","obsolete","low pay","margin pressure","complaint","failure","barrier","shortage","weak demand","falling"];
 const supportTerms=["growth","growing","demand","hiring","hire","jobs","revenue","market","clients","customers","increased","expanding","opportunity"];
 const negative=challengeTerms.filter(x=>t.includes(x)).length;
 const positive=supportTerms.filter(x=>t.includes(x)).length;
 if(negative>positive&&negative>0)return {relation:"CHALLENGES",confidence:negative>=2?"MEDIUM":"LOW",rationale:"The retrieved text contains question-relevant caution or adverse-market language."};
 if(positive>negative&&positive>0)return {relation:"SUPPORTS",confidence:positive>=2?"MEDIUM":"LOW",rationale:"The retrieved text contains question-relevant observable-demand or market-activity language."};
 return {relation:"CONTEXT",confidence:"LOW",rationale:"The retrieved text is relevant, but its direction is ambiguous."};
}

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
 const evaluated=results.map(r=>{const e=evaluateResearchResult(query,r);return {...r,relation:e.relation,basis:e.confidence==="LOW"?"INFERRED":(r.basis||"INFERRED")} as RawResearchResult});
 const sourceRank:Record<SourceAuthority,number>={PRIMARY:5,AUTHORITATIVE:4,INDUSTRY:3,MARKET_SIGNAL:2,ANECDOTAL:1};
 const sources=evaluated.map(normalizeSource).sort((a,b)=>sourceRank[b.authority]-sourceRank[a.authority]);
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
  scope:query.scope,
  claim:evaluated.find(r=>r.relation!=="CONTEXT")?.claim||evaluated[0]?.claim||query.question,
  status,
  sources,
  uncertainty:status==="UNRESOLVED"?"The minimum independent evidence threshold has not been met.":status==="MIXED"?"Credible evidence points in more than one direction.":undefined,
  nextVerification:status==="UNRESOLVED"?(query.contradictionSearch||query.searches[0]):undefined
 };
}

export function createResearchJob(id:string,plan:ResearchPlan,createdAt=new Date().toISOString()):ResearchJob{
 return {id,opportunity:plan.opportunity,path:plan.path,createdAt,plan,state:"PLANNED"};
}
