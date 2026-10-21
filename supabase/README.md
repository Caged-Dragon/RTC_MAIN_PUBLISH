# Showcase database integration

The site reads the shared production schema using the public Supabase publishable key from `.env.example`. Catalogue prices come from `product_prices` joined to `products`, and public pages/metadata come from `web_pages`, `web_page_sections`, and `web_seo`.

`legacy_reference_not_for_current_schema/` contains older SQL from a previous schema design; it is preserved for reference only and should not be applied to the live database without review.
