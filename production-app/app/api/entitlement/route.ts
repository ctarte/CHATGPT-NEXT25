import {NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";

export async function GET(){
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)return NextResponse.json({entitled:false},{status:401});
 const {data,error}=await supabase.from("purchase_entitlements")
  .select("entitlement,granted_at")
  .eq("user_id",user.id)
  .eq("entitlement","FOUNDING_CLIENT")
  .eq("payment_status","paid")
  .order("granted_at",{ascending:false})
  .limit(1)
  .maybeSingle();
 if(error)return NextResponse.json({entitled:false},{status:500});
 return NextResponse.json({entitled:Boolean(data),entitlement:data?.entitlement||null,grantedAt:data?.granted_at||null});
}
