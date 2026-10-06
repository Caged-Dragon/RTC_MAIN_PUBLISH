/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Every image URL comes from the database, so any https host is allowed.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    formats: ["image/avif", "image/webp"],
  },
};
export default nextConfig;
