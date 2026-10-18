# RT Crackers — Responsive, Accessibility and SEO Improvements

## Changes in this source update

- Replaced the last set of hard-coded banner aspect-ratio overrides with a single responsive rule driven by the active banner image's actual dimensions. Desktop and mobile-specific banner images are measured separately, and the frame is recalculated when the viewport crosses the mobile breakpoint.
- Kept the full banner artwork visible with `object-fit: contain`; added a responsive minimum/maximum banner height so unusually wide artwork remains usable without cropping.
- Reduced unnecessary banner image eager-loading, retained high fetch priority for the active slide, and paused auto-rotation while the user hovers or focuses the banner. Added an explicit pause/resume control and respect for reduced-motion preferences and hidden browser tabs.
- Added visible keyboard focus styles and a skip-to-main-content link.
- Added Open Graph and Twitter metadata, safe canonical URL normalization, organization JSON-LD, plus Next.js `robots.txt` and `sitemap.xml` routes.
- Made the minimum-order threshold visible in the homepage trust strip when that value exists in the CMS. No review counts, delivery promises or unverified trust claims were invented.
- Kept the existing horizontal product/category/budget/combo rails, adding focus and overflow refinements rather than replacing the existing catalogue flow.

## Existing integration boundary

Product purchase links still lead to `https://cart.rtcrackers.com`. This repository does not expose a supported product-specific cart API/deep-link contract, so the update does not invent product parameters or simulate adding products to a cart. Product-specific cart preselection requires the cart provider's documented integration.

## Validation performed

- TypeScript/TSX syntax transpilation: passed for all source `.ts` and `.tsx` files.
- CSS structure check: balanced braces.
- CSS parser check with `tinycss2`: parsed 578 top-level rules with no top-level parse errors.
- Full TypeScript type-check / production build: **not completed**. `npm ci` stalled while attempting to retrieve dependencies in this execution environment, leaving dependencies incomplete. Run `npm ci` followed by `npm run build` in a network-enabled environment before deployment.

## Release checklist

1. Keep the project's existing private `.env.local` file out of the distributable archive and deployment repository.
2. Run `npm ci` and `npm run build` in CI.
3. Test the homepage at 320, 360, 390, 430, 768, 1024, 1280 and 1440 CSS pixels, including browser zoom at 80%, 100%, 125%, 150% and 200%.
4. Confirm banner ratios against both desktop and mobile CMS images; test pager, pause/resume, keyboard navigation and reduced-motion mode.
5. Run Lighthouse on the deployed website and verify Core Web Vitals, metadata, canonical URL, `/robots.txt`, `/sitemap.xml`, and the full ordering journey on the external cart site.
