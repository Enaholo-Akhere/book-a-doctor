import featureImage from '@/assets/images/feature-img.png';
import videoIcon from '@/assets/images/video-icon.png';
import avatarIcon from '@/assets/images/avatar-icon.png';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';

const Feature = () => {
  return (
    <section>
      <div className='container'>
        <div className='flex md:items-center justify-between flex-col lg:flex-row m-auto '>
          <div className='xl:w-[670px] lg:w-[480px] w-[100%] pr-[20px]'>
            <h2 className='heading'>
              Get virtual treatment <br />
              anytime.
            </h2>
            <ul className='pl-4 mb-5'>
              <li className='text__para'>
                1. Schedule the appointment directly.
              </li>
              <li className='text__para'>
                2. Search for your physician here and contact their office.
              </li>
              <li className='text__para'>
                3. View our physicians who are accepting new patients, use the
                online scheduling tool to select an appointment time.
              </li>
            </ul>
            <Link to='/'>
              <Button title='Learn More' />
            </Link>
          </div>
          <div className='relative z-10 xl:w-[770px] flex justify-end mt-[50px] lg:mt-0 '>
            <div className='xl:w-[450px] lg:w-[350px] md:w-[400px] sm:w-[350px] w-[300px] flex justify-end items-end'>
              <img
                src={featureImage}
                alt='feature image doctor app'
                className='w-ful h-full'
              />
            </div>
            <div className='w-[150px] left-[10px] lg:w-[248px] bg-white absolute bottom-[50px] md:bottom-[100px] sm:left-[150px] md:left-[-100px] xl:left-[50px] 2xl:left-[150px] lg:left-[-150px] z-20 p-2 pb-3 lg:pt-4 lg:px-4 lg:pb-[26px] rounded-[10px] '>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-[6px] lg:gap-3'>
                  <p className='text-[10px] leading-[10px] lg:text-[14px] lg:leading-5 text-textColor font-[400] '>
                    Tue, 26 10:00AM
                  </p>
                </div>
                <span className='w-5 h-5 lg:w-[34px] lg:h-[34px] flex items-center justify-center bg-yellowColor py-1 px-[6px] lg:py-3 lg:px-[9px] '>
                  <img src={videoIcon} alt='doctor appointment' />
                </span>
              </div>
              <div className='w-[65px] lg:w-[96px] bg-[#CCF0F3] py-1 px-2 lg:py-[6px] lg:px-[10px] text-[8px] leading-[8px] lg:text-[12px] lg:leading-4 text-irisBlueColor font-[500] mt-2 lg:mt-4 rounded-full '>
                Consultation
              </div>
              <div className='flex items-center gap-[6px] lg:gap-[10px] mt-2 lg:mt-[18px] '>
                <img src={avatarIcon} alt='available doctor' />
                <h4 className='text-[10px] leading-3 lg:text-[16px] lg:leading-[22px] font-[700] '>
                  Wayne Collins
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feature;
