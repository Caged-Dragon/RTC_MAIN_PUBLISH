# RT Crackers Company Portfolio

Next.js portfolio/catalogue for RT Crackers, wired directly to the current production Supabase project.

## Current database source of truth

This website reads from:

- `public.products` — 127 catalogue products
- `public.company_profile` — company identity, contact details and logo
- `public.merchant_settings` — active catalogue year, ordering and delivery settings
- `public.offers` + `public.offer_banners` — admin-managed home banners/offers

It does not require the older portfolio CMS tables.

## Environment

```env
NEXT_PUBLIC_SUPABASE_URL=https://ypmiinmkyvzdpakbkers.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
NEXT_PUBLIC_SITE_URL=https://rtcrackers.com
CMS_REVALIDATE_SECONDS=60
```

## Vercel

- Framework: Next.js
- Root directory: this project folder
- Build command: `npm run build`
- Output: Next.js default
- Add the environment variables above.

## Behaviour

The catalogue is read-only from the website. Product names, prices, categories and images come from the database. Home banners are read from active `offer_banners` linked to active `offers`. If no banner exists, the portfolio still renders its normal hero.

The ordering CTA points to the customer cart site.

## Run locally

```bash
npm install
npm run dev
```
