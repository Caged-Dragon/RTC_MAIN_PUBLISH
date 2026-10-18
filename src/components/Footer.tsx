import Image from "next/image";
import { getSettings } from "@/lib/cms";
import { CART_URL } from "@/lib/utils";
import { CartIcon, WhatsAppIcon } from "@/components/icons";

const LINKS = [
  { href: "#top", label: "Home" },
  { href: "#categories", label: "Categories" },
  { href: "#catalogue", label: "Products" },
  { href: "#about", label: "About the company" },
  { href: "#shipping", label: "Shipping" },
  { href: "#safety", label: "Safety" },
  { href: "#company-details", label: "Contact & company details" },
  { href: "#terms", label: "Terms" },
];

function parseSocialLinks(raw: string | undefined): Array<{ label: string; url: string }> {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    const entries = Array.isArray(parsed)
      ? parsed.map((item: any) => [item?.label ?? item?.name ?? "Social", item?.url] as [string, unknown])
      : parsed && typeof parsed === "object"
        ? Object.entries(parsed as Record<string, unknown>)
        : [];
    return entries.flatMap(([label, value]) => {
      const url = typeof value === "string" ? value : value && typeof value === "object" && "url" in value ? String((value as { url: unknown }).url ?? "") : "";
      if (!/^https?:\/\//i.test(url)) return [];
      const title = String(label).replace(/[_-]+/g, " ").replace(/\b\w/g, (match) => match.toUpperCase());
      return [{ label: title || "Social", url }];
    });
  } catch {
    return [];
  }
}

function validWebUrl(value: string | undefined) {
  return value && /^https?:\/\//i.test(value) ? value : "";
}

export default async function Footer() {
  const s = await getSettings();
  const name = s["site.name"] ?? "RT Crackers";
  const legalName = s["site.legal_name"];
  const factoryName = s["site.factory_name"];
  const location = [
    s["site.address"],
    s["site.city"],
    s["site.district"],
    s["site.state"],
    s["site.postal_code"],
    s["site.country"],
  ].filter(Boolean).filter((value, index, values) => values.indexOf(value) === index).join(" · ");
  const mapsUrl = validWebUrl(s["site.maps_url"]);
  const websiteUrl = validWebUrl(s["site.website_url"]);
  const socials = parseSocialLinks(s["site.social_links"]);

  return (
    <footer data-rtc-component="footer" className="site-footer">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-[1.2fr_.8fr_1.1fr] lg:px-6 lg:py-16">
        <div>
          {s["site.logo_url"] && (
            <span className="inline-block rounded-xl bg-[#FFFBF5] p-2">
              <Image src={s["site.logo_url"]} alt={`${name} logo`} width={180} height={60} className="h-11 w-auto object-contain" />
            </span>
          )}
          <p className="mt-5 max-w-md text-sm font-bold leading-6 text-white">{name}</p>
          {legalName && legalName !== name && <p className="mt-2 max-w-md text-sm leading-6 text-white/65">Registered / legal name: {legalName}</p>}
          {factoryName && <p className="mt-2 max-w-md text-sm leading-6 text-white/65">Factory / business name: {factoryName}</p>}
          {s["site.description"] && <p className="mt-3 max-w-md text-sm leading-7 text-white/70">{s["site.description"]}</p>}
          {location && <p className="mt-4 max-w-md break-words text-sm leading-6 text-white/65">{location}</p>}
          {s["site.factory_address"] && s["site.factory_address"] !== s["site.address"] && (
            <p className="mt-3 max-w-md break-words text-sm leading-6 text-white/60">Factory / godown: {s["site.factory_address"]}{s["site.factory_pincode"] ? `, ${s["site.factory_pincode"]}` : ""}</p>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            <a href={CART_URL} target="_blank" rel="noopener noreferrer" className="cart-button"><CartIcon /> Visit Cart</a>
            {s["site.ordering_url"] && <a href={s["site.ordering_url"]} target="_blank" rel="noopener noreferrer" className="footer-whatsapp-link"><WhatsAppIcon /> WhatsApp</a>}
          </div>
          {(websiteUrl || mapsUrl) && (
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/70">
              {websiteUrl && <a href={websiteUrl} target="_blank" rel="noopener noreferrer">Official website ↗</a>}
              {mapsUrl && <a href={mapsUrl} target="_blank" rel="noopener noreferrer">Directions ↗</a>}
            </div>
          )}
        </div>

        <div>
          <h2 className="font-bold text-[var(--accent)]">Explore</h2>
          <nav aria-label="Footer navigation" className="mt-4 flex flex-col gap-3 text-sm text-white/75">
            {LINKS.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
            <a href={CART_URL} target="_blank" rel="noopener noreferrer">Ordering cart ↗</a>
          </nav>
          {socials.length > 0 && (
            <div className="mt-7">
              <h3 className="text-sm font-bold text-[var(--accent)]">Social channels</h3>
              <nav aria-label="Social media" className="mt-3 flex flex-col gap-2 text-sm text-white/75">
                {socials.map((social) => <a key={`${social.label}-${social.url}`} href={social.url} target="_blank" rel="noopener noreferrer">{social.label} ↗</a>)}
              </nav>
            </div>
          )}
        </div>

        <div>
          <h2 className="font-bold text-[var(--accent)]">Contact details</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/75">
            {s["site.sales_email"] && <a href={`mailto:${s["site.sales_email"]}`}><span className="footer-detail-label">Sales email</span><span className="mt-1 block break-words">{s["site.sales_email"]}</span></a>}
            {s["site.support_email"] && <a href={`mailto:${s["site.support_email"]}`}><span className="footer-detail-label">Support email</span><span className="mt-1 block break-words">{s["site.support_email"]}</span></a>}
            {s["site.mobile"] && <a href={`tel:${s["site.mobile"]}`}><span className="footer-detail-label">Mobile</span><span className="mt-1 block">{s["site.mobile"]}</span></a>}
            {s["site.alternate_mobile"] && <a href={`tel:${s["site.alternate_mobile"]}`}><span className="footer-detail-label">Alternate mobile</span><span className="mt-1 block">{s["site.alternate_mobile"]}</span></a>}
            {s["site.support_phone"] && <a href={`tel:${s["site.support_phone"]}`}><span className="footer-detail-label">Support / helpline</span><span className="mt-1 block">{s["site.support_phone"]}</span></a>}
            {s["site.landline"] && <a href={`tel:${s["site.landline"]}`}><span className="footer-detail-label">Landline</span><span className="mt-1 block">{s["site.landline"]}</span></a>}
            {s["site.ordering_url"] && <a href={s["site.ordering_url"]} target="_blank" rel="noopener noreferrer"><span className="footer-detail-label">WhatsApp / orders</span><span className="mt-1 block">{s["site.whatsapp_number"] || s["site.phone"]}</span></a>}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs leading-6 text-white/50">
        © {new Date().getFullYear()} {name}. All rights reserved. Catalogue, contact details and active offer banner are sourced from the current website database.
      </div>
    </footer>
  );
}
