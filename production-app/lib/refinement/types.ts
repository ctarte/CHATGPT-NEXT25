export type Reaction='explore_more'|'interesting_unsure'|'like_parts'|'not_for_me'|'absolutely_not'|'my_idea'|'already_considered'|'show_me_reality';
export type ExplorationMode='build_on_what_i_know'|'take_me_somewhere_adjacent'|'surprise_me';
export type PossibilityReaction={possibilityId:string;reaction:Reaction;why?:string;attractiveParts?:string[];customerIdea?:string;customerConfirmed:boolean};
export type RefinementEvidence={sourcePossibilityId:string;reasonCodes:string[];newPreferences:string[];possibleConstraints:string[];confidence:number;requiresConfirmation:boolean};
