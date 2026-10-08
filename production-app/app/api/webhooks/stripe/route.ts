import Stripe from "stripe";
import {createClient as createAdminClient} from "@supabase/supabase-js";
import {serverEnv} from "@/lib/server/env";

function adminClient(){
 const url=process.env.NEXT25_SUPABASE_URL||process.env.SUPABASE_URL;
 const key=process.env.NEXT25_SUPABASE_SERVICE_ROLE_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY||process.env.NEXT25_SUPABASE_SECRET_KEY||process.env.SUPABASE_SECRET_KEY;
 if(!url||!key)throw new Error("Server persistence is not configured.");
 return createAdminClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
}

export async function POST(req:Request){
 const e=serverEnv();
 const stripe=new Stripe(e.stripeSecret);
 const sig=req.headers.get("stripe-signature");
 if(!sig)return new Response("Missing signature",{status:400});

 let event:Stripe.Event;
 try{event=stripe.webhooks.constructEvent(await req.text(),sig,e.stripeWebhook)}
 catch{return new Response("Invalid signature",{status:400})}

 if(event.type==="checkout.session.completed"){
  const session=event.data.object as Stripe.Checkout.Session;
  const userId=session.client_reference_id||session.metadata?.user_id;
  if(!userId||session.metadata?.user_id!==userId)return new Response("Invalid customer reference",{status:400});
  if(session.mode!=="payment"||session.payment_status!=="paid")return new Response("Payment not complete",{status:400});
  if(session.metadata?.expected_price_id!==e.priceId)return new Response("Unexpected product",{status:400});

  let verified=false;
  try{
   const items=await stripe.checkout.sessions.listLineItems(session.id,{limit:10});
   verified=items.data.some(item=>item.price?.id===e.priceId&&item.quantity===1);
  }catch{return new Response("Unable to verify purchase",{status:500})}
  if(!verified)return new Response("Unexpected purchase",{status:400});

  try{
   const db=adminClient();
   const {error}=await db.from("purchase_entitlements").upsert({
    user_id:userId,
    stripe_session_id:session.id,
    stripe_event_id:event.id,
    stripe_payment_intent_id:typeof session.payment_intent==="string"?session.payment_intent:null,
    price_id:e.priceId,
    payment_status:"paid",
    entitlement:"FOUNDING_CLIENT"
   },{onConflict:"stripe_session_id",ignoreDuplicates:true});
   if(error)throw error;
  }catch(error:unknown){
   // Log only allowlisted diagnostic fields. Never log payloads, credentials, user IDs or session IDs.
   const diagnostic=error&&typeof error==="object"?error as Record<string,unknown>:null;
   const code=diagnostic&&typeof diagnostic.code==="string"&&/^[A-Za-z0-9_]{1,32}$/.test(diagnostic.code)?diagnostic.code:"unknown";
   const status=diagnostic&&typeof diagnostic.status==="number"&&Number.isInteger(diagnostic.status)?diagnostic.status:null;
   const kind=diagnostic&&typeof diagnostic.name==="string"&&/^[A-Za-z]{1,40}$/.test(diagnostic.name)?diagnostic.name:"unknown";
   console.error("Stripe purchase persistence failed",{code,status,kind});
   return new Response("Unable to record purchase",{status:500});
  }
 }
 return new Response("ok");
}
