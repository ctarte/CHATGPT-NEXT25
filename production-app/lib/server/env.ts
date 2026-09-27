import 'server-only';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export function serverEnv() {
  return {
    stripeSecret: requireEnv('STRIPE_SECRET_KEY'),
    stripeWebhook: requireEnv('STRIPE_WEBHOOK_SECRET'),
    priceId: requireEnv('STRIPE_PRICE_FOUNDING_CLIENT'),
  };
}
