import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import ScrollMotion from "@/components/ScrollMotion";
import Header from "@/components/Header";
import MinimumOrderNotice from "@/components/MinimumOrderNotice";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import { getSettings, getTheme, getPageBySlug, themeCss } from "@/lib/cms";
import { fontHref, normalizeSiteBase } from "@/lib/utils";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const [s, home] = await Promise.all([getSettings(), getPageBySlug("home")]);
  const title = home?.seo?.meta_title || "Sivakasi Crackers Catalogue 2026 | RedThunder Crackers — Makka & Wheat Brand";
  const description = home?.seo?.meta_description || "Explore the 2026 RedThunder Crackers catalogue from Rajukanna Fireworks, Sivakasi. Contact +91 8124100501 for product enquiries; online fireworks orders are not accepted.";
  const base = normalizeSiteBase("https://rtcrackers.com");
  const og = s["seo.og_image"] || s["site.logo_url"] || undefined;
  const keywords = String(home?.seo?.keywords || "Sivakasi crackers catalogue, RedThunder Crackers, Makka and Wheat brand, Rajukanna Fireworks, Sivakasi 2026 price list, fireworks product information")
    .split(",").map((keyword) => keyword.trim()).filter(Boolean);
  return {
    metadataBase: new URL(base),
    title: { default: title, template: `%s | ${s["site.name"] ?? "RedThunder Crackers"}` },
    description, keywords,
    alternates: { canonical: home?.seo?.canonical_url || "/" },
    icons: s["site.favicon_url"] ? { icon: s["site.favicon_url"] } : undefined,
    robots: { index: home?.seo?.robots_index ?? true, follow: home?.seo?.robots_follow ?? true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
    openGraph: { title: home?.seo?.og_title || title, description: home?.seo?.og_description || description, siteName: s["site.name"], type: "website", locale: "en_IN", url: base, images: og ? [og] : undefined },
    twitter: { card: "summary_large_image", title: home?.seo?.og_title || title, description: home?.seo?.og_description || description, images: og ? [og] : undefined },
  };
}

export const viewport: Viewport = { themeColor: "#111827", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [s, theme] = await Promise.all([getSettings(), getTheme()]);
  // Theme is supplied by the current RT Crackers database integration.
  const css = themeCss(theme);
  const fonts = fontHref([theme.fonts.heading, theme.fonts.body]);
  const siteBase = normalizeSiteBase(s["seo.canonical_base"] || process.env.NEXT_PUBLIC_SITE_URL);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": `${siteBase}/#business`,
    name: s["site.name"] || "RedThunder Crackers",
    legalName: "Rajukanna Fireworks",
    url: siteBase,
    description: s["site.description"] || "Makka & Wheat brand catalogue from Rajukanna Fireworks, Sivakasi, established 1995. General product information only; this website does not accept online fireworks orders.",
    foundingDate: "1995",
    brand: { "@type": "Brand", name: "Makka & Wheat" },
    parentOrganization: { "@type": "Organization", name: "Rajukanna Fireworks" },
    ...(s["site.logo_url"] || s["seo.og_image"] ? { logo: s["site.logo_url"] || s["seo.og_image"] } : {}),
    telephone: "+91 8124100501",
    email: "sales@rtcrackers.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: s["site.address"] || "Pothigai Nagar, Kila Thiruthangal",
      addressLocality: s["site.city"] || "Sivakasi",
      addressRegion: s["site.state"] || "Tamil Nadu",
      postalCode: s["site.postal_code"] || "626189",
      addressCountry: s["site.country"] || "IN"
    },
    contactPoint: [
      { "@type": "ContactPoint", telephone: "+91 8124100501", contactType: "sales", availableLanguage: ["en", "ta"] },
      { "@type": "ContactPoint", telephone: "+91 7358737658", email: "support@rtcrackers.com", contactType: "customer support", availableLanguage: ["en", "ta"] }
    ],
    priceRange: "₹21–₹5,000"
  };
  return (
    <html lang="en-IN" data-portfolio-theme={theme.key}>
      <head>
        {css && <style dangerouslySetInnerHTML={{ __html: css }} />}
        {fonts && <link rel="stylesheet" href={fonts} />}
      </head>
      <body className="min-h-screen antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", "@id": `${siteBase}/#website`, name: "RedThunder Crackers", alternateName: "RT Crackers Catalogue", url: siteBase, inLanguage: "en-IN", publisher: { "@id": `${siteBase}/#business` } }).replace(/</g, "\\u003c") }} />
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <span id="top" aria-hidden="true" />
        <MinimumOrderNotice />
        <Header />
        <main id="main-content" tabIndex={-1}>{children}</main>
        <Footer />
        <MobileBottomNav />
        <ScrollMotion />
      </body>
    </html>
  );
}
