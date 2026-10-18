# RT Crackers responsive UI correction

This package corrects the previous layout issues in the existing Next.js website. It is based on the reference design and preserves the existing database-backed catalogue and ordering integrations.

## Latest layout corrections

- The active banner from the current `offer_banners` / `offers` database records now renders at the very top of the page, before navigation. The banner uses its intrinsic source-image dimensions (`width: 100%; height: auto`) instead of a forced 16:5 frame and `object-fit: cover`, so the complete artwork is shown without cropping.
- When the database supplies a mobile banner image, the browser selects that asset on viewports up to 767px; it also retains intrinsic proportions rather than cropping the mobile design.
- The navigation sits below the banner and uses a horizontally swipeable link rail on both mobile and desktop. The hamburger/dropdown drawer has been removed.
- The full Company & Contact Details section now sits at the end of the homepage, immediately before the footer. It includes the populated brand/legal identity, addresses, phone/WhatsApp, email, website, map link, registration fields, contact hours and ordering details. Database-populated aim, vision, mission, brand and established information are included in the company profile card when present.
- Company registration and supporting cards adapt to the available width; longer contact sections remain horizontally browsable on small screens.
- Product categories, featured/current catalogue cards, budgets, combo packs, order steps, company/service highlights, shipping cards, safety cards, and contact/terms cards use horizontal snap-scrolling rails. Every rail now has left-to-right flow and left-start snapping, with adaptive card widths, touch scrolling and thin scrollbars where supported.
- Category and price sorting controls are chip rails, not native dropdowns. The mobile navigation is also a rail without a drawer or dropdown.
- A light IntersectionObserver-based motion layer animates sections/cards in and out as they enter or leave the viewport. It uses CSS only (no animation dependency) and respects `prefers-reduced-motion`.
- The active banner remains full-width and uses the selected desktop/mobile asset at its intrinsic aspect ratio (`width: 100%; height: auto; object-fit: contain`), so its container height changes with the current viewport/image and the artwork is not cropped.
- Responsive overrides target small phones, large phones, tablets and desktops while preventing unintended page-level horizontal overflow. Section headings use consistent left alignment with the first content card.

## Database data and integrations

- Products and current prices come from the existing `products` / `product_categories` tables.
- Company identity, populated addresses, contact channels and company profile statements are read from `company_profile` and `merchant_settings`.
- The banner asset, mobile asset, and accessible alt text come from active `offer_banners` / `offers` records.
- Active combo packs and their current prices come from `combo_packs` / `combo_pack_items`, with `LIVE_SUM` prices derived from current related product rates and quantities and `MANUAL` prices preserved from the database.
- The ordering cart remains `https://cart.rtcrackers.com/`. WhatsApp links continue to use the business contact settings.
- The package changes front-end code only; it does not write to or modify database rows.

## Validation performed

- TypeScript/TSX transpilation syntax check: 20 files, zero syntax diagnostics.
- CSS parsed with PostCSS: 749 rules, no parse errors.
- Dropdown/select scan: no `<select>`, `<details>`, or hamburger dropdown rendered by the app navigation.
- Confirmed the active database reports 127 active products, 18 active categories and an active banner; 24 active combo packs are loaded from the database source.
- The latest responsive/layout correction passes TypeScript/TSX syntax parsing across 20 files and the CSS passes PostCSS parsing across 749 rules. Page-order and key CSS intent checks also pass. A full Next.js production build and live browser/device QA have not yet run because `node_modules` is not present and dependency installation could not be completed in this environment. Syntax checks are not a substitute for a full build.

## Build and deployment

1. Extract the archive and retain the existing environment configuration.
2. Ensure `.env.local` contains only the same public Supabase URL and publishable/anon client key expected by the existing project. Never put a service-role key into frontend code.
3. Run `npm ci` and `npm run build` in the intended deployment environment.
4. Test the banner's natural aspect ratio and the rails at 320px, 375px, 390px, 430px, 768px, 1024px and 1440px before deploying through the current hosting workflow.
