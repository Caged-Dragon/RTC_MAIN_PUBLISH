# Showcase upgrade notes — `rtcrackers.com`

This archive contains the independent Next.js application for the RedThunder Crackers company/catalogue site. It links to `https://cart.rtcrackers.com` for catalogue browsing and shares the active Supabase backend with that site.

## Included updates

- Page-specific SEO titles, descriptions, keywords, canonical URLs, Open Graph/Twitter metadata and JSON-LD.
- Supabase CMS-driven SEO using `web_pages`, `web_page_sections`, and `web_seo`.
- Catalogue data aligned to normalized `products`, `product_prices`, `product_categories`, `product_pack_types` and `product_images` tables.
- Business schema/brand identity aligned to Rajukanna Fireworks and Makka & Wheat, Sivakasi, established 1995.
- Product/category links hand off only search/category hints to the CART catalogue; they do not auto-add or submit an order.
- Public CMS content corrected for the ₹3,000 stated dispatch minimum and catalogue/enquiry-only model where reviewed.

## Verified remote changes

The connected database-management interface confirmed 127 active products, 127 current 2026 price rows, 18 active categories and 14 active images. Page-specific SEO records and public CMS copy were updated in the live database for the corresponding public pages. The production database schema was not altered.

## Validation limits

The source syntax check covered 88 TypeScript/TSX files across both projects with no syntax diagnostics. npm dependency downloads and direct HTTP checks of the public domains/Supabase REST could not run from the build environment because of DNS/network failures. Run `npm ci` and `npm run build` in network-enabled CI before deployment.

SEO helps search engines interpret a site but cannot guarantee first position. See `SEO_KEYWORD_MAP.md` and verify indexing with Google Search Console after release.
