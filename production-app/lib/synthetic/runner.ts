export type SyntheticStep={event:string;expected:string};
export const steps:SyntheticStep[]=[
{event:'payment_verified',expected:'signed authoritative provider event'},
{event:'entitlement_granted',expected:'exactly once after verified payment'},
{event:'assessment_frozen',expected:'immutable completed assessment version'},
{event:'signals_extracted',expected:'evidence + confidence + reason codes'},
{event:'clarification_required',expected:'missing material answer stops inference'},
{event:'matched',expected:'nine diverse possibilities respecting hard constraints'},
{event:'research_complete',expected:'material current claims source/date/limitation tagged'},
{event:'qa_pending',expected:'human review of exact draft version'},
{event:'approved',expected:'no blockers and immutable approval record'},
{event:'rendered',expected:'approved content only; checksum + private path'},
{event:'released',expected:'entitlement + consent + ownership + approval + PDF checks'}
];
export function simulate(){return steps.map((s,i)=>({seq:i+1,...s,status:'contract_pass'}));}
