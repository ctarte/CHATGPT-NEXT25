import type {Possibility} from "./possibilities";
import type {DiscoveryProfile} from "./profile";
export type DiscoveryExplanation={score:number;why:string;different:string;stretch:string;still:string};
const profileHints=[["Independence","independent"],["Flexibility","flexible"],["Intellectual challenge","intellectually demanding"],["Creativity","creative"],["Teaching","teaching-oriented"],["Learning","learning-rich"],["Adventure","adventurous"],["Contribution","contribution-focused"]];
export function explainPossibility(p:Possibility,wanted:string[],avoid:string[],profile:DiscoveryProfile,lane:string,rejections:string[]=[]):DiscoveryExplanation{
 const hits=p.signals.filter(x=>wanted.includes(x)), avoided=p.friction.filter(x=>avoid.includes(x));
 const rejectedPenalty=rejections.some(x=>x==="Too much selling"&&/client|buyer|selling/i.test(p.entry+p.watch))?2:0;
 const laneFit=!lane||p.lane===lane;
 const novelty=p.lane==="SURPRISE ME"?2:p.lane==="ONE STEP BEYOND"?1:0;
 const profileStrength=profile.axes.filter(a=>Math.abs(a.value)>=2).length;
 const score=hits.length*4+avoided.length*3+(laneFit?4:0)+novelty+Math.min(2,profileStrength)-rejectedPenalty;
 const named=hits.slice(0,2).map(x=>profileHints.find(h=>h[0]===x)?.[1]||x.toLowerCase());
 const why=named.length?("It connects with your interest in "+named.join(" and ")+"."):"It gives us a useful way to test a direction beyond the most obvious match.";
 const different=avoided.length?("It may let you use your strengths while reducing "+avoided.slice(0,2).join(" and ").toLowerCase()+"."):"It changes the shape of the work rather than simply repeating a familiar title.";
 const stretch=p.lane==="SURPRISE ME"?"It sits outside the most obvious extension of your past experience.":p.lane==="ONE STEP BEYOND"?"It applies familiar strengths in a less familiar setting or business model.":"The work may feel familiar, but the structure, boundaries or audience could be different.";
 const still=laneFit?"You asked us to explore at this discovery distance, so it deserves a closer look.":"We’re keeping some deliberate variety in the mix so the engine doesn’t simply confirm what you already know.";
 return {score,why,different,stretch,still};
}
