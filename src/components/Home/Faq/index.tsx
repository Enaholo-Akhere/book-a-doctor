import FaqList from './FaqList';
import faqImg from '@/assets/images/faq-img.png';

const Faq = () => {
  return (
    <section>
      <div className='container'>
        <div className='flex justify-between gap-[50px] lg:gap-20 m-auto '>
          <div className='w-full md:w-[40%] h-full hidden md:block'>
            <div className='lg:w-[400px] 2xl:w-[450px] '>
              <img
                src={faqImg}
                alt='doctors website'
                className='w-full h-full'
              />
            </div>
          </div>

          <div className='w-full md:w-[60%]'>
            <h2 className='heading'>Most questions by our beloved patients</h2>
            <FaqList />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
