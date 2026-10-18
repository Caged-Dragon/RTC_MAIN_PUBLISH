"use client";

import { useEffect } from "react";

/** Adds repeatable in/out reveal motion without changing page layout or requiring a library. */
export default function ScrollMotion() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) return;

    const sectionSelector = [
      ".top-banner",
      ".company-masthead",
      ".trust-strip",
      "main > section",
      "main section.section-pad",
      "footer",
    ].join(",");
    const cardSelector = [
      ".category-tile",
      ".product-card",
      ".budget-showcase-card",
      ".combo-card",
      ".order-step-card",
      ".trust-strip-item",
      ".company-masthead-detail",
    ].join(",");

    const sections = Array.from(document.querySelectorAll<HTMLElement>(sectionSelector));
    const cards = Array.from(document.querySelectorAll<HTMLElement>(cardSelector));
    const all = Array.from(new Set([...sections, ...cards]));

    all.forEach((element, index) => {
      element.classList.add("scroll-motion");
      if (index % 2 === 0) element.classList.add("motion-from-right");
      else element.classList.add("motion-from-left");
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const element = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          element.classList.add("is-visible");
          element.classList.remove("motion-exit-left", "motion-exit-right");
        } else {
          element.classList.remove("is-visible");
          element.classList.toggle("motion-exit-left", entry.boundingClientRect.top < 0);
          element.classList.toggle("motion-exit-right", entry.boundingClientRect.top >= 0);
        }
      });
    }, { threshold: 0.08, rootMargin: "-4% 0px -7% 0px" });

    all.forEach((element) => observer.observe(element));
    document.documentElement.dataset.scrollAnimations = "ready";

    return () => {
      observer.disconnect();
      delete document.documentElement.dataset.scrollAnimations;
      all.forEach((element) => element.classList.remove("scroll-motion", "motion-from-right", "motion-from-left", "motion-exit-left", "motion-exit-right", "is-visible"));
    };
  }, []);

  return null;
}
