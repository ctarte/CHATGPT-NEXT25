"use client";
import {useEffect} from "react";
import {usePathname} from "next/navigation";

/** Preserve explicit section anchors while starting new pages at their beginning. */
export function RouteScrollReset(){
 const pathname=usePathname();
 useEffect(()=>{
   if(typeof window==="undefined"||window.location.hash)return;
   window.scrollTo({top:0,left:0,behavior:"instant"});
 },[pathname]);
 return null;
}
