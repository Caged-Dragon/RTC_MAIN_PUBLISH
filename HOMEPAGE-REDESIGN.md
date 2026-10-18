# RT Crackers homepage redesign

## What changed

- Reordered the experience so the global header is followed by the shopping-first hero, live offer banner carousel, trust strip, categories and product browsing.
- Replaced the former company-first introduction with the hero headline **“Light Up Every Celebration.”** and clear Shop Now / Browse Categories actions.
- Moved the About / company profile section below the shopping catalogue.
- Updated the best-seller shelf to use actual `is_bestseller` and `is_featured` flags in the connected catalogue rather than hard-coded category slugs.
- Changed category, product, budget, combo and order-step sections from swipe-only rails to responsive grids. The product grid is two columns on mobile.
- Updated the visual design toward midnight navy (`#111827`), festival orange (`#F97316`), celebration gold (`#F4B942`) and clean white cards.
- Adjusted the mobile sticky navigation to Home, Categories, Search, Cart and WhatsApp. The Search item targets the product search input.
- Increased the offer carousel rotation interval to five seconds.
- Corrected tuple typing in the unused `CompanyMasthead` component so project-wide TypeScript checking succeeds.

## Cart integration note

The product catalogue currently links to a separate ordering-cart site. This update preserves that flow. Product cards do **not** claim to add a product to a cart because this codebase does not expose a product-specific add-to-cart API or documented deep link to the external cart. A true in-page Add to Cart interaction requires the cart provider's API or supported product-link contract.

## Validation

- `npx tsc --noEmit`: passes.
- `next build`: not completed in the editing container because this archive includes the Windows SWC native package, while the Linux build attempted to download the Linux SWC package and the network request failed. Run `npm ci` and `npm run build` in the deployment/CI environment to complete production compilation.

## Environment file

The distributable source archive intentionally excludes `.env.local`, `.git`, `.next`, and `node_modules`. Keep your current private `.env.local` file locally and do not commit credentials. Use `.env.example` as a reference when setting up a new environment.
