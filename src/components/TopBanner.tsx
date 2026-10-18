"use client";

import { useEffect, useState, type CSSProperties } from "react";
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
  const [bannerRatio, setBannerRatio] = useState("16 / 7");
  const [rotationPaused, setRotationPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const active = slides.length ? (slides[activeIndex] ?? slides[0]) : undefined;

  useEffect(() => {
    setActiveIndex((current) => (slides.length ? current % slides.length : 0));
  }, [slides.length]);

  useEffect(() => {
    if (slides.length < 2 || rotationPaused || isHovered || hasFocus) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        setActiveIndex((current) => (current + 1) % slides.length);
      }
    }, 5000);

    return () => window.clearInterval(timer);
  }, [slides.length, rotationPaused, isHovered, hasFocus]);

  // Measure the exact image selected by the browser (including a mobile-specific
  // source). The banner frame can therefore follow the artwork rather than a
  // hard-coded aspect ratio that might crop or letterbox it at different zooms.
  useEffect(() => {
    let measuredImage: HTMLImageElement | null = null;
    let cancelled = false;
    let measurementSequence = 0;
    const mobileQuery = window.matchMedia("(max-width: 767px)");

    if (!active) return;

    const measureActiveImage = () => {
      const requestSequence = ++measurementSequence;
      const image = new window.Image();
      measuredImage = image;
      image.decoding = "async";
      image.onload = () => {
        if (cancelled || requestSequence !== measurementSequence || !image.naturalWidth || !image.naturalHeight) return;
        setBannerRatio(`${image.naturalWidth} / ${image.naturalHeight}`);
      };
      image.src = mobileQuery.matches && active.mobile_image_url
        ? active.mobile_image_url
        : active.image_url;
    };

    measureActiveImage();
    mobileQuery.addEventListener("change", measureActiveImage);
    return () => {
      cancelled = true;
      mobileQuery.removeEventListener("change", measureActiveImage);
      if (measuredImage) measuredImage.onload = null;
    };
  }, [active?.image_url, active?.mobile_image_url]);

  if (!active) return null;
  const whatsappUrl = settings["site.ordering_url"];

  return (
    <section
      className="top-banner-shell"
      aria-label="RT Crackers featured banners"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setHasFocus(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHasFocus(false);
      }}
    >
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
        style={{ "--top-banner-ratio": bannerRatio } as CSSProperties}
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
                  loading={current ? "eager" : "lazy"}
                  fetchPriority={current ? "high" : "auto"}
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

      <div className="top-banner-ctas" role="group" aria-label="Quick shopping actions">
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
          <button
            type="button"
            className="top-banner-pause"
            aria-label={rotationPaused ? "Resume automatic banner rotation" : "Pause automatic banner rotation"}
            aria-pressed={rotationPaused}
            onClick={() => {
              setRotationPaused((paused) => !paused);
              // An explicit resume action takes precedence over the hover/focus pause.
              setIsHovered(false);
              setHasFocus(false);
            }}
          >
            <span aria-hidden="true">{rotationPaused ? "▶" : "Ⅱ"}</span>
          </button>
        </div>
      )}
    </section>
  );
}
