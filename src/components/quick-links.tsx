import { RiLinkedinFill } from 'react-icons/ri';
import {
  AiFillYoutube,
  AiFillGithub,
  AiOutlineInstagram,
} from 'react-icons/ai';
import { QuickLinkInterface, SocialLinkInterface } from '@/types/doctors.ds';

export const socialLinks: SocialLinkInterface[] = [
  { path: 'https://www.youtube.com', icon: <AiFillYoutube /> },

  { path: 'https://www.youtube.com', icon: <AiOutlineInstagram /> },
  { path: 'https://github.com/Enaholo-Akhere', icon: <AiFillGithub /> },
  {
    path: 'https://www.linkedin.com/in/enaholo-akhere',
    icon: <RiLinkedinFill />,
  },
];

export const quickLink01: QuickLinkInterface[] = [
  { path: '/', display: 'Home' },
  { path: '/about-us', display: 'About Us' },
  { path: '/services', display: 'Services' },
  { path: '/', display: 'Blog' },
];

export const quickLinks03: QuickLinkInterface[] = [
  { path: '/', display: 'Donate' },
  { path: '/contact-us', display: 'Contact Us' },
];

export const quickLinks02: QuickLinkInterface[] = [
  { path: '/find-a-doctor', display: 'Find a Doctor' },
  { path: '/request-an-appointment', display: 'Request an Appointment' },
  { path: '/find-a-location', display: 'Find a Location' },
  { path: '/get-an-opinion', display: 'Get an Opinion' },
];
