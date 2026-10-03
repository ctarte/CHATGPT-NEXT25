export type EvidenceStatus="SUPPORTED"|"MIXED"|"UNRESOLVED"|"CONTRADICTED";
export type EvidenceLens="MARKET"|"BUYER"|"ECONOMICS"|"ENTRY"|"GEOGRAPHY"|"COMPETITION"|"CHANGE"|"COUNTER_EVIDENCE"|"TEST";
export type SourceAuthority="PRIMARY"|"AUTHORITATIVE"|"INDUSTRY"|"MARKET_SIGNAL"|"ANECDOTAL";
export type EvidenceBasis="DIRECT"|"INFERRED"|"SYNTHESIZED";

export type EvidenceSource={
 label:string;
 url:string;
 publisher?:string;
 publishedAt?:string;
 checkedAt:string;
 authority:SourceAuthority;
 basis:EvidenceBasis;
 supports:"SUPPORTS"|"CHALLENGES"|"CONTEXT";
 note?:string;
};

export type EvidenceItem={
  lens:EvidenceLens;
  question:string;
  whyItMatters:string;
  status:EvidenceStatus;
  finding?:string;
  sources?:EvidenceSource[];
  uncertainty?:string;
  nextVerification?:string;
};

export type EvidenceDossier={
  opportunity:string;
  path:"CAREER"|"BUSINESS"|"BOTH";
  hypothesis:string;
  items:EvidenceItem[];
};

const shared:EvidenceItem[]=[
 {lens:"MARKET",question:"Is there current, observable demand for this work?",whyItMatters:"An attractive idea still needs a real market.",status:"UNRESOLVED"},
 {lens:"ECONOMICS",question:"What do realistic earnings, pricing and costs look like?",whyItMatters:"The economics must fit the life and income the customer is designing for.",status:"UNRESOLVED"},
 {lens:"GEOGRAPHY",question:"Where does this opportunity actually exist?",whyItMatters:"Demand may be local, concentrated, remote or broadly accessible.",status:"UNRESOLVED"},
 {lens:"CHANGE",question:"What could make this opportunity stronger or weaker over the next several years?",whyItMatters:"Technology, AI, regulation and demographic change can move value quickly.",status:"UNRESOLVED"},
 {lens:"COUNTER_EVIDENCE",question:"What evidence would make us advise against pursuing this version?",whyItMatters:"The goal is to test the hypothesis, not defend it.",status:"UNRESOLVED"},
 {lens:"TEST",question:"What is the smallest credible real-world test?",whyItMatters:"A low-risk experiment can reveal more than another round of speculation.",status:"UNRESOLVED"}
];

export function createEvidenceDossier(opportunity:string,path:"CAREER"|"BUSINESS"|"BOTH"):EvidenceDossier{
 const career:EvidenceItem[]=[
  {lens:"BUYER",question:"Which employers are hiring for work that resembles this direction?",whyItMatters:"Named employers and adjacent roles make demand concrete.",status:"UNRESOLVED"},
  {lens:"ENTRY",question:"Which skills or credentials are truly required, and which are merely preferred?",whyItMatters:"We should distinguish real barriers from intimidating job-description language.",status:"UNRESOLVED"}
 ];
 const business:EvidenceItem[]=[
  {lens:"BUYER",question:"Who has the problem, budget and reason to buy this?",whyItMatters:"A business opportunity becomes real only when a specific customer has a reason to pay.",status:"UNRESOLVED"},
  {lens:"COMPETITION",question:"What alternatives are customers already paying for?",whyItMatters:"Competition can validate demand while revealing how the offer must differ.",status:"UNRESOLVED"},
  {lens:"ENTRY",question:"What capital, licensing, suppliers or operating capabilities are actually required?",whyItMatters:"Startup effort should be visible before the customer becomes attached to the idea.",status:"UNRESOLVED"}
 ];
 const items=[...shared,...(path==="CAREER"?career:path==="BUSINESS"?business:[...career,...business])];
 return {opportunity,path,hypothesis:"This direction has earned investigation because it fits discovery evidence. It has not yet earned a recommendation.",items};
}

export function evidenceSummary(dossier:EvidenceDossier){
 const counts=dossier.items.reduce((a,x)=>({...a,[x.status]:(a[x.status]||0)+1}),{} as Record<EvidenceStatus,number>);
 const unresolved=counts.UNRESOLVED||0;
 return {
  supported:counts.SUPPORTED||0,
  mixed:counts.MIXED||0,
  contradicted:counts.CONTRADICTED||0,
  unresolved,
  ready:unresolved===0,
  language:unresolved?"RESEARCH IN PROGRESS — IMPORTANT QUESTIONS ARE STILL OPEN.":"THE EVIDENCE HAS BEEN ASSEMBLED. NOW WE INTERPRET WHAT IT MEANS."
 };
}


export function auditEvidenceItem(item:EvidenceItem){
 const sources=item.sources||[];
 const primary=sources.filter(s=>s.authority==="PRIMARY"||s.authority==="AUTHORITATIVE").length;
 const challenges=sources.filter(s=>s.supports==="CHALLENGES").length;
 const dated=sources.filter(s=>Boolean(s.publishedAt)).length;
 return {
  sourceCount:sources.length,
  primaryOrAuthoritative:primary,
  contradictorySources:challenges,
  datedSources:dated,
  auditable:sources.length>0&&sources.every(s=>Boolean(s.url&&s.checkedAt)),
  caution:sources.length===0?"NO OUTSIDE EVIDENCE ATTACHED YET.":challenges>0?"CONTRADICTORY EVIDENCE IS PRESENT — INTERPRET, DON’T AVERAGE IT AWAY.":primary===0?"EVIDENCE EXISTS, BUT NO PRIMARY OR AUTHORITATIVE SOURCE IS ATTACHED YET.":"SOURCE TRAIL PRESENT."
 };
}

export function dossierAudit(dossier:EvidenceDossier){
 const audits=dossier.items.map(auditEvidenceItem);
 return {
  sourceCount:audits.reduce((n,a)=>n+a.sourceCount,0),
  auditableItems:audits.filter(a=>a.auditable).length,
  challengedItems:audits.filter(a=>a.contradictorySources>0).length,
  totalItems:audits.length
 };
}
