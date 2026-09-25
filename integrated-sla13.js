const AK="next25_integrated_v13";let A=JSON.parse(localStorage.getItem(AK)||'{"answers":{},"active":[],"step":0,"version":"integrated_v13"}');
const CORE=[
["entry","Which statement comes closest to why you are exploring NEXT25?","single",["Approaching retirement","Already retired","Want a different career","Want to start or own a business","Burned out / need a change","Revisiting a dream I postponed","Life is fine—I want to be more intentional"]],
["change","What most needs to change?","multi",["How I spend my time","My work itself","My employer / environment","My level of responsibility","My schedule","My sense of purpose","My income model","Where I live or work","Nothing urgent—I want to expand possibilities"]],
["keep","What most deserves to remain in your next chapter?","multi",["Expertise","Relationships","Income","Professional identity","Intellectual challenge","Structure","Freedom","Family time","Community","Creative interests"]],
["energy","Which activities tend to create energy rather than merely prove competence?","multi",["Solving problems","Teaching","Creating","Helping one person","Leading","Researching","Building systems","Making / repairing","Writing","Connecting people","Exploring / travel"]],
["less","Which activities would you prefer to do less often?","multi",["Managing people","Being managed","Selling","Administration","Presenting","Technical work","Client service","Meetings","Travel","Crisis solving","Detailed analysis"]],
["success","Three years from now, what would make you say the change was worthwhile?","text",[]],
["conditions","Which conditions should the next chapter support?","multi",["Schedule control","Geographic flexibility","Predictable income","Low financial risk","Family time","Intellectual stimulation","Creative expression","Limited management","Meaningful contribution","Privacy / low visibility","Community / people","Travel"]],
["risk","How much uncertainty feels acceptable?","single",["Very little","Some if downside is controlled","Moderate with calculated experiments","A fair amount for something compelling","Not sure"]]
];
const BR={
business:{label:"Ownership & Entrepreneurship",why:"Your answers suggest ownership may be part of the picture. These questions separate a desire for a business from the deeper motives a business might represent.",q:[
["bizwhy","What is most attractive about owning something?","multi",["Independence","Income potential","Build an asset","Create something of my own","Schedule control","Choose who I work with","Solve a problem I care about","Recognition / identity"]],
["bizmodel","Which forms sound worth exploring?","multi",["Start from scratch","Buy an existing business","Solo professional practice","Microbusiness / lifestyle business","Digital / knowledge business","Partnership","Franchise","Not sure"]],
["bizfriction","What most concerns you about ownership?","multi",["Selling","Financial risk","Employees","Administration","Marketing myself","Technology","Unpredictable income","Long hours","Customer problems","Being tied down"]],
["capital","How much personal capital would you be comfortable putting at risk before evidence of demand?","single",["Almost none","A modest test amount","A meaningful but bounded amount","Potentially substantial after diligence","Not sure"]],
["sellcomfort","How willing are you to personally sell or develop business?","single",["I strongly prefer not to","Only through relationships / referrals","Comfortable selectively","Comfortable making it central","Not sure"]],
["employee","Do you want responsibility for employees?","single",["No","Only a very small team","Possibly","Yes","Not sure"]],
["bizproof","Before committing, what evidence would you want?","multi",["Paying customer","Repeat demand","Attractive economics","Enjoy the work","Lifestyle fit","Partner / operator available","Clear exit / stop point"]]
]},
burnout:{label:"Change, Burnout & Role Redesign",why:"Wanting out does not always mean wanting a new profession. These questions separate the work from the conditions surrounding the work.",q:[
["burnsource","What feels most depleted?","multi",["The profession itself","Employer / culture","Management responsibility","Workload / pace","Client demands","Schedule","Commute / location","Politics / bureaucracy","Repetition","Loss of meaning"]],
["stilllike","Which parts of your current or former work would you still choose voluntarily?","multi",["Problem solving","Client relationships","Technical expertise","Teaching others","Strategy","Leading","Creating","Research","Negotiating","Almost none"]],
["sabbatical","If you could take six months away with no career penalty, what do you think would happen?","single",["I would probably want to return differently","I would want a different employer / setting","I would want a different profession","I would explore ownership","I would not want to return","I truly do not know"]],
["intensity","Would the same work feel different at half the intensity?","single",["Yes, probably","Maybe","No","I do not know"]],
["rolechange","Which redesigns sound attractive?","multi",["Fractional role","Advisory role","Project work","Part-time","Independent practice","Teaching / mentoring","Board work","Different industry","Complete break"]],
["recover","What would you need more of before making a major decision?","multi",["Time","Energy","Distance from current role","Financial clarity","Ideas","Confidence","Family alignment","Real-world experiments"]]
]},
retirement:{label:"Retirement, Engagement & Purpose",why:"Retirement can solve the calendar without answering what deserves the calendar. These questions explore engagement rather than assuming more work is the answer.",q:[
["retirefeel","Which description feels closest?","single",["Excited and full of plans","Relieved but uncertain","Comfortable but under-engaged","Busy but not deeply fulfilled","Restless / bored","Missing professional identity","Still working and planning ahead"]],
["calendar","If next month were completely open, what would you naturally put on the calendar?","multi",["Travel","Family","Learning","Fitness / outdoors","Creative work","Volunteer service","Teaching / mentoring","Consulting / selective work","Home / property projects","Social activities","I am not sure"]],
["miss","What, if anything, do you miss from working life?","multi",["People","Structure","Status / identity","Being needed","Intellectual challenge","Income","Competition","Solving problems","Nothing much"]],
["enough","Which areas already feel rich enough?","multi",["Family","Friendships","Travel","Learning","Purpose","Creative expression","Community","Health routines","Work / projects","None yet"]],
["contribute","How interested are you in being useful to people beyond your immediate family?","single",["Very interested","Somewhat","Only selectively","Not especially","Not sure"]],
["rhythm","What rhythm sounds most appealing?","single",["Mostly free with occasional projects","A few structured days each week","Seasonal periods of work / activity","One major project at a time","A full active schedule","Not sure"]]
]},
dream:{label:"Deferred Dream & Possibility Gap™",why:"A postponed dream can matter literally—or it can represent a value that could be expressed in a completely different form.",q:[
["dreamwhat","What have you postponed or repeatedly imagined?","text",[]],
["dreamrep","What did that dream represent?","multi",["Independence","Creativity","Adventure","Recognition","Ownership","Contribution","Freedom","A different identity","Financial upside","Mastery","Something entirely mine"]],
["dreamstop","What most prevented you from pursuing it?","multi",["Money","Family obligations","Career demands","Fear of failure","Fear of looking foolish","Did not know how","Timing","Loss of security","Partner concerns","The idea lost energy"]],
["literal","How important is the original form of the dream?","single",["Very—the specific dream matters","Somewhat—the theme matters too","Not much—I want what it represented","I am no longer sure I want it","Not sure"]],
["regret","If you never tested any version of it, how would you feel?","single",["Strong regret","Some regret","Probably fine","Relieved","Not sure"]],
["smalltest","What is the smallest credible version you could test?","text",[]]
]},
reinvent:{label:"Intentional Reinvention",why:"Nothing has to be wrong to design the next chapter deliberately. These questions look for expansion, curiosity and underused parts of you.",q:[
["moreof","What would you like substantially more of?","multi",["Adventure","Learning","Creativity","Contribution","Family","Friendships","Travel","Independence","Income","Quiet / space","Physical activity","Intellectual challenge"]],
["unused","Which part of yourself feels underused?","multi",["Teacher","Creator","Entrepreneur","Mentor","Explorer","Leader","Maker","Writer","Researcher","Community builder","Student / learner"]],
["curious","What subjects or activities keep pulling your attention even when nobody asks you to pursue them?","text",[]],
["newid","How open are you to an identity that would surprise people who know your résumé?","single",["Very open","Somewhat open","Only if it builds on what I know","Not very open","Not sure"]],
["portfolio","Would you prefer one defining pursuit or a portfolio of several meaningful pursuits?","single",["One defining pursuit","Two or three complementary pursuits","A broad portfolio","I do not know"]],
["permission","What have you been waiting for permission, time or confidence to try?","text",[]]
]}
};
function save(){localStorage.setItem(AK,JSON.stringify(A))}
function determine(){
 let e=A.answers.entry||"",c=A.answers.change||[],active=[];
 if(e.includes("business"))active.push("business");
 if(e.includes("Burned")||e.includes("career")||c.some(x=>["My work itself","My employer / environment","My level of responsibility"].includes(x)))active.push("burnout");
 if(e.includes("retirement")||e.includes("retired"))active.push("retirement");
 if(e.includes("dream"))active.push("dream");
 if(e.includes("intentional")||c.includes("Nothing urgent—I want to expand possibilities"))active.push("reinvent");
 if(!active.length)active.push("reinvent");
 A.active=[...new Set(active)].slice(0,3);save();return A.active;
}
function allSteps(){let steps=[{key:"core",label:"Common Foundation",why:"These questions establish the transition, energy, desired conditions and definition of success.",q:CORE}];determine().forEach(k=>steps.push({key:k,...BR[k]}));steps.push({key:"synthesis",label:"Your Blueprint",why:"Review the signals NEXT25 has gathered before carrying them into the Blueprint.",q:[]});return steps}
function fld(q){let [id,t,type,opts]=q,v=A.answers[id]??(type==="multi"?[]:"");if(type==="text")return `<label class="aq"><b>${t}</b><textarea data-id="${id}" placeholder="Write whatever comes to mind…">${v}</textarea></label>`;return `<div class="aq"><b>${t}</b><div class="aopts">${opts.map(o=>`<button data-id="${id}" data-type="${type}" data-val="${o}" class="${type==="multi"?(v.includes(o)?"selected":""):(v===o?"selected":"")}">${o}</button>`).join("")}</div></div>`}
function answered(){return Object.values(A.answers).filter(v=>Array.isArray(v)?v.length:String(v).trim()).length}
function synth(){
 let a=A.answers, signals=[];
 if((a.energy||[]).length)signals.push(["Energy",a.energy.slice(0,4).join(", ")]);
 if((a.conditions||[]).length)signals.push(["Life conditions",a.conditions.slice(0,5).join(", ")]);
 if((a.keep||[]).length)signals.push(["Preserve",a.keep.slice(0,4).join(", ")]);
 if((a.less||[]).length)signals.push(["Reduce",a.less.slice(0,4).join(", ")]);
 if((a.bizwhy||[]).length)signals.push(["Ownership motives",a.bizwhy.slice(0,4).join(", ")]);
 if((a.burnsource||[]).length)signals.push(["Change source",a.burnsource.slice(0,4).join(", ")]);
 if((a.calendar||[]).length)signals.push(["Retirement engagement",a.calendar.slice(0,4).join(", ")]);
 if((a.dreamrep||[]).length)signals.push(["Dream represented",a.dreamrep.slice(0,4).join(", ")]);
 if((a.moreof||[]).length)signals.push(["More of",a.moreof.slice(0,4).join(", ")]);
 return `<div class="asynth"><p class="eyebrow">DISCOVERY SYNTHESIS</p><h2>The question path changed because your answers changed.</h2><p class="lead">You completed the common foundation plus ${A.active.length} relevant branch${A.active.length===1?"":"es"}: <b>${A.active.map(k=>BR[k].label).join(" • ")}</b>.</p><div class="signal-cards">${signals.map(([k,v])=>`<article><small>${k}</small><b>${v}</b></article>`).join("")}</div><div class="a12-note"><b>Next production connection</b><p>These normalized signals will feed the integrated Matching Engine and Personalized NEXT25 Blueprint™. The current Phase 12 page validates branching and question quality before we merge it into the paid customer flow.</p></div><div class="a-actions"><button class="ghost" id="prev">← Back</button><a class="button" href="blueprint-quality-lab.html">Open Blueprint Quality Lab →</a></div></div>`
}
function render(){
 let steps=allSteps();if(A.step>=steps.length)A.step=steps.length-1;let st=steps[A.step];
 aTitle.textContent=st.label;aWhy.textContent=st.why;aCount.textContent=`${answered()} answered`;aPath.textContent=A.step===0?"Common Core":st.label;aBar.style.width=`${(A.step+1)/steps.length*100}%`;
 pathMap.innerHTML=steps.map((s,i)=>`<button data-step="${i}" class="${i===A.step?"active":""}"><b>${i+1}</b><span>${s.label}<small>${i===0?"Everyone":i===steps.length-1?"Review":A.active.includes(s.key)?"Opened by your answers":"Not opened"}</small></span></button>`).join("");
 if(st.key==="synthesis")aCard.innerHTML=blueprint13(); else aCard.innerHTML=`<p class="branchwhy">${st.why}</p>${st.q.map(fld).join("")}<div class="a-actions">${A.step?'<button class="ghost" id="prev">← Back</button>':'<span></span>'}<button class="button" id="next">${A.step===0?"Choose My Deeper Paths":"Continue"} →</button></div>`;
 bind()
}
function bind(){
 document.querySelectorAll(".aopts button").forEach(b=>b.onclick=()=>{let id=b.dataset.id;if(b.dataset.type==="multi"){let v=A.answers[id]||[];v.includes(b.dataset.val)?v.splice(v.indexOf(b.dataset.val),1):v.push(b.dataset.val);A.answers[id]=v}else A.answers[id]=b.dataset.val;save();render()});
 document.querySelectorAll("textarea[data-id]").forEach(t=>t.oninput=()=>{A.answers[t.dataset.id]=t.value;save();aCount.textContent=`${answered()} answered`});
 document.querySelectorAll("#pathMap button").forEach(b=>b.onclick=()=>{A.step=+b.dataset.step;save();render()});
 if(document.querySelector("#next"))next.onclick=()=>{if(A.step===0&&!A.answers.entry){alert("Please choose the statement that comes closest to why you are here.");return}determine();A.step++;save();render();document.querySelector("#adaptive").scrollIntoView({behavior:"smooth"})};
 if(document.querySelector("#prev"))prev.onclick=()=>{A.step=Math.max(0,A.step-1);save();render();document.querySelector("#adaptive").scrollIntoView({behavior:"smooth"})}
}
render();
let universe13=[];
fetch('possibility-universe.json').then(r=>r.json()).then(d=>{universe13=d.possibilities;if(allSteps()[A.step].key==='synthesis')render()}).catch(()=>{});
function esc13(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function blueprint13(){
let profile=NEXT25Signals.interpret(A.answers),matches=universe13.length?NEXT25Signals.rank(universe13,profile):null;
let active=profile.signals.filter(s=>s.level).sort((a,b)=>b.level-a.level).slice(0,6);
let sections=matches?[['Strong',matches.strong],['Adjacent',matches.adjacent],['Overlooked',matches.overlooked]]:[];
return `<div class="asynth bp13"><p class="eyebrow">PERSONALIZED NEXT25 BLUEPRINT™ • PROTOTYPE</p><h2>Your next chapter, with the reasoning made visible.</h2><p class="lead">${profile.answered} answered questions across ${A.active.length} adaptive paths. These are hypotheses worth testing, not prescriptions.</p>
<section><h3>01 • Where You Are Now</h3><p>${esc13(A.answers.entry||'Your transition is still taking shape.')}. ${A.answers.success?'Your definition of a worthwhile change: “'+esc13(A.answers.success)+'”':'Your definition of success deserves further reflection.'}</p></section>
<section><h3>02 • What We Noticed</h3><div class="signal-cards">${active.map(s=>`<article><small>${esc13(s.id)} • directional signal ${s.level}/5</small><b>${esc13(s.reasons.map(r=>r.answer).join(' · '))}</b><details><summary>Why this appeared</summary>${s.reasons.map(r=>`<p>${esc13(r.question)} → ${esc13(r.answer)} <code>${esc13(r.code)}</code></p>`).join('')}</details></article>`).join('')||'<p>More answers are needed.</p>'}</div></section>
<section><h3>03 • Tensions & Tradeoffs</h3>${profile.tensions.map(t=>`<article class="bptension"><p>${esc13(t.message)}</p><details><summary>Supporting answers</summary>${t.reasons.map(r=>`<p>${esc13(r.question)} → ${esc13(r.answer)}</p>`).join('')}</details></article>`).join('')||'<p>No dominant tension surfaced; real-world tests may reveal additional tradeoffs.</p>'}</section>
<section><h3>04 • Nine Possibilities Worth Exploring</h3>${matches?`<div class="bp9">${sections.map(([label,arr])=>`<div><h4>${label}</h4>${arr.map(r=>`<article><b>${esc13(r.item.name)}</b><small>${esc13(r.item.family)}</small><p><strong>Why:</strong> ${esc13(r.why.map(w=>w.label).join(', ')||'A combination of directional attributes and your answers')}.</p><p><strong>Possible friction:</strong> ${esc13(r.friction.join('; ')||r.item.poor_fit?.[0]||'Actual work may differ from expectations')}.</p><p><strong>Test:</strong> ${esc13(r.item.experiment||'Run a bounded experiment')}.</p><details><summary>Reason codes</summary>${r.why.map(w=>`<p>${w.reasonCodes.map(esc13).join(' · ')}</p>`).join('')||'<p>More evidence is needed.</p>'}</details></article>`).join('')}</div>`).join('')}</div>`:'<p>Loading possibilities…</p>'}</section>
<section><h3>05 • Possibility Gap™</h3><p>The overlooked group expands the field of inquiry; novelty is not evidence that a possibility is better.</p></section>
<section><h3>06 • 90-Day Experiments™</h3>${matches?matches.strong.map(r=>`<p><b>${esc13(r.item.name)}:</b> ${esc13(r.item.experiment||'Test a small version first.')}</p>`).join(''):'<p>Experiments load with the universe.</p>'}</section>
<section><h3>07 • 25 for 25™</h3><p>List experiences, relationships, projects, learning and contributions—not merely work.</p><textarea id="list25" placeholder="One idea per line…">${esc13(A.twentyfive||'')}</textarea></section>
<section><h3>08 • Questions Still Worth Answering</h3><p>What would you enjoy on an ordinary Tuesday? Which attractive idea conflicts with a genuine life requirement? What evidence could change your mind?</p></section>
<section><h3>09 • Your Next 90 Days</h3><p><b>Days 1–30:</b> speak with people doing the work. <b>Days 31–60:</b> test one bounded version. <b>Days 61–90:</b> review energy, usefulness, lifestyle fit and willingness to repeat.</p></section>
<div class="a12-note"><b>Prototype boundary</b><p>Signals and possibility attributes are unvalidated design heuristics, not psychological measures, income predictions or proof of suitability. Responses remain in this browser. Production requires secure accounts, private matching logic, consent and human testing.</p></div>
<div class="a-actions"><button class="ghost" id="prev">← Back</button><button class="button" id="printBlueprint" type="button">Print Blueprint →</button></div></div>`}
const bind13=bind;bind=function(){bind13();let t=document.querySelector('#list25');if(t)t.oninput=()=>{A.twentyfive=t.value;save()};let p=document.querySelector('#printBlueprint');if(p)p.onclick=()=>window.print()};
