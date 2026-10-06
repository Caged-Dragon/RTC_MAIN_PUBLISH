import Image from "next/image";
import { getSettings } from "@/lib/cms";
import { CART_URL } from "@/lib/utils";
import { CartIcon } from "@/components/icons";

const LINKS = [
  { href: "#top", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#catalogue", label: "Products" },
  { href: "#shipping", label: "Shipping" },
  { href: "#safety", label: "Safety" },
  { href: "#contact", label: "Contact" },
  { href: "#terms", label: "Terms" },
];

export default async function Footer() {
  const s = await getSettings();
  const name = s["site.name"] ?? "RT Crackers";
  const location = [s["site.address"], [s["site.city"], s["site.state"]].filter(Boolean).join(", "), s["site.postal_code"]].filter(Boolean).join(" · ");
  return (
    <footer data-rtc-component="footer" className="site-footer">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_.8fr_.9fr] lg:px-6">
        <div>
          {s["site.logo_url"] && (
            <span className="inline-block rounded-xl bg-[#FFFBF5] p-2">
              <Image src={s["site.logo_url"]} alt={`${name} logo`} width={180} height={60} className="h-11 w-auto object-contain" />
            </span>
          )}
          <p className="mt-5 max-w-md text-sm leading-7 text-white/70">{name} — official company portfolio and product catalogue. Orders are placed through our cart.</p>
          {location && <p className="mt-4 max-w-md text-sm leading-6 text-white/60">{location}</p>}
          <a href={CART_URL} target="_blank" rel="noopener noreferrer" className="cart-button mt-6 inline-flex"><CartIcon />Visit Cart</a>
        </div>
        <div>
          <h2 className="font-bold text-[var(--accent)]">Explore</h2>
          <nav aria-label="Footer navigation" className="mt-4 flex flex-col gap-2 text-sm text-white/75">
            {LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
            <a href={CART_URL} target="_blank" rel="noopener noreferrer">Cart</a>
          </nav>
        </div>
        <div>
          <h2 className="font-bold text-[var(--accent)]">Contact</h2>
          <div className="mt-4 flex flex-col gap-2 text-sm text-white/75">
            {s["site.sales_email"] && <a href={`mailto:${s["site.sales_email"]}`}>{s["site.sales_email"]}</a>}
            {s["site.support_email"] && <a href={`mailto:${s["site.support_email"]}`}>{s["site.support_email"]}</a>}
            {s["site.ordering_url"] && s["site.phone"] && <a href={s["site.ordering_url"]} target="_blank" rel="noopener noreferrer">WhatsApp: {s["site.phone"]}</a>}
            {s["site.support_phone"] && <a href={`tel:${s["site.support_phone"]}`}>Helpline: {s["site.support_phone"]}</a>}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/55">© {new Date().getFullYear()} {name}. All rights reserved.</div>
    </footer>
  );
}
