import Image from "next/image";
import { getSettings, whatsappUrl } from "@/lib/cms";
import { CART_URL } from "@/lib/utils";
import HeaderSearch from "@/components/HeaderSearch";
import MobileNav from "@/components/MobileNav";
import { CartIcon, WhatsAppIcon } from "@/components/icons";

const NAV = [
  { href: "#top", label: "Home" },
  { href: "#catalogue", label: "Shop all" },
  { href: "#categories", label: "Categories" },
  { href: "#about", label: "About us" },
  { href: "#shipping", label: "Delivery" },
  { href: "#safety", label: "Safety" },
  { href: "#company-details", label: "Contact" },
];

/** Responsive two-tier navigation inspired by the supplied desktop/mobile reference. */
export default async function Header() {
  const s = await getSettings();
  const name = s["site.name"] ?? "REDTHUNDER CRACKERS";
  const logo = s["site.logo_url"];
  const wa = whatsappUrl(s);
  const phone = s["site.whatsapp_number"] || s["site.support_phone"] || s["site.mobile"];

  return (
    <header data-rtc-component="header" className="site-header sticky top-0 z-50 border-b backdrop-blur-xl">
      <div className="header-main-row mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 lg:px-6">
        <a href="#top" className="header-brand flex min-w-0 shrink-0 items-center gap-2" aria-label={`${name} – home`}>
          {logo ? (
            <Image src={logo} alt={`${name} logo`} width={185} height={62} priority className="site-logo h-12 w-auto max-w-[12rem] object-contain" />
          ) : (
            <span className="header-brand-text">{name}</span>
          )}
        </a>

        <HeaderSearch className="header-search-desktop hidden lg:flex" />

        <div className="header-actions ml-auto flex shrink-0 items-center gap-2">
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="header-whatsapp" aria-label="Contact customer support on WhatsApp">
              <WhatsAppIcon />
              <span className="header-action-copy"><strong>WhatsApp</strong><small>Product enquiries</small></span>
            </a>
          )}
          <a href={CART_URL} target="_blank" rel="noopener noreferrer" className="header-cart" aria-label="Open the product catalogue">
            <CartIcon />
            <span>Cart</span>
          </a>
        </div>
      </div>

      <div className="header-mobile-search mx-auto max-w-7xl px-3 pb-3 lg:hidden">
        <HeaderSearch className="header-search-mobile" />
      </div>

      <MobileNav links={NAV} />
    </header>
  );
}
