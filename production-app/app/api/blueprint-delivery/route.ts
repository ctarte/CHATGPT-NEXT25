import {NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";
import {getPurchaseAccess} from "@/lib/entitlements";

// Read-only customer delivery status. A report is released only when a
// server-controlled approval record exists. No client input selects a user.
export const dynamic="force-dynamic";
export const revalidate=0;

export async function GET(){
 try{
  const supabase=await createClient();
  const {data:{user},error:authError}=await supabase.auth.getUser();
  if(authError||!user)return NextResponse.json({error:"Sign in to view your Blueprint delivery."},{status:401});
  const access=await getPurchaseAccess();
  if(!access.discovery)return NextResponse.json({status:"ACCESS_REQUIRED",downloadAvailable:false},{headers:{"Cache-Control":"private, no-store"}});
  // Until the audited approval, private storage, and release database are
  // connected, fail closed. Never infer release from Discovery completion.
  return NextResponse.json({status:"IN_PROGRESS",downloadAvailable:false,
   message:"Your working Blueprint is available while Discovery continues. A final PDF is not yet released."},
   {headers:{"Cache-Control":"private, no-store"}});
 }catch{
  return NextResponse.json({error:"Unable to verify Blueprint delivery status."},{status:503});
 }
}
