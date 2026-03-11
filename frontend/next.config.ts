import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.aladin.co.kr',
      },
      {
        protocol: 'http',
        hostname: 'image.aladin.co.kr',
      },
      {
        protocol: 'https',
        hostname: '*.aladin.co.kr',
      },
      {
        protocol: 'http',
        hostname: '*.aladin.co.kr',
      }
    ]
  },
  /* config options here */
};

export default nextConfig;
