"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { Category, ComboPack, Product } from "@/lib/cms";
import { CART_URL, inr, cartHandoffUrl } from "@/lib/utils";

const CATEGORY_IMAGES: Array<[string, string]> = [
  ["SPARKLER", "/showcase/redthunder_sparklers_1791297554442.jpg"],
  ["STAR", "/showcase/redthunder_twinkling_stars_1791303667579.jpg"],
  ["SOUND", "/showcase/redthunder_sound_crackers_1791301117609.jpg"],
  ["BIJILI", "/showcase/redthunder_sound_crackers_1791301117609.jpg"],
  ["BOMB", "/showcase/redthunder_aerial_shots_1791299049699.jpg"],
  ["FLOWER", "/showcase/redthunder_pots_fountains_1791299034674.jpg"],
  ["POT", "/showcase/redthunder_pots_fountains_1791299034674.jpg"],
  ["CHAKKAR", "/showcase/redthunder_peacock_chakkars_1791301133347.jpg"],
  ["ROCKET", "/showcase/redthunder_sky_rockets_1791303603553.jpg"],
  ["FOUNTAIN", "/showcase/redthunder_pots_fountains_1791299034674.jpg"],
  ["PEACOCK", "/showcase/redthunder_peacock_chakkars_1791301133347.jpg"],
  ["GIFT", "/showcase/redthunder_gift_boxes_1791297541022.jpg"],
  ["KID", "/showcase/redthunder_kids_novelties_1791303636279.jpg"],
  ["CHORSA", "/showcase/redthunder_garlands_wala_1791303620827.jpg"],
  ["WALA", "/showcase/redthunder_garlands_wala_1791303620827.jpg"],
  ["AERIAL", "/showcase/redthunder_aerial_shells_1791303651159.jpg"],
];

function categoryImage(category: Category) {
  if (category.image_url) return category.image_url;
  const name = category.category_name.toUpperCase();
  return CATEGORY_IMAGES.find(([keyword]) => name.includes(keyword))?.[1]
    ?? "/showcase/redthunder_hero_crackers_1791297525760.jpg";
}

type Props = { products: Product[]; categories: Category[]; combos: ComboPack[] };

const BUDGET_OPTIONS = [
  { value: "500", amount: "₹500", label: "Products up to ₹500", note: "Smaller items" },
  { value: "1000", amount: "₹1,000", label: "Products up to ₹1,000", note: "More choices" },
  { value: "1500", amount: "₹1,500", label: "Products up to ₹1,500", note: "Explore more" },
];

const ORDER_STEPS = [
  { number: "01", title: "Browse the catalogue", body: "Explore current product names, categories and published rates." },
  { number: "02", title: "Filter and compare", body: "Use search, category filters and price sorting to find product information." },
  { number: "03", title: "Keep a local shortlist", body: "Use the companion site to review catalogue details. It does not submit an online order." },
  { number: "04", title: "Ask for information", body: "Contact the business to confirm current details, serviceability and applicable terms." },
];

export default function Catalogue({ products, categories, combos }: Props) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sort, setSort] = useState("featured");
  const [budget, setBudget] = useState("");
  const [visibleCount, setVisibleCount] = useState(16);

  useEffect(() => {
    const onHeaderSearch = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      setQuery(typeof detail === "string" ? detail : "");
      setVisibleCount(16);
    };
    window.addEventListener("rtcrackers:search", onHeaderSearch);
    return () => window.removeEventListener("rtcrackers:search", onHeaderSearch);
  }, []);

  const filteredProducts = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    const filtered = products.filter((product) => {
      const categoryMatch = activeCategory === "all" || product.category_slug === activeCategory;
      const budgetMatch = !budget || product.selling_price < Number(budget);
      const textMatch = !term || [
        product.product_name,
        product.product_code ?? "",
        product.category_name,
        product.pack_type_name ?? "",
      ].some((value) => value.toLocaleLowerCase().includes(term));
      return categoryMatch && budgetMatch && textMatch;
    });

    return filtered.sort((a, b) => {
      if (sort === "price-low") return a.selling_price - b.selling_price;
      if (sort === "price-high") return b.selling_price - a.selling_price;
      if (sort === "name") return a.product_name.localeCompare(b.product_name, "en", { sensitivity: "base" });
      const scoreA = Number(Boolean(a.is_featured)) * 2 + Number(Boolean(a.is_bestseller));
      const scoreB = Number(Boolean(b.is_featured)) * 2 + Number(Boolean(b.is_bestseller));
      return scoreB - scoreA;
    });
  }, [products, query, activeCategory, sort, budget]);

  const chooseCategory = (slug: string) => {
    setActiveCategory(slug);
    setVisibleCount(16);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("catalogue")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  };

  const chooseBudget = (value: string) => {
    setBudget(value);
    setVisibleCount(16);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("catalogue")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  };

  const resetFilters = () => {
    setQuery("");
    setActiveCategory("all");
    setSort("featured");
    setBudget("");
    setVisibleCount(16);
  };

  const visibleCategories = categories;
  const selectedCategoryName = categories.find((category) => category.slug === activeCategory)?.category_name;
  // Prefer explicitly marked best sellers. If the catalogue only has featured
  // flags configured, show those instead and label the shelf honestly.
  const bestSellerProducts = products.filter((product) => product.is_bestseller).slice(0, 8);
  const featuredProducts = products
    .filter((product) => product.is_featured && !product.is_bestseller)
    .slice(0, Math.max(0, 8 - bestSellerProducts.length));
  const selectedIds = new Set([...bestSellerProducts, ...featuredProducts].map((product) => product.product_id));
  const catalogueFallback = products.filter((product) => !selectedIds.has(product.product_id));
  const highlightProducts = [...bestSellerProducts, ...featuredProducts, ...catalogueFallback].slice(0, 8);
  const highlightTitle = bestSellerProducts.length > 0
    ? "Best Sellers"
    : featuredProducts.length > 0 ? "Featured Products" : "Explore the Collection";
  const highlightIntro = bestSellerProducts.length > 0
    ? "Popular picks marked in our current product catalogue."
    : featuredProducts.length > 0
      ? "Explore products highlighted in the current catalogue."
      : "A quick selection from our current product catalogue.";
  const categoryAggregateSchemas = categories.map((category) => {
    const categoryProducts = products.filter((product) => product.category_slug === category.slug && product.selling_price > 0);
    if (!categoryProducts.length) return null;
    return {
      "@type": "Product",
      name: `${category.category_name} – Makka & Wheat brand Sivakasi crackers`,
      category: category.category_name,
      brand: { "@type": "Brand", name: "Makka & Wheat" },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "INR",
        lowPrice: Math.min(...categoryProducts.map((product) => product.selling_price)),
        highPrice: Math.max(...categoryProducts.map((product) => product.selling_price)),
        offerCount: categoryProducts.length
      }
    };
  }).filter(Boolean);
  const comboAggregate = combos.filter((combo) => combo.current_price > 0);
  const catalogSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        name: "Makka & Wheat brand crackers – RedThunder factory-direct catalogue",
        itemListElement: products.filter((product) => product.selling_price > 0).slice(0, 100).map((product, index) => ({
          "@type": "ListItem", position: index + 1, item: {
            "@type": "Product", name: product.product_name, sku: product.product_code || product.product_id,
            category: product.category_name, image: product.image_url || undefined,
            brand: { "@type": "Brand", name: "Makka & Wheat" },
            description: `Catalogue information for ${product.product_name} from Rajukanna Fireworks, Sivakasi. This website does not accept online fireworks orders.`
          }
        }))
      },
      ...categoryAggregateSchemas,
      ...(comboAggregate.length ? [{
        "@type": "Product", name: "Sivakasi cracker combo packs – RedThunder Crackers", category: "Combo Packs",
        brand: { "@type": "Brand", name: "Makka & Wheat" },
        offers: { "@type": "AggregateOffer", priceCurrency: "INR", lowPrice: Math.min(...comboAggregate.map((combo) => combo.current_price)), highPrice: Math.max(...comboAggregate.map((combo) => combo.current_price)), offerCount: comboAggregate.length }
      }] : [])
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogSchema).replace(/</g, "\\u003c") }} />
      <section id="categories" className="section-pad category-section py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="catalogue-section-heading mb-5 sm:mb-7">
            <div>
              <p className="eyebrow mb-2">Find your favourites</p>
              <h2 className="section-title">Shop by <span className="accent-red">category</span></h2>
            </div>
            <a href="#catalogue" className="text-button">Browse all products <span aria-hidden="true">→</span></a>
          </div>

          {categories.length > 0 ? (
            <div className="category-grid grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
              {visibleCategories.map((category) => {
                const selected = activeCategory === category.slug;
                return (
                  <button
                    key={category.category_id || category.slug}
                    type="button"
                    onClick={() => chooseCategory(category.slug)}
                    aria-pressed={selected}
                    className={`category-tile${selected ? " category-tile-selected" : ""}`}
                    title={category.details || category.description || category.category_name}
                  >
                    <span className="category-tile-image-wrap">
                      <Image
                        src={categoryImage(category)}
                        alt={`${category.alt_text || category.category_name} – Makka & Wheat brand Sivakasi crackers`}
                        width={520}
                        height={360}
                        sizes="(min-width:1280px) 12vw,(min-width:1024px) 24vw,(min-width:640px) 32vw,50vw"
                        className="category-tile-image"
                      />
                    </span>
                    <span className="category-tile-copy"><strong>{category.category_name}</strong></span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="surface-card rounded-2xl p-6 text-[var(--muted)]">Categories will appear here when available in the catalogue.</p>
          )}
        </div>
      </section>

      {highlightProducts.length > 0 && (
        <section id="catalogue-featured" className="featured-catalogue-section section-pad py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <div className="catalogue-section-heading mb-5 sm:mb-7">
              <div>
                <p className="eyebrow mb-2">From the live product list</p>
                <h2 className="section-title">{highlightTitle}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75 sm:text-base">{highlightIntro}</p>
              </div>
              <a href="#catalogue" className="gold-button px-4 py-3">View all products <span aria-hidden="true">→</span></a>
            </div>
            <div className="product-grid featured-product-grid grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {highlightProducts.map((product) => <ProductCard key={`highlight-${product.product_id}`} p={product} />)}
            </div>
          </div>
        </section>
      )}


      {combos.length > 0 && (
        <section id="combos" className="combo-showcase-section section-pad py-9 sm:py-11">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <div className="catalogue-section-heading mb-5 sm:mb-7">
              <div>
                <p className="eyebrow mb-2">Database-listed combinations</p>
                <h2 className="section-title">RedThunder <span className="accent-red">combos</span></h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">Current active combo packs and prices are loaded from the existing ordering database.</p>
              </div>
              <a href={`${CART_URL}/combos`} target="_blank" rel="noopener noreferrer" className="text-button">View combo packs in cart <span aria-hidden="true">↗</span></a>
            </div>
            <div className="combo-grid grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              {combos.map((combo) => (
                <article key={combo.id} className="combo-card">
                  <div className="combo-card-image">
                    <Image
                      src={combo.image_url || "/showcase/redthunder_gift_boxes_1791297541022.jpg"}
                      alt={`${combo.name} – Makka & Wheat brand Sivakasi cracker combo pack`}
                      width={560}
                      height={380}
                      sizes="(min-width:1024px) 24vw,50vw"
                    />
                    {combo.badge_text && <span className="combo-card-badge">{combo.badge_text}</span>}
                  </div>
                  <div className="combo-card-body">
                    <p className="combo-card-price">{inr(combo.current_price)}</p>
                    <h3>{combo.short_title || combo.name}</h3>
                    <p className="combo-card-description">{combo.description || combo.tagline || "See the current combo details on the ordering site."}</p>
                    <p className="combo-card-count">{combo.item_count} product lines · {combo.budget_tier ? combo.budget_tier.toLowerCase() + " range" : "combo pack"}</p>
                    <a href={`${CART_URL}/combos`} target="_blank" rel="noopener noreferrer" className="combo-card-link">View combo details <span aria-hidden="true">↗</span></a>
                    <p className="product-minimum-note">For requested Sivakasi godown dispatch, the stated ₹3,000 minimum applies to permitted offline fulfilment; confirm details with sales.</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="catalogue" className="section-pad catalogue-section py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="catalogue-section-heading mb-6 sm:mb-8">
            <div>
              <p className="eyebrow mb-2">Live product information</p>
              <h2 className="section-title">Explore the <span className="accent-red">catalogue</span></h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">Product names, categories, pack details and prices come from the production database. Product actions continue to the existing cart website.</p>
            </div>
            <div className="catalogue-total"><strong>{products.length.toLocaleString("en-IN")}</strong><span>active products loaded</span></div>
          </div>

          <div className="catalogue-toolbar">
            <label className="catalogue-search-wrap">
              <span className="sr-only">Search products</span>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="catalogue-search-icon" fill="none"><circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.8" /><path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              <input id="catalogue-search" className="search-input catalogue-search" type="search" inputMode="search" placeholder="Search product name, code, category or pack…" value={query} onChange={(event) => { setQuery(event.target.value); setVisibleCount(16); }} />
            </label>
            <div className="catalogue-filter-control">
              <span className="catalogue-filter-label">Browse category</span>
              <div className="horizontal-rail filter-chip-rail" aria-label="Filter products by category">
                <button type="button" className="filter-chip" aria-pressed={activeCategory === "all"} onClick={() => { setActiveCategory("all"); setVisibleCount(16); }}>All categories</button>
                {categories.map((category) => <button key={category.category_id || category.slug} type="button" className="filter-chip" aria-pressed={activeCategory === category.slug} onClick={() => { setActiveCategory(category.slug); setVisibleCount(16); }}>{category.category_name}</button>)}
              </div>
            </div>
            <div className="catalogue-filter-control">
              <span className="catalogue-filter-label">Sort products</span>
              <div className="horizontal-rail filter-chip-rail sort-chip-rail" aria-label="Sort the product catalogue">
                <button type="button" className="filter-chip" aria-pressed={sort === "featured"} onClick={() => { setSort("featured"); setVisibleCount(16); }}>Recommended</button>
                <button type="button" className="filter-chip" aria-pressed={sort === "price-low"} onClick={() => { setSort("price-low"); setVisibleCount(16); }}>Price: low to high</button>
                <button type="button" className="filter-chip" aria-pressed={sort === "price-high"} onClick={() => { setSort("price-high"); setVisibleCount(16); }}>Price: high to low</button>
                <button type="button" className="filter-chip" aria-pressed={sort === "name"} onClick={() => { setSort("name"); setVisibleCount(16); }}>Name: A–Z</button>
              </div>
            </div>
            {(query || activeCategory !== "all" || sort !== "featured" || budget) && <button type="button" className="clear-filters" onClick={resetFilters}>Reset filters</button>}
          </div>

          <div className="catalogue-budget-active">
            <span>Quick price filter:</span>
            <div className="budget-filter-buttons">
              <button type="button" className="budget-chip" aria-pressed={!budget} onClick={() => { setBudget(""); setVisibleCount(16); }}>Any price</button>
              {BUDGET_OPTIONS.map((option) => <button key={option.value} type="button" className="budget-chip" aria-pressed={budget === option.value} onClick={() => { setBudget(option.value); setVisibleCount(16); }}>{`Under ${option.amount}`}</button>)}
            </div>
          </div>

          <div className="catalogue-results-row" aria-live="polite">
            <p>Showing <strong>{Math.min(visibleCount, filteredProducts.length)}</strong> of <strong>{filteredProducts.length}</strong> matching products{selectedCategoryName ? <span> in <strong>{selectedCategoryName}</strong></span> : null}</p>
            {query && <p className="catalogue-query">Search: “{query}”</p>}
          </div>

          {filteredProducts.length > 0 ? (
            <div className="product-grid grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:gap-5">
              {filteredProducts.slice(0, visibleCount).map((product) => <ProductCard key={product.product_id} p={product} />)}
            </div>
          ) : (
            <div className="catalogue-empty surface-card rounded-2xl p-8 text-center sm:p-12">
              <span aria-hidden="true" className="catalogue-empty-icon">⌕</span><h3 className="mt-3 text-xl font-black">No products found</h3><p className="mt-2 text-[var(--muted)]">Try another search, category or price range.</p><button type="button" className="brand-button mt-5 px-5 py-3" onClick={resetFilters}>Clear search and filters</button>
            </div>
          )}
          {visibleCount < filteredProducts.length && <div className="mt-8 flex justify-center"><button type="button" className="brand-button px-7 py-3.5" onClick={() => setVisibleCount((count) => count + 16)}>Load 16 more products <span aria-hidden="true">↓</span></button></div>}
          <p className="catalogue-note mt-6 text-center text-sm leading-6 text-[var(--muted)]">Prices shown are catalogue references. The stated ₹3,000 minimum and COD terms apply only to permitted offline fulfilment arrangements confirmed directly with sales.</p>
        </div>
      </section>
      <section className="how-to-order-section section-pad py-9 sm:py-11" aria-labelledby="how-to-order-title">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="mb-5">
            <p className="eyebrow mb-2">Find product information</p>
            <h2 id="how-to-order-title" className="section-title">How to use the <span className="accent-red">catalogue</span></h2>
          </div>
          <ol className="order-step-grid grid grid-cols-2 gap-3 lg:grid-cols-4">
            {ORDER_STEPS.map((step) => (
              <li key={step.number} className="order-step-card">
                <span className="order-step-number-large">{step.number}</span>
                <div><h3>{step.title}</h3><p>{step.body}</p></div>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs leading-5 text-[var(--muted)]">This website and its companion storefront are catalogue/general-enquiry services only; they do not accept online fireworks orders or payments. For any legally permitted offline arrangement, contact the licensed business to confirm availability, serviceability, transport charges and the stated ₹3,000 dispatch minimum.</p>
        </div>
      </section>

    </>
  );
}
