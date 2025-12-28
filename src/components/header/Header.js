import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import logo from '@/assets/images/logo.png';
import { BiMenu } from 'react-icons/bi';
import { NavLink, Link } from 'react-router-dom';
// import userImg from '@/assets/images/avatar-icon.png';
import { useEffect, useRef } from 'react';
import Button from '@/components/Button';
const Header = ({ navLink, toggleMenu, }) => {
    const headerRef = useRef(null);
    const handleStickyHeader = () => {
        window.addEventListener('scroll', () => {
            if (document.body.scrollTop > 80 ||
                document.documentElement.scrollTop > 80) {
                if (headerRef.current) {
                    headerRef.current.classList.add('sticky__header');
                }
            }
            else {
                if (headerRef.current) {
                    headerRef.current.classList.remove('sticky__header');
                }
            }
        });
    };
    useEffect(() => {
        handleStickyHeader();
        return () => window.removeEventListener('scroll', handleStickyHeader);
    }, []);
    return (_jsx("header", { className: 'header', ref: headerRef, children: _jsxs("div", { className: 'container flex justify-between items-center m-auto', children: [_jsx("div", { className: '', children: _jsx(NavLink, { to: '/', children: _jsx("img", { src: logo, alt: '', className: 'w-full' }) }) }), _jsx("div", { className: 'hidden md:block', onClick: toggleMenu, children: _jsx("ul", { className: 'flex items-center gap-[2.7rem] md:flex-column', children: navLink.map((link, index) => (_jsx("li", { children: _jsx(NavLink, { to: link.path, className: (navClass) => navClass.isActive
                                    ? 'text-primaryColor text-16 leading-7 font-[600]]'
                                    : 'text-textColor text-16 leading-7 font-[600]', children: link.display }) }, index))) }) }), _jsxs("div", { className: 'flex items-center gap-4', children: [_jsx("div", { className: '' }), _jsx(Link, { to: '/login', children: _jsx(Button, { title: 'Login', bgColor: ' bg-primaryColor', txtColor: 'text-white', btnWidth: 'w-fit', px: 'md:px-[56px] px-[30px]', py: '' }) }), _jsx("span", { className: 'md:hidden', onClick: toggleMenu, children: _jsx(BiMenu, { className: 'w-6 h-5 cursor-pointer' }) })] })] }) }));
};
export default Header;
