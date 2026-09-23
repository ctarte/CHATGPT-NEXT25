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
["Preparedness","The people who may someday need to help me understand who my key professionals and contacts are."],
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
 let band=overall>=85?"Strongly Activated":overall>=70?"Well Positioned":overall>=55?"Open Possibilities":overall>=40?"Transition Point":"Ready for a Reset";
 let keys=Object.keys(scores), hi=keys.reduce((a,b)=>scores[a]>scores[b]?a:b), lo=keys.reduce((a,b)=>scores[a]<scores[b]?a:b);
 let signal="Your strongest foundation is "+hi+". That strength can become an anchor as you design the rest of your next chapter.";
 let attention="Your greatest opportunity appears in "+lo+". This is not a judgment—it is an invitation to decide what deserves more intention.";
 if(scores.Freedom>=70&&scores.Clarity<55) signal="You have room to move—but may not yet know where you want to point that freedom.";
 if(scores.Clarity>=70&&scores.Engagement<55) signal="You appear to know what matters, but some of it may still be waiting for activation.";
 if(scores.Engagement>=70&&scores.Preparedness<55) attention="You are living actively, but household organization may not be keeping pace.";
 if(scores.Preparedness>=70&&scores.Engagement<55) signal="Your life may be well organized without yet being fully activated.";
 $("#quizBody").hidden=true;$("#results").hidden=false;$("#results").innerHTML=`<div class="result-score"><p class="eyebrow">YOUR NEXT25 SCORE™</p><div class="big-score">${overall}</div><div class="band">${band.toUpperCase()}</div><p>Your score is a conversation starter—a way to see where momentum exists and where possibilities may deserve attention.</p></div><div class="bars">${keys.map(k=>`<div class="barrow"><strong>${k}</strong><div class="track"><div class="fill" style="width:${scores[k]}%"></div></div><span>${scores[k]}</span></div>`).join("")}</div><div class="insights"><div class="insight"><b>Opportunity Signal™</b><p>${signal}</p></div><div class="insight"><b>Attention Area™</b><p>${attention}</p></div></div><div class="result-score"><h3>What could your next chapter actually become?</h3><p>Second Life Architect™ goes beyond the Score to build your personalized NEXT25 Blueprint™.</p><a class="button" href="#architect">Explore Second Life Architect™</a> <button class="text-btn" id="retake">Retake Score</button></div>`;$("#bar").style.width="100%";localStorage.setItem("next25Score",JSON.stringify({overall,scores,version:"score_v1.0"}));$("#retake").onclick=()=>location.reload();
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
