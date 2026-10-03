import type {ResearchPlan} from "./researchIntelligence";
import type {OpportunityIntelligence} from "./opportunityIntelligence";

export type ExperimentType="CONVERSATION"|"APPLICATION"|"OFFER"|"PROTOTYPE"|"PRESELL"|"SHADOW"|"MICRO_PILOT"|"ACQUISITION_SCREEN";
export type Experiment={
 id:string;
 type:ExperimentType;
 title:string;
 assumption:string;
 action:string;
 audience:string;
 targetCount:number;
 timeboxDays:number;
 maxSpend:number;
 successSignals:string[];
 cautionSignals:string[];
 failureSignals:string[];
 evidenceToCapture:string[];
 stopRule:string;
 nextIfStrong:string;
 nextIfWeak:string;
};

const money=(n:number)=>Math.max(0,Math.round(n));

export function designExperiment(intel:OpportunityIntelligence,budget=250,timeboxDays=14):Experiment{
 const p=intel.job.plan;
 const category=p.category;
 const id=`${intel.job.id}-experiment-1`;
 if(category==="EMPLOYMENT")return {id,type:"APPLICATION",title:"Test whether the market recognizes your fit",assumption:"Real employers will respond to this positioning when your transferable value is made explicit.",action:"Create one focused positioning statement and use it in a small set of carefully matched applications or direct conversations.",audience:"Employers or hiring leaders in the target role",targetCount:5,timeboxDays:Math.min(timeboxDays,14),maxSpend:0,successSignals:["2+ substantive responses","1+ interview or exploratory conversation"],cautionSignals:["Interest only after major credential changes"],failureSignals:["No substantive response after five well-matched attempts"],evidenceToCapture:["role","employer","response","objection","language that resonated"],stopRule:"Stop after five qualified attempts and interpret the pattern before sending more.",nextIfStrong:"Refine positioning and expand the test.",nextIfWeak:"Return objections to Discovery and redesign the role or entry path."};
 if(category==="ADVISORY"||category==="SERVICE_BUSINESS")return {id,type:"OFFER",title:"See whether a real buyer leans forward",assumption:"A specific buyer has enough pain and budget to engage with this offer.",action:"Present a narrowly defined sample offer to qualified prospective buyers without building a full business around it.",audience:"Prospective buyers with the problem the offer addresses",targetCount:5,timeboxDays:Math.min(timeboxDays,14),maxSpend:money(Math.min(budget,250)),successSignals:["2+ ask substantive follow-up questions","1+ requests proposal, pilot or pricing"],cautionSignals:["Interest but unclear willingness to pay"],failureSignals:["Prospects consistently say the problem is not important or already solved"],evidenceToCapture:["problem wording","buyer reaction","objection","price reaction","requested outcome"],stopRule:"Do not add features to rescue the idea during the test. Capture objections first.",nextIfStrong:"Design a paid micro-pilot.",nextIfWeak:"Redesign buyer, problem or offer using the objections."};
 if(category==="EDUCATION"||category==="CREATOR")return {id,type:"MICRO_PILOT",title:"Teach the smallest useful version",assumption:"The audience will spend time or money to learn this from you.",action:"Offer one compact session, briefing or prototype lesson before creating a course, book or content engine.",audience:"A narrowly defined learner group",targetCount:8,timeboxDays:Math.min(timeboxDays,21),maxSpend:money(Math.min(budget,200)),successSignals:["5+ opt in","3+ complete","2+ ask for a next step or deeper version"],cautionSignals:["High curiosity but low completion"],failureSignals:["Qualified people do not opt in even when the promise is clear"],evidenceToCapture:["opt-ins","completion","questions","willingness to pay","requested next topic"],stopRule:"Do not build the full curriculum before the pilot is interpreted.",nextIfStrong:"Test a paid second version.",nextIfWeak:"Change audience, promise or format—not all three at once."};
 if(category==="ACQUISITION")return {id,type:"ACQUISITION_SCREEN",title:"Test the acquisition thesis before pursuing a deal",assumption:"Businesses matching the desired economics and operating fit actually exist at attainable terms.",action:"Screen a small sample of real listings or broker conversations against a fixed acquisition scorecard.",audience:"Business listings, brokers and owners",targetCount:10,timeboxDays:Math.min(timeboxDays,21),maxSpend:0,successSignals:["3+ businesses meet core thesis","1+ merits preliminary owner/broker conversation"],cautionSignals:["Fit exists only at materially higher capital requirements"],failureSignals:["The thesis repeatedly fails on price, cash flow, geography or owner dependence"],evidenceToCapture:["asking price","cash flow","owner role","financing","location","reason for sale"],stopRule:"Do not change the scorecard mid-sample to make deals qualify.",nextIfStrong:"Proceed to a deeper screen—not an offer.",nextIfWeak:"Revise one acquisition constraint and repeat."};
 return {id,type:"CONVERSATION",title:"Put the idea in contact with reality",assumption:"People close to this opportunity will recognize a real need and a plausible role for you.",action:"Conduct structured conversations using the same five questions.",audience:"People who buy, hire, perform or closely observe this work",targetCount:5,timeboxDays:Math.min(timeboxDays,14),maxSpend:0,successSignals:["Repeated unmet need","Specific next-step invitations"],cautionSignals:["Polite encouragement without concrete behavior"],failureSignals:["Consistent evidence that the need or fit is weak"],evidenceToCapture:["exact need","current alternative","objection","next action"],stopRule:"Interpret five qualified conversations before expanding.",nextIfStrong:"Design a behavioral test.",nextIfWeak:"Return the evidence to Discovery for redesign."};
}
