export type PipelineStage='assessment_frozen'|'signals_extracted'|'workstyle_built'|'matched'|'briefs_selected'|'research_pending'|'research_complete'|'draft_generated'|'qa_pending'|'approved'|'rendered'|'delivered'|'blocked';
export type PipelineRun={id:string;assessmentId:string;customerId:string;stage:PipelineStage;assessmentVersion:string;signalVersion:string;workstyleVersion:string;matcherVersion:string;researchVersion:string;blueprintTemplateVersion:string;createdAt:string;updatedAt:string;blockers:string[]};
export type ReasonCode={code:string;sourceQuestionIds:string[];summary:string;confidence:number};
export type Candidate={possibilityId:string;title:string;tier:'strong'|'adjacent'|'overlooked';fit:number;frictions:string[];reasonCodes:ReasonCode[]};
