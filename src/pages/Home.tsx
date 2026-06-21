import Recognition from '@/components/Home/Recognition';
import Hero from '@/components/Home/Hero/Hero';
import GetInTouch from '@/components/Home/GetInTouch/GetInTouch';
import Feature from '@/components/Home/Feature/Feature';
import Faq from '@/components/Home/Faq';
import Services from '../components/Services';
import DoctorsHome from '../components/Doctors';
import Testimonial from '../components/Testimonial';
import { useGetAllDoctors } from '@/Hook/useDoctors';
import { AxiosError } from 'axios';
import FadeInSection from '@/components/Motions/motion';
import ParallaxSection from '@/components/Home/ParallaxSection/Parallax';

const Home = () => {
  const { isLoading, isError, data, error } = useGetAllDoctors('');
  return (
    <>
      {/*======== hero section here ========*/}

      <FadeInSection>
        <Hero />
      </FadeInSection>
      {/* ======== Get in Touch section  ======== */}
      <GetInTouch />

      <ParallaxSection />

      {/* ======== About section ======== */}
      <Recognition />

      {/* ======== Services section ======== */}

      <Services
        subtitle=' From routine check-ups to specialized treatments, our medical
            services are designed to meet your unique health needs.'
        title='Our medical services '
      />

      {/* ======== Feature section ======== */}
      <Feature />

      {/* ======== Our great doctors ======== */}

      <DoctorsHome
        subtitle=' Our team of compassionate, skilled doctors is here to provide
            personalized, top-quality care every step of the way.'
        title='Our great doctors'
        isLoading={isLoading}
        isError={isError}
        data={data}
        error={error as AxiosError}
      />

      {/* ======== FAQ ======== */}
      <Faq />

      {/* ======== Testimonial Start ======== */}
      <Testimonial />
    </>
  );
};

export default Home;
