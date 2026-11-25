'use client';
import Recognition from '@/components/Home/Recognition';
import Hero from '@/components/Home/Hero/Hero';
import GetInTouch from '@/components/Home/GetInTouch/GetInTouch';
import Feature from '@/components/Home/Feature/Feature';
import Faq from '@/components/Home/Faq';
import Services from '../components/Services';
import HomeDoctors from '@/components/Home/HomeDoctors';
import Testimonial from '../components/Testimonial';
import ParallaxSection from '@/components/Home/ParallaxSection/Parallax';
import type { DoctorsResponse } from '@/library/api/server';

const Home = ({ initialDoctors }: { initialDoctors?: DoctorsResponse }) => {
  return (
    <>
      {/*======== hero section here ========*/}

      {/* Hero runs its own entrance animation on load. */}
      <Hero />
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

      <HomeDoctors initialDoctors={initialDoctors} />

      {/* ======== FAQ ======== */}
      <Faq />

      {/* ======== Testimonial Start ======== */}
      <Testimonial />
    </>
  );
};

export default Home;
