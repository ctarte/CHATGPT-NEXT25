"use client";
import {useState} from "react";
import Link from "next/link";
import {Chrome} from "../components/SiteChrome";

export default function Page(){
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 async function beginCheckout(){
  setBusy(true);setError("");
  try{
   const res=await fetch("/api/checkout/session",{method:"POST"});
   const data=await res.json();
   if(!res.ok||!data.checkoutUrl)throw new Error(data.error||"Unable to start checkout.");
   window.location.assign(data.checkoutUrl);
  }catch(e){
   setError(e instanceof Error?e.message:"Unable to start checkout.");
   setBusy(false);
  }
 }
 return <Chrome><main>
  <section className="page-hero blueprint-hero">
   <p className="eyebrow">FOUNDING CLIENT ACCESS</p>
   <h1>Continue your Discovery.<br/><em>Go deeper when a direction earns it.</em></h1>
   <p className="lead">Your purchase is connected to your signed-in Discovered by Design account. Secure checkout is handled by Stripe, and access is granted only after the payment is verified.</p>
  </section>
  <section className="section">
   <div className="steps pricing-grid">
    <article>
     <p className="eyebrow dark">FOUNDING CLIENT</p>
     <h2>$995</h2>
     <h3>Discovery + Opportunity Intelligence</h3>
     <p>A personalized Think Tank process plus the deeper research layer for the directions that earn your attention.</p>
     <p><b>INCLUDES</b></p>
     <p>Discovery · personalized opportunity directions · reaction and refinement · Personalized Discovery Blueprint · market, career and business evidence · counter-evidence · Opportunity Decision Brief · 90-day intelligence plan</p>
     <button className="button gold" type="button" onClick={beginCheckout} disabled={busy}>{busy?"Opening secure checkout…":"Continue to secure checkout →"}</button>
     {error&&<p role="alert"><b>{error}</b></p>}
    </article>
    <article>
     <p className="eyebrow dark">BEFORE YOU CONTINUE</p>
     <h3>Your account stays at the center of the purchase.</h3>
     <p>You must be signed in before checkout begins. Stripe processes the payment; Discovered by Design verifies the completed purchase before granting Founding Client access.</p>
     <p>No access is granted merely because a customer returns from checkout.</p>
     <Link className="text-link darklink" href="/pricing">Review pricing →</Link>
    </article>
   </div>
  </section>
 </main></Chrome>
}