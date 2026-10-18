# RT Crackers — Responsive Header and Banner Fix

This update is limited to responsive layout corrections for the top of the homepage.

## Updated areas
- Header brand, actions, and search sizing on tablet and mobile.
- Hero text, CTA buttons, stats, and image layout on small screens.
- Featured banner sizing and image containment to prevent clipping/cropping.
- Banner CTA cards on narrow screens.
- Trust strip cards on compact viewports.

The existing catalogue, cart, CMS data, and ordering behaviour are unchanged.

## Validation
- TypeScript check: passed (`tsc --noEmit`).
- CSS parse: passed with PostCSS.
- Production build: not run as part of this responsive-only change.
