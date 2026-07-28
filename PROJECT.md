# CodeToCall project

## Purpose

Build a useful, accurate, search-led reference site for international calling
codes and dialling instructions. Keep the operating cost close to zero while
proving whether the site can attract repeatable organic traffic and eventually
earn advertising revenue.

## Architecture

- Astro static output hosted on Cloudflare Pages.
- No server-side rendering, database, Worker, or paid request-time compute.
- GitHub repository `JonBrady/Codetocall` is the source of truth.
- `main` is production; other pushed branches are previews.

## Product principles

- Correct answers before page-count growth.
- Useful, differentiated pages rather than thin SEO inventory.
- Fast pages with stable layouts.
- Measurement before monetisation.
- Preview-first, reversible releases.
- Owner approval before any paid or metered service.

The current priorities, decision metrics, monetisation gate, and portfolio rule
are maintained in [RECOVERY_PLAN.md](./RECOVERY_PLAN.md). Operational procedures
are in [DEPLOYMENT.md](./DEPLOYMENT.md).
