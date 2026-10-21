# RedThunder Showcase — `rtcrackers.com`

The independent Next.js source tree for the public company/catalogue website. It shares the existing production Supabase project with `cart.rtcrackers.com`.

## Local development and deployment

Requirements: Node.js 20+ and npm.

```bash
cp .env.example .env.local
npm ci
npm run dev
```

Production validation: `npm run build`, then `npm start`. Deploy this directory as its own Vercel project, attach `rtcrackers.com`, and configure the environment variables from `.env.example`.

### Environment variables

- `NEXT_PUBLIC_SUPABASE_URL` — shared Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — browser/public publishable key; never use a service-role/secret key in this app.
- `NEXT_PUBLIC_SITE_URL=https://rtcrackers.com` — canonical origin.
- `CMS_REVALIDATE_SECONDS=60` — server-side CMS cache period.

## Shared database integration

The live catalogue is read from `products`, `product_prices`, `product_categories`, `product_pack_types`, and `product_images`. The site reads public page content and theme data from `web_pages`, `web_page_sections`, `web_seo`, `web_settings`, `web_themes`, `web_media`, and `app_sites`. The product rates shown are sourced from current `product_prices` rows; the older `rt_cart_products` table is only used for popularity/featured flags when its product name matches the normalized catalogue row.

The public catalogue is data-driven, while the public information pages receive page-specific metadata. The current database check found 127 active catalogue products, 127 current 2026 price rows, and 18 active categories. Current database price range is ₹21–₹5,000; prices may change, and rates shown are catalogue information.

## SEO setup

- Server-generated metadata reads unique `web_seo` records, page titles/descriptions, canonicals, Open Graph and Twitter descriptions.
- Public informational pages are generated from `web_pages` and `web_page_sections`.
- `src/app/sitemap.ts` lists published, indexable public pages; `src/app/robots.ts` publishes the canonical sitemap URL.
- The root layout includes Organization/LocalBusiness JSON-LD, and the catalogue includes product/category schema appropriate for catalogue content.
- Keep headings, visible text, product names, useful alt text and internal links aligned with the per-page plan in `SEO_KEYWORD_MAP.md`.

SEO improvements cannot guarantee a first-place Google ranking. Submit the sitemap and monitor indexing/canonical selection/performance in Search Console after deployment.

## Cross-site behavior and transaction status

Product/category links open the companion catalogue at `https://cart.rtcrackers.com`; they pass a search/category hint only. Both independent deployments share the verified `hhbpyxhtksgbkaigeutl` Supabase project and use the normalized product and pricing tables. They do not add a product or submit an order. The showcase website is catalogue/enquiry-only and does not provide online fireworks checkout or payments.

The official PESO circular on online fireworks sales should be reviewed with qualified counsel and the relevant licensing authority before any digital ordering flow is restored.

## Database SQL files

The `supabase/legacy_reference_not_for_current_schema/` folder retains older SQL only for reference. Do not apply those scripts to the live project without reconciling them against the remote schema/migration history. The SEO/page-content DML applied during this update is already live; no new tables or DDL were applied.
