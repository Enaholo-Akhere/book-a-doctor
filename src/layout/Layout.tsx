import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import NavBar from '@/components/navBar/NavBar';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import AOS from 'aos';

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

  // Initialised here, inside the same Suspense boundary as the page, so it
  // runs only after the page has hydrated: AOS adds classes to [data-aos]
  // elements, which would otherwise make the server HTML mismatch.
  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
      offset: 100,
      easing: 'ease-out-cubic',
    });
  }, []);

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
