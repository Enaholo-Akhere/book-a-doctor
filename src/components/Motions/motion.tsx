import { m } from 'framer-motion';

const FadeInSection = ({ children }: { children: React.ReactNode }) => {
  return (
    <m.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </m.div>
  );
};

export default FadeInSection;
