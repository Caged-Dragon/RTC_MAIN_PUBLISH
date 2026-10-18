import { getSettings, whatsappUrl } from "@/lib/cms";
import { CART_URL } from "@/lib/utils";
import { CartIcon, WhatsAppIcon } from "@/components/icons";

export default async function MobileBottomNav() {
  const settings = await getSettings();
  const wa = whatsappUrl(settings);
  return (
    <nav className="mobile-bottom-nav" aria-label="Quick navigation">
      <a href="#top" className="mobile-bottom-nav-item"><span aria-hidden="true">⌂</span><small>Home</small></a>
      <a href="#categories" className="mobile-bottom-nav-item"><span aria-hidden="true">▦</span><small>Categories</small></a>
      <a href="#catalogue-search" className="mobile-bottom-nav-item"><span aria-hidden="true">⌕</span><small>Search</small></a>
      <a href={CART_URL} target="_blank" rel="noopener noreferrer" className="mobile-bottom-nav-item"><CartIcon /><small>Cart</small></a>
      {wa ? <a href={wa} target="_blank" rel="noopener noreferrer" className="mobile-bottom-nav-item mobile-bottom-whatsapp"><WhatsAppIcon /><small>WhatsApp</small></a> : <a href="#company-details" className="mobile-bottom-nav-item"><span aria-hidden="true">☎</span><small>Contact</small></a>}
    </nav>
  );
}
