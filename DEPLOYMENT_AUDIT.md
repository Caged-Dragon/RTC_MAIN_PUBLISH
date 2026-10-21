# Showcase website — deployment and backend audit

Canonical domain: `https://rtcrackers.com`

## Shared backend

This independent Next.js project uses the active `RTCrackers` Supabase project `hhbpyxhtksgbkaigeutl` shared with `cart.rtcrackers.com`. Management-channel checks verified the current public schema, table read grants and RLS policies for the normalized catalogue and public CMS tables. Current observed catalogue data includes 127 active products, 127 current 2026 price rows, 18 active categories, and prices in the range ₹21–₹5,000. Current site page/content metadata is sourced from `web_pages`, `web_page_sections`, `web_seo`, `web_settings`, `web_themes`, `web_media` and `app_sites`.

The live database has unique `web_seo` metadata rows for each of the six public showcase pages. The titles/descriptions and SEO records were verified after updating. CMS wording was corrected where legacy sections contained an obsolete ₹2,000 minimum, out-of-date flat fee promises or old online-order/COD-checkout language.

## Build and test

```sh
cp .env.example .env.local
npm ci
npm run build
npm start
```

A source-level TypeScript/TSX transpile pass parsed 88 files across both projects without syntax errors. The dependency-backed `npm run build` could not be completed in this runtime because dependency downloads failed due to DNS/network errors. Run the build and smoke-test in a network-enabled CI/deployment environment before publishing.

## Runtime HTTP verification limitations

The container could not resolve either configured website domain or the public Supabase REST hostname; remote HTTP status and direct REST responses could not be confirmed here. The database schema, table grants, RLS policies, live catalogue counts and CMS/SEO records were queried using the connected Supabase management connection.

## Cross-site and transaction status

Product/category links navigate to `https://cart.rtcrackers.com` with catalogue search/category hints only. They never auto-add a product or submit an order. This release is catalogue/general-enquiry only; no online fireworks orders or payments are sent. The main website links back to the catalogue.

## SEO

See `SEO_KEYWORD_MAP.md`. Page metadata, HTTPS canonical URLs, social cards, structured data and the Next.js sitemap/robots routes have been added or refined. Product names/rates are loaded from the normalized database schema. SEO improvements support indexability but cannot guarantee a #1 Google position. Verify both domain properties and monitor canonical selection, coverage and page experience in Google Search Console after deployment.

## Production database advisories

Supabase's advisor currently reports public execution grants on several `SECURITY DEFINER` functions, four RLS-enabled tables without explicit policies, and mutable `search_path` warnings on several functions. These production permissions were not automatically changed; an administrator should review intended use and dependencies before applying remediation.
