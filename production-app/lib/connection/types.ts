export type ConnectionState='owner_action_required'|'configured_unverified'|'verified_staging'|'verified_production'|'blocked';
export type ConnectionCapability='hosting'|'data_auth_storage'|'payments'|'email'|'monitoring'|'domain_dns';
export type ConnectionEvidence={capability:ConnectionCapability;environment:'staging'|'production';state:ConnectionState;checkedAt:string;proof:string[]};
