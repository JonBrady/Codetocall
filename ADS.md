# Advertising controls

CodeToCall contains reserved ad positions, but visible advertising remains off
unless the Cloudflare build environment explicitly enables it.

## Build-time controls

- `PUBLIC_ADS_ENABLED=true` permits the AdSense script to load after the visitor
  accepts optional Google services.
- `PUBLIC_ADS_RENDER=true` permits configured ad units to render.
- `PUBLIC_ADSENSE_CLIENT` supplies the public publisher/client identifier.
- `PUBLIC_ADSENSE_SLOT_TOP`, `PUBLIC_ADSENSE_SLOT_MID`, and
  `PUBLIC_ADSENSE_SLOT_BOTTOM` supply ad-unit identifiers.
- `PUBLIC_ADSENSE_MODE` defaults to `non-personalized`.

The `PUBLIC_*` values are visible in browser output and must never contain
secrets.

## Current gate

Do not turn on rendered ads or request another AdSense review just because the
code is ready. First resolve AdSense's low-value-content finding, publish stronger
original utility, confirm `ads.txt`, establish real traffic measurement, and set
up the required Google-certified consent platform for UK/EEA visitors.

The site's privacy-choice banner gates GA4 and dormant AdSense code. It is not a
Google-certified CMP and must not be represented as one.

## Layout

Ad positions are reserved in the shared layout to avoid large layout shifts.
Start with a small number of placements if approval is eventually granted, then
measure revenue alongside speed, engagement, and search performance. Remove any
placement that harms the product.
