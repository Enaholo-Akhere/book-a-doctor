import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/constants/site';

/**
 * Blocks crawling of pages that are private or only reachable from a link
 * sent to one user. Login, signup and forgot-password stay crawlable on
 * purpose: they are linked from every page and carry a noindex tag, which
 * Google can only see if it is allowed to fetch them.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/dashboard/',
        '/admin',
        '/users/',
        '/payment-success-st',
        '/payment-success-fl',
        '/verify-email',
        '/reset-password',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
