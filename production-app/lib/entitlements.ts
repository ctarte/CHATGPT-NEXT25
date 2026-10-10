import "server-only";
import {createClient} from "@/lib/supabase/server";

export type PurchaseTier = "DISCOVERY" | "OPPORTUNITY_INTELLIGENCE" | "FOUNDING_CLIENT" | "OPPORTUNITY_INTELLIGENCE_UPGRADE";

export async function getPurchaseAccess(){
 const supabase=await createClient();
 const {data:{user},error:authError}=await supabase.auth.getUser();
 if(authError||!user)return {authenticated:false,discovery:false,opportunityIntelligence:false};
 const {data,error}=await supabase.from("purchase_entitlements")
  .select("entitlement")
  .eq("user_id",user.id)
  .eq("payment_status","paid")
  .in("entitlement",["DISCOVERY","OPPORTUNITY_INTELLIGENCE","FOUNDING_CLIENT","OPPORTUNITY_INTELLIGENCE_UPGRADE"]);
 if(error)return {authenticated:true,discovery:false,opportunityIntelligence:false};
 const tiers=new Set((data||[]).map(row=>row.entitlement as PurchaseTier));
 const full=tiers.has("FOUNDING_CLIENT")||tiers.has("OPPORTUNITY_INTELLIGENCE");
 const discovery=full||tiers.has("DISCOVERY");
 // An upgrade is valid only when accompanied by a paid Discovery entitlement.
 const premium=full||(tiers.has("DISCOVERY")&&tiers.has("OPPORTUNITY_INTELLIGENCE_UPGRADE"));
 return {authenticated:true,discovery,opportunityIntelligence:premium};
}

// Legacy founding-client purchases remain eligible for premium access.
export async function hasFoundingClientEntitlement(){
 return (await getPurchaseAccess()).opportunityIntelligence;
}
