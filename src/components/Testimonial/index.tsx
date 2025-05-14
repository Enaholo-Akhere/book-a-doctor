import { useLocation } from 'react-router-dom';
import TestimonialSwiper from './TestimonialSwiper';

const Testimonial = () => {
  const { pathname } = useLocation();
  const pn = pathname === '/doctors';
  return (
    <section className={`${pn ? 'mt-[-150px]' : ''}`}>
      <div className='container'>
        <div className='lg:w-[470px] mx-auto mb-[50px]'>
          <h2 className='heading text-center'>What our patients say</h2>
          <p className='text__para text-center'>
            Hear from the patients whose lives we’ve touched through
            compassionate, expert healthcare.
          </p>
        </div>
        <TestimonialSwiper />
      </div>
    </section>
  );
};

export default Testimonial;
