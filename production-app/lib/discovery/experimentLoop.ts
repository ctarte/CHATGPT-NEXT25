import type {Experiment} from "./experimentDesigner";
import type {ExperimentInterpretation,ExperimentResult} from "./experimentLearning";

export type LearningLoop={
 preserve:string[];
 newEvidence:string[];
 challenge:string[];
 nextInstruction:string;
};

export function experimentToDiscovery(experiment:Experiment,result:ExperimentResult,interpretation:ExperimentInterpretation):LearningLoop{
 const learned=interpretation.learned.filter(Boolean);
 if(interpretation.state==="REDESIGN")return {
  preserve:["original Discovery Record","positive person-level fit","desired life conditions"],
  newEvidence:learned,
  challenge:[experiment.assumption,...experiment.failureSignals],
  nextInstruction:`Generate materially different versions that preserve the person-level fit but do not depend on this failed assumption: ${experiment.assumption}`
 };
 if(interpretation.state==="REFINE")return {
  preserve:["core opportunity hypothesis","strong experiment signals"],
  newEvidence:learned,
  challenge:experiment.cautionSignals,
  nextInstruction:"Change one important variable at a time and create the next smallest test."
 };
 if(interpretation.state==="EXPAND")return {
  preserve:["Discovery Record","research dossier","experiment evidence"],
  newEvidence:learned,
  challenge:["Do not mistake early traction for durable demand."],
  nextInstruction:"Increase the realism of the next test while keeping the commitment reversible."
 };
 return {preserve:["current hypothesis"],newEvidence:learned,challenge:[],nextInstruction:"Finish the planned experiment before changing the opportunity."};
}
