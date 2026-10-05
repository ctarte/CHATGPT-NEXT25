import {NextResponse} from "next/server";
import Stripe from "stripe";
import {serverEnv} from "@/lib/server/env";
import {createClient} from "@/lib/supabase/server";

export async function POST(){
 try{
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user)return NextResponse.json({error:"Sign in before starting checkout."},{status:401});

  const e=serverEnv();
  const stripe=new Stripe(e.stripeSecret);
  const site=process.env.NEXT_PUBLIC_SITE_URL;
  if(!site)return NextResponse.json({error:"Checkout is temporarily unavailable."},{status:503});

  const s=await stripe.checkout.sessions.create({
   mode:"payment",
   line_items:[{price:e.priceId,quantity:1}],
   success_url:`${site}/dashboard?checkout=returned`,
   cancel_url:`${site}/founding-client?checkout=cancelled`,
   client_reference_id:user.id,
   customer_email:user.email||undefined,
   metadata:{user_id:user.id,expected_price_id:e.priceId}
  });
  if(!s.url)return NextResponse.json({error:"Checkout is temporarily unavailable."},{status:503});
  return NextResponse.json({checkoutUrl:s.url});
 }catch{
  return NextResponse.json({error:"Unable to start checkout right now."},{status:500});
 }
}
