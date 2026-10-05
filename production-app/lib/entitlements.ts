import "server-only";
import {createClient} from "@/lib/supabase/server";

export async function hasFoundingClientEntitlement(){
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)return false;
 const {data,error}=await supabase.from("purchase_entitlements")
  .select("id")
  .eq("user_id",user.id)
  .eq("entitlement","FOUNDING_CLIENT")
  .eq("payment_status","paid")
  .limit(1)
  .maybeSingle();
 if(error)return false;
 return Boolean(data);
}
