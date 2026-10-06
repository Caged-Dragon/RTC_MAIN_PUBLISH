import Hero from "@/components/Hero";
import Section from "@/components/Section";
import MovingShowcase from "@/components/MovingShowcase";
import { getBanners, getCategories, getProducts, getSections, getSettings } from "@/lib/cms";
import { CART_URL } from "@/lib/utils";
import { CartIcon } from "@/components/icons";

export const revalidate = 60;

/** Decorative icons for the shipping cards; the card text itself comes from Supabase. */
const SHIPPING_ICONS = ["🚚", "📦", "📍", "🛡️"];

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
  const [sections, banners, categories, products, s] = await Promise.all([getSections(), getBanners(), getCategories(), getProducts(20), getSettings()]);
  const by = (page: number, key: string) => sections.find((x) => x.page_id === page && x.key === key);
  const about = by(1, "about_us")?.content ?? {};
  const shipping = sections.filter((x) => x.page_id === 2);
  const terms = by(3, "buying_terms")?.content ?? {};
  const safety = by(4, "confirmation_cancellation")?.content ?? {};
  const priceIntro = by(6, "price_list_intro")?.content ?? {};
  const contact = by(6, "price_list_contact")?.content ?? {};
  const hero = banners[0];
  const highlights: string[] = about.highlights ?? [];
  const priceYear = Number(s["catalog.year"]) || undefined;

  return (
    <>
      <Hero banner={hero} settings={s} productCount={Number(s["catalog.product_count"]) || 0} categoryCount={Number(s["catalog.category_count"]) || categories.length} priceYear={priceYear} />

      <Section id="about" eyebrow="The company" title={about.title ?? "About RT Crackers"}>
        <div className="about-grid grid gap-10 lg:grid-cols-[1.1fr_.9fr]">
          <div data-rtc-component="about_paragraph" className="reveal space-y-5 text-lg leading-8 text-[var(--muted)]">
            {about.intro && <p>{about.intro}</p>}
            {about.brand_information && <p>{about.brand_information}</p>}
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
        {(about.vision || about.mission) && (
          <div data-rtc-component="about_vision" className="reveal mt-10 grid gap-5 md:grid-cols-2">
            {about.vision && <div className="surface-card rounded-2xl p-6"><p className="eyebrow">Vision</p><p className="mt-3 text-lg leading-7">{about.vision}</p></div>}
            {about.mission && <div data-rtc-component="about_mission" className="surface-card rounded-2xl p-6"><p className="eyebrow">Mission</p><p className="mt-3 text-lg leading-7">{about.mission}</p></div>}
          </div>
        )}
      </Section>

      <MovingShowcase products={products} categories={categories} />

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
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      <Section id="contact" eyebrow={contact.city ? `Get in touch • ${contact.city}` : "Get in touch"} title="Contact Us">
        <div className="contact-grid grid gap-6 lg:grid-cols-[1fr_.8fr]">
          <div data-rtc-component="contact_card" className="reveal surface-card rounded-3xl p-8">
            <p className="eyebrow">{s["site.name"] ?? "RT Crackers"}</p>
            {contact.address && <p className="mt-3 text-lg font-bold">{contact.address}</p>}
            <p className="mt-2 text-[var(--muted)]">{[contact.city, contact.state].filter(Boolean).join(", ")} {contact.postal_code}{contact.country ? `, ${contact.country}` : ""}</p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {s["site.sales_email"] && (
                <a href={`mailto:${s["site.sales_email"]}`} className="soft-card min-w-0 rounded-xl p-4">
                  <span className="text-xs font-bold uppercase text-[var(--muted)]">Sales</span>
                  <strong className="mt-1 block break-words text-primary">{s["site.sales_email"]}</strong>
                </a>
              )}
              {s["site.support_phone"] && (
                <a href={`tel:${s["site.support_phone"]}`} className="soft-card min-w-0 rounded-xl p-4">
                  <span className="text-xs font-bold uppercase text-[var(--muted)]">Helpline</span>
                  <strong className="mt-1 block text-primary">{s["site.support_phone"]}</strong>
                </a>
              )}
            </div>
          </div>
          <div data-rtc-component="order_cta" className="reveal rounded-3xl bg-[var(--footer-bg)] p-8 text-white">
            <p className="text-sm font-black uppercase tracking-widest text-[var(--accent)]">Ready to order?</p>
            <h3 className="mt-3 text-3xl font-black">Browse, then check out at our cart.</h3>
            <p className="mt-4 text-white/75">Pick your products from the catalogue and place your order on the cart site. Questions about availability? Message us on WhatsApp.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href={CART_URL} target="_blank" rel="noopener noreferrer" className="brand-button px-5 py-3"><CartIcon />Go to Cart</a>
              {s["site.ordering_url"] && <a href={s["site.ordering_url"]} target="_blank" rel="noopener noreferrer" className="gold-button px-5 py-3">WhatsApp {s["site.phone"]}</a>}
            </div>
          </div>
        </div>
      </Section>

      {(terms.shipping_rules ?? []).length > 0 && (
        <Section id="terms" eyebrow="Business terms" title="Important ordering notes" tone="tint">
          <div className="grid gap-4 md:grid-cols-3">
            {(terms.shipping_rules as string[]).map((x) => (
              <div key={x} data-rtc-component="terms_card" className="reveal soft-card rounded-2xl p-5"><span className="text-xl text-primary" aria-hidden="true">◆</span><p className="mt-3 text-sm leading-6">{x}</p></div>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
