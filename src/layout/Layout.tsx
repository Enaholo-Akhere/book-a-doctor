import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import NavBar from '@/components/navBar/NavBar';
import Routers from '@/routes/Routers';
import { useState } from 'react';

const navLink = [
  { path: '/', display: 'Home' },
  { path: '/doctors', display: 'Find a Doctor' },
  { path: '/services', display: 'Services' },
  { path: '/contact', display: 'Contact' },
];

const Layout = () => {
  const [toggle, setToggle] = useState(false);

  const toggleMenu = () => {
    setToggle(!toggle);
  };

  return (
    <>
      <Header navLink={navLink} toggleMenu={toggleMenu} />
      <NavBar navLink={navLink} toggleMenu={toggleMenu} toggle={toggle} />

      <main className='max-w-[2040px] mx-auto'>
        <Routers />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
