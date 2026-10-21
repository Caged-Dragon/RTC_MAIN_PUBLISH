import type { MetadataRoute } from "next";
import { getPublishedPages } from "@/lib/cms";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getPublishedPages();
  const base = "https://rtcrackers.com";
  return pages.filter((page) => page.seo?.robots_index !== false).map((page) => ({
    url: page.is_homepage || page.slug === "home" ? `${base}/` : `${base}/${page.slug}`,
    changeFrequency: page.slug === "2026-price-list" ? "daily" : "weekly",
    priority: page.is_homepage || page.slug === "home" ? 1 : page.slug === "2026-price-list" ? 0.9 : 0.65,
  }));
}
