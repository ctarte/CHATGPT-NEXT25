import "server-only";
import type {RawResearchResult} from "../discovery/liveResearch";
import type {ResearchProvider} from "../discovery/liveIntelligenceWorkflow";

type BraveResult={title?:string;url?:string;description?:string;page_age?:string;profile?:{long_name?:string};language?:string};
type BraveResponse={web?:{results?:BraveResult[]}};

function publisher(url:string){
 try{return new URL(url).hostname.replace(/^www\./,"")}catch{return undefined}
}
function sourceKind(url:string):RawResearchResult["sourceKind"]{
 const h=(publisher(url)||"").toLowerCase();
 if(/\.gov$|\.gov\./.test(h))return "GOVERNMENT";
 if(/\.edu$|\.edu\./.test(h))return "ACADEMIC";
 // Recognized job/talent marketplaces are market signals, not primary authorities.
 if(/(^|\.)(linkedin\.com|indeed\.com|glassdoor\.com|ziprecruiter\.com|monster\.com|careerbuilder\.com|dice\.com|wellfound\.com|flexjobs\.com|upwork\.com|fiverr\.com)$/.test(h))return "MARKETPLACE";
 // Established journalism/business publications are useful industry evidence.
 if(/(^|\.)(reuters\.com|apnews\.com|bloomberg\.com|wsj\.com|ft\.com|forbes\.com|fortune\.com|cnbc\.com|businessinsider\.com|fastcompany\.com|inc\.com)$/.test(h))return "NEWS";
 // Known professional/trade bodies are industry evidence. Keep this allowlist narrow.
 if(/(^|\.)(shrm\.org|ama\.org|aicpa-cima\.com|aicpa\.org|cfainstitute\.org|pmi\.org|score\.org)$/.test(h))return "TRADE";
 return "OTHER";
}
async function search(q:string,freshnessDays?:number){
 const key=process.env.BRAVE_SEARCH_API_KEY;
 if(!key)throw new Error("BRAVE_SEARCH_API_KEY is not configured.");
 const u=new URL("https://api.search.brave.com/res/v1/web/search");
 u.searchParams.set("q",q);u.searchParams.set("count","10");u.searchParams.set("country","US");u.searchParams.set("search_lang","en");u.searchParams.set("safesearch","moderate");u.searchParams.set("text_decorations","false");
 if(freshnessDays&&freshnessDays<=365)u.searchParams.set("freshness",freshnessDays<=1?"pd":freshnessDays<=7?"pw":freshnessDays<=31?"pm":"py");
 const r=await fetch(u,{headers:{Accept:"application/json","X-Subscription-Token":key},cache:"no-store"});
 if(!r.ok)throw new Error(`Brave Search failed with status ${r.status}.`);
 return await r.json() as BraveResponse;
}
function normalize(data:BraveResponse,relation:RawResearchResult["relation"],retrievedAt:string):RawResearchResult[]{
 return (data.web?.results||[]).filter(x=>x.url&&x.title).map(x=>({
  title:x.title!,url:x.url!,publisher:publisher(x.url!),publishedAt:x.page_age,retrievedAt,
  excerpt:x.description,claim:x.description||x.title!,relation,sourceKind:sourceKind(x.url!),basis:"DIRECT"
 }));
}
const authoritySearches=(q:string)=>[
 `${q} site:bls.gov OR site:census.gov OR site:bea.gov OR site:sba.gov`,
 `${q} site:.edu`
];

export const braveResearchProvider:ResearchProvider=async ({searches,contradictionSearch,freshnessDays,preferredAuthorities})=>{
 const retrievedAt=new Date().toISOString();
 const authorityQueries=(preferredAuthorities||[]).some(a=>a==="PRIMARY"||a==="AUTHORITATIVE")
  ? authoritySearches(searches[0]).slice(0,2):[];
 const primaryQueries=[...authorityQueries,...searches].slice(0,3);
 const primary=await Promise.all(primaryQueries.map(q=>search(q,freshnessDays)));
 // Retrieval only supplies candidates. The claim evaluator decides whether each result supports,
 // challenges, or merely contextualizes the research question.
 const primaryCandidates=primary.flatMap(x=>normalize(x,"CONTEXT",retrievedAt));
 const contradictionCandidates=contradictionSearch?normalize(await search(contradictionSearch,freshnessDays),"CONTEXT",retrievedAt):[];
 return [...primaryCandidates,...contradictionCandidates];
};
