import type {ExplorationMode,PossibilityReaction} from './types';
export function refinementRequest(mode:ExplorationMode,reactions:PossibilityReaction[]){
 return {mode,reactions,requirements:[
 'preserve hard constraints','use rejection reasons as evidence','preserve attractive attributes',
 'include customer-originated ideas','increase diversity when requested','do not simply replace rejected titles with synonyms',
 'return explainable reason codes','surface clarification questions before guessing'
 ]};
}
