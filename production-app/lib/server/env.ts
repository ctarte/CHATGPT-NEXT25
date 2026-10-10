import "server-only";

export type CheckoutTier = "DISCOVERY" | "OPPORTUNITY_INTELLIGENCE" | "OPPORTUNITY_INTELLIGENCE_UPGRADE";

function requireEnv(name:string):string{
 const value=process.env[name];
 if(!value)throw new Error(`Missing required environment variable: ${name}`);
 return value;
}

export function serverEnv(){
 return {
  stripeSecret:requireEnv("STRIPE_SECRET_KEY"),
  stripeWebhook:requireEnv("STRIPE_WEBHOOK_SECRET"),
  // Keep legacy configuration for already-created Founding Client sessions.
  priceId:requireEnv("STRIPE_PRICE_FOUNDING_CLIENT"),
 };
}

export function priceForTier(tier:CheckoutTier):string{
 const name:Record<CheckoutTier,string>={
  DISCOVERY:"STRIPE_PRICE_DISCOVERY",
  OPPORTUNITY_INTELLIGENCE:"STRIPE_PRICE_OPPORTUNITY_INTELLIGENCE",
  OPPORTUNITY_INTELLIGENCE_UPGRADE:"STRIPE_PRICE_OPPORTUNITY_INTELLIGENCE_UPGRADE"
 };
 return requireEnv(name[tier]);
}

export function configuredTierPrices(){
 return {
  DISCOVERY:process.env.STRIPE_PRICE_DISCOVERY,
  OPPORTUNITY_INTELLIGENCE:process.env.STRIPE_PRICE_OPPORTUNITY_INTELLIGENCE,
  OPPORTUNITY_INTELLIGENCE_UPGRADE:process.env.STRIPE_PRICE_OPPORTUNITY_INTELLIGENCE_UPGRADE
 };
}
