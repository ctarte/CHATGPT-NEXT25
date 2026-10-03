export type BlueprintInput={signals:string[];discard:string[];field:string[];unexpected:string[];knowledge:string[];briefs:string[];experiments:string[];openQuestions:string[];decisionBriefs?:string[];readiness?:string[]};
export type BlueprintSection={number:string;title:string;purpose:string;items:string[];status:"EVIDENCE"|"DEVELOPING"|"RESEARCH"};
export function assembleBlueprint(i:BlueprintInput):BlueprintSection[]{return[
 {number:"01",title:"WHAT WE DISCOVERED",purpose:"The strongest themes emerging from your choices and reactions.",items:i.signals.length?i.signals:["More discovery evidence needed."],status:"EVIDENCE"},
 {number:"02",title:"CONDITIONS TO DISCARD",purpose:"Conditions you have indicated you do not want to recreate.",items:i.discard.length?i.discard:["No Conditions to Discard recorded yet."],status:"EVIDENCE"},
 {number:"03",title:"YOUR DISCOVERY FIELD",purpose:"Possibilities you decided were worth keeping in view.",items:i.field.length?i.field:["No possibilities preserved in the field yet."],status:"DEVELOPING"},
 {number:"04",title:"THE UNEXPECTED",purpose:"Directions that expanded the field beyond the obvious.",items:i.unexpected.length?i.unexpected:["No unexpected direction preserved yet."],status:"DEVELOPING"},
 {number:"05",title:"WHAT YOU KNOW",purpose:"Experience, expertise, methods and ideas that may deserve a different future.",items:i.knowledge.length?i.knowledge:["What You Know reflections are still open."],status:"DEVELOPING"},
 {number:"06",title:"OPPORTUNITY DEEP DIVES",purpose:"Possibilities selected for factual investigation.",items:i.briefs.length?i.briefs:["No Opportunity Brief opened yet."],status:"RESEARCH"},
 {number:"07",title:"OPPORTUNITY DECISION BRIEFS",purpose:"Executive synthesis of what looks encouraging, what still needs proof and how far the evidence justifies going.",items:i.decisionBriefs?.length?i.decisionBriefs:["No opportunity has reached Decision Brief stage yet."],status:"RESEARCH"},
 {number:"08",title:"READINESS",purpose:"A multidimensional view of personal fit, market evidence, economics, entry feasibility, real-world response, risk and reversibility.",items:i.readiness?.length?i.readiness:["Readiness develops as research and experiments produce evidence."],status:"EVIDENCE"},
 {number:"09",title:"EXPERIMENTS",purpose:"Small real-world tests designed to produce evidence before commitment.",items:i.experiments.length?i.experiments:["No real-world experiment planned yet."],status:"EVIDENCE"},
 {number:"10",title:"QUESTIONS STILL WORTH ANSWERING",purpose:"Important uncertainties that should remain visible rather than be guessed away.",items:i.openQuestions.length?i.openQuestions:["Continue discovery to surface the next research question."],status:"RESEARCH"}
]};
