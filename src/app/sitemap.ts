import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/cms";
import { normalizeSiteBase } from "@/lib/utils";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSettings();
  const base = normalizeSiteBase(settings["seo.canonical_base"]);
  const homepage = new URL("/", base).toString();

  return [{
    url: homepage,
    changeFrequency: "daily",
    priority: 1,
  }];
}
