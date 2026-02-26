# Deploy to Cloudflare Pages (static-only)

This project is **static-first** (Astro static output). No SSR, no Functions, no per-request compute.

## 1) Create the repo (GitHub)

- Push this folder to a GitHub repo (e.g. `dialcode`).

## 2) Cloudflare Pages settings

In Cloudflare Dashboard → **Pages** → **Create a project** → Connect to GitHub.

**Build settings**
- Framework preset: **Astro** (or “None” if you prefer manual)
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: (leave blank if repo root is this project; otherwise set it)

**Environment variables (recommended)**
- `SITE` = your production origin, e.g.
  - `https://your-project.pages.dev` (ok for MVP), or
  - `https://yourdomain.com` (when you add a custom domain)

This is used for canonical URLs + sitemap generation.

## 3) Verify

After deploy, check:
- `/` loads
- `/dial-builder/` works
- `/country/gb/` works
- `/robots.txt` exists
- `/sitemap-index.xml` exists

## Notes

- We intentionally avoid any SSR/Workers usage in Phase 1.
- All pages are cacheable and CDN-friendly by default.
