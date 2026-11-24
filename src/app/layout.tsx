import type { Metadata, Viewport } from 'next';
import 'aos/dist/aos.css';
import '@/index.css';
import App from '@/App';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/constants/site';

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
    icon: '/careconnect-favicon.png',
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
    <html lang='en' data-scroll-behavior='smooth'>
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
