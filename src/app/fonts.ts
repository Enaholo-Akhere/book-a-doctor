import { Cormorant_Infant, Manrope } from 'next/font/google';

// Self-hosted at build time by next/font: no request to Google's servers, and no
// render-blocking stylesheet. Exposed as CSS variables used in index.css.
export const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});

// Only the booking details use it, so don't preload it on every page; the browser
// fetches it when text in this font actually renders.
export const cormorant = Cormorant_Infant({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  preload: false,
  variable: '--font-cormorant',
});
