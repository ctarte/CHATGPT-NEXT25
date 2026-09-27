# Second Connection — Supabase Staging
After hosting exists:
1. Create a STAGING Supabase project.
2. Keep production separate.
3. Put credentials into Vercel encrypted environment variables, not source code.
4. Apply migrations in numeric order.
5. Configure auth redirect URLs to staging.
6. Create private Blueprint bucket.
7. Implement/review RLS policies before customer testing.
8. Create two fictional accounts and prove cross-customer access fails.
9. Confirm staff-only tables remain inaccessible to ordinary customers.
10. Only then connect payment test mode.
