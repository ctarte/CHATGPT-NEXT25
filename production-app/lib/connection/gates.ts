import type {ConnectionEvidence} from './types';
export function stagingReady(items:ConnectionEvidence[]){
 const required=['hosting','data_auth_storage','payments','email','monitoring'] as const;
 return required.every(c=>items.some(i=>i.capability===c&&i.environment==='staging'&&i.state==='verified_staging'));
}
export function productionReady(items:ConnectionEvidence[]){
 return ['hosting','data_auth_storage','payments','email','monitoring','domain_dns'].every(c=>items.some(i=>i.capability===c&&i.environment==='production'&&i.state==='verified_production'));
}
// This is necessary but not sufficient: Phase 25 legal/commercial/operational launch gates must also pass.
