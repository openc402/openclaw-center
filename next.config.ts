import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/openclaw-center',
  images: { unoptimized: true },
};
export default nextConfig;
