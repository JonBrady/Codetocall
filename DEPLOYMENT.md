# CodeToCall deployment and operations

CodeToCall is deployed automatically from GitHub to Cloudflare Pages. This is
the handover guide for maintaining the live site without relying on a
particular person or agent.

## Production services

| Service | Current role |
| --- | --- |
| GitHub repository | `JonBrady/Codetocall` is the source of truth |
| Cloudflare Pages project | `codetocall` builds and hosts the static site |
| Production branch | `main` |
| Production domains | `https://codetocall.com` and `codetocall.pages.dev` |
| Build output | Static files in `dist/` |

Cloudflare's GitHub integration is connected and automatic deployments are
enabled. A successful `main` build updates production; a non-production branch
build creates a separate preview.

## Required Cloudflare build settings

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | Repository root / blank |
| Node.js version | 22 |
| `SITE` environment variable | `https://codetocall.com` |

Pin Node 22 with Cloudflare's supported Node-version setting or a
`NODE_VERSION=22` build variable. The repository and CI use the same major
version. Never put secrets in `PUBLIC_*` variables.

## Normal release

1. Create a clearly named branch from an up-to-date `main`.
2. Run `npm ci` and `npm run check`.
3. Review interactive or visual changes locally with `npm run preview`.
4. Push the branch and wait for GitHub Actions and the Cloudflare preview.
5. Inspect affected preview pages on desktop and mobile.
6. Merge into `main` only after the preview is accepted.
7. Confirm the production deployment, then smoke-test `/`, `/dial-builder/`, a
   country page, a calling-code page, `/robots.txt`, and `/sitemap-index.xml`.
8. Confirm analytics and advertising behaviour did not change unexpectedly.

Do not assume a GitHub push reached production merely because the push
succeeded. The Cloudflare deployment must also finish successfully.

## Automated checks

`.github/workflows/ci.yml` runs on pull requests and pushes. It installs from
the lockfile, runs product tests, validates country data, and performs a full
static build. It does not deploy and needs no Cloudflare or Google credentials.

## Rollback

If a production release is faulty:

1. Consider promoting Cloudflare's previous successful production deployment
   for immediate temporary recovery.
2. Revert the faulty commit or merged pull request. Do not force-push `main`.
3. Let Cloudflare deploy the revert and repeat the smoke tests.
4. Add a regression test before attempting the change again.

## Analytics, consent, and advertising

- Google storage is denied by default and GA4 loads only after visitor consent.
- `PUBLIC_GA_MEASUREMENT_ID` can override the CodeToCall GA4 identifier.
- `PUBLIC_ADS_ENABLED=true` permits AdSense to load after visitor acceptance.
- `PUBLIC_ADS_RENDER=true` permits configured ad slots to render.
- Keep `PUBLIC_ADSENSE_MODE=non-personalized` unless there is a deliberate,
  reviewed reason to change it.

Before rendering ads, confirm AdSense approval, working analytics, `ads.txt`,
and the required Google-certified consent platform. The site's simple privacy
choice is not a substitute for that certified platform.

## Cost guardrails

The intended architecture is a static Cloudflare Pages site on the existing
free plan. Routine deployments should not require paid Workers or metered
infrastructure.

Owner approval is required before upgrading a plan, enabling a metered
Cloudflare product, starting Google Ads or paid traffic, buying domains or data,
adding payment information, or accepting usage-based charges. State the price,
charging unit, spending limit, purpose, and free alternative first.

GitHub Actions usage should also be monitored against the repository owner's
plan. The CI workflow is deliberately small and uses no paid third-party action.

## Troubleshooting

### GitHub changed but the live site did not

1. Confirm the commit is on `main`, not only a preview branch.
2. Check GitHub Actions for that commit.
3. Inspect the Cloudflare deployment branch, commit, status, and build log.
4. Confirm automatic production deployments and GitHub access remain enabled.
5. Confirm `codetocall.com` is attached to the `codetocall` Pages project.

### Build fails

Reproduce with Node 22 using `npm ci`, `npm test`, `npm run validate-data`, and
`npm run build`. Fix the branch rather than bypassing checks or manually
uploading `dist/` over the Git integration.

### Pages address works but the custom domain does not

Check the Pages custom-domain status and `codetocall.com` DNS records. Record
existing values before changing DNS, and do not recreate records without
understanding what else they serve.
