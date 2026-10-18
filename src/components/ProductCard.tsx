import Image from "next/image";
import type { Product } from "@/lib/cms";
import { inr, CART_URL } from "@/lib/utils";

const CATEGORY_IMAGES: Array<[string, string]> = [
  ["SPARKLER", "/showcase/redthunder_sparklers_1791297554442.jpg"],
  ["STAR", "/showcase/redthunder_twinkling_stars_1791303667579.jpg"],
  ["SOUND", "/showcase/redthunder_sound_crackers_1791301117609.jpg"],
  ["BIJILI", "/showcase/redthunder_sound_crackers_1791301117609.jpg"],
  ["FLOWER", "/showcase/redthunder_pots_fountains_1791299034674.jpg"],
  ["POT", "/showcase/redthunder_pots_fountains_1791299034674.jpg"],
  ["CHAKKAR", "/showcase/redthunder_peacock_chakkars_1791301133347.jpg"],
  ["ROCKET", "/showcase/redthunder_sky_rockets_1791303603553.jpg"],
  ["GIFT", "/showcase/redthunder_gift_boxes_1791297541022.jpg"],
  ["KID", "/showcase/redthunder_kids_novelties_1791303636279.jpg"],
  ["WALA", "/showcase/redthunder_garlands_wala_1791303620827.jpg"],
];

function fallbackImage(category: string) {
  const upper = category.toUpperCase();
  return CATEGORY_IMAGES.find(([needle]) => upper.includes(needle))?.[1]
    ?? "/showcase/redthunder_hero_crackers_1791297525760.jpg";
}

export default function ProductCard({ p }: { p: Product }) {
  const image = p.image_url || fallbackImage(p.category_name);
  const hasValidMrp = p.mrp > p.selling_price && p.mrp > 0;

  return (
    <article data-rtc-component="product_card" className="product-card flex h-full flex-col overflow-hidden rounded-2xl">
      <div className="product-image relative aspect-square overflow-hidden">
        <Image
          src={image}
          alt={p.image_url ? (p.alt_text ?? p.product_name) : `${p.category_name} category image`}
          fill
          sizes="(min-width:1280px) 23vw,(min-width:1024px) 25vw,(min-width:640px) 33vw,50vw"
          className={`product-img object-contain${p.image_url ? " p-3 sm:p-4" : " product-fallback-img"}`}
          loading="lazy"
        />
        {p.is_featured && <span className="product-flag">Featured</span>}
      </div>
      <div className="product-card-body flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="product-category-label">{p.category_name}</p>
          {p.product_code && <span className="product-code">{p.product_code}</span>}
        </div>
        <h3 className="product-card-name mt-2 font-bold leading-snug">{p.product_name}</h3>
        <div className="mt-auto pt-4">
          <div className="flex min-h-7 flex-wrap items-baseline gap-x-2 gap-y-1">
            <p className="product-price text-lg font-black">{inr(p.selling_price)}</p>
            {hasValidMrp && <p className="product-mrp text-sm">{inr(p.mrp)}</p>}
          </div>
          {p.pack_type_name && <p className="product-pack mt-1">{p.pack_type_name}</p>}
          <a
            href={CART_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="product-order-link mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-extrabold"
            aria-label={`Continue to the ordering cart to order ${p.product_name}`}
          >
            Open ordering cart <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </article>
  );
}
