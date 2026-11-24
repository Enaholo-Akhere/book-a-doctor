import { usePathname } from 'next/navigation';
import TestimonialSwiper from './TestimonialSwiper';

const Testimonial = () => {
  const pathname = usePathname();
  const pn = pathname === '/doctors';

  return (
    <section className={`${pn ? 'lg:mt-[-150px] mt-[0px]' : ''} '`}>
      <div className=' '>
        <div className='lg:w-[470px] mx-auto mb-[50px]'>
          <h2 className='heading text-center'>What our patients say</h2>
          <p className='text__para text-center'>
            Hear from the patients whose lives we’ve touched through compassionate, expert
            healthcare.
          </p>
        </div>
        <TestimonialSwiper />
      </div>
    </section>
  );
};

export default Testimonial;
