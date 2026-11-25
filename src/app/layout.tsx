import type { Metadata, Viewport } from 'next';
import '@/index.css';
import App from '@/App';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/constants/site';
import { cormorant, manrope } from './fonts';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} – Online Doctor Consultations`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image' },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0c8075',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' data-scroll-behavior='smooth' className={`${manrope.variable} ${cormorant.variable}`}>
      {/* Browser extensions (e.g. ColorZilla's cz-shortcut-listen) add
          attributes to <body> before React loads. This only ignores
          attribute differences on <body> itself, not its children. */}
      <body suppressHydrationWarning>
        <App>{children}</App>
        <div id='modal-root'></div>
      </body>
    </html>
  );
}
