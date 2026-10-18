import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import ScrollMotion from "@/components/ScrollMotion";
import Header from "@/components/Header";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import { getSettings, getTheme, themeCss } from "@/lib/cms";
import { fontHref, normalizeSiteBase } from "@/lib/utils";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const title = s["seo.title"] || "RT Crackers | Fireworks & Crackers";
  const description = s["seo.description"] || s["site.description"] || "Explore the RT Crackers catalogue, browse product categories and continue to the ordering website for current prices and availability.";
  const og = s["seo.og_image"] || s["site.logo_url"] || undefined;
  const base = normalizeSiteBase(s["seo.canonical_base"] || process.env.NEXT_PUBLIC_SITE_URL);
  return {
    metadataBase: base ? new URL(base) : undefined,
    title: { default: title, template: `%s | ${s["site.name"] ?? "RT Crackers"}` },
    description,
    alternates: base ? { canonical: "/" } : undefined,
    icons: s["site.favicon_url"] ? { icon: s["site.favicon_url"] } : undefined,
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
    openGraph: { title, description, siteName: s["site.name"], type: "website", locale: "en_IN", url: base, images: og ? [og] : undefined },
    twitter: { card: "summary_large_image", title, description, images: og ? [og] : undefined },
  };
}

export const viewport: Viewport = { themeColor: "#111827", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [s, theme] = await Promise.all([getSettings(), getTheme()]);
  // Theme is supplied by the current RT Crackers database integration.
  const css = themeCss(theme);
  const fonts = fontHref([theme.fonts.heading, theme.fonts.body]);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: s["site.name"] || "RT Crackers",
    url: normalizeSiteBase(s["seo.canonical_base"]),
    ...(s["site.description"] ? { description: s["site.description"] } : {}),
    ...((s["site.logo_url"] || s["seo.og_image"]) ? { logo: s["site.logo_url"] || s["seo.og_image"] } : {}),
  };
  return (
    <html lang="en-IN" data-portfolio-theme={theme.key}>
      <head>
        {css && <style dangerouslySetInnerHTML={{ __html: css }} />}
        {fonts && <link rel="stylesheet" href={fonts} />}
      </head>
      <body className="min-h-screen antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <span id="top" aria-hidden="true" />
        <Header />
        <main id="main-content" tabIndex={-1}>{children}</main>
        <Footer />
        <MobileBottomNav />
        <ScrollMotion />
      </body>
    </html>
  );
}
