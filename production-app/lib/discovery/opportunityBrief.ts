import type {Possibility} from "./possibilities";
export type OpportunityBrief={
 title:string;world:string;lane:string;overview:string;why:string[];
 entry:string[];buyers:string[];economics:string;complexity:string;
 skills:string[];risks:string[];poorFit:string[];questions:string[];experiment:string;
};
const buyerByWorld:Record<string,string[]>={
 "CAREER":["Organizations with a defined expertise gap","Professional firms or institutions","Project-based or fractional employers"],
 "BUSINESS":["A narrow customer group with a recurring problem","Organizations that value specialized expertise","Buyers who can measure the result"],
 "WHAT YOU KNOW":["Professional or industry audiences","Organizations that need the knowledge transferred","Readers, learners, licensees or advisory clients"],
 "EXPERIENCE":["Communities, institutions or participants aligned with the pursuit","Partners or hosts where appropriate","This may be personally valuable without requiring a paying customer"],
 "UNEXPECTED":["A deliberately selected niche audience","Partners, communities or institutions","This may begin as an experiment before it has an economic model"]
};
export function buildOpportunityBrief(p:Possibility):OpportunityBrief{
 const capital=p.title.includes("Acquisition")?"Potentially significant; acquisition financing and diligence would need separate evaluation.":p.world==="EXPERIENCE"?"Usually driven more by time, travel and participation costs than business startup capital.":"Often testable with modest initial capital before building a larger structure.";
 const complexity=p.title.includes("Acquisition")?"HIGHER":p.world==="BUSINESS"?"MODERATE":"LOWER TO MODERATE";
 return {
  title:p.title,world:p.world,lane:p.lane,overview:p.desc,
  why:[p.attractive,p.lane==="SURPRISE ME"?"It intentionally expands the field beyond the most obvious extension of past experience.":"It can be explored without treating it as a predetermined answer."],
  entry:[p.entry,"Talk with people already doing adjacent versions of the work.","Test the smallest credible version before making a major commitment."],
  buyers:buyerByWorld[p.world]||buyerByWorld.UNEXPECTED,
  economics:capital+" Income potential should be researched for the specific market, geography, delivery model and time commitment rather than assumed from a generic title.",
  complexity,
  skills:["Relevant subject-matter credibility","Ability to communicate a clear result or value proposition",p.world==="BUSINESS"?"Customer discovery and basic commercial discipline":"Ability to define boundaries and expectations"],
  risks:[p.watch,"Demand, compensation and competitive conditions may differ substantially by niche.","A possibility that sounds attractive conceptually may feel different when tested in real life."],
  poorFit:["The day-to-day work recreates several conditions you explicitly want to discard.","The economics require a scale, risk level or time commitment you do not want.","You like the idea more than the actual activities required to do it."],
  questions:["Who is already doing this successfully—and in what form?","Who pays for it, employs it or participates in it?","What does a realistic week actually look like?","What credentials, licenses, insurance or other requirements could apply?","What would make this economically worthwhile for you?","What is the smallest experiment that could produce useful evidence?"],
  experiment:p.experiment
 };
}
