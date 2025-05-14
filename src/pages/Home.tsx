import About from '../components/Home/about/About';
import Hero from '@/components/Home/Hero/Hero';
import GetInTouch from '@/components/Home/GetInTouch/GetInTouch';
import Feature from '@/components/Home/Feature/Feature';
import Faq from '@/components/Home/Faq';
import Services from '../components/ServicesComp';
import DoctorsHome from '../components/DoctorsComp';
import Testimonial from '../components/Testimonial';

const Home = () => {
  return (
    <>
      {/*======== hero section here ========*/}
      <Hero />

      {/* ======== Get in Touch section  ======== */}
      <GetInTouch />

      {/* ======== About section ======== */}
      <About />

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
      />

      {/* ======== FAQ ======== */}
      <Faq />

      {/* ======== Testimonial Start ======== */}
      <Testimonial />
    </>
  );
};

export default Home;
