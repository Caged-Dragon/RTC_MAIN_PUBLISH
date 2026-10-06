import Image from "next/image";

/**
 * Advertising banner comes from the current Supabase offer_banners table.
 * Sized by its real aspect ratio when the media row provides one, so it is never distorted;
 * on very wide screens height is capped and the image is cropped with object-cover.
 */
export default function TopBanner({ url, alt, ratio }: { url?: string; alt?: string; ratio?: string }) {
  if (!url) return null;
  return (
    <div className="top-banner" style={{ aspectRatio: ratio || "16 / 5" }}>
      <Image src={url} alt={alt || "RT Crackers advertising banner"} fill priority sizes="100vw" quality={85} className="object-cover object-center" />
    </div>
  );
}
