import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['canvas'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('canvas');
    }
    return config;
  },
};

export default nextConfig;
