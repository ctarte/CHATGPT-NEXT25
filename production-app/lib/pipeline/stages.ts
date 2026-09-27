import type {PipelineStage} from './types';
export const NEXT:Record<Exclude<PipelineStage,'delivered'|'blocked'>,PipelineStage>={
assessment_frozen:'signals_extracted',signals_extracted:'workstyle_built',workstyle_built:'matched',matched:'briefs_selected',briefs_selected:'research_pending',research_pending:'research_complete',research_complete:'draft_generated',draft_generated:'qa_pending',qa_pending:'approved',approved:'rendered',rendered:'delivered'};
export const HUMAN_GATES:PipelineStage[]=['qa_pending','approved'];
export function canAutoAdvance(stage:PipelineStage){return stage!=='blocked'&&!HUMAN_GATES.includes(stage)&&stage!=='delivered'}
