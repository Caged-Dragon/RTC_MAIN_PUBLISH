import "server-only";
import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { CART_URL } from "./utils";

const REVALIDATE = Number(process.env.CMS_REVALIDATE_SECONDS ?? 60);
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const sb = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: { fetch: (input, init) => fetch(input, { ...init, next: { revalidate: REVALIDATE } }) },
});

async function run<T>(
  p: PromiseLike<{ data: T | null; error: { message: string } | null }>,
  fallback: T
): Promise<T> {
  try {
    const { data, error } = await p;
    if (error) {
      console.error("[cms]", error.message);
      return fallback;
    }
    return data ?? fallback;
  } catch (e) {
    console.error("[cms]", e);
    return fallback;
  }
}

export type Settings = Record<string, string>;
export type Theme = {
  key: string;
  light: Record<string, string>;
  dark: Record<string, string>;
  fonts: { heading?: string; body?: string };
  components?: Record<string, Record<string,string>>;
};
export type Banner = {
  title: string;
  subtitle: string | null;
  image_url: string;
  link_url: string | null;
  position: string;
  display_order: number;
};
export type Category = {
  category_id: string;
  category_name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  details?: string | null;
  alt_text?: string | null;
};
export type Product = {
  product_id: number;
  product_name: string;
  selling_price: number;
  mrp: number;
  category_id: string;
  category_name: string;
  category_slug: string;
  pack_type_name: string | null;
  price_year: number;
  image_url: string | null;
  alt_text: string | null;
  is_bestseller?: boolean;
  is_featured?: boolean;
};
export type Media = { url: string; alt: string; ratio: string | null };
export type Section = {
  page_id: number;
  key: string;
  name: string;
  type: string;
  content: Record<string, any>;
};

const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const asObject = (v: unknown): Record<string, any> => {
  if (typeof v === "string") {
    try { return JSON.parse(v); } catch { return {}; }
  }
  return v && typeof v === "object" ? (v as Record<string, any>) : {};
};

const asText = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/**
 * This website intentionally uses the current RT Crackers production schema:
 * products, company_profile, merchant_settings, offers and offer_banners.
 * It does not depend on the older portfolio CMS schema.
 */

export const getCompany = cache(async () => {
  return run(
    sb.from("company_profile")
      .select("company_name,legal_name,tagline,description,vision,aim,mission,logo_url,favicon_url,website_url,email,support_email,mobile,alternate_mobile,whatsapp_number,landline,physical_address,address_line_2,landmark,city,district,state,postal_code,country,google_maps_url,social_links,policies,seo_details,is_active")
      .eq("is_active", true)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
    null as any
  );
});

export const getMerchant = cache(async () => {
  return run(
    sb.from("merchant_settings")
      .select("factory_name,active_catalog_year,factory_godown_address,pincode,whatsapp_booking_number,support_phone,merchant_upi_id,minimum_order_value,is_season_booking_open,dispatch_policy_text")
      .limit(1)
      .maybeSingle(),
    null as any
  );
});

export const getProducts = cache(async (limit = 20): Promise<Product[]> => {
  const merchant = await getMerchant();
  const year = Number(merchant?.active_catalog_year) || new Date().getFullYear();

  const rows = await run(
    sb.from("products")
      .select("id,product_code,name,category,category_id,pack_type,rate,mrp_rate,is_active,image_url,product_image,s_no,is_bestseller,is_featured,product_categories!products_category_id_fkey(category_id,category_name,slug)")
      .eq("is_active", true)
      .order("s_no", { ascending: true })
      .order("product_code", { ascending: true })
      .limit(Math.max(1, Math.min(limit, 50))),
    [] as any[]
  );

  return rows.map((p, index) => {
    const relation = Array.isArray(p.product_categories) ? p.product_categories[0] : p.product_categories;
    const categoryName = asText(relation?.category_name) || asText(p.category) || "Products";
    return {
      product_id: index + 1,
      product_name: asText(p.name) || `Product ${p.product_code ?? index + 1}`,
      selling_price: Number(p.rate) || 0,
      mrp: Number(p.mrp_rate ?? p.rate) || 0,
      category_id: relation?.category_id ?? p.category_id ?? 0,
      category_name: categoryName,
      category_slug: asText(relation?.slug) || slugify(categoryName),
      pack_type_name: asText(p.pack_type) || null,
      price_year: year,
      image_url: asText(p.image_url) || asText(p.product_image) || null,
      alt_text: asText(p.name) || null,
      is_bestseller: Boolean(p.is_bestseller),
      is_featured: Boolean(p.is_featured),
          ...(p.id ? { db_id: p.id } : {}),
    } as Product;
  });
});

export const getProductCount = cache(async (): Promise<number> => {
  try {
    const { count, error } = await sb.from("products").select("id", { count: "exact", head: true }).eq("is_active", true);
    if (error) { console.error("[cms]", error.message); return 0; }
    return count ?? 0;
  } catch (e) {
    console.error("[cms]", e); return 0;
  }
});

export const getCategories = cache(async (): Promise<Category[]> => {
  const rows = await run(
    sb.from("product_categories")
      .select("category_id,category_key,category_name,slug,description,details,image_url,alt_text,display_order,is_active")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("category_name", { ascending: true }),
    [] as any[]
  );
  return rows.map((r) => ({
    category_id: String(r.category_id ?? ""),
    category_name: asText(r.category_name) || "Products",
    slug: asText(r.slug) || slugify(r.category_name || "products"),
    description: asText(r.description) || null,
    image_url: asText(r.image_url) || null,
    ...(r.details ? { details: asText(r.details) } : {}),
    ...(r.alt_text ? { alt_text: asText(r.alt_text) } : {}),
  }));
});

export const getBanners = cache(async (): Promise<Banner[]> => {
  const now = Date.now();
  const rows = await run(
    sb.from("offer_banners")
      .select("image_url,mobile_image_url,headline,subheadline,button_text,button_url,display_order,is_active,starts_at,ends_at,offer_id,offers!inner(title,short_title,is_active,starts_at,ends_at)")
      .eq("is_active", true)
      .eq("offers.is_active", true)
      .order("display_order", { ascending: true }),
    [] as any[]
  );

  const activeWindow = (start: string | null, end: string | null) => {
    const s = start ? Date.parse(start) : NaN;
    const e = end ? Date.parse(end) : NaN;
    return (!Number.isFinite(s) || s <= now) && (!Number.isFinite(e) || e >= now);
  };

  return rows
    .filter((r) => asText(r.image_url))
    .filter((r) => activeWindow(r.starts_at, r.ends_at))
    .filter((r) => activeWindow(r.offers?.starts_at, r.offers?.ends_at))
    .map((r) => ({
      title: asText(r.headline) || asText(r.offers?.short_title) || asText(r.offers?.title) || "RT Crackers Offers",
      subtitle: asText(r.subheadline) || null,
      image_url: asText(r.image_url),
      link_url: asText(r.button_url) || "#catalogue",
      position: "H",
      display_order: Number(r.display_order) || 0,
    }));
});

export const getSettings = cache(async (): Promise<Settings> => {
  const [company, merchant, productCount, categories, banners] = await Promise.all([
    getCompany(),
    getMerchant(),
    getProductCount(),
    getCategories(),
    getBanners(),
  ]);

  const policies = asObject(company?.policies);
  const seo = asObject(company?.seo_details);
  const social = asObject(company?.social_links);

  const phone = asText(company?.whatsapp_number) || asText(company?.mobile) || asText(merchant?.whatsapp_booking_number) || "8124100501";
  const address = [
    asText(company?.physical_address),
    asText(company?.address_line_2),
    asText(company?.landmark),
  ].filter(Boolean).join(", ");

  const out: Settings = {};
  out["site.name"] = asText(company?.company_name) || asText(merchant?.factory_name) || "REDTHUNDER CRACKERS";
  out["site.tagline"] = asText(company?.tagline);
  out["site.description"] = asText(company?.description);
  out["site.domain"] = "rtcrackers.com";
  out["site.logo_url"] = asText(company?.logo_url);
  out["site.favicon_url"] = asText(company?.favicon_url) || asText(company?.logo_url);
  out["site.phone"] = phone;
  out["site.phone_country_code"] = "91";
  out["site.address"] = address || asText(merchant?.factory_godown_address) || "D No. 4/2017/A, Pothigai Nagar, Kila Thiruthangal";
  out["site.city"] = asText(company?.city) || "Sivakasi";
  out["site.state"] = asText(company?.state) || "Tamil Nadu";
  out["site.postal_code"] = asText(company?.postal_code) || asText(merchant?.pincode) || "626189";
  out["site.sales_email"] = asText(company?.email);
  out["site.support_email"] = asText(company?.support_email);
  out["site.support_phone"] = asText(company?.alternate_mobile) || asText(company?.mobile) || asText(merchant?.support_phone);
  out["site.ordering_url"] = phone ? `https://wa.me/91${phone.replace(/\D/g, "").replace(/^91/, "")}` : "";
  out["site.cart_url"] = CART_URL;
  out["site.banner_url"] = banners[0]?.image_url ?? "";
  out["site.banner_alt"] = banners[0]?.title ?? "RT Crackers offer banner";
  out["site.banner_ratio"] = "16 / 5";
  out["seo.title"] = asText(seo.title) || `${out["site.name"]} | Fireworks & Crackers`;
  out["seo.description"] = asText(seo.description) || asText(company?.description) || "RT Crackers — quality fireworks and crackers from Sivakasi.";
  out["seo.canonical_base"] = asText(company?.website_url) || "https://rtcrackers.com";
  out["seo.og_image"] = asText(company?.logo_url);
  out["active_theme"] = "rt_crackers_database";
  out["catalog.year"] = String(merchant?.active_catalog_year ?? "");
  out["catalog.minimum_order_value"] = String(merchant?.minimum_order_value ?? "");
  out["catalog.season_booking_open"] = String(merchant?.is_season_booking_open ?? "");
  out["catalog.product_count"] = String(productCount);
  out["catalog.category_count"] = String(categories.length);
  out["catalog.banner_count"] = String(banners.length);
  out["social.links"] = JSON.stringify(social);
  out["policy.shipping"] = asText(merchant?.dispatch_policy_text);
  out["policy.raw"] = JSON.stringify(policies);
  return out;
});

export const getTheme = cache(async (): Promise<Theme> => {
  const fallback: Theme = {
    key: "rt_crackers_database",
    light: {
      primary: "#D92D27", primary_dark: "#A91F1B", accent: "#E7AD21", accent_dark: "#B9820F",
      background: "#FFF8F5", surface: "#FFFAF7", surface_elevated: "#FFFFFF", surface_variant: "#FFF1EC",
      text: "#241716", text_muted: "#756A67", border: "#EAD8D1", border_strong: "#D9BCB3",
    },
    dark: {
      primary: "#FF6B61", primary_dark: "#D92D27", accent: "#F4B942", accent_dark: "#D99A1E",
      background: "#1B0A09", surface: "#28110F", surface_elevated: "#341613", surface_variant: "#401A16",
      text: "#FFF3EA", text_muted: "#D6BBB3", border: "#5A3029", border_strong: "#744038",
    },
    fonts: { heading: "system-ui", body: "system-ui" },
  };
  const row = await run(
    sb.from("theme_page_settings")
      .select("*")
      .eq("website_key", "main")
      .eq("page_key", "home")
      .eq("is_active", true)
      .limit(1)
      .maybeSingle(), null as any
  );
  if (!row) return fallback;
  const componentRows = await run(
    sb.from("theme_component_settings").select("component_key,font_family,font_size,font_weight,line_height,letter_spacing,text_color,background_color,border_color,border_width,border_radius,box_shadow,padding,margin,width,max_width,text_align").eq("website_key","main").eq("page_key","home").eq("is_active",true).order("sort_order"),
    [] as any[]
  );
  const components: Record<string,Record<string,string>> = {};
  for (const c of componentRows) {
    const key = asText(c.component_key); if (!key) continue;
    components[key] = Object.fromEntries(Object.entries(c).filter(([k,v]) => k !== "component_key" && typeof v === "string" && v.length < 500).map(([k,v]) => [k, String(v)]));
  }
  const light = {
    ...fallback.light,
    primary: row.primary_color, primary_dark: row.primary_dark_color, accent: row.accent_color,
    background: row.background_color, surface: row.surface_color, surface_elevated: row.surface_elevated_color,
    surface_variant: row.section_color, text: row.text_color, text_muted: row.muted_text_color,
    border: row.border_color, border_strong: row.border_strong_color,
  };
  const dark = { ...light, background: "#1B0A09", surface: "#28110F", surface_elevated: "#341613", surface_variant: "#401A16", text: "#FFF3EA", text_muted: "#D6BBB3", border: "#5A3029", border_strong: "#744038" };
  return { key: `db:${row.website_key}:${row.page_key}`, light, dark, fonts: { heading: row.font_heading || "system-ui", body: row.font_body || "system-ui" }, components };
});

const THEME_VARS: Record<string, string[]> = {
  "--primary": ["primary"], "--primary-dark": ["primary_dark"],
  "--brand": ["brand_blue", "brand"], "--brand-2": ["brand_blue_2", "brand_2"],
  "--accent": ["accent", "gold"], "--accent-dark": ["accent_dark", "gold_dark"],
  "--background": ["background"], "--surface": ["surface"],
  "--surface-2": ["surface_elevated", "surface_2"], "--surface-variant": ["surface_variant"],
  "--text": ["text"], "--muted": ["text_muted", "muted"],
  "--border": ["border"], "--border-strong": ["border_strong"],
};

const SAFE_COLOR = /^(#[0-9a-f]{3,8}|(rgb|hsl)a?\([\d\s.,%/deg]+\)|[a-z]+)$/i;
const SAFE_FONT = /^[\w \-]{1,60}$/;

function declarations(colors: Record<string, string>) {
  let css = "";
  for (const [cssVar, keys] of Object.entries(THEME_VARS)) {
    const raw = keys.map((k) => colors[k]).find((v) => typeof v === "string" && SAFE_COLOR.test(v.trim()));
    if (raw) css += `${cssVar}:${raw.trim()};`;
  }
  return css;
}

export function themeCss(theme: Theme): string {
  let css = "";
  const light = declarations(theme.light);
  const dark = declarations(theme.dark);
  const fonts = [["--font-heading", theme.fonts.heading], ["--font-body", theme.fonts.body]] as const;
  const fontCss = fonts.map(([v, f]) => (f && SAFE_FONT.test(f) ? `${v}:"${f}",system-ui,sans-serif;` : "")).join("");
  if (light || fontCss) css += `html:root{${light}${fontCss}}`;
  if (dark) css += `html[data-theme="dark"]:root{${dark}}`;
  const componentMap: Record<string,string> = { font_family:"font-family",font_size:"font-size",font_weight:"font-weight",line_height:"line-height",letter_spacing:"letter-spacing",text_color:"color",background_color:"background-color",border_color:"border-color",border_width:"border-width",border_radius:"border-radius",box_shadow:"box-shadow",padding:"padding",margin:"margin",width:"width",max_width:"max-width",text_align:"text-align" };
  for (const [key,row] of Object.entries(theme.components || {})) {
    const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, ""); if (!safeKey) continue;
    const decl = Object.entries(componentMap).map(([field,prop]) => { const v=row[field]; return v && !/[<>]/.test(v) ? `${prop}:${v}` : ""; }).filter(Boolean).join(";");
    if (decl) css += `[data-rtc-component="${safeKey}"]{${decl}}`;
  }
  return css;
}

export const getSections = cache(async (): Promise<Section[]> => {
  const [company, merchant, productCount, categories] = await Promise.all([
    getCompany(), getMerchant(), getProductCount(), getCategories(),
  ]);
  const policies = asObject(company?.policies);
  const shipping = asText(merchant?.dispatch_policy_text);

  return [
    {
      page_id: 1, key: "about_us", name: "About", type: "about",
      content: {
        title: "About RT Crackers",
        intro: asText(company?.description),
        brand_information: asText(company?.aim),
        product_information: asText(company?.mission),
        vision: asText(company?.vision),
        mission: asText(company?.mission),
        highlights: [
          `${productCount} active catalogue products`,
          `${categories.length} product categories`,
          `Based in ${asText(company?.city) || "Sivakasi"}`,
          "Current catalogue is read from the production database",
        ],
      },
    },
    {
      page_id: 2, key: "shipping_delivery", name: "Shipping & Delivery", type: "shipping",
      content: {
        title: "Shipping & Delivery",
        body: shipping || "Delivery charges and availability are confirmed before payment.",
        policies: ["Delivery charges are additional where applicable.", "Availability is confirmed before payment."],
      },
    },
    {
      page_id: 2, key: "ordering", name: "Ordering", type: "shipping",
      content: {
        title: "Ordering",
        body: "Choose products from the catalogue and continue to the cart to place an order.",
      },
    },
    {
      page_id: 3, key: "buying_terms", name: "Buying Terms", type: "terms",
      content: {
        policies: Array.isArray(policies.shipping_rules) ? policies.shipping_rules : [
          "Please confirm product availability before payment.",
          "Delivery charges are additional where applicable.",
        ],
      },
    },
    {
      page_id: 4, key: "confirmation_cancellation", name: "Safety & Confirmation", type: "policy",
      content: {
        policies: Array.isArray(policies.confirmation_cancellation) ? policies.confirmation_cancellation : [
          "Confirm availability before payment.",
          "Keep the payment receipt for order reference.",
        ],
      },
    },
    {
      page_id: 6, key: "price_list_intro", name: "Catalogue", type: "catalogue",
      content: { catalog_count: productCount, category_count: categories.length },
    },
    {
      page_id: 6, key: "price_list_contact", name: "Contact", type: "contact",
      content: {
        address: asText(company?.physical_address),
        city: asText(company?.city),
        state: asText(company?.state),
        postal_code: asText(company?.postal_code),
      },
    },
  ];
});

export function whatsappUrl(s: Settings): string | null {
  return s["site.ordering_url"] || null;
}
