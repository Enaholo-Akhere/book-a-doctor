import Button from '@/components/Button';
import heroImage from '@/assets/images/hero-img01.png';
import heroImage2 from '@/assets/images/hero-img02.png';
import heroImage3 from '@/assets/images/hero-img03.png';

const Hero = () => {
  return (
    <section className='hero__section pt-[30px] 2xl:h-[750px]'>
      <div className='container m-auto flex items-center px-0'>
        <div className='flex flex-col lg:flex-row  items-center justify-between'>
          <div className='w-[100%] lg:w-[40%] m-auto gap-y-[10px] xl:gap-y-[20px] 2xl:gap-y-[300px] mb-[50px]  2xl:mb-[50px] lg:mb-0'>
            <div className=' gap-3 2xl:gap-10 flex flex-col w-full '>
              <h1 className='text-[30px] md:text-[40px] 2xl:text-[60px] leading-[30px] md:leading-[70px] 2xl:leading-[70px] text-headingColor font-[800] '>
                We help patients live a healthy, longer life. 12334
              </h1>
              <p className='text__para flex-wrap leading-7 mt-[5px] mb-[10px]'>
                Your health matters — and we’re here to support you every step
                of the way. With trusted care, a listening ear, and guidance you
                can count on.
              </p>
              <Button
                title='Request an Appointment'
                bgColor='bg-primaryColor'
                txtColor='text-white'
                btnWidth='w-fit'
                px='md:px-[30px] px-[20px] '
                py='md:py-4 py-3'
              />
            </div>
            {/* =======Counter======= */}
            <div className='mt-[30px] lg:mt-[40px] flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-[30px]'>
              <div>
                <h2 className='text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor'>
                  30+
                </h2>
                <span className='w-[100px] h-2 bg-yellowColor rounded-full block mt-[-16px]'></span>
                <p className='text__para'>Years of Experience</p>
              </div>
              <div>
                <h2 className='text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor'>
                  15+
                </h2>
                <span className='w-[100px] h-2 bg-purpleColor rounded-full block mt-[-16px]'></span>
                <p className='text__para'>Clinic Location</p>
              </div>{' '}
              <div>
                <h2 className='text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor'>
                  100%
                </h2>
                <span className='w-[100px] h-2 bg-irisBlueColor rounded-full block mt-[-16px]'></span>
                <p className='text__para'>Patient Satisfaction</p>
              </div>
            </div>
          </div>
          <div className='flex gap-[30px] lg:justify-end justify-center w-[100%] lg:w-[50%] m-auto'>
            <div className='lg:w-[250px] md:w-[250px] w-[150px] 2xl:w-[350px] '>
              <img src={heroImage} alt='book a doctor' className='w-full' />
            </div>
            <div className='mt-[30px] lg:w-[170px] md:w-[200px] w-[100px] 2xl:w-[250px] '>
              <img
                src={heroImage2}
                alt='book a doctor'
                className='w-full mb-[30px]'
              />
              <img src={heroImage3} alt='book a doctor' className='w-full' />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
