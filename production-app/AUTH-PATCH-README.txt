NEXT25 Supabase Authentication Patch
====================================

Purpose
-------
Replace the production sign-in placeholder with real Supabase email/password
authentication and protect /dashboard from anonymous access.

This patch contains NO credentials.

Required Vercel Production variables
------------------------------------
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY

Installation
------------
Copy the contents of this ZIP into the existing repository root so that the
included "production-app" folder MERGES with the existing production-app folder.
Allow these intended files to be replaced:
- production-app/app/auth/sign-in/page.tsx
- production-app/app/dashboard/page.tsx
- production-app/app/theme.css

New files include Supabase browser/server helpers, proxy session refresh,
the sign-in form, and the sign-out route.

After pushing to GitHub, let Vercel deploy. Then create ONE fictional test user
in Supabase Authentication and test sign-in/sign-out. Do not use a real client.
