import type {Possibility} from "./possibilities";
import type {DiscoveryProfile} from "./profile";
import type {Synthesis} from "./synthesis";
export type FieldItem={title:string;world:string;lane:string;reason:string};
export type DiscoveryField={curiosities:string[];explore:FieldItem[];unexpected:FieldItem[];knowledge:FieldItem|null};
export function buildDiscoveryField(universe:Possibility[],wanted:string[],avoid:string[],profile:DiscoveryProfile,synthesis:Synthesis):DiscoveryField{
 const score=(p:Possibility)=>p.signals.filter(x=>wanted.includes(x)).length*3-p.conditions.filter(x=>avoid.includes(x)).length*3+(synthesis.directions.includes(p.title)?5:0);
 const ranked=[...universe].sort((a,b)=>score(b)-score(a));
 const toItem=(p:Possibility):FieldItem=>({title:p.title,world:p.world,lane:p.lane,reason:p.signals.filter(x=>wanted.includes(x)).slice(0,2).length?("Connects with "+p.signals.filter(x=>wanted.includes(x)).slice(0,2).join(" and ").toLowerCase()+"."):p.desc});
 const explore=ranked.filter(p=>p.lane!=="SURPRISE ME").slice(0,5).map(toItem);
 const unexpected=ranked.filter(p=>p.lane==="SURPRISE ME"&&!explore.some(x=>x.title===p.title)).slice(0,2).map(toItem);
 const knowledgeCandidate=ranked.find(p=>p.world==="WHAT YOU KNOW");
 return {curiosities:wanted.slice(0,3),explore,unexpected,knowledge:knowledgeCandidate?toItem(knowledgeCandidate):null};
}
