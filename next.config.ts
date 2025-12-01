import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    root: '.', // this fixes the "Next.js package not found" panic
  },
};

export default nextConfig;
