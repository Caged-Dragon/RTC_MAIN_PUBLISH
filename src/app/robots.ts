import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/cms";
import { normalizeSiteBase } from "@/lib/utils";

export const revalidate = 3600;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSettings();
  const base = normalizeSiteBase(settings["seo.canonical_base"]);
  const sitemap = new URL("/sitemap.xml", base).toString();

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap,
  };
}
