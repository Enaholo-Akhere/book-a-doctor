'use client';
import Image from 'next/image';
// components/motion/ParallaxSection.tsx
import { m, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import Button from '@/components/Button';
import teamDoctorImgAsset from '@/assets/images/team_doctors.jpg';


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
      <m.div
        style={{
          position: 'absolute',
          inset: 0,
          y,
          height: '160%',
          top: '-20%',
        }}
      >
        {/* 5568×3712 original: next/image serves a screen-sized version. */}
        <Image
          src={teamDoctorImgAsset}
          alt='Our medical team'
          fill
          sizes='100vw'
          style={{ objectFit: 'cover' }}
        />
      </m.div>

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
        <m.h2
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
        </m.h2>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link href='/doctors'>
            <Button title='Meet our doctors' />
          </Link>
        </m.div>
      </div>
    </section>
  );
};

export default ParallaxSection;
