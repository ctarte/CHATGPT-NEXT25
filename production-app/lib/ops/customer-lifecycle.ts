export const CUSTOMER_FLOW=['lead','checkout_started','paid','entitled','welcome_sent','intake_started','intake_complete','blueprint_in_production','qa_review','approved','released','followup_30','followup_60','followup_90'] as const;
export const EXCEPTION_STATES=['refunded','cancelled','blocked'] as const;
// Production transitions are event-driven and idempotent. Browser redirects never prove payment or entitlement.
