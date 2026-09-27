# Next.js Hosting Deployment Guide
Recommended target: a managed Next.js host such as Vercel.

- Import the GitHub repository.
- Set Root Directory to `production-app`.
- Create distinct staging/preview and production environment variables.
- Keep provider secrets server-side.
- Connect a custom domain only after the staging synthetic run passes.
- Protect internal Studio/operations routes with server-side staff authorization.
- Do not assume an obscured URL is access control.

GitHub Pages remains useful for the static public prototype, but it is not the protected customer application.
