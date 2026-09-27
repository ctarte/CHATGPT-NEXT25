export type ReviewStatus='new'|'in_analysis'|'research_needed'|'draft_ready'|'qa_review'|'revision_requested'|'approved'|'rendered'|'released'|'blocked';
export type ReviewPriority='normal'|'high';
export type StudioCase={customerId:string;displayName:string;status:ReviewStatus;priority:ReviewPriority;pipelineRunId:string;blueprintId?:string;ageDays:number;blockers:string[];nextAction:string};
export type ReviewerDecision='approve'|'request_revision'|'request_research'|'block';
export type ReviewDecision={decision:ReviewerDecision;reviewerId:string;notes:string;findingIds:string[];createdAt:string};
