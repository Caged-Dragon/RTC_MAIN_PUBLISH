import Image from "next/image";
import type { Product } from "@/lib/cms";
import { inr } from "@/lib/utils";

export default function ProductCard({ p }: { p: Product }) {
  return (
    <article className="product-card flex h-full flex-col overflow-hidden rounded-2xl">
      <div className="product-image relative aspect-square overflow-hidden">
        {p.image_url ? (
          <Image src={p.image_url} alt={p.alt_text ?? p.product_name} fill sizes="(min-width:1024px) 22vw,(min-width:640px) 33vw,50vw" className="product-img object-contain p-3" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl" aria-hidden="true">🎇</div>
        )}
      </div>
      <div className="product-card-body flex flex-1 flex-col p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--primary)]">{p.category_name}</p>
        <h3 className="product-card-name mt-2 font-bold leading-snug">{p.product_name}</h3>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <p className="product-price text-lg font-black text-primary">{inr(p.selling_price)}</p>
          <span className="rounded-full bg-[var(--surface-variant)] px-2.5 py-1 text-xs font-bold">{p.pack_type_name ?? "Pack"}</span>
        </div>
      </div>
    </article>
  );
}
