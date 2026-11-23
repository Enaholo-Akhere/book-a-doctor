import type { Metadata, Viewport } from 'next';
import 'aos/dist/aos.css';
import '@/index.css';
import App from '@/App';

export const metadata: Metadata = {
  title: 'CareConnect - Your Health, Our Priority',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/careconnect-favicon.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0d8c81',
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
