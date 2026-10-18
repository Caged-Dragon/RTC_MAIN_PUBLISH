# RT Crackers Website — Database-Driven Homepage

Next.js website for RT Crackers. It retains the existing project architecture and reads the live catalogue and business profile from the connected Supabase project. The global header is followed by a responsive shopping hero and an image-aware CMS offer banner. Orders continue through the separate cart website; this site does not create a second cart or payment flow.

## Production database remains the source of truth

The website reads from the existing production tables:

- `public.products` — active products, identifiers, product codes, pack details, prices and images
- `public.product_categories` — active category names, slugs, descriptions and images
- `public.company_profile` — company identity, registered name, brand description, aim, vision, mission, contact channels, address, optional registration identifiers, business hours, policies and social links
- `public.merchant_settings` — factory identity/address, catalogue year, booking state, minimum order value and dispatch policy
- `public.offers` + `public.offer_banners` — active offer artwork, headline/subheadline and optional mobile artwork/link
- `public.theme_page_settings` + `public.theme_component_settings` — database-managed site theme, where configured

No demo catalogue or invented sale prices are added. The homepage loads up to 500 active product records per request, uses the real database product IDs, and filters/sorts those records in the browser.

## What changed

- Places the responsive hero and active database offer banner directly after the global header. A mobile creative is used when one exists, and the banner frame follows the selected artwork dimensions.
- Refreshed the main hero while continuing to display the live company name, promotional copy, location and catalogue counts.
- Added category artwork/cards using real category records and available category images.
- Added product search, category filtering, price sorting, budget filters and progressive “load more” for the real catalogue.
- Product cards use the current database prices and only show MRP when the database MRP is greater than the selling price.
- Expanded the company/contact area and footer to show populated legal/factory names, parent business and brand, company description, aim, vision, mission, established claim, registered/factory address, city/district/state/postcode/country, all available phones/emails, WhatsApp, website, map and social links. Registration identifiers, custom contacts and business hours appear only when populated in the database.
- Preserved the existing cart URL and WhatsApp number resolution; product order links continue to the current cart domain because no verified product-specific cart deep-link interface is defined in this project.
- Retained the current safety, shipping, ordering notes, SEO metadata, database theme and reduced-motion preferences.

## Environment

Copy `.env.example` to `.env.local` and supply the existing project's values. Use only the Supabase publishable key (or legacy anon key if that is what the project is configured to use). **Never put a Supabase service-role/secret key in a `NEXT_PUBLIC_` variable or frontend source code.**

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
NEXT_PUBLIC_SITE_URL=https://rtcrackers.com
CMS_REVALIDATE_SECONDS=60
```

Do not commit `.env.local`.

## Run locally

```bash
npm ci
npm run dev
```

Build for production with:

```bash
npm run build
npm run start
```

## Vercel deployment

- Framework: Next.js
- Root directory: project root
- Build command: `npm run build`
- Output: Next.js default
- Configure the four environment variables above in the appropriate deployment environment.

## Integration notes

- The cart CTA is `https://cart.rtcrackers.com` in `src/lib/utils.ts`.
- Database reads and active-offer filtering are in `src/lib/cms.ts`.
- The banner remains optional: if there is no active database banner, the banner section is omitted rather than replaced by a fake offer.
- The page remains read-only with respect to the database. It does not change pricing, stock, catalogue records or booking settings.


## Validation and limitations for this handoff

- The latest responsive/accessibility/SEO fixes are described in [`IMPLEMENTATION-AUDIT.md`](./IMPLEMENTATION-AUDIT.md).
- TypeScript/TSX syntax transpilation: 22 source files, 0 syntax diagnostics.
- CSS parser check (`tinycss2`): 1,096 rules visited recursively, 0 parse errors; CSS brace balance is 0.
- A full TypeScript type-check and Next.js production build were **not verified** in this environment because `npm ci` stalled while retrieving dependencies. Run `npm ci` and `npm run build` in CI or another network-enabled environment before deployment.
- This package contains source changes only; the live website has not been deployed or modified by this handoff. No Supabase rows, prices, stock, bookings, or orders were changed.
