import { getSettings, whatsappUrl } from "@/lib/cms";

/** Persistent business-rule notice shared by every showcase route. */
export default async function MinimumOrderNotice() {
  const settings = await getSettings();
  const wa = whatsappUrl(settings) || "https://wa.me/918124100501";
  return (
    <aside className="minimum-order-notice" aria-label="Minimum order and payment policy">
      <span aria-hidden="true">📢</span>
      <p><strong>Minimum ₹3,000 for permitted offline fulfilment</strong><span> on requested Sivakasi godown dispatch · Contact sales for applicable payment terms</span></p>
      <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="Ask sales about product information and fulfilment terms">WhatsApp support ↗</a>
    </aside>
  );
}
