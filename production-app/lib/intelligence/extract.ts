import type {ReasonCode} from '../pipeline/types';
export type Answer={questionId:string;value:unknown};
export type ExtractedSignal={id:string;value:number|null;confidence:number;reasonCodes:ReasonCode[];missing:boolean};
export function normalizeScale(v:unknown):number|null{if(typeof v!=='number'||!Number.isFinite(v))return null;return Math.max(-1,Math.min(1,v))}
export function evidenceSignal(id:string,value:number|null,questionIds:string[]):ExtractedSignal{return{id,value,confidence:value===null?0:Math.min(.9,.45+questionIds.length*.1),reasonCodes:value===null?[]:[{code:`SIG_${id.toUpperCase()}`,sourceQuestionIds:questionIds,summary:`Directional ${id} signal from explicit assessment responses.`,confidence:Math.min(.9,.45+questionIds.length*.1)}],missing:value===null}}
