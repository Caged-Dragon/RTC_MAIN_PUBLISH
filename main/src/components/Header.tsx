import Image from "next/image";
import { getSettings, whatsappUrl } from "@/lib/cms";
import { CART_URL } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";
import MobileNav from "@/components/MobileNav";
import { CartIcon, WhatsAppIcon } from "@/components/icons";

/** Single-page portfolio: the six sections the header exposes, in display order. */
const NAV = [
  { href: "#top", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#catalogue", label: "Products" },
  { href: "#shipping", label: "Shipping" },
  { href: "#safety", label: "Safety" },
  { href: "#contact", label: "Contact" },
];

export default async function Header() {
  const s = await getSettings();
  const name = s["site.name"] ?? "RT Crackers";
  const logo = s["site.logo_url"];
  const wa = whatsappUrl(s);
  return (
    <header data-rtc-component="header" className="site-header sticky top-0 z-50 border-b backdrop-blur-xl">
      <div className="site-header-inner relative mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 lg:gap-6 lg:px-6">
        <a href="#top" className="flex min-w-0 shrink items-center gap-3" aria-label={`${name} – back to top`}>
          {logo ? (
            <Image src={logo} alt="RT Crackers official logo" width={170} height={56} priority className="site-logo h-11 w-auto max-w-[12rem] rounded-lg object-contain" />
          ) : (
            <span className="truncate text-xl font-black text-primary">{name}</span>
          )}
        </a>

        <nav className="hidden flex-1 items-center justify-center gap-7 text-sm font-semibold lg:flex" aria-label="Main navigation">
          {NAV.map((l) => (
            <a key={l.href} href={l.href} className="nav-link">{l.label}</a>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="whatsapp-button" aria-label="Chat with us on WhatsApp (opens in a new tab)">
              <WhatsAppIcon />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          )}
          <a href={CART_URL} target="_blank" rel="noopener noreferrer" className="cart-button" aria-label="Cart (opens the ordering site in a new tab)">
            <CartIcon />
            <span className="hidden sm:inline">Cart</span>
          </a>
          <ThemeToggle />
          <MobileNav links={NAV} cartUrl={CART_URL} />
        </div>
      </div>
    </header>
  );
}