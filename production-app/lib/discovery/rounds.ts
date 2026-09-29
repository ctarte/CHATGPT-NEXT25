import type {Possibility} from "./possibilities";
export type Reaction="NOT ME"|"MAYBE"|"CURIOUS"|"SHOW ME MORE";
export function buildRound(universe:Possibility[],wanted:string[],avoid:string[],lane:string,seen:string[],positive:string[],size=7){
 const score=(p:Possibility)=>{
  let n=p.signals.filter(x=>wanted.includes(x)).length*3+p.friction.filter(x=>avoid.includes(x)).length*2;
  if(lane&&p.lane===lane)n+=4;
  if(positive.some(t=>t===p.title))n+=2;
  return n;
 };
 const fresh=universe.filter(p=>!seen.includes(p.title));
 const ranked=[...fresh].sort((a,b)=>score(b)-score(a));
 const surprise=ranked.find(p=>p.lane==="SURPRISE ME");
 const core=ranked.filter(p=>p!==surprise).slice(0,Math.max(0,size-(surprise?1:0)));
 return surprise?[...core,surprise]:core.slice(0,size);
}
