import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

// The carousel (and the Swiper library) sits far below the fold on every page that shows it,
// so load it after the page is up rather than in the initial bundle.
const TestimonialSwiper = dynamic(() => import('./TestimonialSwiper'), {
  ssr: false,
  loading: () => <div className='min-h-[320px]' aria-hidden />,
});

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
