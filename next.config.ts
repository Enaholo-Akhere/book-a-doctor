import type { NextConfig } from 'next';

// The Render backend. Override with BACKEND_ORIGIN in the build environment.
const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN || 'https://doctor-webapp-backend-zxn3.onrender.com';

// react-pdf imports the modern pdf.js build, which calls JS features that
// Safari on iOS doesn't have yet (Map.getOrInsertComputed, Math.sumPrecise...)
// and fails there. The legacy build ships polyfills for them.
const PDFJS_LEGACY = {
  'pdfjs-dist': 'pdfjs-dist/legacy/build/pdf.mjs',
  'pdfjs-dist/web/pdf_viewer.mjs': 'pdfjs-dist/legacy/web/pdf_viewer.mjs',
};

const nextConfig: NextConfig = {
  agentRules: false,
  turbopack: { resolveAlias: PDFJS_LEGACY },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'pdfjs-dist$': PDFJS_LEGACY['pdfjs-dist'],
      'pdfjs-dist/web/pdf_viewer.mjs$': PDFJS_LEGACY['pdfjs-dist/web/pdf_viewer.mjs'],
    };
    return config;
  },
  images: {
    // Doctor and patient photos are uploaded to Cloudinary.
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/careconnects/**' }],
  },
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
