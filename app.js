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


const possibilityData={
 build:{title:"Build something worth testing",path:"BUILD",desc:"Explore a business, product, service or project without assuming it must become your next career.",question:"What problem, customer or idea have you repeatedly found yourself thinking about?",experiment:"Have 10 problem-discovery conversations before spending meaningfully on the idea."},
 earn:{title:"Turn experience into selective value",path:"EARN",desc:"Explore consulting, advisory, fractional work or another flexible way to use expertise.",question:"Which problems do people already seek your judgment on?",experiment:"Define one fixed-scope advisory offer and test it in three conversations."},
 teach:{title:"Transfer what decades taught you",path:"TEACH",desc:"Teaching and mentoring can convert experience into contribution without recreating a full-time job.",question:"What do you understand now that would have saved your younger self years?",experiment:"Design and deliver one 60-minute workshop or six-session mentoring test."},
 create:{title:"Make the work that has been waiting",path:"CREATE",desc:"Writing, photography, art, film, design, craft or another creative pursuit can become a serious next-chapter project.",question:"What would you make if the result did not need to impress anyone?",experiment:"Complete 20 creative sessions and one finished artifact in 90 days."},
 travel:{title:"Turn someday into a sequence",path:"EXPERIENCE",desc:"Build an Experience Portfolio™ around timing, energy, people and meaning rather than a random bucket list.",question:"Which experience becomes harder—not easier—if you postpone it five years?",experiment:"Choose one priority experience and sketch a three-year experience calendar."},
 learn:{title:"Become a beginner again",path:"LEARN",desc:"Use learning for mastery, curiosity and renewed engagement—whether or not it leads to a credential.",question:"What subject or skill would you study even if nobody ever asked about it?",experiment:"Take one short course before committing to a longer program."},
 serve:{title:"Direct experience toward impact",path:"SERVE",desc:"Explore service, philanthropy, nonprofit work, civic involvement or board contribution without unnecessary obligation.",question:"Which problem or community would make your contribution feel personal?",experiment:"Choose one cause and test a focused volunteer role or modest grant."},
 family:{title:"Design memories before calendars fill themselves",path:"CONNECT",desc:"Create traditions, recurring time and shared experiences that turn family intention into lived memory.",question:"What recurring experience would your family remember ten years from now?",experiment:"Create one repeatable family tradition or plan one meaningful short trip."},
 legacy:{title:"Preserve what only you can provide",path:"LEGACY",desc:"Capture stories, values, lessons, traditions and messages while they can still become conversations.",question:"Which story would your family be unable to reconstruct without you?",experiment:"Record five stories and organize 25 meaningful photographs with context."},
 simplify:{title:"Protect the freedom you worked to create",path:"SIMPLIFY",desc:"Sometimes the best next chapter adds less. Identify obligations, possessions or routines that consume disproportionate attention.",question:"What are you maintaining out of habit rather than value?",experiment:"Remove, automate or delegate 10 recurring obligations and measure the time reclaimed."}
};
const selectedPaths=new Set();
document.querySelectorAll("#possibilityGrid [data-path]").forEach(btn=>btn.addEventListener("click",()=>{
 const key=btn.dataset.path;
 if(selectedPaths.has(key)){selectedPaths.delete(key);btn.classList.remove("selected")}
 else if(selectedPaths.size<3){selectedPaths.add(key);btn.classList.add("selected")}
 else{document.querySelector("#possibilityOutput").innerHTML='<p class="kicker">THREE IS ENOUGH FOR NOW</p><h3>Keep the exploration focused.</h3><p>Deselect one possibility before adding another. NEXT25 is designed to create direction, not another overwhelming list.</p>';return}
 renderPossibilities();
}));
function renderPossibilities(){
 const out=document.querySelector("#possibilityOutput");
 if(!selectedPaths.size){out.innerHTML='<p class="kicker">YOUR PERSONALIZED POSSIBILITIES</p><h3>Start with curiosity.</h3><p>Select one to three areas. Your NEXT25 pathways will appear here.</p><div class="output-empty"><span>01</span> Choose what interests you<br><span>02</span> See connected possibilities<br><span>03</span> Consider one small experiment</div>';return}
 const items=[...selectedPaths].map(k=>possibilityData[k]);
 out.innerHTML='<p class="kicker">YOUR POSSIBILITY MIX</p><h3>'+items.map(x=>x.path).join(" + ")+'</h3><p class="mix-intro">These selections suggest several directions worth exploring. They are possibilities, not prescriptions.</p>'+items.map(x=>`<div class="path-result"><b>${x.title}</b><p>${x.desc}</p><small>QUESTION TO CONSIDER</small><p>${x.question}</p><small>SMALL EXPERIMENT</small><p>${x.experiment}</p></div>`).join("");
}
const sampleContent={
 summary:`<p class="kicker">01 • EXECUTIVE SUMMARY</p><h3>A life with more freedom needs a clearer direction.</h3><p>Alex appears to be entering a transition with meaningful financial and schedule flexibility, substantial professional experience, and several interests that have remained secondary to work. The central opportunity is not simply “retirement.” It is deciding how expertise, family, travel, learning and contribution should fit together.</p><div class="sample-callout"><b>Blueprint observation</b><p>Do not rush to replace a full professional calendar with another full calendar. Test the activities that create energy before making them permanent commitments.</p></div><div class="sample-stats"><span><b>Primary clue</b> Reinventor</span><span><b>Foundation</b> Freedom</span><span><b>Opportunity</b> Engagement</span></div>`,
 archetype:`<p class="kicker">02 • ARCHETYPE & DIRECTION</p><h3>Reinventor + Mentor</h3><p>Alex's responses suggest interest in remaining useful without recreating the intensity of the previous career. The Reinventor clue points toward a new form of work or creation; the Mentor clue suggests that accumulated judgment may be as valuable as technical expertise.</p><div class="sample-callout"><b>Direction to explore</b><p>A portfolio chapter: selective advisory work, mentoring, extended travel and one serious learning project rather than a single replacement identity.</p></div>`,
 signals:`<p class="kicker">03 • OPPORTUNITY SIGNALS™</p><h3>Expertise. Experience. Family continuity.</h3><p>Three signals recur across the fictional profile. Expertise could be used more selectively. Several postponed experiences appear time-sensitive. Household knowledge is concentrated in one person and could be easier for family to navigate.</p><div class="signal-list"><span>01 Expertise Opportunity</span><span>02 Experience Opportunity</span><span>03 Family Continuity Opportunity</span></div>`,
 gap:`<p class="kicker">04 • POSSIBILITY GAP™</p><h3>The distance between “important” and “actually happening.”</h3><p>Alex consistently rates travel, mentoring and family time as important, yet current calendar patterns still resemble the working years. The gap is less about resources than activation and permission.</p><div class="gap-line"><span>Current pattern</span><i></i><span>Intended chapter</span></div><p><strong>Question:</strong> What would need to leave the calendar for the intended chapter to become visible?</p>`,
 twentyfive:`<p class="kicker">05 • 25 FOR 25™</p><h3>A portfolio, not a bucket list.</h3><p>A fictional first set might include: mentor three emerging leaders; spend a month living—not vacationing—in a possible future location; record ten family stories; learn conversational Italian; create an annual grandchildren tradition; teach one workshop; take one meaningful trip each year; simplify one property responsibility.</p><div class="sample-callout"><b>The principle</b><p>Some items are experiences. Others are relationships, projects, decisions, contributions or forms of simplification.</p></div>`,
 experiment:`<p class="kicker">06 • 90-DAY EXPERIMENTS™</p><h3>Test the life before deciding the life.</h3><p><strong>Experiment:</strong> Selective advisory work. Alex will conduct three structured conversations with people who fit a potential advisory audience, define one fixed-fee offer, and test whether one paid pilot feels energizing rather than obligatory.</p><div class="experiment-grid"><span><b>Time box</b>90 days</span><span><b>Spend cap</b>Minimal</span><span><b>Evidence</b>Energy + demand</span><span><b>Decision</b>Continue / modify / stop</span></div>`
};
document.querySelectorAll("[data-sample]").forEach(btn=>btn.addEventListener("click",()=>{
 document.querySelectorAll("[data-sample]").forEach(x=>x.classList.remove("active"));btn.classList.add("active");
 document.querySelector("#samplePage").innerHTML=sampleContent[btn.dataset.sample];
}));
