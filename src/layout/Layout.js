import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs(_Fragment, { children: [_jsx(Header, { navLink: navLink, toggleMenu: toggleMenu }), _jsx(NavBar, { navLink: navLink, toggleMenu: toggleMenu, toggle: toggle }), _jsx("main", { className: 'max-w-[2040px] mx-auto', children: _jsx(Routers, {}) }), _jsx(Footer, {})] }));
};
export default Layout;
