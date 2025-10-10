import { jsx as _jsx } from "react/jsx-runtime";
import { RiLinkedinFill } from 'react-icons/ri';
import { AiFillYoutube, AiFillGithub, AiOutlineInstagram, } from 'react-icons/ai';
export const socialLinks = [
    { path: 'https://www.youtube.com', icon: _jsx(AiFillYoutube, {}) },
    { path: 'https://www.youtube.com', icon: _jsx(AiOutlineInstagram, {}) },
    { path: 'https://github.com/Enaholo-Akhere', icon: _jsx(AiFillGithub, {}) },
    {
        path: 'https://www.linkedin.com/in/enaholo-akhere',
        icon: _jsx(RiLinkedinFill, {}),
    },
];
export const quickLink01 = [
    { path: '/', display: 'Home' },
    { path: '/about-us', display: 'About Us' },
    { path: '/services', display: 'Services' },
    { path: '/', display: 'Blog' },
];
export const quickLinks03 = [
    { path: '/', display: 'Donate' },
    { path: '/contact-us', display: 'Contact Us' },
];
export const quickLinks02 = [
    { path: '/find-a-doctor', display: 'Find a Doctor' },
    { path: '/request-an-appointment', display: 'Request an Appointment' },
    { path: '/find-a-location', display: 'Find a Location' },
    { path: '/get-an-opinion', display: 'Get an Opinion' },
];
