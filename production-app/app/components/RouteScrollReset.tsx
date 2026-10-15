"use client";
import {useEffect,useLayoutEffect} from "react";
import {usePathname} from "next/navigation";

/** A new page starts at the top; in-page anchors retain their intended position. */
export function RouteScrollReset(){
 const pathname=usePathname();
 useLayoutEffect(()=>{
   if(window.location.hash)return;
   const root=document.documentElement;
   const previous=root.style.scrollBehavior;
   root.style.scrollBehavior="auto";
   window.scrollTo(0,0);
   root.style.scrollBehavior=previous;
 },[pathname]);
 useEffect(()=>{
   if(window.location.hash)return;
   const id=window.requestAnimationFrame(()=>window.scrollTo(0,0));
   return ()=>window.cancelAnimationFrame(id);
 },[pathname]);
 return null;
}
