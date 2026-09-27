export type LaunchGateStatus='pass'|'warning'|'blocker'|'not_configured';
export type CustomerLifecycle='lead'|'checkout_started'|'paid'|'entitled'|'welcome_sent'|'intake_started'|'intake_complete'|'blueprint_in_production'|'qa_review'|'approved'|'released'|'followup_30'|'followup_60'|'followup_90'|'refunded'|'cancelled'|'blocked';
export type LaunchGate={id:string;name:string;status:LaunchGateStatus;owner:string;evidence?:string;nextAction?:string};
export type OpsCase={customerId:string;orderId?:string;blueprintId?:string;stage:CustomerLifecycle;nextAction:string;blockers:string[];lastEventAt:string};
