import {NextResponse} from "next/server";
import Stripe from "stripe";
import {serverEnv} from "@/lib/server/env";
import {createClient} from "@/lib/supabase/server";

function diagnosticCode(error:unknown){
 if(error instanceof Stripe.errors.StripeError)return "STRIPE_CHECKOUT_ERROR";
 if(error instanceof Error&&error.message.startsWith("Missing required environment variable:"))return "CHECKOUT_CONFIG_ERROR";
 return "CHECKOUT_SERVER_ERROR";
}

export async function POST(){
 try{
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user)return NextResponse.json({error:"Sign in before starting checkout.",code:"AUTH_REQUIRED"},{status:401});

  const e=serverEnv();
  const stripe=new Stripe(e.stripeSecret);
  const site=process.env.NEXT_PUBLIC_SITE_URL;
  if(!site)return NextResponse.json({error:"Checkout is temporarily unavailable.",code:"SITE_URL_MISSING"},{status:503});

  const s=await stripe.checkout.sessions.create({
   mode:"payment",
   line_items:[{price:e.priceId,quantity:1}],
   success_url:`${site}/dashboard?checkout=returned`,
   cancel_url:`${site}/founding-client?checkout=cancelled`,
   client_reference_id:user.id,
   customer_email:user.email||undefined,
   metadata:{user_id:user.id,expected_price_id:e.priceId}
  });
  if(!s.url)return NextResponse.json({error:"Checkout is temporarily unavailable.",code:"CHECKOUT_URL_MISSING"},{status:503});
  return NextResponse.json({checkoutUrl:s.url});
 }catch(error){
  const code=diagnosticCode(error);
  const stripeError=error instanceof Stripe.errors.StripeError?error:null;
  console.error("checkout_session_failed",{
   code,
   errorName:error instanceof Error?error.name:"UnknownError",
   stripeType:stripeError?.type||null,
   stripeCode:stripeError?.code||null,
   statusCode:stripeError?.statusCode||null
  });
  return NextResponse.json({error:"Unable to start checkout right now.",code},{status:500});
 }
}
