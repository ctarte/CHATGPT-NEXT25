import {NextResponse} from "next/server";
import {loadDiscoveryRecord,saveDiscoveryRecord} from "../../../lib/discovery/persistence";
import type {DiscoveryRecord} from "../../../lib/discovery/record";
const MAX_BYTES=250_000;
function validRecord(x:unknown):x is DiscoveryRecord{
 if(!x||typeof x!=="object")return false;
 const r=x as Record<string,unknown>;
 return [1,2].includes(Number(r.version))&&typeof r.startingPoint==="string"&&Array.isArray(r.wantMore)&&Array.isArray(r.wantLess)&&Array.isArray(r.seen)&&typeof r.reactions==="object"&&typeof r.rejectionReasons==="object"&&typeof r.knowledge==="object"&&typeof r.fieldActions==="object"&&Array.isArray(r.briefsOpened);
}
export const dynamic="force-dynamic";
export const revalidate=0;
export async function GET(){try{const record=await loadDiscoveryRecord();if(!record)return NextResponse.json({error:"Authentication required."},{status:401});return NextResponse.json({record})}catch(e){const m=e instanceof Error?e.message:"Unable to load discovery record.";return NextResponse.json({error:m},{status:m.includes("Authentication")?401:500})}}
export async function PUT(req:Request){try{const raw=await req.text();if(raw.length>MAX_BYTES)return NextResponse.json({error:"Discovery record is too large."},{status:413});const record=JSON.parse(raw) as unknown;if(!validRecord(record))return NextResponse.json({error:"Invalid or unsupported discovery record."},{status:400});await saveDiscoveryRecord({...record,version:2});return NextResponse.json({saved:true})}catch(e){const m=e instanceof Error?e.message:"Unable to save discovery record.";return NextResponse.json({error:m},{status:m.includes("Authentication")?401:500})}}
