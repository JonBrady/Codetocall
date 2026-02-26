# Scaling plan (keep Phase 1 static + cheap)

## Phase 1 (now): static-first

- Static country pages generated at build time.
- Static JSON dataset in-repo.
- Dial Builder runs entirely in the browser.
- Cloudflare Pages deploy (no Functions).

**Why:** zero per-request compute cost; avoids surprise bills.

## Phase 2: add compute only if it earns its keep

If/when needed:

1) **Optional “advanced parser” Worker**
- Only if we need richer rules than the deterministic browser-only normalizer.
- Put it behind caching and strict rate limits.
- Prefer: return precomputed results / lookup tables.

2) **Bot protection + abuse controls**
- Cloudflare WAF managed rules
- Rate limiting rules for any endpoints we add
- (If we add a Worker) require a simple token / turnstile for heavy use

3) **Monetization hooks (still static)**
- Add ad slots in templates (no ad scripts enabled until decision time).
- Add “recommendations” blocks by country/route (static content).

## Phase 3: optional paid developer API

- Separate product from the SEO site.
- Worker-based API with:
  - strict per-key quotas
  - caching (KV/Cache API)
  - clear error messages
  - predictable pricing

Key rule: **do not let SEO traffic hit paid compute paths**.
