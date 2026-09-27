import type {Candidate} from '../pipeline/types';
export function selectDeepBriefs(c:Candidate[],count=3):Candidate[]{const tier={strong:3,adjacent:2,overlooked:1};return [...c].sort((a,b)=>(tier[b.tier]-tier[a.tier])||(b.fit-a.fit)).filter((x,i,arr)=>i===arr.findIndex(y=>y.possibilityId===x.possibilityId)).slice(0,Math.max(2,Math.min(3,count)))}
// Production adds diversity constraints so three near-identical possibilities do not consume all deep-brief slots.
