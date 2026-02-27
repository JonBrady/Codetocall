# Ads

This site currently renders **ad placeholders only** (no ad network scripts).

## Slots

- **Top**: directly below the calculator hero block
  - Suggested: 728×90 (desktop), 320×100 (mobile)
- **Mid**: between the supporting content blocks and footer
  - Suggested: responsive rectangle
- **Bottom**: near footer
  - Suggested: wide unit or anchor-style

## Enabling ads later

When you’re ready for ads, replace the placeholder `<div class="adSlot ...">` blocks with your ad network tags.

To temporarily hide placeholders without deleting code, add:

```css
.adSlot { display: none; }
```

to `public/styles/global.css`.
