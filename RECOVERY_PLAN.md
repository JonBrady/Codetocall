# CodeToCall recovery plan

Updated: 28 July 2026

## Objective

Turn CodeToCall into a dependable, measurable, low-cost reference site for
international calling. Prove that the first site attracts useful search traffic
before reusing the model for additional sites.

## Guardrails

- Keep the site static on Cloudflare Pages unless paid compute has a proven return.
- Use preview deployments for every change; `main` remains the production branch.
- Do not enable a paid Cloudflare or Google feature without the owner's approval.
- Do not show adverts until the content and consent setup are ready.
- Prefer useful, accurate pages over creating large numbers of thin pages.

## First three priorities

### 1. Make releases safe and repeatable

Status: completed on `agent/recovery-foundation`

- Replace the inherited OpenClaw-era setup notes.
- Add automated build, data-validation, and correctness checks.
- Pin the supported Node.js version.
- Document preview-first deployment, rollback, and cost controls.

Success means a broken change is caught before it reaches `main`, and a future
maintainer can operate the site without relying on the former agent.

### 2. Establish trustworthy measurement and consent

Status: completed on `agent/recovery-foundation`

- Add the existing GA4 property (`G-TZP3CBGKDT`) in consent-aware mode.
- Keep analytics storage denied until the visitor chooses.
- Record anonymous Cloudflare Web Analytics as a low-cost operational cross-check.
- Keep AdSense adverts off while the account reports low-value content.
- Before serving Google adverts in the UK/EEA, configure a Google-certified CMP,
  such as Google's free Privacy & messaging CMP.

Success means real visits and search landings can be measured without claiming
that a basic site banner alone makes advertising compliant.

### 3. Fix the product's core answer

Status: completed on `agent/recovery-foundation`

- Use `libphonenumber-js` as the shared formatter and validator.
- Remove unsafe hand-written leading-zero rules.
- Make the home page and Dial Builder return the same result.
- Add automated examples for common routes and invalid input.

Success means representative UK, US, European, and international numbers are
converted consistently, with invalid or ambiguous input explained clearly.

## Recovery checkpoint

Checkpoint: commit `49fc6eb` on `agent/recovery-foundation`

- The recovery branch is pushed to GitHub and its warning-free CI run passed.
- Nine dialing tests pass, 245 country records validate, and 458 static pages build.
- The live `main` branch has not been changed.
- Analytics remains consent-gated and adverts remain disabled.
- Cloudflare preview/dashboard verification is the next step.
- Cloudflare inspection is paused because loading and inspecting the dashboard
  repeatedly crashed the Codex in-app browser after the PC restart. Resume via a
  stable signed-in browser session or a narrowly scoped Cloudflare API token.

## Next phase: earn search visibility

Start only after the first three priorities have passed a preview review.

1. Audit Search Console's indexed and excluded URLs.
2. Improve high-intent country and route pages with genuinely distinct guidance,
   examples, mobile/landline notes, time-zone context, and common mistakes.
3. Strengthen navigation between the calculator, country pages, and route pages.
4. Add structured data only where it accurately describes visible content.
5. Submit the corrected sitemap and monitor indexing, impressions, clicks, and
   engagement for 6-8 weeks.

Initial decision metrics:

- correct-answer test pass rate;
- indexed useful pages, not raw page count;
- organic impressions and clicks by landing page;
- calculator completions or successful copy actions;
- return visits and outbound exits;
- page speed and layout stability.

## Monetisation gate

Do not request another AdSense review merely because the code is ready. Request
review after the site has stronger differentiated content, working navigation,
clear ownership/contact/privacy information, and measurable search usage.

If approval is granted, begin with a small number of reserved, layout-stable ad
positions. Monitor revenue per thousand sessions alongside speed, engagement,
and search performance. Remove placements that damage the product.

## Portfolio rule

Do not clone CodeToCall into a portfolio of near-identical sites yet. First prove
one repeatable content-and-distribution pattern. New sites should target a
distinct user problem, share the inexpensive operating system, and have enough
original utility to stand on their own.
