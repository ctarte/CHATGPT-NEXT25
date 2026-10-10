import Stripe from "stripe";
import {createClient as createAdminClient} from "@supabase/supabase-js";
import {serverEnv,configuredTierPrices,type CheckoutTier} from "@/lib/server/env";

function adminClient(){
 const url=process.env.NEXT25_SUPABASE_URL||process.env.SUPABASE_URL;
 const key=process.env.NEXT25_SUPABASE_SERVICE_ROLE_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY||process.env.NEXT25_SUPABASE_SECRET_KEY||process.env.SUPABASE_SECRET_KEY;
 if(!url||!key)throw new Error("Server persistence is not configured.");
 return createAdminClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
}

export async function POST(req:Request){
 const sig=req.headers.get("stripe-signature");
 if(!sig)return new Response("Missing signature",{status:400});
 let e:ReturnType<typeof serverEnv>;
 try{e=serverEnv()}catch{return new Response("Webhook not configured",{status:503})}
 const stripe=new Stripe(e.stripeSecret);
 let event:Stripe.Event;
 try{event=stripe.webhooks.constructEvent(await req.text(),sig,e.stripeWebhook)}
 catch{return new Response("Invalid signature",{status:400})}
 if(event.type!=="checkout.session.completed")return new Response("ok");
 // Preview currently shares database credentials with Production. Fail closed until
 // a dedicated test database is configured and this guard is deliberately enabled.
 if(process.env.VERCEL_ENV==="preview"&&process.env.NEXT25_ALLOW_PREVIEW_ENTITLEMENT_WRITES!=="true")
  return new Response("Preview entitlement persistence is disabled until test data is isolated",{status:503});

 const session=event.data.object as Stripe.Checkout.Session;
 const userId=session.client_reference_id;
 if(!userId||session.metadata?.user_id!==userId)return new Response("Invalid customer reference",{status:400});
 if(session.mode!=="payment"||session.payment_status!=="paid")return new Response("Payment not complete",{status:400});

 const tier=session.metadata?.purchase_tier;
 const prices=configuredTierPrices();
 const supported:CheckoutTier[]=["DISCOVERY","OPPORTUNITY_INTELLIGENCE","OPPORTUNITY_INTELLIGENCE_UPGRADE"];
 let entitlement:string;
 let priceId:string;
 if(tier&&supported.includes(tier as CheckoutTier)){
  const selected=tier as CheckoutTier;
  const configured=prices[selected];
  if(!configured||session.metadata?.expected_price_id!==configured)return new Response("Unexpected product",{status:400});
  entitlement=selected;
  priceId=configured;
 }else if(!tier&&session.metadata?.expected_price_id===e.priceId){
  // Preserve verified checkout sessions created before tiered checkout was introduced.
  entitlement="FOUNDING_CLIENT";
  priceId=e.priceId;
 }else return new Response("Unknown purchase type",{status:400});

 let verified=false;
 try{
  const items=await stripe.checkout.sessions.listLineItems(session.id,{limit:10});
  verified=items.data.length===1&&items.data[0].price?.id===priceId&&items.data[0].quantity===1;
 }catch{return new Response("Unable to verify purchase",{status:500})}
 if(!verified)return new Response("Unexpected purchase",{status:400});

 try{
  const db=adminClient();
  if(entitlement==="OPPORTUNITY_INTELLIGENCE_UPGRADE"){
   const {data:prior,error:lookupError}=await db.from("purchase_entitlements")
    .select("id").eq("user_id",userId).eq("payment_status","paid").eq("entitlement","DISCOVERY").limit(1).maybeSingle();
   if(lookupError)return new Response("Unable to verify upgrade eligibility",{status:500});
   if(!prior)return new Response("Upgrade requires Discovery",{status:400});
  }
  const {error}=await db.from("purchase_entitlements").upsert({
   user_id:userId,
   stripe_session_id:session.id,
   stripe_event_id:event.id,
   stripe_payment_intent_id:typeof session.payment_intent==="string"?session.payment_intent:null,
   price_id:priceId,
   payment_status:"paid",
   entitlement
  },{onConflict:"stripe_session_id",ignoreDuplicates:true});
  if(error)throw error;
 }catch(error:unknown){
  const diagnostic=error&&typeof error==="object"?error as Record<string,unknown>:null;
  const code=diagnostic&&typeof diagnostic.code==="string"&&/^[A-Za-z0-9_]{1,32}$/.test(diagnostic.code)?diagnostic.code:"unknown";
  const status=diagnostic&&typeof diagnostic.status==="number"&&Number.isInteger(diagnostic.status)?diagnostic.status:null;
  const kind=diagnostic&&typeof diagnostic.name==="string"&&/^[A-Za-z]{1,40}$/.test(diagnostic.name)?diagnostic.name:"unknown";
  console.error("Stripe purchase persistence failed",{code,status,kind});
  return new Response("Unable to record purchase",{status:500});
 }
 return new Response("ok");
}
