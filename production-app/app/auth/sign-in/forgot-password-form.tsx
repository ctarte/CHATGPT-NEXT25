"use client";
import {FormEvent,useState} from "react";
import {createClient} from "@/lib/supabase/client";
export default function ForgotPasswordForm(){
 const [email,setEmail]=useState(""),[message,setMessage]=useState(""),[busy,setBusy]=useState(false);
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault(); setBusy(true); setMessage("");
  try{
   const supabase=createClient();
   const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:`${window.location.origin}/auth/update-password`});
   setMessage(error?"We couldn't send the reset email. Please try again.":"Check your email for a password-reset link. Use the newest email only.");
  }catch{setMessage("Password recovery is temporarily unavailable. Please try again later.");}
  finally{setBusy(false);}
 }
 return <details className="forgot-password"><summary>Forgot password?</summary><form className="signin-form" onSubmit={submit}><label>Email address<input type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label>{message?<p className="auth-message" role="status">{message}</p>:null}<button type="submit" disabled={busy}>{busy?"Sending…":"Send password reset"}</button></form></details>;
}
