import { Link } from 'react-router-dom';
import logo from '/public/CareConnect-logo.png';
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
          <div className='w-full md:w-[250px] h-full'>
            <div className='w-[150px] h-full'>
              <img
                src={logo}
                alt='doctors image'
                className='w-[100%] h-[100%]'
              />
            </div>

            <div className='flex items-center gap-3 mt-4'>
              {socialLinks.map(
                (socials: SocialLinkInterface, index: number) => (
                  <Link to={socials.path} key={index + 'social-link'}>
                    <div className='w-9 h-9 border border-solid border-[#1B1A1E] rounded-full flex items-center justify-center group hover:bg-primaryColor hover:border-none '>
                      {socials.icon}
                    </div>
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
        <div className='border-t border-solid border-gray-100 pt-5 flex items-center justify-between flex-wrap gap-2'>
          <p className='text-[13px] text-gray-400'>
            © {year} CareConnect. Developed by Enaholo Akhere.
          </p>
          <div className='flex items-center gap-1 text-[13px] text-gray-400'>
            <span>🔒</span> HIPAA compliant
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;

// const Footer = () => {
//   const year = new Date().getFullYear();
//   return (
//     <footer className='border-t border-solid border-gray-100 py-12'>
//       <div className='container'>
//         <div className='grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-8 mb-12'>
//           <div>
//             <div className='flex items-center gap-3 mb-4'>
//               <img
//                 src={logo}
//                 alt='CareConnect'
//                 className='w-8 h-8 object-contain'
//               />
//               <span className='text-base font-medium text-headingColor'>
//                 CareConnect
//               </span>
//             </div>
//             <p className='text-sm text-textColor leading-7 mb-6'>
//               Connecting patients with trusted healthcare professionals. Book
//               appointments, manage your health, all in one place.
//             </p>
//             <div className='flex items-center gap-3'>
//               {socialLinks.map((socials, index) => (
//                 <Link
//                   to={socials.path}
//                   key={index}
//                   className='w-9 h-9 border border-solid border-gray-200 rounded-full flex items-center justify-center text-textColor hover:border-primaryColor hover:text-primaryColor transition-colors'
//                 >
//                   {socials.icon}
//                 </Link>
//               ))}
//             </div>
//           </div>

//           {[
//             { title: 'Quick links', links: quickLink01 },
//             { title: 'I want to', links: quickLinks02 },
//             { title: 'Support', links: quickLinks03 },
//           ].map(({ title, links }) => (
//             <div key={title}>
//               <p className='text-xs font-medium text-gray-400 uppercase tracking-widest mb-4'>
//                 {title}
//               </p>
//               <ul className='flex flex-col gap-3'>
//                 {links.map((qLink, index) => (
//                   <li key={index}>
//                     <Link
//                       to={qLink.path}
//                       className='text-sm text-textColor hover:text-primaryColor transition-colors'
//                     >
//                       {qLink.display}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>

//         <div className='border-t border-solid border-gray-100 pt-5 flex items-center justify-between flex-wrap gap-2'>
//           <p className='text-[13px] text-gray-400'>
//             © {year} CareConnect. Developed by Enaholo Akhere.
//           </p>
//           <div className='flex items-center gap-1 text-[13px] text-gray-400'>
//             <span>🔒</span> HIPAA compliant
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
