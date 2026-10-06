import type { Category, Product } from "@/lib/cms";
import { CART_URL } from "@/lib/utils";

const IMAGE_MAP: Array<[string, string]> = [
  ["SPARKLER", "/showcase/redthunder_sparklers_1791297554442.jpg"],
  ["SOUND", "/showcase/redthunder_sound_crackers_1791301117609.jpg"],
  ["LAKSHMI", "/showcase/redthunder_sound_crackers_1791301117609.jpg"],
  ["POT", "/showcase/redthunder_pots_fountains_1791299034674.jpg"],
  ["FOUNTAIN", "/showcase/redthunder_pots_fountains_1791299034674.jpg"],
  ["CHAKKAR", "/showcase/redthunder_peacock_chakkars_1791301133347.jpg"],
  ["TWINKLING", "/showcase/redthunder_twinkling_stars_1791303667579.jpg"],
  ["ROCKET", "/showcase/redthunder_sky_rockets_1791303603553.jpg"],
  ["SKY", "/showcase/redthunder_aerial_shots_1791299049699.jpg"],
  ["AERIAL", "/showcase/redthunder_aerial_shells_1791303651159.jpg"],
  ["PEACOCK", "/showcase/redthunder_peacock_chakkars_1791301133347.jpg"],
  ["GIFT", "/showcase/redthunder_gift_boxes_1791297541022.jpg"],
  ["KIDS", "/showcase/redthunder_kids_novelties_1791303636279.jpg"],
  ["CHORSA", "/showcase/redthunder_garlands_wala_1791303620827.jpg"],
  ["WALA", "/showcase/redthunder_garlands_wala_1791303620827.jpg"],
];

function fallbackImage(category: string) {
  const upper = category.toUpperCase();
  return IMAGE_MAP.find(([needle]) => upper.includes(needle))?.[1] ?? "/showcase/redthunder_hero_crackers_1791297525760.jpg";
}

function ProductTile({ product }: { product: Product }) {
  const image = product.image_url || fallbackImage(product.category_name);
  return (
    <a className="moving-showcase-card" href={CART_URL} aria-label={`View ${product.product_name} in the cart catalogue`}>
      <div className="moving-showcase-image">
        <img src={image} alt="" loading="lazy" />
        <span className="moving-showcase-number">#{product.product_id}</span>
      </div>
      <div className="moving-showcase-body">
        <span>{product.category_name}</span>
        <strong>{product.product_name}</strong>
        <b>₹{product.selling_price.toLocaleString("en-IN")}</b>
      </div>
    </a>
  );
}

function CategoryTile({ category }: { category: Category }) {
  const image = category.image_url || fallbackImage(category.category_name);
  return (
    <a className="moving-category-card" href={CART_URL} aria-label={`Browse ${category.category_name}`}>
      <img src={image} alt="" loading="lazy" />
      <div title={category.details || category.description || category.category_name}>
        <span>Explore</span>
        <strong>{category.category_name}</strong>
      </div>
    </a>
  );
}

export default function MovingShowcase({ products, categories }: { products: Product[]; categories: Category[] }) {
  // Prefer database-selected featured/bestseller records when those flags are populated;
  // otherwise use the first 20 catalogue records so the showcase never disappears.
  const rankedProducts = [...products].sort((a, b) => Number(Boolean(b.is_featured)) * 2 + Number(Boolean(b.is_bestseller)) - (Number(Boolean(a.is_featured)) * 2 + Number(Boolean(a.is_bestseller))));
  const topProducts = (() => {
    const picked: Product[] = [];
    const seen = new Set<string>();
    for (const product of rankedProducts) {
      if (!seen.has(product.category_slug)) { picked.push(product); seen.add(product.category_slug); }
      if (picked.length === 20) break;
    }
    if (picked.length < 20) {
      for (const product of rankedProducts) {
        if (!picked.some((p) => p.product_id === product.product_id)) picked.push(product);
        if (picked.length === 20) break;
      }
    }
    return picked;
  })();
  const productLoop = [...topProducts, ...topProducts];
  const categoryLoop = [...categories, ...categories];

  return (
    <section className="showcase-section" aria-label="Featured crackers and categories">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="showcase-heading">
          <div>
            <p className="eyebrow">Made to catch the eye</p>
            <h2 className="section-title gradient-heading">Featured crackers</h2>
            <p className="mt-3 max-w-2xl text-[var(--muted)]">A moving preview of the catalogue. The full product selection and ordering experience live on our cart website.</p>
          </div>
          <a href={CART_URL} className="brand-button px-5 py-3">Browse &amp; Order</a>
        </div>
      </div>

      <div className="marquee-window" aria-hidden="true">
        <div className="marquee-track marquee-forward">
          {productLoop.map((product, index) => <ProductTile key={`${product.product_id}-${index}`} product={product} />)}
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-7xl px-4 lg:px-6">
        <div className="mb-5">
          <p className="eyebrow">Find your favourite</p>
          <h3 className="text-2xl font-black sm:text-3xl">Explore categories</h3>
        </div>
      </div>

      <div className="marquee-window category-marquee" aria-hidden="true">
        <div className="marquee-track marquee-forward marquee-slower">
          {categoryLoop.map((category, index) => <CategoryTile key={`${category.category_id}-${index}`} category={category} />)}
        </div>
      </div>
    </section>
  );
}
