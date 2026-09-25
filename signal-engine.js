/* NEXT25 Phase 13: deterministic, explainable prototype. No network calls. */
(function(g){'use strict';
const VERSION='signals_v1.0';
const DEFINITIONS={autonomy:'Autonomy Drive',creative:'Creative Drive',contribution:'Contribution Drive',expertise:'Expertise Carryforward',ownership:'Ownership Motivation',learning:'Learning Drive',exploration:'Exploration Appetite',engagement:'Engagement Need',identity:'Identity Transition',flexibility:'Lifestyle Flexibility',income:'Income Importance',security:'Security Preference',commercial:'Commercial Friction',management:'Management Aversion',visibility:'Visibility Preference',social:'Social Intensity',legacy:'Legacy Orientation',family:'Family Priority',activation:'Activation Readiness'};
const rules=[
['autonomy','bizwhy',['Independence','Schedule control','Choose who I work with'],2],['autonomy','conditions',['Schedule control','Geographic flexibility'],2],['autonomy','dreamrep',['Independence','Freedom'],2],
['creative','energy',['Creating','Writing','Making / repairing'],2],['creative','keep',['Creative interests'],2],['creative','dreamrep',['Creativity','Something entirely mine'],2],
['contribution','energy',['Helping one person','Teaching'],2],['contribution','conditions',['Meaningful contribution'],2],['contribution','dreamrep',['Contribution'],2],
['expertise','keep',['Expertise','Professional identity','Intellectual challenge'],2],['expertise','stilllike',['Technical expertise','Strategy','Research','Teaching others'],2],
['ownership','bizwhy',['Build an asset','Create something of my own','Income potential'],2],['ownership','bizmodel',['Start from scratch','Buy an existing business','Microbusiness / lifestyle business','Digital / knowledge business'],1],
['learning','energy',['Researching','Exploring / travel'],2],['learning','moreof',['Learning','Intellectual challenge'],2],['exploration','moreof',['Adventure','Travel','Learning'],2],['exploration','calendar',['Travel','Learning'],1],
['engagement','retirefeel',['Comfortable but under-engaged','Restless / bored','Missing professional identity'],3],['engagement','miss',['Being needed','Intellectual challenge','Structure'],2],
['identity','entry',['Want a different career','Burned out / need a change','Revisiting a dream I postponed'],1],['identity','dreamrep',['A different identity'],2],['identity','newid',['Very open','Somewhat open'],2],
['flexibility','conditions',['Schedule control','Geographic flexibility','Travel'],2],['flexibility','rhythm',['Mostly free with occasional projects','Seasonal periods of work / activity'],2],
['income','conditions',['Predictable income'],2],['income','keep',['Income'],2],['income','bizwhy',['Income potential'],2],
['security','conditions',['Low financial risk','Predictable income'],2],['security','risk',['Very little','Some if downside is controlled'],2],['security','capital',['Almost none','A modest test amount'],2],
['commercial','bizfriction',['Selling','Marketing myself','Unpredictable income'],2],['commercial','less',['Selling'],2],['commercial','sellcomfort',['I strongly prefer not to','Only through relationships / referrals'],2],
['management','bizfriction',['Employees'],2],['management','less',['Managing people'],2],['management','employee',['No'],3],
['visibility','conditions',['Privacy / low visibility'],3],['visibility','bizfriction',['Marketing myself'],1],
['social','energy',['Connecting people','Teaching','Helping one person'],2],['social','calendar',['Social activities','Teaching / mentoring'],2],
['legacy','dreamrep',['Contribution'],1],['legacy','conditions',['Meaningful contribution'],1],['family','conditions',['Family time'],3],['family','keep',['Family time','Relationships'],2],
['activation','safe',['Low cost','Limited time','Clear stop point','Reversibility'],1],['activation','bizproof',['Paying customer','Enjoy the work','Lifestyle fit'],1]
];
function normalize(a){let signals={};Object.keys(DEFINITIONS).forEach(k=>signals[k]={id:k,label:DEFINITIONS[k],value:0,reasons:[],evidence:'not assessed'});
for(const [id,q,values,weight] of rules){const response=a[q];const found=values.filter(v=>Array.isArray(response)?response.includes(v):response===v);for(const v of found){signals[id].value=Math.min(5,signals[id].value+weight);signals[id].reasons.push({code:`${q}:${v}`,question:q,answer:v,weight});}}
for(const s of Object.values(signals))s.evidence=s.reasons.length>=2?'multiple answers':s.reasons.length===1?'one answer':'not assessed';
const constraints=[]; // Only explicit statements are hard constraints; ordinary preferences never silently become exclusions.
if(a.employee==='No')constraints.push({dimension:'employees',rule:'avoid employee responsibility',source:'employee:No',kind:'explicit'});
if(a.capital==='Almost none')constraints.push({dimension:'capital',max:1,source:'capital:Almost none',kind:'explicit'});
if(a.sellcomfort==='I strongly prefer not to')constraints.push({dimension:'selling',max:2,source:'sellcomfort:I strongly prefer not to',kind:'explicit'});
const tensions=[];
if(signals.ownership.value>=2&&signals.commercial.value>=2)tensions.push({code:'ownership_commercial',text:'Ownership interests you, while selling or marketing may create friction.',sources:[...signals.ownership.reasons,...signals.commercial.reasons].map(r=>r.code)});
if(signals.ownership.value>=2&&signals.security.value>=2)tensions.push({code:'ownership_security',text:'Ownership interests you, while predictability or limiting financial risk matters.',sources:[...signals.ownership.reasons,...signals.security.reasons].map(r=>r.code)});
if(signals.expertise.value>=2&&signals.identity.value>=2)tensions.push({code:'expertise_identity',text:'You may want to carry expertise forward while changing how you identify yourself.',sources:[...signals.expertise.reasons,...signals.identity.reasons].map(r=>r.code)});
return {version:VERSION,signals,constraints,tensions,answered:Object.keys(a).filter(k=>Array.isArray(a[k])?a[k].length:String(a[k]??'').trim()).length};}
const dimensions={autonomy:'autonomy',creative:'creativity',contribution:'meaning',expertise:'expertise',ownership:'scalability',learning:'learning',exploration:'learning',flexibility:'flexibility',income:'income',social:'social',legacy:'meaning'};
function match(profile,universe){const active=Object.values(profile.signals).filter(s=>s.value>0&&dimensions[s.id]);const reasons=x=>active.filter(s=>x[dimensions[s.id]]>=3).sort((a,b)=>b.value-a.value).slice(0,3).map(s=>({signal:s.id,source:s.reasons[0]?.code||'',text:s.label}));
const scored=universe.map(x=>{let score=0;for(const s of active)score+=s.value*(x[dimensions[s.id]]||0);score-=profile.signals.commercial.value*(x.selling||0)*.8;score-=profile.signals.visibility.value*(x.visibility||0)*.7;score-=profile.signals.management.value*(x.social||0)*.35;score-=profile.signals.security.value*(x.capital||0)*.7;
const failures=profile.constraints.filter(c=>c.max!==undefined&&(x[c.dimension]||0)>c.max).map(c=>c.source);return {item:x,score,failures,reasons:reasons(x)};}).sort((a,b)=>b.score-a.score||a.item.id.localeCompare(b.item.id));
const viable=scored.filter(x=>!x.failures.length),used=new Set(),ids=new Set();function pick(pool,n){const out=[];for(const v of pool){if(out.length>=n)break;if(!ids.has(v.item.id)&&!used.has(v.item.family)){out.push(v);ids.add(v.item.id);used.add(v.item.family)}}if(out.length<n)for(const v of pool){if(out.length>=n)break;if(!ids.has(v.item.id)){out.push(v);ids.add(v.item.id)}}return out;}
const strong=pick(viable,3),adjacent=pick(viable.filter(v=>!ids.has(v.item.id)),3),overlooked=pick(viable.filter(v=>!ids.has(v.item.id)).sort((a,b)=>(b.item.learning+b.item.creativity+b.item.flexibility)-(a.item.learning+a.item.creativity+a.item.flexibility)||b.score-a.score),3);
return {strong,adjacent,overlooked,excluded:scored.filter(x=>x.failures.length).length,shortfall:strong.length+adjacent.length+overlooked.length<9,version:'matching_v1.0-phase13'};}
g.NEXT25Signals={VERSION,DEFINITIONS,normalize,match};})(window);
