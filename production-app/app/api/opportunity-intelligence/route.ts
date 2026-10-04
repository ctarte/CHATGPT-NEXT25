import {NextResponse} from "next/server";
import {runLiveIntelligence} from "../../../lib/discovery/liveIntelligenceWorkflow";
import {braveResearchProvider} from "../../../lib/research/brave";
import {loadDiscoveryRecord,saveDiscoveryRecord} from "../../../lib/discovery/persistence";
import type {DiscoveryRecord} from "../../../lib/discovery/record";

export const maxDuration=60;

export async function POST(req:Request){
 try{
  const body=await req.json() as {opportunity?:string;path?:"CAREER"|"BUSINESS"|"BOTH"};
  const opportunity=body.opportunity?.trim();
  const path=body.path;
  if(!opportunity||!path||!["CAREER","BUSINESS","BOTH"].includes(path))return NextResponse.json({error:"A valid opportunity and pathway are required."},{status:400});
  if(opportunity.length>180)return NextResponse.json({error:"Opportunity name is too long."},{status:400});
  const stored=await loadDiscoveryRecord();
  if(!stored?.record)return NextResponse.json({error:"Sign in before starting Opportunity Intelligence."},{status:401});
  const pkg=await runLiveIntelligence({opportunity,path,provider:braveResearchProvider});
  const record=stored.record as unknown as DiscoveryRecord;
  await saveDiscoveryRecord({...record,version:2,
   evidenceDossiers:{...(record.evidenceDossiers||{}),[opportunity]:pkg.dossier},
   readiness:{...(record.readiness||{}),[opportunity]:pkg.readiness},
   decisionBriefs:{...(record.decisionBriefs||{}),[opportunity]:pkg.decisionBrief}
  });
  return NextResponse.json({package:pkg});
 }catch(e){
  const message=e instanceof Error?e.message:"Unable to complete Opportunity Intelligence.";
  return NextResponse.json({error:message},{status:message.includes("BRAVE_SEARCH_API_KEY")?503:500});
 }
}
