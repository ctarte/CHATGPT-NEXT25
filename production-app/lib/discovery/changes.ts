export type ChangeSignal={label:string;value:string;tone:"stronger"|"new"|"friction"|"unexpected"|"open"};
export function buildChangeSignals(wanted:string[],avoid:string[],quick:Record<number,string>,round:number,positiveCount:number):ChangeSignal[]{
 const q=Object.values(quick);
 const out:ChangeSignal[]=[];
 if(wanted.length)out.push({label:"GETTING STRONGER",value:wanted.slice(0,2).join(" + "),tone:"stronger"});
 if(q[0])out.push({label:"NEW SIGNAL",value:q[0],tone:"new"});
 if(avoid.length)out.push({label:"REPEATED FRICTION",value:avoid.slice(0,2).join(" + "),tone:"friction"});
 if(q.includes("Entering an unfamiliar field")||q.includes("A new experience"))out.push({label:"UNEXPECTED OPENNESS",value:"You appear willing to look beyond familiar territory.",tone:"unexpected"});
 if(positiveCount>0)out.push({label:"REACTION EVIDENCE",value:positiveCount+" possibilities earned a closer look in round "+round+".",tone:"stronger"});
 out.push({label:"STILL OPEN",value:q[2]?"How that stretch would feel in real-world practice.":"How much stretch, visibility or uncertainty will actually feel right.",tone:"open"});
 return out.slice(0,6);
}
