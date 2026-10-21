import Image from "next/image";
import type { Settings } from "@/lib/cms";


type Props = {
  settings: Settings;
  productCount: number;
  categoryCount: number;
  priceYear?: number;
};

/** Shopping-first hero. CMS-managed offer banners render immediately after this section. */
export default function Hero({ settings, productCount, categoryCount, priceYear }: Props) {
  const name = settings["site.name"] ?? "RT Crackers";
  const place = [settings["site.city"], settings["site.district"], settings["site.state"]]
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index)
    .join(" · ");
  const tagline = "Discover crackers for every celebration.";
  const description = "Explore our collection and find the right picks for your family and festive moments.";
  const logo = settings["site.logo_url"];

  return (
    <section id="home" className="hero-section relative isolate overflow-hidden">
      <div className="hero-backdrop" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 lg:px-6 lg:py-14">
        <div className="hero-panel grid items-center gap-8 lg:grid-cols-[1fr_.92fr] lg:gap-10">
          <div className="hero-copy py-3 sm:py-5 lg:py-7">
            {place && (
              <p className="hero-location eyebrow mb-5 inline-flex items-center gap-2 rounded-full px-3 py-2 !text-xs !tracking-[.14em]">
                <span className="hero-location-dot" aria-hidden="true" /> {place}
              </p>
            )}
            <p className="hero-kicker mb-3 text-xs font-black uppercase tracking-[.22em] sm:text-sm">
              RT CRACKERS · FESTIVE COLLECTION
            </p>
            <h1 data-rtc-component="hero_heading" className="hero-title max-w-3xl text-4xl font-black leading-[.98] sm:text-6xl xl:text-7xl">
              Light Up Every Celebration.
            </h1>
            {tagline && (
              <p data-rtc-component="hero_tagline" className="hero-tagline mt-5 max-w-2xl text-xl font-bold leading-snug sm:text-2xl">
                {tagline}
              </p>
            )}
            <p data-rtc-component="hero_description" className="hero-description mt-5 max-w-2xl text-base leading-7 sm:text-lg sm:leading-8">
              {description}
            </p>

            <div className="hero-actions mt-7 flex flex-wrap gap-3">
              <a href="#catalogue" className="brand-button px-5 py-3.5 text-base sm:px-6">
                Browse catalogue <span aria-hidden="true">→</span>
              </a>
              <a href="#categories" className="ghost-button px-5 py-3.5 text-base sm:px-6">
                Browse categories
              </a>
            </div>

            <div className="hero-stats mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-7">
              {productCount > 0 && (
                <div className="hero-stat">
                  <b>{productCount.toLocaleString("en-IN")}</b>
                  <span>products to explore</span>
                </div>
              )}
              {categoryCount > 0 && (
                <div className="hero-stat">
                  <b>{categoryCount.toLocaleString("en-IN")}</b>
                  <span>product categories</span>
                </div>
              )}
              {priceYear && (
                <div className="hero-stat">
                  <b>{priceYear}</b>
                  <span>catalogue year</span>
                </div>
              )}
            </div>
          </div>

          <div className="hero-visual-wrap">
            <div className="hero-visual" data-rtc-component="hero_visual">
              <Image
                src="/showcase/redthunder_hero_crackers_1791297525760.jpg"
                alt="RedThunder crackers collection for festive celebrations"
                fill
                priority
                sizes="(min-width:1024px) 46vw, 100vw"
                quality={88}
                className="hero-visual-image"
              />
              <div className="hero-visual-shade" aria-hidden="true" />
              {logo && (
                <div className="hero-brand-mark">
                  <Image src={logo} alt={`${name} logo`} width={140} height={56} className="h-10 w-auto max-w-32 object-contain sm:h-12" />
                </div>
              )}
              <div className="hero-image-caption">
                <span className="hero-caption-label">Explore the range</span>
                <strong>Find your celebration favourites.</strong>
                {settings["site.factory_name"] && <span className="hero-caption-factory">{settings["site.factory_name"]}</span>}
              </div>
            </div>
            <div className="hero-visual-footnote">
              <span className="hero-footnote-mark" aria-hidden="true">✦</span>
              <span>{place || "Official company catalogue"}</span>
              <a href="#company-details">Company details <span aria-hidden="true">→</span></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
