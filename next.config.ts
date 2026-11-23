import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  agentRules: false,
  // Production calls go to /api/v1 on this same origin; forward them to the
  // Render backend (replaces the old Netlify redirect).
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://doctor-webapp-backend-zxn3.onrender.com/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
