import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Don’t block production build on ESLint warnings/errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Don’t block production build on TS errors
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
