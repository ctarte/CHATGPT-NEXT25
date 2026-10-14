import type {Possibility} from "./possibilities";
import type {DiscoveryProfile} from "./profile";
import type {Synthesis} from "./synthesis";

export type FieldItem={title:string;world:string;lane:string;reason:string};
export type DiscoveryField={curiosities:string[];explore:FieldItem[];unexpected:FieldItem[];knowledge:FieldItem|null};

export function buildDiscoveryField(universe:Possibility[],wanted:string[],avoid:string[],profile:DiscoveryProfile,synthesis:Synthesis):DiscoveryField{
 const score=(p:Possibility)=>
  p.signals.filter(x=>wanted.includes(x)).length*3
  -p.conditions.filter(x=>avoid.includes(x)).length*3
  +(synthesis.directions.includes(p.title)?5:0);
 const ranked=[...universe].sort((a,b)=>score(b)-score(a));
 const toItem=(p:Possibility):FieldItem=>{
  const matches=p.signals.filter(x=>wanted.includes(x)).slice(0,2);
  const conflicts=p.conditions.filter(x=>avoid.includes(x)).slice(0,2);
  const why=matches.length
   ?"Connects with your interest in "+matches.join(" and ").toLowerCase()+"."
   :p.desc;
  return {title:p.title,world:p.world,lane:p.lane,reason:why+(conflicts.length?" Worth examining carefully because it may involve "+conflicts.join(" and ").toLowerCase()+".":"")};
 };
 // Show credible matches first, then widen the field rather than filling it with near-identical options.
 const candidates=ranked.filter(p=>p.lane!=="SURPRISE ME");
 const selected:Possibility[]=[];
 const used=new Set<string>();
 const add=(p:Possibility|undefined)=>{if(p&&!used.has(p.title)){selected.push(p);used.add(p.title)}};
 // Category variety is valuable only when it does not displace a substantially stronger fit.
 // With no customer signals, avoid implying that a ranked list is personalized.
 const hasEvidence=wanted.length>0||avoid.length>0||synthesis.directions.length>0;
 if(hasEvidence){
  add(candidates[0]);
  while(selected.length<Math.min(5,candidates.length)){
   const remaining=candidates.filter(p=>!used.has(p.title));
   if(!remaining.length)break;
   const best=score(remaining[0]);
   const represented=new Set(selected.map(p=>p.world));
   const alternate=remaining.find(p=>!represented.has(p.world)&&score(p)>=Math.max(0,best-3));
   add(alternate||remaining[0]);
  }
 }
 const explore=selected.map(toItem);
 const unexpected=ranked.filter(p=>p.lane==="SURPRISE ME"&&!used.has(p.title)).slice(0,2).map(toItem);
 const knowledgeCandidate=ranked.find(p=>p.world==="WHAT YOU KNOW"&&!used.has(p.title)&&!unexpected.some(x=>x.title===p.title));
 return {curiosities:wanted.slice(0,3),explore,unexpected,knowledge:knowledgeCandidate?toItem(knowledgeCandidate):null};
}
