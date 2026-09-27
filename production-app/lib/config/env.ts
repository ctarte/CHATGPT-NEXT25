const requiredServer=['DATABASE_URL','SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY','STRIPE_SECRET_KEY','STRIPE_WEBHOOK_SECRET','STRIPE_PRICE_FOUNDING_CLIENT','RESEND_API_KEY','EMAIL_FROM','SUPPORT_EMAIL','BLUEPRINT_STORAGE_BUCKET'] as const;
export function environmentReadiness(env:Record<string,string|undefined>){
 const missing=requiredServer.filter(k=>!env[k]);
 return {ready:missing.length===0,missing};
}
export const publicSafe=['NEXT_PUBLIC_APP_ENV','NEXT_PUBLIC_SITE_URL'] as const;
// Never expose service-role, payment secret, webhook secret, email API key or database credentials to NEXT_PUBLIC_*.
