import type {DiscoveryProfile} from "./profile";
import type {Possibility} from "./possibilities";
export type Synthesis={headline:string;observations:string[];themes:string[];directions:string[];unexpected:string};
const dictionaries=[
 {theme:"EXPLAIN & TEACH",words:["teach","explain","train","mentor","present","educat","simplif"],directions:["Specialized Instructor","Expert-Led Learning Studio","Specialist Publication or Briefing"]},
 {theme:"ADVISE & SOLVE",words:["advice","advise","solve","problem","strategy","decision","judgment","consult"],directions:["Fractional Strategic Adviser","Micro-Consulting Practice","Specialty Research & Insight Practice"]},
 {theme:"SYSTEMIZE & IMPROVE",words:["process","system","method","framework","improve","efficient","workflow"],directions:["Methodology Productization","Knowledge Licensing Lab","Independent Project Producer"]},
 {theme:"CREATE & COMMUNICATE",words:["write","create","design","research","publish","content","idea"],directions:["Specialist Publication or Briefing","Expert-Led Experience Business","Curator or Collector-to-Educator"]},
 {theme:"BUILD & LEAD",words:["build","lead","manage","launch","business","team","develop"],directions:["Niche Acquisition Entrepreneur","Community Venture Builder","Independent Project Producer"]}
];
export function synthesizeDiscovery(knowledge:Record<string,string>,wanted:string[],avoid:string[],profile:DiscoveryProfile,universe:Possibility[]):Synthesis{
 const text=Object.values(knowledge).join(" ").toLowerCase();
 const scored=dictionaries.map(d=>({...d,score:d.words.reduce((n,w)=>n+(text.includes(w)?1:0),0)})).sort((a,b)=>b.score-a.score);
 const active=scored.filter(x=>x.score>0).slice(0,3);
 const themes=active.length?active.map(x=>x.theme):["EXPERIENCE WORTH EXAMINING"];
 const directions=[...new Set(active.flatMap(x=>x.directions))].slice(0,6);
 const strong=profile.axes.filter(a=>Math.abs(a.value)>=2).sort((a,b)=>Math.abs(b.value)-Math.abs(a.value)).slice(0,2);
 const lean=strong.map(a=>(a.value<0?a.left:a.right).toLowerCase());
 const observations=[
   active.length?("Your answers repeatedly point toward "+active.map(x=>x.theme.toLowerCase()).join(", ")+"."):"Your answers are beginning to reveal where accumulated experience may contain reusable value.",
   wanted.length?("You’ve also asked for more "+wanted.slice(0,3).join(", ").toLowerCase()+"."):"We’re still learning what you want more of.",
   avoid.length?("At the same time, you appear interested in avoiding "+avoid.slice(0,3).join(", ").toLowerCase()+"."):"We’re still learning which conditions you would prefer to discard.",
   lean.length?("Your emerging profile currently leans "+lean.join(" and ")+"."):"Your profile is still deliberately open."
 ];
 const fallback=universe.filter(p=>p.lane==="SURPRISE ME").map(p=>p.title);
 const unexpected=fallback.find(x=>!directions.includes(x))||"A direction outside your current field of view";
 return {headline:active.length>1?"There may be a useful combination hiding in plain sight.":"Your experience may contain more than one direction.",observations,themes,directions:directions.length?directions:universe.slice(0,5).map(x=>x.title),unexpected};
}
