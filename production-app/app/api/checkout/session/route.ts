import {NextResponse} from "next/server";
import Stripe from "stripe";
import {serverEnv,priceForTier,type CheckoutTier} from "@/lib/server/env";
import {createClient} from "@/lib/supabase/server";
import {getPurchaseAccess} from "@/lib/entitlements";

const tiers:CheckoutTier[]=["DISCOVERY","OPPORTUNITY_INTELLIGENCE","OPPORTUNITY_INTELLIGENCE_UPGRADE"];
function diagnosticCode(error:unknown){
 if(error instanceof Stripe.errors.StripeError)return "STRIPE_CHECKOUT_ERROR";
 if(error instanceof Error&&error.message.startsWith("Missing required environment variable:"))return "CHECKOUT_CONFIG_ERROR";
 return "CHECKOUT_SERVER_ERROR";
}
export async function POST(req:Request){
 try{
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user)return NextResponse.json({error:"Sign in before starting checkout.",code:"AUTH_REQUIRED"},{status:401});
  let body:unknown;
  try{body=await req.json()}catch{return NextResponse.json({error:"Select a purchase option.",code:"TIER_REQUIRED"},{status:400})}
  const tier=(body&&typeof body==="object"&&"tier" in body)?(body as {tier?:unknown}).tier:null;
  if(typeof tier!=="string"||!tiers.includes(tier as CheckoutTier))
   return NextResponse.json({error:"Invalid purchase option.",code:"INVALID_TIER"},{status:400});
  const selected=tier as CheckoutTier;
  const access=await getPurchaseAccess();
  if(!access.authenticated)return NextResponse.json({error:"Sign in before starting checkout.",code:"AUTH_REQUIRED"},{status:401});
  if(access.opportunityIntelligence||(selected==="DISCOVERY"&&access.discovery))
   return NextResponse.json({error:"You already have access to this service.",code:"ALREADY_PURCHASED"},{status:409});
  if(selected==="OPPORTUNITY_INTELLIGENCE_UPGRADE"&&!access.discovery)
   return NextResponse.json({error:"Purchase Discovery before upgrading.",code:"DISCOVERY_REQUIRED"},{status:403});
  if(selected==="OPPORTUNITY_INTELLIGENCE"&&access.discovery)
   return NextResponse.json({error:"You already own Discovery. Choose the $400 upgrade.",code:"UPGRADE_AVAILABLE"},{status:409});

  const e=serverEnv();
  const priceId=priceForTier(selected);
  const stripe=new Stripe(e.stripeSecret);
  const site=process.env.NEXT_PUBLIC_SITE_URL;
  if(!site)return NextResponse.json({error:"Checkout is temporarily unavailable.",code:"SITE_URL_MISSING"},{status:503});
  const s=await stripe.checkout.sessions.create({
   mode:"payment",
   line_items:[{price:priceId,quantity:1}],
   success_url:`${site}/dashboard?checkout=returned`,
   cancel_url:`${site}/pricing?checkout=cancelled`,
   client_reference_id:user.id,
   customer_email:user.email||undefined,
   metadata:{user_id:user.id,expected_price_id:priceId,purchase_tier:selected}
  });
  if(!s.url)return NextResponse.json({error:"Checkout is temporarily unavailable.",code:"CHECKOUT_URL_MISSING"},{status:503});
  return NextResponse.json({checkoutUrl:s.url});
 }catch(error){
  const code=diagnosticCode(error);
  const stripeError=error instanceof Stripe.errors.StripeError?error:null;
  console.error("checkout_session_failed",{code,errorName:error instanceof Error?error.name:"UnknownError",stripeType:stripeError?.type||null,stripeCode:stripeError?.code||null,statusCode:stripeError?.statusCode||null});
  return NextResponse.json({error:"Unable to start checkout right now.",code},{status:500});
 }
}
