import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import NavBar from '@/components/navBar/NavBar';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import AOS from 'aos';
import { usePathname } from 'next/navigation';

const navLink = [
  { path: '/', display: 'Home' },
  { path: '/doctors', display: 'Find a Doctor' },
  { path: '/services', display: 'Services' },
  { path: '/contact', display: 'Contact' },
];

const Layout = ({ children }: { children: ReactNode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Effects run only after hydration has finished, so AOS adding classes to
  // [data-aos] elements can't make the server HTML mismatch.
  //
  // AOS measures every animated element when it starts, which is a lot of layout work.
  // Start it once the browser is idle so it doesn't compete with the first paint and
  // hydration. Its elements are all below the fold, so nothing visible waits on it.
  useEffect(() => {
    const start = () =>
      AOS.init({
        duration: 700,
        once: true,
        offset: 100,
        easing: 'ease-out-cubic',
      });
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(start, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 200);
    return () => clearTimeout(id);
  }, []);

  // The admin dashboard is a full-screen app with its own sidebar.
  const isAdmin = usePathname()?.startsWith('/admin');
  if (isAdmin) return <main>{children}</main>;

  return (
    <>
      <Header navLink={navLink} onOpenMenu={openMenu} menuOpen={menuOpen} />
      <NavBar navLink={navLink} open={menuOpen} onClose={closeMenu} />

      <main className='max-w-[2040px] mx-auto'>
        {children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
