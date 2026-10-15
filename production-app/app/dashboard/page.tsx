import Link from "next/link";
import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import {loadDiscoveryRecord} from "@/lib/discovery/persistence";
import {possibilityUniverse} from "@/lib/discovery/possibilities";
import {recordSummary,type DiscoveryRecord} from "@/lib/discovery/record";
import {hasFoundingClientEntitlement} from "@/lib/entitlements";

function titleFor(id:string){return possibilityUniverse.find(p=>p.id===id)?.title||id}
function keptField(record:DiscoveryRecord){
 const explicit=Object.entries(record.fieldActions||{}).filter(([,v])=>v!=="DISCARD").map(([k])=>k);
 const reactions=Object.entries(record.reactions||{}).filter(([,v])=>v==="SHOW ME MORE"||v==="CURIOUS").map(([id])=>titleFor(id));
 return [...new Set([...explicit,...(record.briefsOpened||[]),...reactions])].slice(0,6);
}

export default async function Dashboard(){
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)redirect("/auth/sign-in");
 const entitled=await hasFoundingClientEntitlement();
 const stored=await loadDiscoveryRecord();
 const record=(stored?.record||null) as DiscoveryRecord|null;
 const summary=record?recordSummary(record):null;
 const field=record?keptField(record):[];
 const reactionEntries=record?Object.entries(record.reactions||{}):[];
 const reactedTitles=reactionEntries.map(([id])=>titleFor(id));
 const signals=(record?.wantMore?.length?record.wantMore:reactionEntries.flatMap(([id])=>possibilityUniverse.find(p=>p.id===id)?.signals||[])).filter((x,i,a)=>a.indexOf(x)===i).slice(0,4);
 const avoid=record?.wantLess?.slice(0,4)||[];
 const rounds=record?.round||0;
 const explored=new Set([...(record?.seen||[]),...reactedTitles]).size;
 const briefs=summary?.decisionBriefs||summary?.briefsOpened||0;
 return <main className="discovery-dash">
  <aside><b>DISCOVERED BY DESIGN™</b><nav><span className="active">Where You Are Now</span><Link href="/start">My Discovery</Link><Link href="/dashboard/field">My Field</Link><Link href="/dashboard/briefs">Opportunity Briefs</Link><Link href="/blueprint">My Blueprint</Link><Link href="/dashboard/briefs">Investigate Directions</Link></nav><form action="/auth/sign-out" method="post"><button type="submit">Sign out</button></form></aside>
  <section className="dash-main"><p className="eyebrow dark">WELCOME BACK</p>{entitled?<div className="dash-note"><b>FOUNDING CLIENT ACCESS</b><p>Your verified purchase is connected to this account.</p></div>:null}<h1>Your personal Think Tank</h1><p className="dash-lead">Here’s what we’re discovering about you—and where your thinking might take you next.</p>
   <div className="dash-metrics"><article><b>{String(rounds).padStart(2,"0")}</b><span>Discovery Rounds</span></article><article><b>{String(explored).padStart(2,"0")}</b><span>Ideas Explored</span></article><article><b>{String(field.length).padStart(2,"0")}</b><span>Directions Kept</span></article><article><b>{String(briefs).padStart(2,"0")}</b><span>Opportunity Briefs</span></article></div>
   <div className="dash-grid"><article><p className="eyebrow dark">WHAT WE’RE LEARNING ABOUT YOU</p><h2>{signals.length?signals.join(" · "):"Your strongest signals will appear as you continue Discovery."}</h2><p>{signals.length?"These are drawn from what you said you want more of.":"Continue Discovery to give the Think Tank more evidence to work with."}</p></article><article><p className="eyebrow dark">WHAT YOU WANT TO AVOID</p><h2>{avoid.length?avoid.join(" · "):"No conditions recorded yet."}</h2><p>These are conditions you indicated you would prefer not to recreate.</p></article></div>
   <div className="dash-field"><div><p className="eyebrow">DIRECTIONS WORTH EXPLORING</p><h2>Ideas you have kept in view as your field takes shape.</h2></div><div className="dash-possibilities">{field.length?field.map(x=><span key={x}>{x}</span>):<span>Your field will appear here as you react to directions.</span>}</div></div>
   <div className="dash-note"><b>YOUR NEXT STEP</b><p>{!record?"Begin Discovery so your Think Tank can learn what matters to you.":field.length?"Explore the directions you have kept, or continue refining your Discovery.":"Continue Discovery to uncover directions worth exploring."}</p></div>
   <div className="dash-actions"><Link className="button dark-button" href="/start">Continue discovering →</Link><Link className="button outline-button" href="/dashboard/field">Explore my field →</Link><Link className="button outline-button" href="/blueprint">View my Blueprint →</Link></div>
   <div className="dash-note"><b>YOUR PERSONALIZED BLUEPRINT</b><p>{record?"Your Discovery progress is saved. Open your Blueprint to review its current status and available content.":"Your Blueprint begins with Discovery. Start when you are ready; no final document has been issued yet."}</p></div>
  </section>
 </main>
}