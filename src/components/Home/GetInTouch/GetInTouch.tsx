import { BsArrowRight } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { medicalServices } from '@/assets/data/serviceProvided';
import CardMotion from '@/components/Motions/cardMotion';

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
          {medicalServices.map((ms) => (
            <CardMotion
              key={ms.id}
              styling='bg-white rounded-xl border border-gray-200 p-5'
            >
              <div
                className=' px-2 flex flex-col justify-between items-center py-5 h-full'
                data-aos='fade-up'
                data-aos-delay='200'
              >
                <div className='mb-10'>
                  <img src={ms.icon} alt='world class doctors' />
                </div>
                <div className='flex flex-col justify-between h-[220px] w-full '>
                  <div>
                    <h2 className='text-[26px] leading-9 text-headingColor font-[700] text-center '>
                      {ms.title}
                    </h2>
                  </div>
                  <div>
                    <p className='text-[16px] leading-7 text-textColor font-[400] my-4 text-center h-[100px] w-full  '>
                      {ms.subtext}
                    </p>
                  </div>
                  <div>
                    <Link
                      to={ms.url}
                      className='w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto flex items-center justify-center group hover:bg-primaryColor hover:border-none'
                    >
                      <BsArrowRight className='group-hover:text-white w-6 h-5' />
                    </Link>
                  </div>
                </div>
              </div>
            </CardMotion>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GetInTouch;
