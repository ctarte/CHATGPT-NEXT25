"use client";
import {useState} from "react";
import type {CheckoutTier} from "@/lib/server/env";

export default function PurchaseButton({tier,label,className}:{tier:CheckoutTier;label:string;className:string}){
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 async function begin(){
  setBusy(true);setError("");
  try{
   const response=await fetch("/api/checkout/session",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({tier})});
   const data=await response.json();
   if(!response.ok||typeof data.checkoutUrl!=="string")throw new Error(data.error||"Unable to start checkout.");
   window.location.assign(data.checkoutUrl);
  }catch(e){
   setError(e instanceof Error?e.message:"Unable to start checkout.");
   setBusy(false);
  }
 }
 return <><button type="button" className={className} onClick={begin} disabled={busy}>{busy?"Opening secure checkout…":label}</button>{error&&<p role="alert">{error}</p>}</>;
}
