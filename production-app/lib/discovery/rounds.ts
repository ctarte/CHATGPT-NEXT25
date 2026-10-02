import type {Possibility} from "./possibilities";
export type Reaction="NOT ME"|"MAYBE"|"CURIOUS"|"SHOW ME MORE";
export type ReentryBrief="FOLLOW THE ENERGY"|"INVESTIGATE THE SURPRISE"|"CHALLENGE AN ASSUMPTION"|"REVISIT WHAT DIDN’T FEEL RIGHT"|"SURPRISE ME AGAIN"|"";
export type DiscoveryPath="retirement"|"already-retired"|"career-reinvention"|"business-discovery"|"open-discovery"|"";
export function buildRound(universe:Possibility[],wanted:string[],avoid:string[],lane:string,seen:string[],positive:string[],size=7,reentry:ReentryBrief="",path:DiscoveryPath=""){
 const score=(p:Possibility)=>{
  let n=p.signals.filter(x=>wanted.includes(x)).length*3-p.conditions.filter(x=>avoid.includes(x)).length*3;
  if(lane&&p.lane===lane)n+=4;
  if(positive.some(t=>t===p.title))n+=2;
  if(reentry==="FOLLOW THE ENERGY")n+=p.signals.filter(x=>wanted.includes(x)).length*3;
  if(reentry==="INVESTIGATE THE SURPRISE"&&p.lane==="SURPRISE ME")n+=7;
  if(reentry==="CHALLENGE AN ASSUMPTION"){if(!lane||p.lane!==lane)n+=3;if(p.lane==="SURPRISE ME")n+=3;}
  if(reentry==="REVISIT WHAT DIDN’T FEEL RIGHT")n+=p.conditions.filter(x=>avoid.includes(x)).length?-2:2;
  if(reentry==="SURPRISE ME AGAIN"&&p.lane==="SURPRISE ME")n+=10;
  // The doorway changes the opening search, but never fences the visitor into one world.
  if(path==="business-discovery"){if(p.world==="BUSINESS"||p.world==="WHAT YOU KNOW")n+=4;if(p.lane==="SURPRISE ME")n+=1;}
  if(path==="career-reinvention"){if(p.world==="CAREER")n+=4;if(p.world==="BUSINESS"||p.world==="WHAT YOU KNOW")n+=1;}
  if(path==="retirement"||path==="already-retired"){if(p.world==="EXPERIENCE"||p.world==="UNEXPECTED")n+=4;if(p.world==="CAREER"||p.world==="WHAT YOU KNOW")n+=1;}
  if(path==="open-discovery"){if(p.lane==="SURPRISE ME")n+=5;if(p.world==="UNEXPECTED")n+=2;}
  return n;
 };
 const fresh=universe.filter(p=>!seen.includes(p.title));
 const ranked=[...fresh].sort((a,b)=>score(b)-score(a));
 const surprise=ranked.find(p=>p.lane==="SURPRISE ME");
 if(reentry==="SURPRISE ME AGAIN"||reentry==="INVESTIGATE THE SURPRISE")return ranked.slice(0,size);
 const core=ranked.filter(p=>p!==surprise).slice(0,Math.max(0,size-(surprise?1:0)));
 return surprise?[...core,surprise]:core.slice(0,size);
}
