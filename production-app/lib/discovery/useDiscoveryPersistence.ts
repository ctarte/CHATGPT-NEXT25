"use client";import {useEffect,useRef,useState} from "react";import type {DiscoveryRecord} from "./record";
export type SaveState="CHECKING"|"SIGNED OUT"|"SAVING"|"SAVED"|"ERROR";
export function useDiscoveryPersistence(record:DiscoveryRecord,restore:(r:DiscoveryRecord)=>void){
 const [state,setState]=useState<SaveState>("CHECKING"),hydrated=useRef(false),timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 useEffect(()=>{fetch("/api/discovery").then(async r=>{if(r.status===401){setState("SIGNED OUT");return null}if(!r.ok)throw new Error();return r.json()}).then(x=>{const saved=x?.record?.record as DiscoveryRecord|undefined;if(saved?.version===1)restore(saved);if(x)setState("SAVED")}).catch(()=>setState("ERROR")).finally(()=>{hydrated.current=true})},[]);
 useEffect(()=>{if(!hydrated.current||state==="SIGNED OUT")return;if(timer.current)clearTimeout(timer.current);setState("SAVING");timer.current=setTimeout(()=>{fetch("/api/discovery",{method:"PUT",headers:{"content-type":"application/json"},body:JSON.stringify(record)}).then(r=>{if(r.status===401){setState("SIGNED OUT");return}if(!r.ok)throw new Error();setState("SAVED")}).catch(()=>setState("ERROR"))},800);return()=>{if(timer.current)clearTimeout(timer.current)}},[record]);
 return state;
}
