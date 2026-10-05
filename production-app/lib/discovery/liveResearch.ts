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

const STOP=new Set(["demand","market","hiring","customers","compensation","rates","pricing","revenue","costs","technology","regulation","trends","jobs","employers","qualifications","requirements","clients","companies","consultant","services","challenges","decline","growth","evidence","durable"]);
const words=(s:string)=>new Set(s.toLowerCase().replace(/[^a-z0-9 ]/g," ").split(/\s+/).filter(w=>w.length>3));
const overlap=(a:string,b:string)=>{const x=words(a),y=words(b);return [...x].filter(w=>y.has(w)).length};
const opportunityTerms=(query:ResearchQuery)=>{
 const first=(query.searches[0]||"").toLowerCase().replace(/[^a-z0-9 ]/g," ").split(/\s+/).filter(w=>w.length>3&&!STOP.has(w)&&!/^(202[0-9])$/.test(w));
 return new Set(first);
};

export function evaluateResearchResult(query:ResearchQuery,result:RawResearchResult):ClaimEvaluation{
 const text=`${result.title} ${result.excerpt||""} ${result.claim||""}`;
 const relevance=overlap(query.question+" "+query.searches.join(" "),text);
 const coreTerms=opportunityTerms(query);
 const textTerms=words(text);
 const coreOverlap=[...coreTerms].filter(w=>textTerms.has(w)).length;
 const requiredCore=coreTerms.size>=2?2:1;
 if(relevance<2||coreOverlap<requiredCore)return {relation:"CONTEXT",confidence:"LOW",rationale:"The source may be authoritative, but it does not directly address the opportunity closely enough to count as evidence."};
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

const geographyClaimSignal=(r:RawResearchResult)=>{
 const t=`${r.title} ${r.excerpt||""} ${r.claim||""}`.toLowerCase();
 const access=/\b(remote|hybrid|onsite|on-site|work from home|nationwide|nationally|across the united states|anywhere in the united states)\b/.test(t);
 const constraint=/\b(license|licensing|licensed|state restriction|travel required|must reside|residency|local presence|in-person|commute|relocation)\b/.test(t);
 const activity=/\b(demand|jobs?|openings?|clients?|customers?|employers?|market|concentration|hiring|opportunities|workforce)\b/.test(t);
 const place=/\b(alabama|alaska|arizona|arkansas|california|colorado|connecticut|delaware|florida|georgia|hawaii|idaho|illinois|indiana|iowa|kansas|kentucky|louisiana|maine|maryland|massachusetts|michigan|minnesota|mississippi|missouri|montana|nebraska|nevada|new hampshire|new jersey|new mexico|new york|north carolina|north dakota|ohio|oklahoma|oregon|pennsylvania|rhode island|south carolina|south dakota|tennessee|texas|utah|vermont|virginia|washington|west virginia|wisconsin|wyoming)\b/.test(t);
 const headquarters=/\b(hq|headquarters|founded|based in)\b/.test(t);
 return access||constraint||(place&&activity&&!headquarters);
};

export function synthesizeFinding(query:ResearchQuery,results:RawResearchResult[]):NormalizedFinding{
 const evaluated=results.map(r=>{const e=evaluateResearchResult(query,r);const relation=query.lens==="GEOGRAPHY"&&!geographyClaimSignal(r)?"CONTEXT":e.relation;return {...r,relation,basis:e.confidence==="LOW"?"INFERRED":(r.basis||"INFERRED")} as RawResearchResult});
 const sourceRank:Record<SourceAuthority,number>={PRIMARY:5,AUTHORITATIVE:4,INDUSTRY:3,MARKET_SIGNAL:2,ANECDOTAL:1};
 const relationRank:Record<RawResearchResult["relation"],number>={SUPPORTS:3,CHALLENGES:3,CONTEXT:1};
 const sources=evaluated.map(normalizeSource).sort((a,b)=>relationRank[b.supports]-relationRank[a.supports]||sourceRank[b.authority]-sourceRank[a.authority]);
 const publisherKey=(s:EvidenceSource)=>{if(s.publisher)return s.publisher.trim().toLowerCase();try{return new URL(s.url).hostname.replace(/^www\\./,"").toLowerCase()}catch{return s.url.toLowerCase()}};
 const supporting=sources.filter(s=>s.supports==="SUPPORTS");
 const challenging=sources.filter(s=>s.supports==="CHALLENGES");
 const supports=supporting.length;
 const challenges=challenging.length;
 const independentSupport=new Set(supporting.map(publisherKey)).size;
 const independentChallenges=new Set(challenging.map(publisherKey)).size;
 const strongAuthorities=new Set<SourceAuthority>(["PRIMARY","AUTHORITATIVE","INDUSTRY"]);
 const strongSupport=supporting.filter(s=>strongAuthorities.has(s.authority));
 const strongChallenges=challenging.filter(s=>strongAuthorities.has(s.authority));
 const independentStrongSupport=new Set(strongSupport.map(publisherKey)).size;
 const independentStrongChallenges=new Set(strongChallenges.map(publisherKey)).size;
 const hasStrongSupport=independentStrongSupport>0;
 const hasStrongChallenge=independentStrongChallenges>0;
 let status:EvidenceStatus="UNRESOLVED";
 if(supports>0&&challenges>0)status="MIXED";
 else if(challenges>=query.minimumIndependentSources&&independentChallenges>=query.minimumIndependentSources&&hasStrongChallenge&&supports===0)status="CONTRADICTED";
 else if(supports>=query.minimumIndependentSources&&independentSupport>=query.minimumIndependentSources&&hasStrongSupport)status="SUPPORTED";
 return {
  lens:query.lens,
  scope:query.scope,
  claim:evaluated.find(r=>r.relation!=="CONTEXT")?.claim||(query.lens==="GEOGRAPHY"?"Current evidence does not yet establish a dominant geographic market, remote-access pattern, or material location constraint for this opportunity.":evaluated[0]?.claim||query.question),
  status,
  sources,
  uncertainty:status==="UNRESOLVED"?"The evidence is relevant, but the minimum combination of independent and higher-authority support has not been met.":status==="MIXED"?"Credible evidence points in more than one direction.":undefined,
  nextVerification:status==="UNRESOLVED"?(query.contradictionSearch||query.searches[0]):undefined
 };
}

export function createResearchJob(id:string,plan:ResearchPlan,createdAt=new Date().toISOString()):ResearchJob{
 return {id,opportunity:plan.opportunity,path:plan.path,createdAt,plan,state:"PLANNED"};
}
