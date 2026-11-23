import icon01Asset from '@/assets/images/icon01.png';
import icon02Asset from '@/assets/images/icon02.png';
import icon03Asset from '@/assets/images/icon03.png';

const icon01: string = icon01Asset.src;
const icon02: string = icon02Asset.src;
const icon03: string = icon03Asset.src;

export interface medicalServiceInterface {
  id: number;
  title: string;
  subtext: string;
  icon: string;
  url: string;
}

export const medicalServices: medicalServiceInterface[] = [
  {
    id: 1,
    title: 'Find a Doctor',
    icon: icon01,
    url: '/doctors',
    subtext:
      'Our health system delivers expert, compassionate care — from advanced lab testing to personalized treatment in the clinic.',
  },
  {
    id: 2,
    title: 'Find a Location',
    url: '',
    icon: icon02,
    subtext:
      "With locations near you, it's easy to access the expert care you need — wherever and whenever you need it.",
  },
  {
    id: 3,
    url: '/doctors',
    title: 'Book Appointment',
    icon: icon03,
    subtext:
      'Booking an appointment is quick and easy. Choose a time that works for you and get the care you need — when you need it.',
  },
];
