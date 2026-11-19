import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import NavBar from '@/components/navBar/NavBar';
import Routers from '@/routes/Routers';
import { useCallback, useState } from 'react';

const navLink = [
  { path: '/', display: 'Home' },
  { path: '/doctors', display: 'Find a Doctor' },
  { path: '/services', display: 'Services' },
  { path: '/contact', display: 'Contact' },
];

const Layout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <Header navLink={navLink} onOpenMenu={openMenu} menuOpen={menuOpen} />
      <NavBar navLink={navLink} open={menuOpen} onClose={closeMenu} />

      <main className='max-w-[2040px] mx-auto'>
        <Routers />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
