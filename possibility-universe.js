let U=[];
const labels={capital:"Startup capital",income:"Income orientation",autonomy:"Autonomy",flexibility:"Flexibility",social:"Social intensity",creativity:"Creativity",expertise:"Expertise reuse",learning:"Learning",visibility:"Public visibility",selling:"Selling",physical:"Physical intensity",scalability:"Scalability",meaning:"Meaning"};
fetch("possibility-universe.json").then(r=>r.json()).then(d=>{U=d.possibilities;families()});
function families(){let m={};U.forEach(x=>(m[x.family]??=[]).push(x));familyGrid.innerHTML=Object.entries(m).map(([k,v])=>`<article><span>${v.length} possibilities</span><h3>${k}</h3><p>${v.slice(0,4).map(x=>x.name).join(" • ")} • …</p></article>`).join("")}
function distance(x,k,target){if(!target)return 0;return Math.abs(x[k]-target)}
function score(x){
 let pri=priority.value,s=x[pri]*4;
 [["social",+social.value],["visibility",+visibility.value],["selling",+selling.value],["capital",+capital.value],["expertise",+expertise.value]].forEach(([k,t])=>{if(t)s+=5-distance(x,k,t)*2});
 return s;
}
function card(x,why){let top=Object.entries(labels).map(([k,l])=>[l,x[k]]).sort((a,b)=>b[1]-a[1]).slice(0,4);return `<article class="ucard"><p class="kicker">${x.family}</p><h3>${x.name}</h3><p><b>Why it surfaced:</b> ${why}</p><div class="meters">${top.map(([l,v])=>`<span><i style="width:${v*20}%"></i><b>${l}</b></span>`).join("")}</div><small>Explore the model, lifestyle and real-world requirements before treating this as a candidate.</small></article>`}
matchUniverse.onclick=()=>{
 if(!U.length)return;
 let ranked=[...U].sort((a,b)=>score(b)-score(a));
 let pri=priority.value, expected=ranked.slice(0,6);
 let expectedFamilies=new Set(expected.map(x=>x.family));
 let adjacent=ranked.filter(x=>!expectedFamilies.has(x.family)&&x[pri]>=3).slice(0,6);
 let overlooked=ranked.filter(x=>!expectedFamilies.has(x.family)&&!adjacent.includes(x)&&x[pri]>=3).sort((a,b)=>(b.learning+b.flexibility+b.meaning)-(a.learning+a.flexibility+a.meaning)).slice(0,6);
 let why=x=>`${labels[pri]} is strong (${x[pri]}/5)`+(+expertise.value?`; expertise fit ${x.expertise}/5`:"")+(+social.value?`; social intensity ${x.social}/5`:"");
 universeResults.innerHTML=`<div class="uresult-head"><p class="eyebrow">YOUR EXPLORATION SET</p><h2>18 ideas—not 240.</h2><p>The Universe narrows the field while deliberately reserving space for ideas outside the most obvious family.</p></div><div class="utier"><h3>01 • Expected Fits</h3><p>Closest structural matches to your current filters.</p>${expected.map(x=>card(x,why(x))).join("")}</div><div class="utier adjacent"><h3>02 • Adjacent Possibilities</h3><p>Similar fit characteristics from different possibility families.</p>${adjacent.map(x=>card(x,why(x))).join("")}</div><div class="utier overlooked"><h3>03 • Possibilities You May Not Have Considered</h3><p>Less obvious structural matches. Novelty alone does not make them better.</p>${overlooked.map(x=>card(x,why(x))).join("")}</div><div class="uboundary"><b>Prototype boundary</b><p>These attributes are design metadata used to demonstrate matching logic. They are not claims about earnings, job availability, startup costs or suitability for a specific person.</p></div>`;
 universeResults.scrollIntoView({behavior:"smooth",block:"start"});
};