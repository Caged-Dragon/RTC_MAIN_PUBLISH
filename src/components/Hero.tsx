import Image from "next/image";
import type { Banner, Settings } from "@/lib/cms";
import { CART_URL } from "@/lib/utils";
import { CartIcon } from "@/components/icons";

type Props = { banner?: Banner; settings: Settings; productCount: number; categoryCount: number; priceYear?: number };

export default function Hero({ banner, settings, productCount, categoryCount, priceYear }: Props) {
  const name = settings["site.name"] ?? "RT Crackers";
  const place = [settings["site.city"], settings["site.state"]].filter(Boolean).join(" • ");
  const tagline = banner?.title && banner.title.trim().toLowerCase() !== name.toLowerCase() ? banner.title : (settings["site.tagline"] || null);
  const description = banner?.subtitle ?? settings["site.description"] ?? `${name} — fireworks and crackers, with a full product catalogue and a simple way to order.`;
  const logo = settings["site.logo_url"];
  return (
    <section id="home" className="relative isolate overflow-hidden">
      <div className="hero-bg" aria-hidden="true" />
      {/* decorative fireworks: static CSS bursts + a few softly twinkling sparks */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <span className="burst" style={{ "--s": "clamp(220px,34vw,460px)", top: "-9%", right: "-6%", "--o": ".38" } as React.CSSProperties} />
        <span className="burst" style={{ "--s": "clamp(150px,20vw,300px)", bottom: "-10%", left: "-4%", "--o": ".30", "--r": "7deg", "--c": "var(--burst-b)" } as React.CSSProperties} />
        <span className="burst hidden md:block" style={{ "--s": "220px", top: "14%", left: "46%", "--o": ".20", "--r": "3deg" } as React.CSSProperties} />
        <div>
          <span className="spark" style={{ top: "18%", left: "9%" }} />
          <span className="spark" style={{ top: "62%", left: "38%" }} />
          <span className="spark" style={{ top: "28%", left: "58%" }} />
          <span className="spark" style={{ top: "76%", right: "12%" }} />
          <span className="spark hidden sm:block" style={{ top: "10%", right: "26%" }} />
        </div>
      </div>

      <div className="hero-shell mx-auto grid min-h-[64vh] max-w-7xl items-center gap-10 px-4 py-14 sm:gap-12 sm:py-20 lg:grid-cols-[1.1fr_.9fr] lg:px-6">
        <div>
          {place && <p className="eyebrow hero-rise mb-4 !text-sm !tracking-[.22em]">{place}</p>}
          <h1 data-rtc-component="hero_heading" className="hero-title gradient-heading gradient-heading--animated hero-rise hero-rise-2 max-w-4xl text-5xl font-black leading-[1] sm:text-7xl">{name}</h1>
          {tagline && <p data-rtc-component="hero_tagline" className="accent-text hero-rise hero-rise-2 mt-4 text-xl sm:text-2xl">{tagline}</p>}
          <p data-rtc-component="hero_description" className="hero-rise hero-rise-3 mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">{description}</p>
          <div className="hero-actions hero-rise hero-rise-3 mt-9 flex flex-wrap gap-3">
            <a href="#catalogue" className="brand-button px-6 py-3 text-base">Explore Products</a>
            <a href={CART_URL} target="_blank" rel="noopener noreferrer" className="ghost-button px-6 py-3 text-base"><CartIcon />View Cart</a>
          </div>
          <div className="hero-stats hero-rise hero-rise-3 mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-[var(--muted)]">
            {productCount > 0 && <span><b className="hero-stat-value accent-text text-2xl">{productCount}+</b><br />catalogue items</span>}
            {categoryCount > 0 && <span><b className="hero-stat-value accent-text text-2xl">{categoryCount}</b><br />categories</span>}
            {priceYear ? <span><b className="hero-stat-value accent-text text-2xl">{priceYear}</b><br />price list</span> : null}
          </div>
        </div>

        {logo && (
          <div className="hidden justify-self-end lg:flex">
            <div className="logo-card rounded-[2rem] p-6">
              <Image src={logo} alt="RT Crackers" width={440} height={240} className="h-auto w-[26rem] max-w-full rounded-2xl object-contain" />
              <p className="accent-text mt-4 text-center text-xs uppercase tracking-[.25em]">Official company portfolio</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
