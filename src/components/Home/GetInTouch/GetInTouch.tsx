import icon01 from '@/assets/images/icon01.png';
import icon02 from '@/assets/images/icon02.png';
import icon03 from '@/assets/images/icon03.png';
import { BsArrowRight } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const GetInTouch = () => {
  return (
    <section>
      <div className='container'>
        <div className='lg:w-[470px] mx-auto mb-[50px]'>
          <h2 className='heading text-center'>
            Providing the best medical services
          </h2>
          <p className='text__para text-center'>
            World-class care for everyone. Our health system offers unmatched,
            expert health care.
          </p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-[10px] mt-[30px] lg-mt-[55px]  '>
          <div className=' px-5 flex flex-col justify-between items-center'>
            <div className='mb-10'>
              <img src={icon01} alt='world class doctors' />
            </div>
            <div className='flex flex-col justify-between h-[220px] '>
              <div>
                <h2 className='text-[26px] leading-9 text-headingColor font-[700] text-center '>
                  Find a Doctor
                </h2>
              </div>
              <div>
                <p className='text-[16px] leading-7 text-textColor font-[400] mt-4 text-center h-[100px] '>
                  Our health system delivers expert, compassionate care — from
                  advanced lab testing to personalized treatment in the clinic.
                </p>
              </div>
              <div>
                <Link
                  to='/doctors'
                  className='w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto flex items-center justify-center group hover:bg-primaryColor hover:border-none'
                >
                  <BsArrowRight className='group-hover:text-white w-6 h-5' />
                </Link>
              </div>
            </div>
          </div>
          <div className=' px-5 flex flex-col justify-between items-center'>
            <div className='mb-10'>
              <img src={icon02} alt='world class doctors' />
            </div>
            <div className='flex flex-col justify-between h-[220px]'>
              <div>
                <h2 className='text-[26px] leading-9 text-headingColor font-[700] text-center '>
                  Find a Location
                </h2>
              </div>
              <div>
                <p className='text-[16px] leading-7 text-textColor font-[400] mt-4 text-center h-[100px] '>
                  With locations near you, it's easy to access the expert care
                  you need — wherever and whenever you need it.
                </p>
              </div>
              <div>
                <Link
                  to='/doctors'
                  className='w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto flex items-center justify-center group hover:bg-primaryColor hover:border-none'
                >
                  <BsArrowRight className='group-hover:text-white w-6 h-5' />
                </Link>
              </div>
            </div>
          </div>
          <div className=' px-5 flex flex-col justify-between items-center'>
            <div className='mb-10'>
              <img src={icon03} alt='world class doctors' />
            </div>
            <div className='flex flex-col justify-between h-[220px]'>
              <div>
                <h2 className='text-[26px] leading-9 text-headingColor font-[700] text-center '>
                  Book Appointment
                </h2>
              </div>
              <div>
                <p className='text-[16px] leading-7 text-textColor font-[400] mt-4 text-center h-[100px] '>
                  Booking an appointment is quick and easy. Choose a time that
                  works for you and get the care you need — when you need it.
                </p>
              </div>
              <div>
                <Link
                  to='/location'
                  className='w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto flex items-center justify-center group hover:bg-primaryColor hover:border-none'
                >
                  <BsArrowRight className='group-hover:text-white w-6 h-5' />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInTouch;
