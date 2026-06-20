// components/motion/ParallaxSection.tsx
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import teamDoctorImg from '@/assets/images/team_doctors.jpg';

const ParallaxSection = () => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // image moves slower than scroll for the parallax effect
  const y = useTransform(scrollYProgress, [0, 1], ['-30%', '30%']);

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        height: '80vh',
        overflow: 'hidden',
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          y,
          height: '160%',
          top: '-20%',
        }}
      >
        <img
          src={teamDoctorImg}
          alt='Our medical team'
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </motion.div>

      {/* dark overlay for text legibility */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.4)',
        }}
      />

      {/* centered minimal content */}
      <div
        style={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 1.5rem',
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            color: '#fff',
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            fontWeight: 600,
            marginBottom: '2rem',
            maxWidth: '600px',
          }}
        >
          Care from professionals you can trust
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link to='/doctors'>
            <Button title='Meet our doctors' />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ParallaxSection;
