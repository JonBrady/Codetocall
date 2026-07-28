# CodeToCall

[CodeToCall](https://codetocall.com/) is a fast, static reference site for
international calling codes and dialling instructions. It provides a dial
builder plus indexable country and calling-code pages.

The site is built with Astro and deployed to Cloudflare Pages from
[`JonBrady/Codetocall`](https://github.com/JonBrady/Codetocall).

## Operating model

- `main` is the production branch. A successful push to `main` triggers a
  production deployment to `https://codetocall.com`.
- Other pushed branches receive Cloudflare preview deployments.
- The site is statically generated into `dist/`. It does not require Workers,
  server-side rendering, a database, or paid Cloudflare storage.
- Changes should be developed and checked on a feature branch, reviewed on its
  preview URL, and merged into `main` only when ready for production.
- Advertising must remain controlled by its environment flags. Do not enable
  live ad rendering until consent, approval, and measurement requirements have
  been checked.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the release, rollback, and cost-control
procedures. The active priorities and business gates are in
[RECOVERY_PLAN.md](./RECOVERY_PLAN.md).

## Local setup

The supported runtime is Node.js 22, pinned in `.nvmrc`.

```sh
npm ci
npm run check
npm run dev
```

The local development server is normally available at `http://localhost:4321`.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Astro development server |
| `npm test` | Run phone-number correctness tests |
| `npm run validate-data` | Check country and exit-code data for structural errors |
| `npm run build` | Generate the production site in `dist/` |
| `npm run check` | Run tests, data validation, and a complete production build |
| `npm run preview` | Serve the generated build locally |
| `npm run build-countries` | Regenerate country data for an intentional update |

Every pull request and push is checked by GitHub Actions with `npm ci`, tests,
data validation, and a production build.

## Configuration

| Variable | Purpose | Safe default |
| --- | --- | --- |
| `SITE` | Canonical production origin and sitemap base | `https://codetocall.com` |
| `PUBLIC_GA_MEASUREMENT_ID` | Public GA4 measurement identifier | Existing CodeToCall property |
| `PUBLIC_ADSENSE_CLIENT` | AdSense publisher/client identifier | Empty |
| `PUBLIC_ADS_ENABLED` | Permit AdSense after visitor acceptance | Off |
| `PUBLIC_ADS_RENDER` | Render ad units when set to `true` | Off |
| `PUBLIC_ADSENSE_MODE` | `non-personalized` or `default` | `non-personalized` |
| `PUBLIC_ADSENSE_SLOT_TOP` | Top ad-unit identifier | Empty |
| `PUBLIC_ADSENSE_SLOT_MID` | Middle ad-unit identifier | Empty |
| `PUBLIC_ADSENSE_SLOT_BOTTOM` | Bottom ad-unit identifier | Empty |

Variables prefixed with `PUBLIC_` are included in browser-facing output and
must never contain passwords, API secrets, payment data, or private tokens.

## Project map

```text
public/             Static files copied directly to the finished site
scripts/            Country-data generation and validation
src/components/     Shared page, consent, and advertising components
src/data/           Country, guide, and exit-code datasets
src/lib/            Phone-number and advertising logic
src/pages/          Astro routes
tests/              Product-correctness tests
.github/workflows/  Automated repository checks
```

## Safety rules

- Do not push experiments directly to `main`.
- Do not make an unreviewed bulk change to generated country pages.
- Do not use `npm audit fix --force` or broad dependency upgrades without
  reviewing their effect and rebuilding the site.
- Never commit account credentials, Cloudflare API tokens, Google credentials,
  or `.env` files.
- Do not enable a chargeable Cloudflare or Google service without the owner's
  prior approval.
- Prefer small, reversible commits and use a normal revert to roll back a live
  release.
