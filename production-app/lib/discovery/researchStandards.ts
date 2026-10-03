import type {EvidenceSource,SourceAuthority} from "./evidence";

export type ResearchConfidence="STRONG_EVIDENCE"|"USEFUL_SIGNAL"|"EARLY_SIGNAL"|"INSUFFICIENT_EVIDENCE";

export type SourceStandard={
 authority:SourceAuthority;
 role:string;
 use:string;
 caution:string;
};

export const sourceStandards:SourceStandard[]=[
 {authority:"PRIMARY",role:"Direct evidence",use:"Government, regulators, employers, companies and other first-party records for observable facts, requirements, openings, filings and current activity.",caution:"A company can accurately describe itself while still presenting its own interests."},
 {authority:"AUTHORITATIVE",role:"Independent expertise",use:"Academic, statistical and other authoritative research for structural trends, labor markets, demographics and documented change.",caution:"Methodology, population and publication date must match the question being asked."},
 {authority:"INDUSTRY",role:"Sector context",use:"Trade bodies and high-quality industry reporting for market change, practitioner context and developing patterns.",caution:"Industry narratives can amplify fashionable themes before durable demand is proven."},
 {authority:"MARKET_SIGNAL",role:"Behavioral signal",use:"Job postings, marketplaces, pricing, transactions and other observable activity that can reveal real-world demand.",caution:"A listing or asking price is a signal, not proof of a completed transaction or durable market."},
 {authority:"ANECDOTAL",role:"Question generator",use:"Community discussions and individual experiences for discovering objections, language and questions worth investigating.",caution:"Never use anecdote alone to establish market demand, economics or a structural trend."}
];

function publisherKey(s:EvidenceSource){
 if(s.publisher)return s.publisher.trim().toLowerCase();
 try{return new URL(s.url).hostname.replace(/^www\./,"").toLowerCase()}catch{return s.url.toLowerCase()}
}
function ageDays(s:EvidenceSource,now:Date){
 const raw=s.publishedAt||s.checkedAt; const t=new Date(raw).getTime();
 return Number.isFinite(t)?(now.getTime()-t)/86400000:Infinity;
}

export function assessResearchConfidence(sources:EvidenceSource[],freshnessDays=365,now=new Date()){
 const independent=new Set(sources.map(publisherKey)).size;
 const strong=sources.filter(s=>s.authority==="PRIMARY"||s.authority==="AUTHORITATIVE");
 const fresh=sources.filter(s=>ageDays(s,now)<=freshnessDays);
 const support=sources.filter(s=>s.supports==="SUPPORTS");
 const challenge=sources.filter(s=>s.supports==="CHALLENGES");
 let confidence:ResearchConfidence="INSUFFICIENT_EVIDENCE";
 if(independent>=3&&strong.length>=1&&fresh.length>=2)confidence="STRONG_EVIDENCE";
 else if(independent>=2&&fresh.length>=1)confidence="USEFUL_SIGNAL";
 else if(sources.length>=1)confidence="EARLY_SIGNAL";
 return {
  confidence,
  independentPublishers:independent,
  primaryOrAuthoritative:strong.length,
  freshSources:fresh.length,
  supportingSources:support.length,
  challengingSources:challenge.length,
  hasCounterEvidence:challenge.length>0,
  language:confidence==="STRONG_EVIDENCE"
   ?"Multiple independent and current sources, including stronger evidence, support treating this as a meaningful research finding—not a guarantee."
   :confidence==="USEFUL_SIGNAL"
   ?"The evidence is useful enough to shape the next question or test, but not strong enough to support a major commitment."
   :confidence==="EARLY_SIGNAL"
   ?"We found an early signal worth investigating. It should not yet be treated as a durable trend."
   :"There is not enough current, independent evidence to draw a useful conclusion."
 };
}

export function researchQualityRules(){
 return [
  "Prefer direct and authoritative evidence for factual claims.",
  "Use industry sources for context, not as the sole proof of a structural trend.",
  "Treat marketplaces, postings and pricing as market signals rather than completed outcomes.",
  "Use anecdotes to discover questions—not to validate demand.",
  "Require independent publishers; repeated articles tracing back to one source count as one evidence stream.",
  "Match freshness to the question. Fast-changing technology, hiring and market signals require newer evidence than structural demographic context.",
  "Search deliberately for evidence that challenges the thesis.",
  "Keep unresolved questions visible rather than converting uncertainty into confidence.",
  "Separate what a source directly shows from what we infer or synthesize.",
  "End research with a reversible real-world test whenever research alone cannot resolve the decision."
 ];
}
