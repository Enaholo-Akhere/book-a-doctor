import { RiLinkedinFill } from 'react-icons/ri';
import {
  AiFillYoutube,
  AiFillGithub,
  AiOutlineInstagram,
} from 'react-icons/ai';
import { QuickLinkInterface, SocialLinkInterface } from '@/types/doctors.ds';

export const socialLinks: SocialLinkInterface[] = [
  { path: 'https://www.youtube.com', icon: <AiFillYoutube />, label: 'CareConnect on YouTube' },

  // TODO: this points at YouTube; replace with the real Instagram profile URL.
  { path: 'https://www.youtube.com', icon: <AiOutlineInstagram />, label: 'CareConnect on Instagram' },
  { path: 'https://github.com/Enaholo-Akhere', icon: <AiFillGithub />, label: 'GitHub' },
  {
    path: 'https://www.linkedin.com/in/enaholo-akhere',
    icon: <RiLinkedinFill />,
    label: 'LinkedIn',
  },
];

export const quickLink01: QuickLinkInterface[] = [
  { path: '/', display: 'Home' },
  { path: '/#about', display: 'About Us' },
  { path: '/services', display: 'Services' },
  { path: '/', display: 'Blog' },
];

export const quickLinks03: QuickLinkInterface[] = [
  { path: '/', display: 'Donate' },
  { path: '/contact', display: 'Contact Us' },
];

export const quickLinks02: QuickLinkInterface[] = [
  { path: '/doctors', display: 'Find a Doctor' },
  { path: '/doctors', display: 'Request an Appointment' },
  { path: '/find-a-location', display: 'Find a Location' },
  { path: '/doctors', display: 'Get an Opinion' },
];
