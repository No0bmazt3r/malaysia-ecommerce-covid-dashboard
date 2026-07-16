import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Static export for easy Vercel deployment
  images: { unoptimized: true }, // Disables sharp dependency requirement
  trailingSlash: true,
};
export default nextConfig;
