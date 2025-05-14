import { Link } from 'react-router-dom';
import logo from '@/assets/images/logo.png';
import {
  socialLinks,
  quickLink01,
  quickLinks02,
  quickLinks03,
} from '@/components/quick-links';
import { QuickLinkInterface, SocialLinkInterface } from '@/types/doctors.ds';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className='pb-16 pt-10'>
      <div className='container'>
        <div className='flex justify-between flex-col md:flex-row flex-wrap gap-[35px]'>
          <div>
            <img src={logo} alt='doctors image' />
            <p className='text-[15px] leading-7 font-[400] text-textColor mt-6 '>
              Copyright &#169; {year} | developed by Enaholo Akhere | all rights
              reserved.
            </p>
            <div className='flex items-center gap-3 mt-4'>
              {socialLinks.map(
                (socials: SocialLinkInterface, index: number) => (
                  <Link
                    to={socials.path}
                    key={index + 'social-link'}
                    className='w-9 h-9 border border-solid border-[#1B1A1E] rounded-full flex items-center justify-center group hover:bg-primaryColor hover:border-none '
                  >
                    {socials.icon}
                  </Link>
                )
              )}
            </div>
          </div>
          <div>
            <h2 className='text-[20px] leading-[30px] font-[700] mb-6 text-headingColor '>
              Quick Links
            </h2>
            <ul>
              {quickLink01.map((qLink: QuickLinkInterface, index: number) => (
                <li key={index + 'quick-link'} className='mb-4'>
                  <Link
                    to={qLink.path}
                    className='text-[15px] leading-7 font-[400] text-textColor '
                  >
                    {qLink.display}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className='text-[20px] leading-[30px] font-[700] mb-6 text-headingColor '>
              I want to:
            </h2>
            <ul>
              {quickLinks02.map((qLink: QuickLinkInterface, index: number) => (
                <li key={index + 'quick-link'} className='mb-4'>
                  <Link
                    to={qLink.path}
                    className='text-[15px] leading-7 font-[400] text-textColor '
                  >
                    {qLink.display}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className='text-[20px] leading-[30px] font-[700] mb-6 text-headingColor '>
              Support
            </h2>
            <ul>
              {quickLinks03.map((qLink: QuickLinkInterface, index: number) => (
                <li key={index + 'quick-link'} className='mb-4'>
                  <Link
                    to={qLink.path}
                    className='text-[15px] leading-7 font-[400] text-textColor '
                  >
                    {qLink.display}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
