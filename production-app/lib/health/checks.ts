export type HealthState='pass'|'fail'|'not_configured';
export type HealthCheck={name:string;state:HealthState;detail:string};
export function summarize(checks:HealthCheck[]){return {ready:checks.every(c=>c.state==='pass'),checks};}
// Production implementation should use bounded provider checks and timeouts.
// Health output must not echo secrets, raw database errors, customer data, or proprietary matching logic.
