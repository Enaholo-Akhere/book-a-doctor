import FaqList from './FaqList';
import faqImg from '@/assets/images/faq-img.png';
import {
  MotionDiv,
  imageVariant,
  textContainerVariant,
  textItemVariant,
  sectionViewport,
} from '@/components/Motions/flexMotion';

const Faq = () => {
  return (
    <section>
      <div className='container'>
        <div className='flex justify-between gap-[50px] lg:gap-20 m-auto'>
          {/* image side */}
          <MotionDiv
            initial='hidden'
            whileInView='show'
            viewport={sectionViewport}
            variants={imageVariant}
            className='w-full md:w-[40%] h-full hidden md:block'
          >
            <div className='lg:w-[400px] 2xl:w-[450px]'>
              <img
                src={faqImg}
                alt='doctors website'
                className='w-full h-full'
              />
            </div>
          </MotionDiv>

          {/* text + faq list side */}
          <MotionDiv
            initial='hidden'
            whileInView='show'
            viewport={sectionViewport}
            variants={textContainerVariant}
            className='w-full md:w-[60%]'
          >
            <MotionDiv variants={textItemVariant}>
              <h2 className='heading'>
                Most questions by our beloved patients
              </h2>
            </MotionDiv>
            <MotionDiv variants={textItemVariant}>
              <FaqList />
            </MotionDiv>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
};

export default Faq;
