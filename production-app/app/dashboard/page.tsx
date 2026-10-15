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
 const blueprintStatus=!record?"Not started":field.length?"Working Blueprint available":"Discovery in progress";
 return <main className="discovery-dash">
  <aside><b>DISCOVERED BY DESIGN™</b><nav><span className="active">Where You Are Now</span><Link href="/start">My Discovery</Link><Link href="/dashboard/field">My Field</Link><Link href="/dashboard/briefs">Opportunity Briefs</Link><Link href="/blueprint">My Blueprint</Link></nav><form action="/auth/sign-out" method="post"><button type="submit">Sign out</button></form></aside>
  <section className="dash-main"><p className="eyebrow dark">WELCOME BACK</p>{entitled?<div className="dash-note"><b>FOUNDING CLIENT ACCESS</b><p>Your verified purchase is connected to this account.</p></div>:null}<h1>Your personal Think Tank</h1><p className="dash-lead">Here’s what we’re discovering about you—and where your thinking might take you next.</p>
   <section className="dash-guidance" aria-label="Your guided next step"><p className="eyebrow dark">YOUR PERSONAL GUIDE</p><h2>One step at a time.</h2><p>{!record?"Start by telling us about your interests, experience and what you would like to change. There are no right answers.":!reactionEntries.length?"You have begun Discovery. Next, review the ideas we introduce and tell us what catches your attention. You can say no to any of them.":!field.length?"You have reacted to some ideas. Now choose any directions you are curious about; we will use your reactions to refine what comes next.":"You have directions worth considering. Explore one, tell us what feels right or wrong, and use your working Blueprint to see what you have learned."}</p><p className="dash-guidance-reassurance">You can return to your Discovery and revise your answers. You do not need to make a career or business decision today.</p><Link className="button dark-button" href={field.length?"/dashboard/field":"/start"}>{field.length?"Explore my directions →":"Continue my guided Discovery →"}</Link></section> <div className="dash-metrics"><article><b>{String(rounds).padStart(2,"0")}</b><span>Discovery Rounds</span></article><article><b>{String(explored).padStart(2,"0")}</b><span>Ideas Explored</span></article><article><b>{String(field.length).padStart(2,"0")}</b><span>Directions Kept</span></article><article><b>{String(briefs).padStart(2,"0")}</b><span>Opportunity Briefs</span></article></div>
   <div className="dash-grid"><article><p className="eyebrow dark">WHAT WE’RE LEARNING ABOUT YOU</p><h2>{signals.length?signals.join(" · "):"Your strongest signals will appear as you continue Discovery."}</h2><p>{signals.length?"These are drawn from what you said you want more of.":"Continue Discovery to give the Think Tank more evidence to work with."}</p></article><article><p className="eyebrow dark">WHAT YOU WANT TO AVOID</p><h2>{avoid.length?avoid.join(" · "):"No conditions recorded yet."}</h2><p>These are conditions you indicated you would prefer not to recreate.</p></article></div>
   <div className="dash-field"><div><p className="eyebrow">DIRECTIONS WORTH EXPLORING</p><h2>Ideas you have kept in view as your field takes shape.</h2></div><div className="dash-possibilities">{field.length?field.map(x=><span key={x}>{x}</span>):<span>Your field will appear here as you react to directions.</span>}</div></div>

   <div className="dash-actions"><Link className="button dark-button" href="/start">Continue discovering →</Link><Link className="button outline-button" href="/dashboard/field">Explore my field →</Link><Link className="button outline-button" href="/blueprint">View my Blueprint →</Link></div>
   <div className="dash-note"><b>YOUR PERSONALIZED BLUEPRINT · {blueprintStatus}</b><p>{record?"Your working Blueprint reflects your saved Discovery. It is not a finalized or approved PDF. Continue refining your directions before final delivery.":"Your Blueprint begins with Discovery. Start when you are ready; no final document has been issued yet."}</p></div>
  </section>
 </main>
}