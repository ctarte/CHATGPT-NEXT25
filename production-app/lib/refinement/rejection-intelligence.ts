import type {PossibilityReaction,RefinementEvidence} from './types';
export function deriveRefinementEvidence(r:PossibilityReaction):RefinementEvidence{
 const negative=['not_for_me','absolutely_not'].includes(r.reaction);
 return {sourcePossibilityId:r.possibilityId,reasonCodes:negative?['customer_rejection_reason_requires_semantic_review']:['customer_reaction'],
 newPreferences:r.attractiveParts??[],possibleConstraints:negative&&r.why?[r.why]:[],confidence:r.customerConfirmed?.9:.55,
 requiresConfirmation:!r.customerConfirmed};
}
// Production rule: semantic interpretation of free text must be explainable and reviewed where material.
// Never convert a rejected title into a broad permanent constraint without understanding why.
