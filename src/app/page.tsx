import Section from "@/components/Section";
import Catalogue from "@/components/Catalogue";
import { getBanners, getCategories, getComboPacks, getProducts, getSections, getSettings } from "@/lib/cms";
import Hero from "@/components/Hero";
import TopBanner from "@/components/TopBanner";
import { CART_URL, inr } from "@/lib/utils";
import { CartIcon, WhatsAppIcon } from "@/components/icons";

export const revalidate = 60;

/** Decorative icons for the shipping cards; the card text itself comes from Supabase. */
const SHIPPING_ICONS = ["🚚", "📦", "📍", "🛡️"];

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

function parseObject(raw: string | undefined): Record<string, unknown> {
  if (!raw) return {};
  try {
    const value: unknown = JSON.parse(raw);
    return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

function parseStringArray(raw: string | undefined): string[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : [];
  } catch {
    return [];
  }
}

function humanizeKey(value: string) {
  return value.replace(/[_-]+/g, " ").replace(/\b\w/g, (match) => match.toUpperCase());
}

function validWebUrl(value: string | undefined) {
  return value && /^https?:\/\//i.test(value) ? value : "";
}

/** General fireworks safety guidance (not company claims or legal statements). */
const SAFETY_TIPS = [
  { icon: "🌳", title: "Use outdoors", text: "Light fireworks only in open outdoor areas, never indoors or in enclosed spaces." },
  { icon: "📏", title: "Keep a safe distance", text: "Step well back after lighting and keep spectators at a safe distance." },
  { icon: "👨‍👩‍👧", title: "Adult supervision", text: "Fireworks should only be handled and lit by adults, or under direct adult supervision." },
  { icon: "🚸", title: "Keep away from children", text: "Store fireworks out of children's reach and do not let children handle them." },
  { icon: "🔥", title: "Avoid flammable materials", text: "Keep clear of dry grass, fuel, curtains, vehicles and other flammable items." },
  { icon: "📜", title: "Follow local regulations", text: "Check and follow the rules and timings that apply in your area." },
  { icon: "📖", title: "Read the instructions", text: "Read the label and instructions on every product before use." },
];

export default async function Home() {
  const [sections, categories, products, s, combos, banners] = await Promise.all([getSections(), getCategories(), getProducts(500), getSettings(), getComboPacks(), getBanners()]);
  const by = (page: number, key: string) => sections.find((x) => x.page_id === page && x.key === key);
  const about = by(1, "about_us")?.content ?? {};
  const shipping = sections.filter((x) => x.page_id === 2);
  const terms = by(3, "buying_terms")?.content ?? {};
  const safety = by(4, "confirmation_cancellation")?.content ?? {};
  const databaseHighlights = parseStringArray(s["site.why_choose_us"]);
  const highlights: string[] = Array.isArray(about.highlights)
    ? about.highlights.filter((item: unknown): item is string => typeof item === "string" && item.trim().length > 0)
    : databaseHighlights;
  const socials = parseSocialLinks(s["site.social_links"]);
  const contactRecord = parseObject(s["site.contact_details"]);
  const businessHours = parseObject(s["site.business_hours"]);
  const existingContactValues = new Set([
    s["site.sales_email"], s["site.support_email"], s["site.mobile"], s["site.alternate_mobile"],
    s["site.support_phone"], s["site.landline"], s["site.whatsapp_number"], s["site.phone"],
  ].filter(Boolean).map((value) => String(value).trim().toLowerCase()));
  const additionalContacts = Object.entries(contactRecord).flatMap(([key, value]) => {
    const label = typeof key === "string" ? humanizeKey(key) : "";
    const val = typeof value === "string" || typeof value === "number" ? String(value).trim() : "";
    if (!val || existingContactValues.has(val.toLowerCase())) return [];
    return [{ label: label || "Contact", value: val }];
  });
  const additionalHours = Object.entries(businessHours).flatMap(([key, value]) => {
    const val = typeof value === "string" || typeof value === "number" ? String(value).trim() : "";
    return val ? [{ label: humanizeKey(key), value: val }] : [];
  });
  const websiteUrl = validWebUrl(s["site.website_url"]);
  const mapsUrl = validWebUrl(s["site.maps_url"]);
  const locationLine = [s["site.city"], s["site.district"], s["site.state"], s["site.postal_code"], s["site.country"]]
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index)
    .join(", ");

  const trustLocation = [s["site.city"], s["site.state"]].filter(Boolean).join(", ");

  return (
    <>
      <Hero settings={s} productCount={products.length} categoryCount={categories.length} priceYear={products.reduce((year, product) => Math.max(year, product.price_year), 0) || undefined} />
      <TopBanner banners={banners} settings={s} />
      <section className="trust-strip" aria-label="Company and service highlights">
        <div className="trust-strip-inner mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 py-4 sm:grid-cols-4 lg:px-6">
          <div className="trust-strip-item"><span aria-hidden="true">✦</span><div><strong>Explore the collection</strong><small>{s["site.name"] || "RT Crackers"}</small></div></div>
          <div className="trust-strip-item"><span aria-hidden="true">⌖</span><div><strong>{trustLocation || "Sivakasi, Tamil Nadu"}</strong><small>Business location</small></div></div>
          <div className="trust-strip-item"><span aria-hidden="true">▦</span><div><strong>{products.length.toLocaleString("en-IN")} products</strong><small>{categories.length.toLocaleString("en-IN")} categories to browse</small></div></div>
          {Number.isFinite(Number(s["merchant.minimum_order_value"])) && Number(s["merchant.minimum_order_value"]) > 0 && <div className="trust-strip-item"><span aria-hidden="true">₹</span><div><strong>{inr(Number(s["merchant.minimum_order_value"]))} minimum order</strong><small>Order threshold</small></div></div>}
          <div className="trust-strip-item">{s["site.ordering_url"] ? <a href={s["site.ordering_url"]} target="_blank" rel="noopener noreferrer" aria-label="Get customer support on WhatsApp"><span aria-hidden="true">◉</span><div><strong>WhatsApp support</strong><small>{s["site.whatsapp_number"] || s["site.support_phone"] || "Contact the team"}</small></div></a> : <div><span aria-hidden="true">◉</span><div><strong>Customer support</strong><small>{s["site.support_phone"] || s["site.sales_email"] || "Contact details below"}</small></div></div>}</div>
        </div>
      </section>

      <Catalogue products={products} categories={categories} combos={combos} />

      <Section id="about" eyebrow="The company" title={about.title ?? "About RT Crackers"}>
        <div className="about-grid grid gap-10 lg:grid-cols-[1.1fr_.9fr]">
          <div data-rtc-component="about_paragraph" className="reveal space-y-5 text-lg leading-8 text-[var(--muted)]">
            {(about.intro || s["site.description"]) && <p>{about.intro || s["site.description"]}</p>}
            {about.brand_information ? <p>{about.brand_information}</p> : (s["site.brand_name"] || s["site.parent_business"]) ? (
              <p>
                {s["site.brand_name"] && <><strong className="text-[var(--text)]">Brand:</strong> {s["site.brand_name"]}. </>}
                {s["site.parent_business"] && <><strong className="text-[var(--text)]">Parent business:</strong> {s["site.parent_business"]}. </>}
                {s["site.factory_name"] && <>The factory / business profile is maintained as {s["site.factory_name"]}.</>}
              </p>
            ) : null}
            {about.product_information && <p>{about.product_information}</p>}
          </div>
          {highlights.length > 0 && (
            <div data-rtc-component="about_highlights" className="reveal">
              <h3 className="accent-text mb-4 text-lg uppercase tracking-wider">Why Choose Us</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {highlights.map((h) => (
                  <div key={h} data-rtc-component="about_highlight_card" className="soft-card rounded-2xl p-5">
                    <span className="text-2xl text-[var(--accent-dark)]" aria-hidden="true">✦</span>
                    <p className="mt-3 font-bold">{h}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {(about.aim || s["site.aim"] || about.vision || s["site.vision"] || about.mission || s["site.mission"] || s["site.established_claim"]) && (
          <div data-rtc-component="about_vision" className="reveal about-vision mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {s["site.established_claim"] && <div className="surface-card rounded-2xl p-6"><p className="eyebrow">Established</p><p className="mt-3 text-lg font-bold leading-7">{s["site.established_claim"]}</p></div>}
            {(about.aim || s["site.aim"]) && <div className="surface-card rounded-2xl p-6"><p className="eyebrow">Aim</p><p className="mt-3 text-base leading-7">{about.aim || s["site.aim"]}</p></div>}
            {(about.vision || s["site.vision"]) && <div className="surface-card rounded-2xl p-6"><p className="eyebrow">Vision</p><p className="mt-3 text-base leading-7">{about.vision || s["site.vision"]}</p></div>}
            {(about.mission || s["site.mission"]) && <div data-rtc-component="about_mission" className="surface-card rounded-2xl p-6"><p className="eyebrow">Mission</p><p className="mt-3 text-base leading-7">{about.mission || s["site.mission"]}</p></div>}
          </div>
        )}
      </Section>


      <Section id="shipping" eyebrow="Delivery" title="Shipping" tone="glow">
        <div className="shipping-grid grid gap-5 md:grid-cols-2">
          {shipping.map((sec, i) => (
            <div key={sec.key} className="reveal surface-card rounded-2xl p-6">
              <span className="feature-icon" aria-hidden="true">{SHIPPING_ICONS[i % SHIPPING_ICONS.length]}</span>
              <p className="eyebrow mt-4">{sec.name}</p>
              <h3 className="mt-2 text-xl font-bold">{sec.content.title ?? sec.name}</h3>
              {sec.content.body && <p className="mt-3 leading-7 text-[var(--muted)]">{sec.content.body}</p>}
              {sec.content.policies && (
                <ul className="mt-4 space-y-3 text-[var(--muted)]">
                  {sec.content.policies.map((x: string) => <li key={x} className="flex gap-3"><span className="text-primary" aria-hidden="true">✓</span>{x}</li>)}
                </ul>
              )}
              {sec.content.schedule && (
                <div className="mt-4 space-y-3">
                  {sec.content.schedule.map((x: any) => (
                    <div key={x.order_window} className="rounded-xl bg-[var(--surface-variant)] p-4 text-sm"><b>{x.order_window}</b><br /><span className="text-[var(--muted)]">{x.delivery_deadline}</span></div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      <section id="safety" data-rtc-component="safety" className="section-pad py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="safety-panel p-6 sm:p-10">
            <div className="reveal">
              <p className="eyebrow mb-3">🛡️ Safety & policy</p>
              <h2 data-rtc-component="safety_heading" className="section-title gradient-heading max-w-4xl">Safety First</h2>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted)]">Fireworks are meant for celebration, and responsible use keeps everyone safe. Please keep these points in mind every time.</p>
            </div>
            <ul className="safety-tips-grid mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {SAFETY_TIPS.map((t) => (
                <li key={t.title} data-rtc-component="safety_card" className="reveal surface-card rounded-2xl p-5">
                  <span className="feature-icon" aria-hidden="true">{t.icon}</span>
                  <h3 className="mt-3 font-bold">{t.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{t.text}</p>
                </li>
              ))}
            </ul>
            <div className="safety-grid mt-8 grid gap-5 lg:grid-cols-2">
              <div data-rtc-component="policy_card" className="reveal surface-card rounded-2xl p-7">
                <h3 className="text-2xl font-bold">Order verification & no-return policy</h3>
                <ul className="mt-5 space-y-4 text-[var(--muted)]">
                  {(safety.policies ?? []).map((x: string, i: number) => (
                    <li key={x} className="flex gap-3"><span className="accent-text">{String(i + 1).padStart(2, "0")}</span><span>{x}</span></li>
                  ))}
                </ul>
              </div>
              <div className="reveal surface-card rounded-2xl p-7">
                <h3 className="text-2xl font-bold">Payment & ordering</h3>
                {terms.payment_policy && <p className="mt-4 leading-7 text-[var(--muted)]">{terms.payment_policy}</p>}
                {terms.payment_dispatch_policy && <p className="mt-4 leading-7 text-[var(--muted)]">{terms.payment_dispatch_policy}</p>}
                <a href={CART_URL} target="_blank" rel="noopener noreferrer" className="brand-button mt-6 px-5 py-3"><CartIcon />Go to Cart</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {((terms.shipping_rules ?? terms.policies ?? []) as string[]).length > 0 && (
        <Section id="terms" eyebrow="Business terms" title="Important ordering notes" tone="tint">
          <div className="grid gap-4 md:grid-cols-3">
            {((terms.shipping_rules ?? terms.policies ?? []) as string[]).map((x) => (
              <div key={x} data-rtc-component="terms_card" className="reveal soft-card rounded-2xl p-5"><span className="text-xl text-primary" aria-hidden="true">◆</span><p className="mt-3 text-sm leading-6">{x}</p></div>
            ))}
          </div>
        </Section>
      )}

      <Section id="contact" eyebrow="Official business information" title="Company & Contact Details">
        <span id="company-details" className="company-anchor" aria-hidden="true" />
        <div className="contact-grid grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
          <div data-rtc-component="contact_card" className="reveal surface-card rounded-3xl p-6 sm:p-8">
            <p className="eyebrow">Company profile</p>
            <h3 className="mt-3 break-words text-2xl font-black sm:text-3xl">{s["site.name"] ?? "RT Crackers"}</h3>
            {s["site.legal_name"] && s["site.legal_name"] !== s["site.name"] && (
              <p className="mt-3 leading-6 text-[var(--muted)]"><strong className="text-[var(--text)]">Registered / legal name:</strong> {s["site.legal_name"]}</p>
            )}
            {s["site.factory_name"] && (
              <p className="mt-2 leading-6 text-[var(--muted)]"><strong className="text-[var(--text)]">Factory / business name:</strong> {s["site.factory_name"]}</p>
            )}
            {s["site.brand_name"] && <p className="mt-2 leading-6 text-[var(--muted)]"><strong className="text-[var(--text)]">Brand:</strong> {s["site.brand_name"]}</p>}
            {s["site.tagline"] && <p className="mt-2 font-semibold leading-6 text-[var(--primary)]">{s["site.tagline"]}</p>}
            {(s["site.established_claim"] || s["site.aim"] || s["site.vision"] || s["site.mission"]) && (
              <div className="company-profile-highlights mt-5 grid gap-3 sm:grid-cols-2">
                {s["site.established_claim"] && <div className="company-profile-highlight"><span>Established</span><strong>{s["site.established_claim"]}</strong></div>}
                {s["site.aim"] && <div className="company-profile-highlight"><span>Aim</span><p>{s["site.aim"]}</p></div>}
                {s["site.vision"] && <div className="company-profile-highlight"><span>Vision</span><p>{s["site.vision"]}</p></div>}
                {s["site.mission"] && <div className="company-profile-highlight"><span>Mission</span><p>{s["site.mission"]}</p></div>}
              </div>
            )}
            <div className="company-detail-divider my-6" />
            <div className="flex items-start gap-3">
              <span className="company-detail-icon" aria-hidden="true">⌖</span>
              <div className="min-w-0">
                <h4 className="font-extrabold">Registered address</h4>
                {s["site.address"] && <p className="mt-2 break-words leading-7 text-[var(--muted)]">{s["site.address"]}</p>}
                {locationLine && <p className="mt-1 break-words leading-7 text-[var(--muted)]">{locationLine}</p>}
                {mapsUrl && <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="company-inline-link mt-3 inline-flex">Open location in Maps <span aria-hidden="true">↗</span></a>}
              </div>
            </div>
            {s["site.factory_address"] && s["site.factory_address"] !== s["site.address"] && (
              <div className="company-secondary-address mt-5 rounded-2xl p-4">
                <h4 className="font-extrabold">Factory / godown address</h4>
                <p className="mt-2 break-words text-sm leading-6 text-[var(--muted)]">{s["site.factory_address"]}{s["site.factory_pincode"] && `, ${s["site.factory_pincode"]}`}</p>
              </div>
            )}
            {websiteUrl ? (
              <div className="mt-5">
                <span className="company-detail-label">Official website</span>
                <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="company-inline-link mt-1 block break-all">{s["site.website_url"]}</a>
              </div>
            ) : s["site.website_url"] ? (
              <div className="mt-5"><span className="company-detail-label">Official website</span><p className="mt-1 break-all">{s["site.website_url"]}</p></div>
            ) : null}
            {(s["site.gst_number"] || s["site.pan_number"] || s["site.business_registration_number"]) && (
              <div className="company-registration-grid mt-6 grid gap-3 sm:grid-cols-2">
                {s["site.gst_number"] && <div className="company-registration-item"><span>GST number</span><strong>{s["site.gst_number"]}</strong></div>}
                {s["site.pan_number"] && <div className="company-registration-item"><span>PAN</span><strong>{s["site.pan_number"]}</strong></div>}
                {s["site.business_registration_number"] && <div className="company-registration-item"><span>Business registration</span><strong>{s["site.business_registration_number"]}</strong></div>}
              </div>
            )}
            {additionalHours.length > 0 && (
              <div className="mt-6">
                <span className="company-detail-label">Business hours</span>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {additionalHours.map((item) => <div key={`${item.label}-${item.value}`} className="company-extra-detail"><span>{item.label}</span><strong>{item.value}</strong></div>)}
                </div>
              </div>
            )}
            {additionalContacts.length > 0 && (
              <div className="mt-6">
                <span className="company-detail-label">Additional contacts</span>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {additionalContacts.map((item) => <div key={`${item.label}-${item.value}`} className="company-extra-detail"><span>{item.label}</span><strong>{item.value}</strong></div>)}
                </div>
              </div>
            )}
            {socials.length > 0 && (
              <div className="mt-6">
                <span className="company-detail-label">Follow / connect</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {socials.map((social) => <a key={`${social.label}-${social.url}`} href={social.url} target="_blank" rel="noopener noreferrer" className="social-link">{social.label} <span aria-hidden="true">↗</span></a>)}
                </div>
              </div>
            )}
          </div>

          <div className="contact-order-panel reveal rounded-3xl p-6 text-white sm:p-8">
            <p className="text-xs font-black uppercase tracking-[.2em] text-[var(--accent)]">Contact & ordering</p>
            <h3 className="mt-3 text-2xl font-black sm:text-3xl">Talk to the company</h3>
            <p className="mt-3 leading-7 text-white/70">Use the current business contact details below for sales, support and order-related questions.</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {s["site.sales_email"] && (
                <a href={`mailto:${s["site.sales_email"]}`} className="company-contact-item">
                  <span>Sales email</span><strong>{s["site.sales_email"]}</strong>
                </a>
              )}
              {s["site.support_email"] && (
                <a href={`mailto:${s["site.support_email"]}`} className="company-contact-item">
                  <span>Support email</span><strong>{s["site.support_email"]}</strong>
                </a>
              )}
              {s["site.mobile"] && (
                <a href={`tel:${s["site.mobile"]}`} className="company-contact-item">
                  <span>Mobile</span><strong>{s["site.mobile"]}</strong>
                </a>
              )}
              {s["site.alternate_mobile"] && (
                <a href={`tel:${s["site.alternate_mobile"]}`} className="company-contact-item">
                  <span>Alternate mobile</span><strong>{s["site.alternate_mobile"]}</strong>
                </a>
              )}
              {s["site.support_phone"] && (
                <a href={`tel:${s["site.support_phone"]}`} className="company-contact-item">
                  <span>Support / helpline</span><strong>{s["site.support_phone"]}</strong>
                </a>
              )}
              {s["site.landline"] && (
                <a href={`tel:${s["site.landline"]}`} className="company-contact-item">
                  <span>Landline</span><strong>{s["site.landline"]}</strong>
                </a>
              )}
            </div>

            {s["site.ordering_url"] && (
              <a href={s["site.ordering_url"]} target="_blank" rel="noopener noreferrer" className="company-whatsapp-cta mt-5 flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-extrabold">
                <WhatsAppIcon /> {s["site.whatsapp_number"] || s["site.phone"] ? `WhatsApp · ${s["site.whatsapp_number"] || s["site.phone"]}` : "Contact on WhatsApp"}
              </a>
            )}

            <div className="company-detail-divider company-detail-divider-dark my-6" />
            {(s["merchant.minimum_order_value"] || s["merchant.season_booking_open"] !== "") && (
              <div className="merchant-status-row mt-5 grid gap-3 sm:grid-cols-2">
                {s["merchant.minimum_order_value"] && (
                  <div className="merchant-status-item"><span>Minimum order value</span><strong>{inr(Number(s["merchant.minimum_order_value"]))}</strong></div>
                )}
                {s["merchant.season_booking_open"] !== "" && (
                  <div className="merchant-status-item"><span>Season booking</span><strong>{s["merchant.season_booking_open"] === "true" ? "Open" : "Closed"}</strong></div>
                )}
              </div>
            )}

            <div className="company-detail-divider company-detail-divider-dark my-6" />
            <p className="text-sm font-extrabold text-white/90">Ordering workflow</p>
            <ol className="mt-3 space-y-2 text-sm leading-6 text-white/70">
              <li><span className="order-step-number">01</span> Browse the catalogue and confirm the product you need.</li>
              <li><span className="order-step-number">02</span> Continue to the existing cart site to review your order.</li>
              <li><span className="order-step-number">03</span> Confirm availability, delivery and final terms with the business before payment.</li>
            </ol>
            <a href={CART_URL} target="_blank" rel="noopener noreferrer" className="brand-button mt-6 px-5 py-3.5"><CartIcon /> Open ordering cart <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </Section>
    </>
  );
}
