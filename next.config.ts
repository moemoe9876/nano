import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['sharp', 'canvas'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('sharp', 'canvas');
    }
    return config;
  },
};
