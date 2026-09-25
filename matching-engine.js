let U=[],P=[],A=[];
fetch("possibility-universe.json").then(r=>r.json()).then(d=>U=d.possibilities);
function chipGroup(id,max=99){document.querySelectorAll(`#${id} button`).forEach(b=>b.onclick=()=>{let arr=id==="priorities"?P:A,k=b.dataset.k;if(arr.includes(k)){arr.splice(arr.indexOf(k),1);b.classList.remove("selected")}else if(arr.length<max){arr.push(k);b.classList.add("selected")}status()})}
chipGroup("priorities",4);chipGroup("aversions");
document.querySelectorAll(".must-grid input").forEach(x=>x.onchange=status);uncertainty.onchange=status;
function status(){let m=[...document.querySelectorAll(".must-grid input:checked")].length;profileStatus.textContent=P.length?`${P.length} priorities • ${A.length} aversions • ${m} must-haves`:"Profile incomplete"}
const L={autonomy:"autonomy",flexibility:"flexibility",meaning:"meaning / contribution",creativity:"creativity",expertise:"expertise reuse",learning:"learning",income:"income orientation",scalability:"scalability",selling:"selling",visibility:"public visibility",social:"social intensity",capital:"startup capital",physical:"physical intensity"};
function hard(x){
 let failures=[];
 document.querySelectorAll(".must-grid input:checked").forEach(c=>{let k=c.dataset.k,v=x[k];if(c.dataset.min&&v<+c.dataset.min)failures.push(`${L[k]} is below your stated minimum`);if(c.dataset.max&&v>+c.dataset.max)failures.push(`${L[k]} exceeds your stated maximum`)});
 return failures;
}
function calc(x){
 let positive=0, friction=0, reasons=[],fr=[];
 P.forEach((k,i)=>{let wt=5-i*.6;positive+=x[k]*wt;if(x[k]>=4)reasons.push(`strong ${L[k]} fit`)});
 A.forEach(k=>{friction+=x[k]*4;if(x[k]>=4)fr.push(`relatively high ${L[k]}`)});
 let fails=hard(x), penalty=fails.length*45;
 if(uncertainty.value==="low" && (x.capital>=3||x.selling>=4)){friction+=8;fr.push("may involve more commercial uncertainty than you prefer")}
 if(uncertainty.value==="high" && x.learning>=4)positive+=4;
 return {score:positive-friction-penalty,positive,friction,fails,reasons,fr};
}
function pickDiverse(pool,n,usedFamilies=new Set()){
 let out=[];
 for(let x of pool){if(out.length>=n)break;if(!usedFamilies.has(x.family)){out.push(x);usedFamilies.add(x.family)}}
 if(out.length<n)for(let x of pool){if(out.length>=n)break;if(!out.includes(x))out.push(x)}
 return out;
}
function tensionText(){
 let t=[];
 let must=[...document.querySelectorAll(".must-grid input:checked")];
 if(P.includes("income")&&uncertainty.value==="low")t.push("Income importance + low uncertainty: opportunities with upside may also introduce variability. Staged tests and bridge income may matter.");
 if(P.includes("autonomy")&&A.includes("selling"))t.push("Autonomy + aversion to selling: independent work often requires market access. Referral, platform, retainer or partnership models may fit better than founder-led selling.");
 if(P.includes("scalability")&&A.includes("capital"))t.push("Scalability + aversion to capital risk: digital, licensing, knowledge or service-to-product models may deserve priority over asset-heavy businesses.");
 if(P.includes("expertise")&&must.some(x=>x.dataset.k==="expertise"&&x.dataset.max))t.push("Reuse expertise + clean-break constraint: your profile contains competing signals about the role your existing expertise should play.");
 if(!t.length)t.push("No dominant tension is visible in this short profile. The full Second Life Architect™ assessment would test additional tradeoffs.");
 return t;
}
function why(x,c){return (c.reasons.slice(0,3).join(", ")||"several moderate fit signals")+"."}
function card(x,kind){
 let c=calc(x),bad=[...c.fails,...c.fr,...x.poor_fit].filter((v,i,a)=>a.indexOf(v)===i).slice(0,3);
 return `<article class="mcard"><p class="kicker">${x.family}</p><h3>${x.name}</h3><div class="fitline"><span>FIT SIGNAL</span><b>${Math.max(0,Math.round(c.score))}</b></div><h4>Why this surfaced</h4><p>${why(x,c)}</p><h4>What could make it wrong</h4><p>${bad.length?bad.join("; ")+".":"The day-to-day reality may still fail the energy or lifestyle test."}</p><h4>Experiment before commitment</h4><p>${x.experiment}</p><small>${kind} • Prototype fit signal, not a probability or recommendation.</small></article>`
}
build9.onclick=()=>{
 if(!U.length){alert("The Possibility Universe is still loading. Please try again.");return}
 if(P.length<2){alert("Please select at least two priorities.");return}
 let ranked=[...U].sort((a,b)=>calc(b).score-calc(a).score);
 let viable=ranked.filter(x=>calc(x).fails.length===0);
 if(viable.length<9)viable=ranked;
 let used=new Set(),strong=pickDiverse(viable,3,used);
 let sf=new Set(strong.map(x=>x.family));
 let adjacentPool=viable.filter(x=>!strong.includes(x)&&!sf.has(x.family)&&calc(x).score>=calc(strong[2]).score*.55);
 let adjacent=pickDiverse(adjacentPool,3,used);
 let taken=new Set([...strong,...adjacent].map(x=>x.id));
 let overlookedPool=viable.filter(x=>!taken.has(x.id)&&!used.has(x.family)).sort((a,b)=>{
   let ca=calc(a),cb=calc(b);
   let noveltyA=a.learning+a.creativity+a.flexibility,noveltyB=b.learning+b.creativity+b.flexibility;
   return (cb.score+noveltyB*1.8)-(ca.score+noveltyA*1.8)
 });
 let overlooked=pickDiverse(overlookedPool,3,used);
 let ts=tensionText();
 m10Results.innerHTML=`<div class="blueprint9-head"><p class="eyebrow">YOUR 9-POSSIBILITY BLUEPRINT™</p><h2>A smaller field with better explanations.</h2><p>This prototype applies priorities, aversions, must-haves, friction and diversity rules before selecting nine possibilities.</p></div>
 <div class="tensionbox"><p class="kicker">TENSIONS & TRADEOFFS</p>${ts.map(x=>`<p>↔ ${x}</p>`).join("")}</div>
 <div class="m-tier"><h3>01 • Strong Fits</h3><p>Closest matches after constraint and friction checks.</p>${strong.map(x=>card(x,"Strong Fit")).join("")}</div>
 <div class="m-tier adjacent"><h3>02 • Adjacent Possibilities</h3><p>Different families that preserve important parts of your pattern.</p>${adjacent.map(x=>card(x,"Adjacent")).join("")}</div>
 <div class="m-tier overlooked"><h3>03 • Possibilities You May Not Have Considered</h3><p>Structurally plausible ideas deliberately drawn outside the obvious answer set.</p>${overlooked.map(x=>card(x,"Overlooked")).join("")}</div>
 <div class="m10-boundary"><b>What this result means</b><p>A fit signal is an internal prototype comparison—not a probability, forecast or recommendation. The purpose is to decide what deserves investigation. A real-world experiment supplies evidence the questionnaire cannot.</p></div>`;
 m10Results.scrollIntoView({behavior:"smooth",block:"start"})
};