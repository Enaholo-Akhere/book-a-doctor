import aboutImg from '@/assets/images/about.png';
import aboutCardImg from '@/assets/images/about-card.png';
import { Link } from 'react-router-dom';
import Button from '../../Button';

const About = () => {
  return (
    <section>
      <div className='container '>
        <div className='flex justify-between gap-[80px] xl:gap-0 flex-col lg:flex-row items-center '>
          <div className='relative w-[100%] lg:w-[50%]  z-10 order-2 lg:order-1'>
            <div className='w-[80%] '>
              <img src={aboutImg} alt='about' className='w-full h-full' />
            </div>
            <div className='absolute z-20 left-[200px] bottom-[20px] w-[200px] sm:left-[370px] sm:bottom-[60px] sm:w-[200px] md:left-[450px] md:bottom-[100px] md:w-[250px] lg:left-[260px] lg:bottom-[60px] lg:w-[200px] xl:left-[350px] xl:bottom-[50px] xl:w-[250px] 2xl:left-[430px] 2xl:bottom-[100px] 2xl:w-[300px]'>
              <img src={aboutCardImg} alt='about' className='w-full h-full' />
            </div>
          </div>
          {/* ======== about content ======== */}
          <div className='w-[100%] lg:w-[40%] order-1 lg:order-2 '>
            <h2 className='heading'> Proud to be one of the nations best</h2>
            <p className='text__para'>
              For 30 years in a row, U.S. News & World Report has recognized us
              as one of the best publics healthcare group in the Nation and #1
              in Texas.
            </p>
            <p className='text__para mt-[30px] mb-5'>
              Our best is something we strive for each day, caring for our
              patients and not looking back at what we accomplished but towards
              what we can do tomorrow.
            </p>
            <Link to='/'>
              <Button
                title='Learn More'
                px='md:px-[56px] px-[30px] '
                py='md:py-4 py-3'
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
