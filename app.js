const questions=[
["Clarity","I can describe what I want the next five to ten years of my life to look like."],
["Clarity","I know which parts of my current life I want to preserve—and which I am ready to change."],
["Clarity","I have identified experiences, projects or goals I would deeply regret never pursuing."],
["Clarity","I have a clear sense of what gives me purpose beyond my current or former occupation."],
["Clarity","If I suddenly had complete freedom over my schedule, I know how I would want to use it."],
["Freedom","I have enough control over my time to pursue meaningful interests or changes."],
["Freedom","My financial situation gives me meaningful choices about how I spend the next chapter of life."],
["Freedom","My current obligations leave room for travel, learning, family, creative work or other priorities."],
["Freedom","My home, possessions and responsibilities support the life I want rather than restrict it."],
["Freedom","I feel able to experiment with a new direction without needing every detail figured out first."],
["Engagement","I regularly spend time on activities that make me feel interested, useful or energized."],
["Engagement","I am actively pursuing at least one meaningful goal, project, experience or learning interest."],
["Engagement","There is something on my calendar in the next 12 months that I am genuinely excited about."],
["Engagement","I am using my knowledge, skills or experience in ways that still feel meaningful to me."],
["Engagement","I tend to act on important personal aspirations rather than repeatedly postpone them."],
["Preparedness","My spouse, partner or another trusted person could locate the important information needed to manage my affairs if I were suddenly unavailable."],
["Preparedness","My important household, financial, insurance, property and estate information is reasonably organized and current."],
["Preparedness","The people who may someday need to help me know who my key professionals and contacts are."],
["Preparedness","I have thought through what would happen to day-to-day household responsibilities if I could not manage them temporarily."],
["Preparedness","I review important documents, contacts and household information often enough to keep them useful."],
["Legacy","I have thought about what I want my family or future generations to remember about me."],
["Legacy","I am preserving important stories, photographs, lessons, traditions or family history rather than assuming someone will do it later."],
["Legacy","I have considered what values, wisdom or life lessons I most want to pass along."],
["Legacy","I have thought about how I want my time, knowledge or resources to benefit people or causes beyond myself."],
["Legacy","I am taking steps now—not just someday—to create the legacy or impact I want."]
];
const labels=["Not at all","A little","Somewhat","Mostly","Very much"], responses=Array(25).fill(null);let idx=0;
const $=s=>document.querySelector(s);
$("#year").textContent=new Date().getFullYear();
$(".menu").onclick=()=>$(".site-header nav").classList.toggle("open");
document.querySelectorAll(".site-header nav a").forEach(a=>a.onclick=()=>$(".site-header nav").classList.remove("open"));
$("#startQuiz").onclick=()=>{$("#quizIntro").hidden=true;$("#quizBody").hidden=false;renderQ()};
function renderQ(){let [d,q]=questions[idx];$("#qMeta").textContent=d+" • QUESTION "+(idx+1)+" OF 25";$("#qText").textContent=q;$("#count").textContent=(idx+1)+" / 25";$("#bar").style.width=((idx)/25*100)+"%";$("#back").style.visibility=idx?"visible":"hidden";$("#answers").innerHTML=labels.map((l,i)=>`<button data-v="${i}">${l}</button>`).join("");document.querySelectorAll("#answers button").forEach(b=>b.onclick=()=>{responses[idx]=+b.dataset.v;if(idx<24){idx++;renderQ()}else showResults()})}
$("#back").onclick=()=>{if(idx){idx--;renderQ()}};
function showResults(){
 const dims={Clarity:[],Freedom:[],Engagement:[],Preparedness:[],Legacy:[]};questions.forEach((q,i)=>dims[q[0]].push(responses[i]));
 const scores={};Object.keys(dims).forEach(k=>scores[k]=Math.round(dims[k].reduce((a,b)=>a+b,0)/(dims[k].length*4)*100));
 const overall=Math.round(Object.values(scores).reduce((a,b)=>a+b,0)/5);
 const band=overall>=85?"Strongly Activated":overall>=70?"Well Positioned":overall>=55?"Open Possibilities":overall>=40?"Transition Point":"Ready for a Reset";
 const descriptions={
 "Strongly Activated":"You appear to have substantial clarity and momentum. The opportunity may be to refine, sequence and preserve what matters most.",
 "Well Positioned":"You appear to have a strong foundation, with several areas that could become more intentional.",
 "Open Possibilities":"Important pieces are in place, while meaningful possibilities may still be underdeveloped or waiting for attention.",
 "Transition Point":"Parts of your life may be changing faster than your next chapter has been deliberately designed.",
 "Ready for a Reset":"Several foundational areas may deserve fresh attention. The useful starting point is deciding what matters now."
 };
 const keys=Object.keys(scores), hi=keys.reduce((a,b)=>scores[a]>=scores[b]?a:b), lo=keys.reduce((a,b)=>scores[a]<=scores[b]?a:b);
 let pattern="Your profile suggests a relatively balanced next-chapter picture. The most useful work may be deciding which opportunity deserves priority first.";
 let signal="Your strongest foundation is "+hi+". That strength can become an anchor as you design the rest of your next chapter.";
 let attention="Your greatest opportunity appears in "+lo+". This is not a judgment—it is an invitation to decide what deserves more intention.";
 if(scores.Freedom>=70&&scores.Clarity<55){pattern="Freedom without a destination";signal="You appear to have room to move, but may not yet know where you want to point that freedom."}
 else if(scores.Clarity>=70&&scores.Engagement<55){pattern="Clarity awaiting activation";signal="You appear to know what matters, while some of it may still be waiting for action."}
 else if(scores.Engagement>=70&&scores.Preparedness<55){pattern="Active life, lighter infrastructure";attention="You appear highly engaged, while household organization and continuity may not be keeping pace."}
 else if(scores.Preparedness>=70&&scores.Engagement<55){pattern="Prepared, with room for activation";signal="Your life may be well organized without yet being fully activated."}
 else if(scores.Legacy>=70&&scores.Preparedness<55){pattern="Legacy intention, continuity opportunity";attention="You care about what carries forward, while some of the information needed by others may still be fragmented."}
 else if(scores.Freedom>=70&&scores.Engagement>=70){pattern="Freedom with momentum";signal="You appear to have both room and energy. The opportunity may be making that momentum more intentional."}
 else if(scores.Clarity>=70&&scores.Freedom<55){pattern="Direction seeking space";attention="You may know what you want, while obligations or constraints make it harder to create room for it."}
 else if(scores.Clarity<55&&scores.Engagement<55){pattern="Discovery before design";signal="Your most useful next step may be exploration rather than forcing a detailed plan too early."}
 const archetypes=[];
 if(scores.Engagement>=65) archetypes.push("Reinventor");
 if(scores.Freedom>=65) archetypes.push("Freedom Seeker");
 if(scores.Legacy>=65) archetypes.push("Legacy Builder");
 if(scores.Preparedness>=65) archetypes.push("Life Steward");
 if(scores.Clarity>=65) archetypes.push("Explorer");
 if(!archetypes.length) archetypes.push("Explorer","Lifelong Learner");
 const prompts={
 Clarity:["If nothing changed except your calendar, what would you want more of?","Which postponed possibility keeps returning to mind?","What would make the next five years feel unmistakably well used?"],
 Freedom:["Which obligation consumes more freedom than it deserves?","What could you simplify without diminishing your life?","Where would one additional day of freedom each week go?"],
 Engagement:["What idea deserves a small experiment instead of more thought?","What would put genuine anticipation on your calendar?","Which skill or experience would you enjoy using again?"],
 Preparedness:["Could a trusted person navigate your household if you were unavailable?","What important information exists only in your head?","Which area would create the most relief if organized this month?"],
 Legacy:["Which story would your family regret never hearing?","What lesson took you decades to learn?","What do you want to transmit beyond financial assets?"]
 }[lo];
 $("#quizBody").hidden=true;$("#results").hidden=false;
 $("#results").innerHTML=`<div class="result-score premium-result"><p class="eyebrow">YOUR NEXT25 SCORE™</p><div class="score-ring" style="--score:${overall*3.6}deg"><div><strong>${overall}</strong><small>/100</small></div></div><div class="band">${band.toUpperCase()}</div><p>${descriptions[band]}</p></div>
 <div class="bars">${keys.map(k=>`<div class="barrow"><strong>${k}</strong><div class="track"><div class="fill" style="width:${scores[k]}%"></div></div><span>${scores[k]}</span></div>`).join("")}</div>
 <div class="result-grid"><div class="insight featured"><span class="kicker">PROFILE PATTERN</span><h3>${pattern}</h3><p>${signal}</p></div><div class="insight"><span class="kicker">GREATEST OPPORTUNITY</span><h3>${lo}</h3><p>${attention}</p></div><div class="insight"><span class="kicker">ARCHETYPE CLUES</span><h3>${archetypes.slice(0,2).join(" + ")}</h3><p>These are exploratory clues, not fixed labels. Second Life Architect™ examines them in greater depth.</p></div></div>
 <div class="consider"><p class="eyebrow">CONSIDER THIS</p><h3>Three questions to carry forward</h3><ol>${prompts.map(x=>`<li>${x}</li>`).join("")}</ol></div>
 <div class="result-cta"><p class="eyebrow">THE SCORE SHOWS WHERE YOU STAND</p><h3>Second Life Architect™ explores what your next chapter could become.</h3><p>Go deeper with your personalized NEXT25 Blueprint™, possibilities, priorities and 90-Day Experiments™.</p><a class="button" href="#architect">Explore Second Life Architect™</a><button class="text-btn" id="retake">Retake Score</button></div>`;
 $("#bar").style.width="100%";localStorage.setItem("next25Score",JSON.stringify({overall,scores,version:"score_v1.1"}));$("#retake").onclick=()=>location.reload();
}
const legal={
privacy:`<h2>Privacy</h2><p><strong>Launch placeholder.</strong> NEXT25 is being prepared for pilot use. This demonstration stores assessment results only in your browser using local storage and does not transmit them to NEXT25.</p><p>Before public launch, this page will state data collected, purposes, retention, deletion procedures, security practices, service providers and communication consent. NEXT25 does not intend to sell personal Score responses to advertisers.</p>`,
terms:`<h2>Terms of Use</h2><p><strong>Launch placeholder.</strong> This preview is provided to demonstrate the NEXT25 experience. Product terms, refund/cancellation provisions, intellectual-property terms and payment terms will be finalized before transactions are enabled.</p>`,
disclaimer:`<h2>Important Disclaimer</h2><p>NEXT25 Score™ is an educational life-planning diagnostic and conversation starter. It is not a clinical psychological test, medical assessment, financial plan, investment recommendation, legal opinion or tax analysis.</p><p>Where your results raise a professional issue, consider discussing it with an appropriately qualified professional.</p>`
};
function openModal(html){$("#modalContent").innerHTML=html;$("#modal").hidden=false}
document.querySelectorAll("[data-modal]").forEach(b=>b.onclick=()=>openModal(legal[b.dataset.modal]));
$("#closeModal").onclick=()=>$("#modal").hidden=true;$("#modal").onclick=e=>{if(e.target.id==="modal")$("#modal").hidden=true};
document.querySelectorAll("[data-checkout]").forEach(b=>b.onclick=()=>openModal(`<div class="checkout-box"><p class="eyebrow">SECOND LIFE ARCHITECT™</p><h2>Founding Client Enrollment</h2><div class="price">$595</div><p>Planned standard price: $995</p><p><strong>Payment integration placeholder</strong></p><p>This site will connect this enrollment step to a secure hosted checkout (such as Stripe) before live payments are accepted. NEXT25 will never collect raw card details in this static GitHub Pages site.</p><p>Enrollment and contact details will be added before public launch.</p></div>`));

const blueprintContent={
 direction:`<p class="kicker">YOUR NEXT-CHAPTER DIRECTION</p><h3>From accumulated experience to intentional possibility.</h3><p>Your Blueprint connects the themes in your responses: what energizes you, what you have postponed, what freedom you have created, and what deserves protection.</p><div class="blueprint-metrics"><span><b>Strength</b> Clarity</span><span><b>Signal</b> Reinvention</span><span><b>Focus</b> Activation</span></div>`,
 signals:`<p class="kicker">OPPORTUNITY SIGNALS™</p><h3>Possibilities hidden in plain sight.</h3><p>Signals connect recurring themes across your answers. A Reinvention Opportunity might emerge from unused expertise; a Legacy Capture Opportunity from stories you keep meaning to preserve; an Experience Opportunity from repeatedly postponed aspirations.</p><div class="blueprint-metrics"><span><b>Signal</b> Expertise</span><span><b>Signal</b> Experience</span><span><b>Signal</b> Legacy</span></div>`,
 possibilities:`<p class="kicker">25 FOR 25™</p><h3>A portfolio for the years ahead.</h3><p>Rather than a random bucket list, 25 for 25™ can include experiences, relationships, projects, learning, family priorities, decisions, contributions and personal milestones—organized around what matters to you.</p><div class="blueprint-metrics"><span><b>Explore</b> 8 ideas</span><span><b>Prioritize</b> 10 ideas</span><span><b>Activate</b> 7 ideas</span></div>`,
 experiment:`<p class="kicker">90-DAY EXPERIMENT™</p><h3>Test the possibility before you redesign your life around it.</h3><p>Considering consulting, teaching, writing, relocating or launching a business? Define a small, reversible experiment with a purpose, time boundary and learning question. Evidence is often more useful than prolonged speculation.</p><div class="blueprint-metrics"><span><b>Test</b> Small</span><span><b>Learn</b> Quickly</span><span><b>Decide</b> Deliberately</span></div>`
};
document.querySelectorAll("[data-blueprint]").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll("[data-blueprint]").forEach(x=>x.classList.remove("active"));btn.classList.add("active");$("#blueprintPanel").innerHTML=blueprintContent[btn.dataset.blueprint]}));
