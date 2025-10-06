import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Client-side (akan terekspos ke browser)
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    // Server-side only (AMAN - tidak terekspos ke browser)
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'oxjfahzrzjdukwksmcem.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Image optimization untuk LCP
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Suppress browser extension errors in development
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: false,
      };
    }
    return config;
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  reactStrictMode: true,
};

export default nextConfig;
