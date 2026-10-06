export const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

/** Customer ordering site. The portfolio has no checkout; every purchasing CTA points here. */
export const CART_URL = "https://cart.rtcrackers.com";

/** Fonts are chosen in the database (theme typography); load them from Google Fonts at runtime. */
export const fontHref = (names: (string | undefined)[]) => {
  const fam = [...new Set(names.filter(Boolean) as string[])];
  return fam.length
    ? `https://fonts.googleapis.com/css2?${fam.map((f) => `family=${encodeURIComponent(f)}:wght@400;600;700;800`).join("&")}&display=swap`
    : null;
};
