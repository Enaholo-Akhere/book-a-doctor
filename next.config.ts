import type { NextConfig } from 'next';

// The Render backend. Override with BACKEND_ORIGIN in the build environment.
const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN || 'https://doctor-webapp-backend-zxn3.onrender.com';

const nextConfig: NextConfig = {
  agentRules: false,
  // Inlined into the browser bundle at build time, so production works
  // without any NEXT_PUBLIC_* variables set on Netlify.
  env: {
    NEXT_PUBLIC_BACKEND_ORIGIN: BACKEND_ORIGIN,
  },
  // Production calls go to /api/v1 on this same origin; forward them to the
  // Render backend (replaces the old Netlify redirect).
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${BACKEND_ORIGIN}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
