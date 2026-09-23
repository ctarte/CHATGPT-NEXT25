# NEXT25 Website

GitHub Pages-ready MVP for NEXT25.

## What works
- Responsive single-page website and mobile navigation
- Full 25-question NEXT25 Score™
- Deterministic 0–4 scoring across Clarity, Freedom, Engagement, Preparedness and Legacy
- Score interpretation bands and basic pattern intelligence
- Browser-local result persistence (no server transmission)
- Second Life Architect™ offer with $595 founding price / $995 planned standard price
- Legal/disclaimer modals, professional and ecosystem sections
- Payment placeholder that deliberately does **not** collect card data

## View locally
Open `index.html` in a browser, or serve this folder with any static web server.

## Publish with GitHub Pages
1. Create a new GitHub repository (for example `next25-website`).
2. Upload all files in this folder to the repository root.
3. In GitHub: **Settings → Pages → Build and deployment**.
4. Choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then Save.
5. GitHub will provide the live `github.io` URL.

## Before public commercial launch
- Add final NEXT25 logo assets and photography.
- Add public contact information when ready.
- Connect a hosted PCI-compliant payment provider; do not place secret API keys in this repository.
- Add production privacy policy, terms, refund/cancellation policy and consent language after legal/privacy review.
- Add analytics only after selecting a privacy approach.
- Pilot/validate the NEXT25 Score before describing cutoffs as validated.
- Consider moving assessment records/accounts to a secure backend when save/resume and customer accounts are enabled.

## Payment integration
The current button is a safe placeholder. A static GitHub Pages site can link to a hosted Stripe Payment Link/Checkout or similar provider. Never collect raw credit-card numbers with this repository alone.
