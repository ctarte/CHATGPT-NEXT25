import type {EvidenceLens,EvidenceSource} from "./evidence";
import type {NormalizedFinding,ResearchJob} from "./liveResearch";
import type {ResearchQuery} from "./researchIntelligence";
import type {OpportunityIntelligence} from "./opportunityIntelligence";

export type ResearchTask={
 id:string;
 lens:EvidenceLens;
 query:string;
 purpose:"PRIMARY"|"CONTRADICTION"|"REFRESH"|"GAP";
 priority:1|2|3|4|5;
};

const canonical=(url:string)=>{
 try{const u=new URL(url);return (u.hostname.replace(/^www\./,"")+u.pathname.replace(/\/$/,"")).toLowerCase();}
 catch{return url.toLowerCase();}
};

export function dedupeSources(sources:EvidenceSource[]){
 const seen=new Set<string>();
 return sources.filter(s=>{const key=canonical(s.url);if(seen.has(key))return false;seen.add(key);return true;});
}

export function sourceIsStale(source:EvidenceSource,freshnessDays:number,now=new Date()){
 const date=source.publishedAt||source.checkedAt;
 const age=(now.getTime()-new Date(date).getTime())/86400000;
 return !Number.isFinite(age)||age>freshnessDays;
}

export function nextResearchTasks(job:ResearchJob,findings:NormalizedFinding[],now=new Date()):ResearchTask[]{
 const tasks:ResearchTask[]=[];
 job.plan.queries.forEach((q:ResearchQuery,index)=>{
  const matching=findings.filter(f=>f.lens===q.lens);
  const sources=dedupeSources(matching.flatMap(f=>f.sources));
  const challenges=sources.filter(s=>s.supports==="CHALLENGES");
  const fresh=sources.filter(s=>!sourceIsStale(s,q.freshnessDays,now));
  if(!matching.length)tasks.push({id:`${job.id}-${q.lens}-gap`,lens:q.lens,query:q.searches[0],purpose:"GAP",priority:5});
  else if(fresh.length<q.minimumIndependentSources)tasks.push({id:`${job.id}-${q.lens}-primary`,lens:q.lens,query:q.searches[Math.min(index,q.searches.length-1)]||q.searches[0],purpose:"PRIMARY",priority:4});
  if(q.contradictionSearch&&challenges.length===0)tasks.push({id:`${job.id}-${q.lens}-challenge`,lens:q.lens,query:q.contradictionSearch,purpose:"CONTRADICTION",priority:5});
  if(sources.length&&fresh.length<sources.length)tasks.push({id:`${job.id}-${q.lens}-refresh`,lens:q.lens,query:q.searches[0],purpose:"REFRESH",priority:3});
 });
 return tasks.sort((a,b)=>b.priority-a.priority);
}

export type DiscoveryReentry={
 shouldReenter:boolean;
 reason:"CONTRADICTED"|"MIXED"|"UNRESOLVED"|"NONE";
 instruction:string;
 preserve:string[];
 challenge:string[];
};

export function discoveryReentry(intel:OpportunityIntelligence):DiscoveryReentry{
 const contradicted=intel.dossier.items.filter(i=>i.status==="CONTRADICTED");
 const mixed=intel.dossier.items.filter(i=>i.status==="MIXED");
 const unresolved=intel.dossier.items.filter(i=>i.status==="UNRESOLVED");
 if(contradicted.length)return {shouldReenter:true,reason:"CONTRADICTED",instruction:"Redesign the opportunity around the parts that still fit the person while removing the assumptions contradicted by outside evidence.",preserve:["positive discovery reactions","desired life conditions","transferable strengths"],challenge:contradicted.map(i=>`${i.lens}: ${i.finding||i.question}`)};
 if(mixed.length)return {shouldReenter:true,reason:"MIXED",instruction:"Generate a lower-risk variation that can be tested where research is genuinely mixed.",preserve:["core attraction","positive evidence"],challenge:mixed.map(i=>`${i.lens}: ${i.uncertainty||i.question}`)};
 if(unresolved.length)return {shouldReenter:false,reason:"UNRESOLVED",instruction:"Do not redesign yet. Resolve the highest-value evidence gaps first.",preserve:["current hypothesis"],challenge:unresolved.map(i=>i.nextVerification||i.question)};
 return {shouldReenter:false,reason:"NONE",instruction:"The evidence layer does not require a Discovery reset. Proceed to a controlled test.",preserve:["full Discovery Record","evidence dossier"],challenge:[]};
}
