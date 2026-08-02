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

Checkpoint: commit `a8e1c39` on `agent/recovery-foundation`

- The recovery branch is pushed to GitHub and builds successfully on Cloudflare Pages.
- Fifteen automated checks pass, 245 country records validate, and 459 static pages build.
- The live `main` branch remains at `09aa45f` and has not been changed.
- Analytics remains consent-gated and adverts remain disabled.
- Chrome provides stable signed-in access to Cloudflare and Google Search Console.
- Most recent public review deployment: `https://729ac0f3.codetocall.pages.dev/`.

## Preview review — 2 August 2026

- Re-ran the complete test, data-validation, and 459-page build successfully.
- Compared the preview with Time.is and kept the focus on one large, immediate answer.
- Found that the site loaded an older public stylesheet instead of the newer source
  styles. The layout now uses one build-managed source stylesheet.
- Replaced the oversized moving empty-state message with a calm instruction.
- Restored the intended country-directory and country-route card layouts, and made
  the popular destination links cleaner and easier to scan.
- Replaced the `AC` and `TA` display-name fallbacks with `Ascension Island` and
  `Tristan da Cunha`, and added validation to prevent ISO-code placeholder names.
- Verified empty, valid, invalid, directory-search, and country-route states locally
  with no browser errors. Production, DNS, adverts, and paid services remain unchanged.

## Search visibility audit — 28 July 2026

- Search Console reported 10,136 impressions and 0 clicks in the previous three months,
  with an average position of 71.8.
- The highest-impression pages were Spain (4,395), Germany (1,640), India (1,636),
  and Australia (1,186).
- Google reported 64 indexed pages and 412 not indexed: 367 discovered but not
  indexed, 34 crawled but not indexed, and 11 in smaller technical categories.
- The sitemap is healthy, last read 27 July 2026, with 457 discovered pages.
- The evidence points to too many similar pages and weak internal navigation rather
  than a broken sitemap.
- `http://www.codetocall.com/` currently returns Cloudflare error 522. Repair the
  `www` DNS/redirect separately before asking Google to validate that issue.

Implemented on the preview branch:

- clean canonical URLs that remove calculator query strings from Google indexing;
- restored curated examples and trunk-prefix rules lost by the old data build;
- distinct guidance for Spain, Germany, India, and Australia;
- human-readable route links and a searchable country-code directory;
- clearer navigation between the calculator and country pages.

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
