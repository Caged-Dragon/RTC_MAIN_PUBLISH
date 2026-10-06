import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/cms";
export const revalidate = 3600;
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const s = await getSettings();
  return { name:s["site.name"] ?? "RT Crackers", short_name:"RT Crackers", description:s["seo.description"], start_url:"/", display:"standalone", background_color:"#FFFDF8", theme_color:"#D81B14", icons:s["site.logo_url"]?[{src:s["site.logo_url"],sizes:"any",type:"image/jpeg"}]:[] };
}
