export const INITIAL_DISCOVERY_ROUNDS = 3;
export const MAX_DISCOVERY_REFINEMENTS = 2;
export const MAX_DISCOVERY_ROUNDS = 5;

export function isAuthorizedDiscoveryRound(input: {
  authenticatedUserId: string;
  purchaseUserId: string;
  purchaseStatus: string;
  purchaseId: string;
  ledgerPurchaseId: string;
  completedRounds: number[];
  refinementsGranted: number;
  requestedRound: number;
}): boolean {
  const {authenticatedUserId, purchaseUserId, purchaseStatus, purchaseId,
    ledgerPurchaseId, completedRounds, refinementsGranted, requestedRound} = input;
  if (!authenticatedUserId || authenticatedUserId !== purchaseUserId ||
      !purchaseId || purchaseId !== ledgerPurchaseId || purchaseStatus !== 'paid') return false;
  if (!Number.isSafeInteger(requestedRound) || requestedRound < 1 || requestedRound > 5) return false;
  if (!Number.isSafeInteger(refinementsGranted) || refinementsGranted < 0 || refinementsGranted > 2) return false;
  if (!Array.isArray(completedRounds) || new Set(completedRounds).size !== completedRounds.length ||
      completedRounds.some(n => !Number.isSafeInteger(n) || n < 1 || n > 5)) return false;
  // A trusted ledger must represent a contiguous sequence starting at round one.
  // Reject future or out-of-order completion entries rather than trusting a client list.
  const ordered = [...completedRounds].sort((a, b) => a - b);
  if (ordered.some((n, i) => n !== i + 1)) return false;
  if (ordered.some(n => n > 3 + refinementsGranted)) return false;
  if (requestedRound > 3 + refinementsGranted) return false;
  for (let n = 1; n < requestedRound; n++) if (!completedRounds.includes(n)) return false;
  return true;
}
