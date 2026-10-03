import type {EvidenceLens,SourceAuthority} from "./evidence";

export type ResearchQuery={
 lens:EvidenceLens;
 question:string;
 searches:string[];
 preferredAuthorities:SourceAuthority[];
 freshnessDays:number;
 minimumIndependentSources:number;
 contradictionSearch?:string;
};

export type ResearchPlan={
 opportunity:string;
 path:"CAREER"|"BUSINESS"|"BOTH";
 category:"EMPLOYMENT"|"ADVISORY"|"EDUCATION"|"CREATOR"|"ACQUISITION"|"SERVICE_BUSINESS"|"GENERAL";
 queries:ResearchQuery[];
};

function classify(title:string,path:ResearchPlan["path"]):ResearchPlan["category"]{
 const t=title.toLowerCase();
 if(/fractional|adviser|advisor|consult|expert/.test(t))return "ADVISORY";
 if(/teach|learning|course|education|workshop/.test(t))return "EDUCATION";
 if(/publish|write|creator|media|newsletter/.test(t))return "CREATOR";
 if(/acquisition|buy a business|search fund/.test(t))return "ACQUISITION";
 if(path==="CAREER")return "EMPLOYMENT";
 if(path==="BUSINESS")return "SERVICE_BUSINESS";
 return "GENERAL";
}

const base=(opportunity:string):ResearchQuery[]=>[
 {lens:"MARKET",question:"Can we observe current demand?",searches:[`${opportunity} demand market 2026`,`${opportunity} hiring customers 2026`],preferredAuthorities:["PRIMARY","AUTHORITATIVE","INDUSTRY"],freshnessDays:365,minimumIndependentSources:2,contradictionSearch:`${opportunity} decline layoffs closures challenges 2026`},
 {lens:"ECONOMICS",question:"What are realistic economics—not exceptional success stories?",searches:[`${opportunity} compensation rates pricing revenue costs 2026`],preferredAuthorities:["PRIMARY","AUTHORITATIVE","INDUSTRY"],freshnessDays:730,minimumIndependentSources:2,contradictionSearch:`${opportunity} low pay margin pressure pricing challenges`},
 {lens:"CHANGE",question:"What is changing the value of this work?",searches:[`${opportunity} AI automation technology regulation trends 2026`],preferredAuthorities:["PRIMARY","AUTHORITATIVE","INDUSTRY"],freshnessDays:365,minimumIndependentSources:2,contradictionSearch:`${opportunity} displaced automated obsolete risk`}
];

const categoryQueries=(category:ResearchPlan["category"],opportunity:string):ResearchQuery[]=>{
 if(category==="EMPLOYMENT")return [
  {lens:"BUYER",question:"Which employers are hiring adjacent roles now?",searches:[`${opportunity} jobs employers hiring`],preferredAuthorities:["PRIMARY","AUTHORITATIVE"],freshnessDays:90,minimumIndependentSources:3},
  {lens:"ENTRY",question:"Which qualifications recur across actual openings?",searches:[`${opportunity} job requirements qualifications`],preferredAuthorities:["PRIMARY"],freshnessDays:90,minimumIndependentSources:5}
 ];
 if(category==="ADVISORY")return [
  {lens:"BUYER",question:"Which buyers retain outside expertise for this problem?",searches:[`${opportunity} clients companies hire consultant fractional`],preferredAuthorities:["PRIMARY","INDUSTRY"],freshnessDays:365,minimumIndependentSources:3},
  {lens:"COMPETITION",question:"How are comparable experts positioned and sold?",searches:[`${opportunity} consulting firms fractional services pricing`],preferredAuthorities:["PRIMARY","INDUSTRY","MARKET_SIGNAL"],freshnessDays:365,minimumIndependentSources:3}
 ];
 if(category==="EDUCATION")return [
  {lens:"BUYER",question:"Who pays to learn this, and in what format?",searches:[`${opportunity} course workshop training buyers`],preferredAuthorities:["PRIMARY","INDUSTRY","MARKET_SIGNAL"],freshnessDays:365,minimumIndependentSources:3},
  {lens:"COMPETITION",question:"What learning alternatives already exist?",searches:[`${opportunity} courses workshops certification alternatives`],preferredAuthorities:["PRIMARY","MARKET_SIGNAL"],freshnessDays:365,minimumIndependentSources:4}
 ];
 if(category==="ACQUISITION")return [
  {lens:"ENTRY",question:"What capital, financing and operator requirements shape entry?",searches:[`${opportunity} acquisition financing SBA equity requirements`],preferredAuthorities:["PRIMARY","AUTHORITATIVE","INDUSTRY"],freshnessDays:365,minimumIndependentSources:3},
  {lens:"MARKET",question:"Is there a healthy supply of businesses matching this thesis?",searches:[`${opportunity} businesses for sale multiples deal volume 2026`],preferredAuthorities:["AUTHORITATIVE","INDUSTRY","MARKET_SIGNAL"],freshnessDays:365,minimumIndependentSources:3}
 ];
 return [
  {lens:"BUYER",question:"Who has the problem and budget to pay for this?",searches:[`${opportunity} customers buyers use cases`],preferredAuthorities:["PRIMARY","INDUSTRY","MARKET_SIGNAL"],freshnessDays:365,minimumIndependentSources:3},
  {lens:"COMPETITION",question:"What are buyers using instead?",searches:[`${opportunity} competitors alternatives pricing`],preferredAuthorities:["PRIMARY","INDUSTRY","MARKET_SIGNAL"],freshnessDays:365,minimumIndependentSources:3}
 ];
};

export function buildResearchPlan(opportunity:string,path:ResearchPlan["path"]):ResearchPlan{
 const category=classify(opportunity,path);
 return {opportunity,path,category,queries:[...base(opportunity),...categoryQueries(category,opportunity),{lens:"COUNTER_EVIDENCE",question:"What would make us stop pursuing this version?",searches:[`${opportunity} failure challenges complaints declining demand`],preferredAuthorities:["PRIMARY","AUTHORITATIVE","INDUSTRY","MARKET_SIGNAL"],freshnessDays:730,minimumIndependentSources:2,contradictionSearch:`${opportunity} evidence of durable demand growth`}]};
}
