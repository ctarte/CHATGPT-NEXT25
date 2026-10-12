import {NextResponse} from "next/server";
import {createClient} from "../../../lib/supabase/server";

export const dynamic="force-dynamic";
export const revalidate=0;

/** Read-only purchase eligibility. Round consumption is deliberately NOT authorized here. */
export async function GET(){
 try{
  const db=await createClient();
  const {data:{user},error:authError}=await db.auth.getUser();
  if(authError||!user)return NextResponse.json({authenticated:false,hasDiscovery:false,canStartAdditionalRound:false},{status:401,headers:{"Cache-Control":"no-store"}});
  const {data,error}=await db.from("purchase_entitlements")
   .select("entitlement").eq("user_id",user.id).eq("payment_status","paid");
  if(error)throw error;
  const tiers=new Set((data||[]).map(row=>row.entitlement));
  const hasDiscovery=["DISCOVERY","OPPORTUNITY_INTELLIGENCE","FOUNDING_CLIENT"].some(t=>tiers.has(t));
  const hasOpportunityIntelligence=tiers.has("OPPORTUNITY_INTELLIGENCE")||tiers.has("FOUNDING_CLIENT")||tiers.has("OPPORTUNITY_INTELLIGENCE_UPGRADE")&&hasDiscovery;
  return NextResponse.json({authenticated:true,hasDiscovery,hasOpportunityIntelligence,canStartAdditionalRound:false,roundAllowanceStatus:"not_yet_enforced"},{headers:{"Cache-Control":"no-store"}});
 }catch{
  return NextResponse.json({error:"Unable to verify purchase access.",canStartAdditionalRound:false},{status:503,headers:{"Cache-Control":"no-store"}});
 }
}
