import Stripe from "stripe";
import {serverEnv} from "@/lib/server/env";

export async function POST(req:Request){
 const e=serverEnv();
 const stripe=new Stripe(e.stripeSecret);
 const sig=req.headers.get("stripe-signature");
 if(!sig)return new Response("Missing signature",{status:400});

 let event:Stripe.Event;
 try{
  event=stripe.webhooks.constructEvent(await req.text(),sig,e.stripeWebhook);
 }catch{
  return new Response("Invalid signature",{status:400});
 }

 if(event.type==="checkout.session.completed"){
  const session=event.data.object as Stripe.Checkout.Session;
  const userId=session.client_reference_id||session.metadata?.user_id;
  if(!userId||session.metadata?.user_id!==userId)
   return new Response("Invalid customer reference",{status:400});
  if(session.mode!=="payment"||session.payment_status!=="paid")
   return new Response("Payment not complete",{status:400});
  if(session.metadata?.expected_price_id!==e.priceId)
   return new Response("Unexpected product",{status:400});

  let verified=false;
  try{
   const items=await stripe.checkout.sessions.listLineItems(session.id,{limit:10});
   verified=items.data.some(item=>item.price?.id===e.priceId&&item.quantity===1);
  }catch{
   return new Response("Unable to verify purchase",{status:500});
  }
  if(!verified)return new Response("Unexpected purchase",{status:400});

  // Purchase identity, payment state and expected price are now verified.
  // Entitlement persistence is intentionally added in the next controlled build.
 }
 return new Response("ok");
}
