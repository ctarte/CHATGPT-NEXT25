import type {Experiment} from "./experimentDesigner";

export type ExperimentObservation={
 signal:"STRONG"|"CAUTION"|"WEAK";
 note:string;
 evidence?:string;
};

export type ExperimentResult={
 experimentId:string;
 completedAt:string;
 attempts:number;
 spend:number;
 observations:ExperimentObservation[];
};

export type ExperimentInterpretation={
 state:"EXPAND"|"REFINE"|"REDESIGN"|"INCOMPLETE";
 language:string;
 learned:string[];
 next:string;
};

export function interpretExperiment(experiment:Experiment,result:ExperimentResult):ExperimentInterpretation{
 if(result.attempts<experiment.targetCount)return {state:"INCOMPLETE",language:"The test has not reached its planned sample. Do not call the idea validated or rejected yet.",learned:result.observations.map(o=>o.note),next:"Complete the agreed test or document why the remaining attempts are no longer appropriate."};
 const strong=result.observations.filter(o=>o.signal==="STRONG").length;
 const weak=result.observations.filter(o=>o.signal==="WEAK").length;
 const caution=result.observations.filter(o=>o.signal==="CAUTION").length;
 if(weak>strong)return {state:"REDESIGN",language:"Reality pushed back on this version. Preserve the person-level fit and redesign the opportunity around what the test exposed.",learned:result.observations.map(o=>o.note),next:experiment.nextIfWeak};
 if(strong>=2&&weak===0)return {state:"EXPAND",language:"The experiment produced behavioral evidence worth a slightly larger test. This is not yet a reason for a major commitment.",learned:result.observations.map(o=>o.note),next:experiment.nextIfStrong};
 return {state:"REFINE",language:"The signal is promising but not clean. Change one important variable and run another controlled test.",learned:result.observations.map(o=>o.note),next:caution?"Choose the most repeated caution signal and design the next test around it.":experiment.nextIfStrong};
}
