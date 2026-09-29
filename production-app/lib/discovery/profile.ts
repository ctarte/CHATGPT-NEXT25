export type ProfileAxis={left:string;right:string;value:number;confidence:number};
export type DiscoveryProfile={axes:ProfileAxis[];summary:string[]};
const signalMap:Record<string,number[]>={"Independence":[-2,1,0,0,-1,0,-2,1],"Intellectual challenge":[-1,0,-2,-2,0,0,0,1],"Creativity":[-1,1,2,1,1,1,0,2],"Income":[0,-1,-1,0,0,-1,0,-1],"Flexibility":[-2,2,1,1,0,1,-1,1],"Adventure":[0,2,1,1,1,2,0,1],"Meaning":[0,0,0,0,1,0,1,1],"Learning":[0,1,-1,-2,0,1,0,1],"Teaching":[0,0,0,-1,2,0,2,2],"Building something":[-1,1,1,1,1,1,0,-2],"Travel":[0,2,0,1,1,2,0,1],"Contribution":[0,0,0,0,1,0,2,2]};
const conditionMap:Record<string,number[]>={"Employees":[-2,0,0,-1,-1,0,-2,2],"Office politics":[-2,1,0,0,-1,0,-1,1],"Commuting":[-1,2,0,0,0,1,-1,0],"Selling":[0,0,0,0,-2,0,-1,2],"Long hours":[0,1,0,0,0,0,0,1],"Fixed schedules":[-1,2,0,0,0,1,0,1],"Management":[-1,0,0,-1,0,0,-2,2],"Financial risk":[0,-1,0,0,0,-2,0,1],"Administrative work":[-1,1,0,0,0,0,-1,2],"Constant availability":[-1,2,0,0,0,0,-1,1],"Isolation":[1,0,0,0,1,0,2,0],"Repetition":[0,1,1,1,0,2,0,1],"High pressure":[0,1,0,0,0,-1,0,1]};
const labels=[["INDEPENDENT","COLLABORATIVE"],["STRUCTURED","FLEXIBLE"],["ANALYTICAL","INTUITIVE"],["SPECIALIST","GENERALIST"],["PRIVATE","VISIBLE"],["STEADY","ADVENTUROUS"],["SOLO","PEOPLE-INTENSIVE"],["OPERATOR","ADVISER · TEACHER · CREATOR"]];
export function buildDiscoveryProfile(wanted:string[],avoid:string[]):DiscoveryProfile{
 const score=new Array(8).fill(0),evidence=new Array(8).fill(0);
 for(const x of wanted){const v=signalMap[x];if(v)v.forEach((n,i)=>{score[i]+=n;if(n)evidence[i]++})}
 for(const x of avoid){const v=conditionMap[x];if(v)v.forEach((n,i)=>{score[i]+=n;if(n)evidence[i]++})}
 const axes=labels.map((x,i)=>({left:x[0],right:x[1],value:Math.max(-4,Math.min(4,score[i])),confidence:Math.min(100,25+evidence[i]*12)}));
 const ranked=axes.map((a,i)=>({...a,i,strength:Math.abs(a.value)})).sort((a,b)=>b.strength-a.strength).slice(0,3);
 const phrase=(a:any)=>a.value<0?a.left.toLowerCase():a.right.toLowerCase();
 const first=ranked.length?("Your early signals lean "+phrase(ranked[0])+(ranked[1]?(" and "+phrase(ranked[1])):"")+"."):"We’re still gathering enough signals to see a pattern.";
 return {axes,summary:[first,"This is not a personality label. It is a working picture built from what attracts you—and the conditions you would rather discard.","The picture can change as you react to more possibilities."]};
}
