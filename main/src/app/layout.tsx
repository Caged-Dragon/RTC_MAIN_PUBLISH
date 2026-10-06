import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import TopBanner from "@/components/TopBanner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSettings, getTheme, themeCss } from "@/lib/cms";
import { fontHref } from "@/lib/utils";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const title = s["seo.title"] ?? "RT Crackers";
  const description = s["seo.description"];
  const og = s["seo.og_image"] || undefined;
  const base = s["seo.canonical_base"] || process.env.NEXT_PUBLIC_SITE_URL;
  return {
    metadataBase: base ? new URL(base) : undefined,
    title: { default: title, template: `%s | ${s["site.name"] ?? "RT Crackers"}` },
    description,
    alternates: base ? { canonical: "/" } : undefined,
    icons: s["site.favicon_url"] ? { icon: s["site.favicon_url"] } : undefined,
    openGraph: { title, description, siteName: s["site.name"], type: "website", images: og ? [og] : undefined },
  };
}

export const viewport: Viewport = { themeColor: "#D71920", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [s, theme] = await Promise.all([getSettings(), getTheme()]);
  // Theme is supplied by the current RT Crackers database integration.
  const css = themeCss(theme);
  const fonts = fontHref([theme.fonts.heading, theme.fonts.body]);
  return (
    <html lang="en" data-portfolio-theme={theme.key}>
      <head>
        {css && <style dangerouslySetInnerHTML={{ __html: css }} />}
        {fonts && <link rel="stylesheet" href={fonts} />}
      </head>
      <body className="min-h-screen antialiased">
        <span id="top" aria-hidden="true" />
        <TopBanner url={s["site.banner_url"]} alt={s["site.banner_alt"]} ratio={s["site.banner_ratio"]} />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
