import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'championshop.id',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
