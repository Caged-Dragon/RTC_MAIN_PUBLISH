"use client";

import { useEffect, useState } from "react";
import type { Banner, Settings } from "@/lib/cms";
import { CART_URL } from "@/lib/utils";
import { CartIcon, WhatsAppIcon } from "@/components/icons";

function safeLink(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  if (value.startsWith("#")) return value;
  return undefined;
}

/**
 * Full-width banner frame that adopts the loaded artwork's intrinsic aspect ratio,
 * so the complete database-sourced image stays visible without cropping. A blurred
 * copy fills the surrounding area, and active banners advance every five seconds.
 */
export default function TopBanner({ banners, settings }: { banners: Banner[]; settings: Settings }) {
  const slides = banners.filter((banner) => Boolean(banner.image_url));
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex((current) => (slides.length ? current % slides.length : 0));
  }, [slides.length]);

  useEffect(() => {
    if (slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) return null;

  const active = slides[activeIndex] ?? slides[0];
  const whatsappUrl = settings["site.ordering_url"];

  return (
    <div className="top-banner-shell" aria-label="RT Crackers featured banners">
      <picture key={`blur-${active.image_url}`} className="top-banner-shell-picture" aria-hidden="true">
        {active.mobile_image_url && <source media="(max-width: 767px)" srcSet={active.mobile_image_url} />}
        <img
          src={active.image_url}
          alt=""
          className="top-banner-shell-image banner-background-enter"
          loading="eager"
          decoding="async"
        />
      </picture>
      <div className="top-banner-shell-scrim" aria-hidden="true" />

      <div
        className="top-banner"
        role={slides.length > 1 ? "region" : undefined}
        aria-roledescription={slides.length > 1 ? "carousel" : undefined}
        aria-label={slides.length > 1 ? "Featured offers" : "Featured offer"}
      >
        <div
          className="top-banner-track"
          style={{ transform: `translate3d(-${activeIndex * 100}%, 0, 0)` }}
        >
          {slides.map((banner, index) => {
            const href = safeLink(banner.link_url);
            const current = index === activeIndex;
            const image = (
              <picture className="top-banner-picture">
                {banner.mobile_image_url && <source media="(max-width: 767px)" srcSet={banner.mobile_image_url} />}
                <img
                  src={banner.image_url}
                  alt={banner.alt_text || banner.title || "RT Crackers banner"}
                  className="top-banner-image"
                  loading="eager"
                  fetchPriority={index === 0 ? "high" : "auto"}
                  decoding="async"
                />
              </picture>
            );

            return (
              <div
                key={`${banner.image_url}-${banner.display_order}-${index}`}
                className="top-banner-slide"
                aria-hidden={!current}
              >
                {href ? (
                  <a
                    href={href}
                    className="top-banner-link"
                    aria-label={`Open ${banner.alt_text || banner.title || "RT Crackers offer"}`}
                    tabIndex={current ? 0 : -1}
                    {...(/^https?:\/\//i.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {image}
                  </a>
                ) : image}
              </div>
            );
          })}
        </div>
      </div>

      <div className="top-banner-ctas" aria-label="Quick shopping actions">
        {whatsappUrl && (
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="top-banner-cta top-banner-cta-whatsapp">
            <span className="top-banner-cta-icon"><WhatsAppIcon /></span>
            <span className="top-banner-cta-copy"><strong>Shop on WhatsApp</strong><small>Quick help &amp; ordering</small></span>
            <span className="top-banner-cta-arrow" aria-hidden="true">↗</span>
          </a>
        )}
        <a href={CART_URL} target="_blank" rel="noopener noreferrer" className="top-banner-cta top-banner-cta-cart">
          <span className="top-banner-cta-icon"><CartIcon /></span>
          <span className="top-banner-cta-copy"><strong>Shop on Cart</strong><small>Browse &amp; place your order</small></span>
          <span className="top-banner-cta-arrow" aria-hidden="true">↗</span>
        </a>
      </div>

      {slides.length > 1 && (
        <div className="top-banner-pagers" role="group" aria-label="Choose banner">
          {slides.map((banner, index) => (
            <button
              key={`${banner.image_url}-pager-${index}`}
              type="button"
              className={`top-banner-pager${index === activeIndex ? " is-active" : ""}`}
              aria-label={`Show banner ${index + 1} of ${slides.length}`}
              aria-pressed={index === activeIndex}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
