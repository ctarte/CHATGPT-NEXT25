const KEY="next25_integrated_v1";let U=[],stage=0;
let S=JSON.parse(localStorage.getItem(KEY)||'{"answers":{},"experiments":[],"twentyfive":[],"version":"integrated_v1"}');
fetch("possibility-universe.json").then(r=>r.json()).then(d=>{U=d.possibilities;render()});
const Q=[
{id:"chapter",title:"Which statement comes closest to why you are here?",type:"single",opts:["Approaching retirement and want a purposeful next chapter","Retired and want more from life","Want a different career","Want to start my first business","Burned out or restless","Revisiting a long-deferred idea","Nothing is wrong—I want to be more intentional"]},
{id:"leave",title:"What would you most like to leave behind?",type:"multi",opts:["Constant pressure","Managing people","Being managed","Repetition","Lack of meaning","Lack of creativity","Fixed schedule","Commuting / location","Financial pressure","Responsibility for everything"]},
{id:"preserve",title:"What would you most like to preserve?",type:"multi",opts:["Expertise","Professional identity","Income","Relationships","Intellectual challenge","Structure","Client relationships","Almost nothing"]},
{id:"better",title:"I would know my life had changed for the better if…",type:"text"},
{id:"energy",title:"Which activities tend to give you energy?",type:"multi",opts:["Solving difficult problems","Teaching / explaining","Creating / designing","Helping one person","Leading","Researching / learning","Building systems","Making / repairing","Writing","Connecting people","Exploring"]},
{id:"less",title:"What are you good at but would happily do much less of?",type:"multi",opts:["Managing people","Selling","Administration","Presenting","Technical work","Client service","Crisis solving","Travel","Meetings","Detailed analysis","Decision responsibility"]},
{id:"meaning",title:"After a satisfying day, what matters most?",type:"single",opts:["I solved something","I helped someone","I created something","I learned something","I made progress on something of my own","I connected with people","I had freedom over my time"]},
{id:"business",title:"If business ownership interests you, what is most attractive?",type:"multi",opts:["Independence","Income potential","Building an asset","Creating something of my own","Schedule control","Choosing the people I work with","Serving a market or cause","I am not sure I actually want a business"]},
{id:"businessNo",title:"What about ownership is least attractive?",type:"multi",opts:["Selling","Financial risk","Employees","Administration","Long hours","Unpredictable income","Technology","Marketing myself","Customer problems","Being tied to a location","Responsibility following me home"]},
{id:"dream",title:"What did the dream you postponed represent?",type:"multi",opts:["Independence","Creativity","Adventure","Recognition","Ownership","Contribution","Freedom","A different identity","Financial upside","Mastery","Something entirely mine","Still figuring it out"]},
{id:"conditions",title:"Which conditions should your next chapter support?",type:"multi",opts:["Schedule control","Travel","Geographic flexibility","Predictable income","Low financial risk","Family time","Intellectual stimulation","Creative expression","Limited management","Meaningful contribution","Privacy / low visibility","Community / people"]},
{id:"income",title:"How important is earned income in your next chapter?",type:"single",opts:["Essential","Important","Useful but not essential","Secondary","Not important"]},
{id:"risk",title:"How much uncertainty are you comfortable with?",type:"single",opts:["Very little","Some if downside is controlled","Moderate with calculated experiments","A fair amount for something compelling","Not sure"]},
{id:"identity",title:"How much of your current or former professional identity do you want to carry forward?",type:"single",opts:["A great deal","Some, but on my terms","Selected pieces","Very little","None—I want a new identity","I do not know yet"]},
{id:"expertise",title:"How might you want to use what you know?",type:"multi",opts:["Advising","Consulting","Teaching","Mentoring","Writing","Speaking","Board work","Research","Starting a business","Creating tools / intellectual property","Volunteering / service","Learn something new instead"]},
{id:"safe",title:"What would make an experiment feel safe enough to try?",type:"multi",opts:["Low cost","Limited time","Privacy","No need to quit anything","Clear stop point","Family support","Expert feedback","A small first customer or audience","Reversibility","Seeing someone like me do it"]},
{id:"evidence",title:"What evidence would make you want to continue?",type:"multi",opts:["I look forward to doing it","People value it","Someone will pay","I improve quickly","It fits my desired lifestyle","It creates meaningful impact","I keep thinking about it afterward"]},
{id:"stuck",title:"What is one thing you have thought about for too long without testing?",type:"text"}
];
function save(){localStorage.setItem(KEY,JSON.stringify(S));saveState.textContent="Saved in this browser"}
function field(q){
 let v=S.answers[q.id]??(q.type==="multi"?[]:"");
 if(q.type==="text")return `<label class="jq"><b>${q.title}</b><textarea data-id="${q.id}" placeholder="Write whatever comes to mind…">${v}</textarea></label>`;
 return `<div class="jq"><b>${q.title}</b><div class="jopts">${q.opts.map(o=>`<button data-id="${q.id}" data-type="${q.type}" data-val="${o}" class="${q.type==="multi"?(v.includes(o)?"selected":""):(v===o?"selected":"")}">${o}</button>`).join("")}</div></div>`
}
function stageQuestions(ids,intro){return `<p class="jintro">${intro}</p>${ids.map(id=>field(Q.find(q=>q.id===id))).join("")}<div class="jactions">${stage?'<button class="text-btn" id="back">← Back</button>':''}<button class="button" id="next">Continue →</button></div>`}
function signals(){
 let a=S.answers, sig={autonomy:0,flexibility:0,meaning:0,creativity:0,expertise:0,learning:0,income:0,scalability:0},av={selling:0,visibility:0,social:0,capital:0,physical:0};
 const all=(...ids)=>ids.flatMap(id=>Array.isArray(a[id])?a[id]:[a[id]||""]).join(" ").toLowerCase();
 let t=all(...Q.map(q=>q.id));
 const bump=(k,words,n=1)=>words.forEach(w=>{if(t.includes(w))sig[k]+=n});
 bump("autonomy",["independence","freedom","schedule control","something of my own","ownership"]);
 bump("flexibility",["schedule control","travel","geographic flexibility","family time","freedom over my time"]);
 bump("meaning",["meaning","contribution","helped","impact","service"]);
 bump("creativity",["creativity","creating","writing","design"]);
 bump("expertise",["expertise","advising","consulting","teaching","mentoring","board work","research"]);
 bump("learning",["learning","learn something new","exploring","adventure"]);
 bump("income",["income","someone will pay","financial upside"]);
 if((a.business||[]).includes("Building an asset"))sig.scalability+=3;
 let less=(a.less||[]).join(" "); if(less.includes("Selling")||(a.businessNo||[]).includes("Selling"))av.selling=5;
 if((a.conditions||[]).includes("Privacy / low visibility"))av.visibility=5;
 if((a.conditions||[]).includes("Limited management"))av.social=3;
 if((a.conditions||[]).includes("Low financial risk"))av.capital=5;
 Object.keys(sig).forEach(k=>sig[k]=Math.min(5,sig[k]));
 return {sig,av};
}
function match(){
 let {sig,av}=signals(), keys=Object.keys(sig).filter(k=>sig[k]).sort((a,b)=>sig[b]-sig[a]);
 function sc(x){let n=0;keys.forEach(k=>n+=x[k]*sig[k]);Object.keys(av).forEach(k=>n-=x[k]*av[k]*.8);if(S.answers.risk==="Very little"&&x.capital>=3)n-=15;if((S.answers.conditions||[]).includes("Low financial risk")&&x.capital>=3)n-=18;return n}
 let ranked=[...U].sort((a,b)=>sc(b)-sc(a)), used=new Set();
 function pick(pool,n){let out=[];for(let x of pool){if(out.length===n)break;if(!used.has(x.family)){out.push(x);used.add(x.family)}}return out}
 let strong=pick(ranked,3), ids=new Set(strong.map(x=>x.id));
 let adjacent=pick(ranked.filter(x=>!ids.has(x.id)),3);[...adjacent].forEach(x=>ids.add(x.id));
 let overlooked=pick(ranked.filter(x=>!ids.has(x.id)).sort((a,b)=>(b.learning+b.creativity+b.flexibility)-(a.learning+a.creativity+a.flexibility)),3);
 return {strong,adjacent,overlooked,keys,sig,av};
}
function tensions(){
 let a=S.answers,t=[];
 if((a.business||[]).includes("Independence")&&(a.businessNo||[]).includes("Selling"))t.push("You appear interested in independence while wanting less selling. Ownership is only one route to autonomy; referral, platform, fractional or partnership models may deserve attention.");
 if((a.conditions||[]).includes("Predictable income")&&["Very little","Some if downside is controlled"].includes(a.risk)&&((a.business||[]).includes("Income potential")||(a.business||[]).includes("Building an asset")))t.push("You value predictability while also showing interest in upside or ownership. A bridge strategy or staged experiment may matter more than a dramatic leap.");
 if((a.preserve||[]).includes("Expertise")&&a.identity==="None—I want a new identity")t.push("You want to preserve expertise while also imagining a new identity. The question may be how to use what you know without recreating the role you are leaving.");
 if(!t.length)t.push("No dominant tension is visible yet. That does not mean there are none; real-world experiments often reveal tradeoffs that questionnaires cannot.");
 return t;
}
function experimentCard(x){return `<article><p class="kicker">${x.family}</p><h3>${x.name}</h3><p>${x.experiment}</p><label><input type="checkbox" data-exp="${x.id}" ${S.experiments.includes(x.id)?"checked":""}> Add to my experiment shortlist</label></article>`}
function blueprint(){
 let m=match(),a=S.answers, all=[...m.strong,...m.adjacent,...m.overlooked];
 let chapter=a.chapter||"You appear to be exploring what should come next.";
 let energ=(a.energy||[]).slice(0,4).join(", ")||"still being discovered";
 let preserve=(a.preserve||[]).slice(0,3).join(", ")||"not yet clear";
 let leave=(a.leave||[]).slice(0,3).join(", ")||"not yet clear";
 let patt=m.keys.slice(0,4).map(k=>({autonomy:"autonomy",flexibility:"flexibility",meaning:"meaning",creativity:"creative expression",expertise:"selective expertise reuse",learning:"learning and novelty",income:"income",scalability:"building something scalable"}[k])).join(", ");
 let selected=all.filter(x=>S.experiments.includes(x.id));
 return `<div class="bp-cover"><p class="eyebrow">PERSONALIZED NEXT25 BLUEPRINT™ • PROTOTYPE</p><h2>Your next chapter is not a single answer.<br><em>It is a field worth intelligently exploring.</em></h2><p>Generated from the responses you provided throughout this one continuous journey.</p></div>
 <section class="bpsec"><span>01</span><div><h3>Where You Are Now</h3><p><b>${chapter}.</b> ${a.better?`Your own definition of improvement begins with: “${a.better}”`:"Your definition of a better chapter is still worth making more explicit."}</p><p>You most want to leave behind: ${leave}. You most want to preserve: ${preserve}.</p></div></section>
 <section class="bpsec"><span>02</span><div><h3>What We Noticed</h3><p>Your recurring energy signals include <b>${energ}</b>. The current matching pattern emphasizes <b>${patt||"continued discovery"}</b>.</p><p>This is an interpretation of your responses—not a diagnosis or conclusion about what you should do.</p></div></section>
 <section class="bpsec"><span>03</span><div><h3>Tensions & Tradeoffs</h3>${tensions().map(x=>`<p class="bptension">↔ ${x}</p>`).join("")}</div></section>
 <section class="bpsec full"><span>04</span><div><h3>Nine Possibilities Worth Exploring</h3><div class="bp9">${[["Strong Fits",m.strong],["Adjacent",m.adjacent],["Overlooked",m.overlooked]].map(([n,arr])=>`<div><h4>${n}</h4>${arr.map(x=>`<article><b>${x.name}</b><small>${x.family}</small><p>${x.poor_fit?.[0]?`Watch for: ${x.poor_fit[0]}.`:"The day-to-day reality still needs testing."}</p></article>`).join("")}</div>`).join("")}</div></div></section>
 <section class="bpsec"><span>05</span><div><h3>Your Possibility Gap™</h3><p>The overlooked column is intentionally drawn beyond the most obvious answer set. Its purpose is not novelty; it is to test whether your underlying pattern fits forms of work or contribution you may never have named.</p></div></section>
 <section class="bpsec full"><span>06</span><div><h3>90-Day Experiments™</h3><p>Choose evidence before commitment. Your shortlist currently contains ${selected.length} experiment${selected.length===1?"":"s"}.</p><div class="bp-exps">${(selected.length?selected:m.strong).map(x=>`<article><b>${x.name}</b><p>${x.experiment}</p></article>`).join("")}</div></div></section>
 <section class="bpsec"><span>07</span><div><h3>25 for 25™</h3><p>Build a personal inventory of experiences, projects, people, learning and contributions you want to make room for—not merely work.</p><textarea id="tf25" placeholder="Examples: take the family to…, learn…, create…, reconnect with…, teach…, visit…, preserve…">${(S.twentyfive||[]).join("\n")}</textarea></div></section>
 <section class="bpsec"><span>08</span><div><h3>Questions Still Worth Answering</h3><p>What would you pursue if nobody needed to be impressed by it?</p><p>Which possibility sounds attractive in theory but would you dislike doing every Tuesday?</p><p>What evidence would justify giving one experiment another 90 days?</p></div></section>
 <section class="bpsec"><span>09</span><div><h3>Your Next 90 Days</h3><p><b>Days 1–30:</b> investigate and speak with real people.</p><p><b>Days 31–60:</b> run one bounded experiment.</p><p><b>Days 61–90:</b> review evidence—energy, value, lifestyle fit and desire to repeat—before expanding commitment.</p></div></section>
 <div class="bp-boundary"><b>Blueprint boundary</b><p>This prototype is an educational life-planning tool. It is not a clinical assessment, financial plan, investment recommendation, legal opinion, tax analysis or prediction of success.</p></div>
 <div class="jactions"><button class="text-btn" id="back">← Experiments</button><button class="button" id="restart">Start a New Prototype</button></div>`;
}
function render(){
 document.querySelectorAll(".j11-rail button").forEach((b,i)=>b.classList.toggle("active",i===stage));
 progressBar.style.width=((stage+1)/5*100)+"%";progressText.textContent=`Stage ${stage+1} of 5`;
 const titles=["Discover what is changing.","Understand what sits underneath.","Expand the field of possibility.","Test before you commit.","Design your NEXT25 Blueprint™."];
 stageTitle.textContent=titles[stage];
 if(stage===0)stageCard.innerHTML=stageQuestions(["chapter","leave","preserve","better"],"Start with the transition itself. A desire for change can come from very different places.");
 if(stage===1)stageCard.innerHTML=stageQuestions(["energy","less","meaning","business","businessNo","dream","conditions","income","risk","identity","expertise"],"Go beneath job titles. We are looking for energy, motives, lifestyle requirements, identity and tradeoffs.");
 if(stage===2){
   let m=match(); stageCard.innerHTML=`<p class="jintro">Your answers now feed the Possibility Universe automatically. You do not need to complete another matching questionnaire.</p><div class="mini9">${[["Strong",m.strong],["Adjacent",m.adjacent],["Overlooked",m.overlooked]].map(([n,a])=>`<section><h3>${n}</h3>${a.map(x=>`<article><b>${x.name}</b><small>${x.family}</small></article>`).join("")}</section>`).join("")}</div><div class="tensionbox"><p class="kicker">TENSIONS WE SHOULD KEEP VISIBLE</p>${tensions().map(x=>`<p>↔ ${x}</p>`).join("")}</div><div class="jactions"><button class="text-btn" id="back">← Back</button><button class="button" id="next">Explore Experiments →</button></div>`;
 }
 if(stage===3){let m=match(),all=[...m.strong,...m.adjacent,...m.overlooked];stageCard.innerHTML=`<p class="jintro">A questionnaire can surface candidates. An experiment creates evidence. Shortlist any that deserve a closer look.</p><div class="experiment-grid">${all.map(experimentCard).join("")}</div>${field(Q.find(q=>q.id==="safe"))}${field(Q.find(q=>q.id==="evidence"))}${field(Q.find(q=>q.id==="stuck"))}<div class="jactions"><button class="text-btn" id="back">← Back</button><button class="button" id="next">Build My Blueprint →</button></div>`}
 if(stage===4)stageCard.innerHTML=blueprint();
 bind();
}
function bind(){
 document.querySelectorAll(".jopts button").forEach(b=>b.onclick=()=>{let id=b.dataset.id;if(b.dataset.type==="multi"){let a=S.answers[id]||[];a.includes(b.dataset.val)?a.splice(a.indexOf(b.dataset.val),1):a.push(b.dataset.val);S.answers[id]=a}else S.answers[id]=b.dataset.val;save();render()});
 document.querySelectorAll("textarea[data-id]").forEach(t=>t.oninput=()=>{S.answers[t.dataset.id]=t.value;save()});
 document.querySelectorAll("[data-exp]").forEach(c=>c.onchange=()=>{let id=c.dataset.exp;if(c.checked&&!S.experiments.includes(id))S.experiments.push(id);if(!c.checked)S.experiments=S.experiments.filter(x=>x!==id);save()});
 if(document.querySelector("#next"))next.onclick=()=>{stage=Math.min(4,stage+1);render();document.querySelector("#journey").scrollIntoView({behavior:"smooth"})};
 if(document.querySelector("#back"))back.onclick=()=>{stage=Math.max(0,stage-1);render();document.querySelector("#journey").scrollIntoView({behavior:"smooth"})};
 if(document.querySelector("#tf25"))tf25.oninput=()=>{S.twentyfive=tf25.value.split("\n").filter(Boolean);save()};
 if(document.querySelector("#restart"))restart.onclick=()=>{if(confirm("Clear this browser prototype and start again?")){localStorage.removeItem(KEY);location.reload()}};
}
document.querySelectorAll(".j11-rail button").forEach(b=>b.onclick=()=>{stage=+b.dataset.stage;render()});
