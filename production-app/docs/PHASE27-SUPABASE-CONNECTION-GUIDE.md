# Database / Auth / Private Storage Connection Guide
Recommended target: separate staging and production managed projects.

Staging sequence:
1. Create project and store connection values in encrypted hosting environment variables.
2. Apply migrations in order.
3. Create private Blueprint bucket.
4. Configure customer authentication.
5. Configure staff role/claims separately from customer role.
6. Review every RLS policy.
7. Create two fictional customers and prove cross-customer reads fail.
8. Prove customer cannot access Studio/research/ops tables.
9. Prove server/reviewer can perform only authorized operations.
10. Test export/deletion and backup/restore.

Service-role credentials are server-only and must never appear in browser bundles.
