# codetocall.com — Project

## Purpose
Build an SEO-first, **static** international calling codes + dial-builder site designed to earn via **ad revenue**.

Core loop:
1) Publish lots of genuinely useful, indexable pages (country/calling-code intent)
2) Keep pages fast + stable (no CLS)
3) Once traffic exists, switch on ads cleanly

## Non-negotiables
- **Static-first** (Cloudflare Pages). Avoid SSR/Workers unless proven ROI.
- Changes must be **safe + reversible** (git history, small diffs).
- Protect UX: avoid layout shift, slow JS, or spammy pages.

## Repo
- Path: `/home/jon/.openclaw/workspace/calling-codes/site`
- Framework: Astro static output

## Deployment
- Host: Cloudflare Pages
- Domain: https://codetocall.com
- Sitemap:
  - https://codetocall.com/sitemap-index.xml

## Monetization
- Keep ad slots present but CLS-safe.
- Ads should be switchable via a single flag (default OFF until ready).

## Current priorities
1) Expand country dataset/pages (increase SEO surface area)
2) Tighten titles/meta + add structured data where helpful
3) Make ads toggleable and keep placeholders CLS-safe

## Working notes
- Session transcript for Search Console setup (Feb 27 late evening) is in:
  `~/.openclaw/agents/main/sessions/a8df1885-d229-4f84-bbb3-33c3e3cf98fc.jsonl`
