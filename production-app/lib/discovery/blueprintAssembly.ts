export type BlueprintInput={signals:string[];discard:string[];field:string[];unexpected:string[];knowledge:string[];briefs:string[];experiments:string[];openQuestions:string[]};
export type BlueprintSection={number:string;title:string;purpose:string;items:string[];status:"EVIDENCE"|"DEVELOPING"|"RESEARCH"};
export function assembleBlueprint(i:BlueprintInput):BlueprintSection[]{return[
 {number:"01",title:"WHAT WE DISCOVERED",purpose:"The strongest themes emerging from your choices and reactions.",items:i.signals,status:"EVIDENCE"},
 {number:"02",title:"CONDITIONS TO DISCARD",purpose:"Conditions you have indicated you do not want to recreate.",items:i.discard,status:"EVIDENCE"},
 {number:"03",title:"YOUR DISCOVERY FIELD",purpose:"Possibilities you decided were worth keeping in view.",items:i.field,status:"DEVELOPING"},
 {number:"04",title:"THE UNEXPECTED",purpose:"Directions that expanded the field beyond the obvious.",items:i.unexpected,status:"DEVELOPING"},
 {number:"05",title:"WHAT YOU KNOW",purpose:"Experience, expertise, methods and ideas that may deserve a different future.",items:i.knowledge,status:"DEVELOPING"},
 {number:"06",title:"OPPORTUNITY DEEP DIVES",purpose:"Possibilities selected for factual investigation.",items:i.briefs,status:"RESEARCH"},
 {number:"07",title:"EXPERIMENTS",purpose:"Small real-world tests designed to produce evidence before commitment.",items:i.experiments,status:"EVIDENCE"},
 {number:"08",title:"QUESTIONS STILL WORTH ANSWERING",purpose:"Important uncertainties that should remain visible rather than be guessed away.",items:i.openQuestions,status:"RESEARCH"}
]};
