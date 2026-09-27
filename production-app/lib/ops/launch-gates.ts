import type {LaunchGate} from './types';
export const REQUIRED_GATE_IDS=['legal','payment','webhook','auth','persistence','intake','research','qa','pdf','delivery','support','privacy','backup','monitoring'] as const;
export function launchVerdict(gates:LaunchGate[]){const blockers=gates.filter(g=>g.status==='blocker'||g.status==='not_configured');return {ready:blockers.length===0,blockers};}
